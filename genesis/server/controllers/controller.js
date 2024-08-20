import path from 'path';
import FileSystemUtil from '../utils/FileSystemUtil.js';


const regex = {
  query: /^query:(.*)$/,
  mutation: /^mutation:(.*)$/,

  find: /find\(([^)]*)\)/,
  fields: /fields\(([^)]*)\)/,
  create: /create\(([^)]*)\)/,
  update: /update\(([^)]*)\)/,
  set: /set\(([^)]*)\)/,
  add: /add\(([^)]*)\)/,
  delete: /delete\(([^)]*)\)/,
  relate: /relate\(([^)]*)\)/,
  auto_increment: /auto_increment\(([^)]*)\)/,
}

const Schema = {
  create(key, data, dbData) {
    const relate = data?.id?.match(regex.relate)?.[1];

    if (relate && data[relate]) {
      data.id = `${key}_${data[relate].match(/\d+/g).join('')}`;
      return data;
    }

    const autoIncrement = data?.id?.match(regex.auto_increment);

    if (autoIncrement) {
      const sign = autoIncrement[1] || '';

      data.id = `${key}_${sign}${dbData.length + 1}`;
      return data;
    }

    data.id = `${key}_${Date.now()}`;
    return data;
  },
};

const syntax = new Map([
  [regex.update, (_, key = _.replace(':', '')) => (dbData) => async ({ prevPathKey, params, data }) => {
    {let match; if (match = prevPathKey.match(regex.find)) {
      const identity = match[1].replace(':', '');
      const index = dbData.findIndex(item => item[identity] === params[identity]);

      if (index !== -1) {
        if (dbData[index].pathname) {
          const oldData = await FileSystemUtil.readFile(dbData[index].pathname);
          await FileSystemUtil.writeFile(
            dbData[index].pathname,
            Object.assign(oldData, data[key])
          );
          return dbData[index];
        } else {
          return dbData[index] = Object.assign(dbData[index], data[key]);
        }
      }

      
    }}

    return undefined;
  }],
  [regex.delete, (_, key = _.replace(':', '')) => (dbData) => ({ prevPathKey, params, data }) => {
    if (key === 'index') {
      dbData[prevPathKey] = dbData[prevPathKey].filter((_, index ) => index !== data.index);
      return null;
    } else {
      dbData[key] = null;
      return dbData;
    }
  }],
  [regex.find, (_, key = _.replace(':', '')) => (dbData) => ({ params })  => {
    if (key) {
      return dbData.find(data => data[key] === params[key]);
    }

    return dbData;
  }],
  [regex.fields, (key) => (dbData) => ()  => {
    const columns = key.split(',');

    return dbData.map(item => columns.reduce((acc, val) => {
      acc[val] = item[val];
      return acc;
    }, {}));
  }],
  [regex.create, (key) => (dbData) => async ({ data }) => {
    key = key.replace(':', '');
    const schema = await Schema.create(key, data[key], dbData);

    if (data.dir) {
      const pathname = path.join(data.dir, `${schema.id}.json`);
      schema.pathname = pathname;

      await FileSystemUtil.writeFile(pathname, schema);

      dbData.push({
        id: schema.id,
        pathname,
      });

      return {
        id: schema.id,
        pathname,
      };

    } else {
      dbData.push(schema);
      return schema;
    }
    
    dbData.push(schema);
    return schema;
  }],
  [regex.set, (key) => (dbData) => ({ data }) => {
    key = key.replace(':', '');
    dbData[key] = data[key];
    return dbData;
  }],
  [regex.add, (key) => (dbData) => ({ data }) => {
    key = key.replace(':', '');
    dbData.push(data[key]);
    return dbData;
  }],
]);

const findCommand = (pathKey, nextPathKey) => {
  for (const [syntaxRegex, action] of syntax) {
    if (nextPathKey) {
      const nextMatch = nextPathKey.match(syntaxRegex);
      if (syntaxRegex === regex.delete && (nextMatch && nextMatch[1] && nextMatch[1] === ':index')) {
        return (dbData) => () => dbData;
      }

      if (syntaxRegex === regex.update && (nextMatch && nextMatch[1])) {
        return (dbData) => () => dbData;
      }
    }

    const match = pathKey.match(syntaxRegex);
    if (match) {
      return action(match[1]);
    }
  }

  return null;
};


async function exec({type, db, sqlPath, params, data }) {
  const pathArray = Array.isArray(sqlPath) ? sqlPath : sqlPath.split('.');

  let result = db.data;

  
  for (let index = 0; index < pathArray.length; index++) {
    const prevPathKey = pathArray[index - 1];
    const pathKey = pathArray[index];
    const nextPathKey = pathArray[index + 1];

    
    const cmd = findCommand(pathKey, nextPathKey);
    if (cmd) {
      if (type === 'query') {
        result = await cmd(result)({ params });
      } else if (type === 'mutation') {
        result = await cmd(result)({ prevPathKey, params, data });
      }
    } else {
      result = result && result[pathKey] !== undefined ? result[pathKey] : undefined;
    }
  }

  if (type === 'mutation') {
    await db.write();

    const findCmdIndex = pathArray.findIndex((p) => p.match(regex.find));

    if (findCmdIndex !== -1) {
      return exec({
        type: 'query',
        db,
        sqlPath: pathArray.slice(
          0,
          pathArray.findIndex((p) => p.match(regex.find)) + 1
        ),
        params,
      });
    }
  }

  return result;
}

const Controller = {
  async sql(req, res) {
    const sql = req.body.sql;
    const data = req.body.data || {};
    const params = req.body.params || {};

    if (req.headers['content-type'].includes('multipart/form-data')) {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const match = sql.match(regex.create);
      const target = match[1].replace(':', '');

      if (target && !data[target]) {
        data[target] = {};
      }

      data[target].file = req.file.path.replace('public', '');

      for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          const value = req.body[key];

          if (key.includes('data')) {

            if (!data[key.split('.')[1]]) {
              data[key.split('.')[1]] = {};
            }

            data[key.split('.')[1]][key.split('.')[2]] = value;
          }
        }
      }
    }

    let type;
    let sqlPath;

    for (const key in regex) {
      if (Object.prototype.hasOwnProperty.call(regex, key)) {
        if (sql.match(regex[key])) {
          sqlPath = sql.match(regex[key])[1];

          if (sqlPath) {
            type = key;
            break;
          }
        }
      }
    }

    if (type === 'query') {
      return res.send({
        data: await exec({
          type,
          db: req.db,
          sqlPath,
          params,
        }),
        ok: true,
        message: `${sql} successfully`,
      });
      
    } else if (type === 'mutation') {
      return res.send({
        data: await exec({
          type,
          db: req.db,
          sqlPath,
          params,
          data
        }),
        ok: true,
        message: `${sql} successfully`,
      });
    }

    return res.status(404).send('No found.');
  },
};

export default Controller;