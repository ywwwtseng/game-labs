const regex = {
  query: /^query:(.*)$/,
  mutation: /^mutation:(.*)$/,

  find: /find\(([^)]*)\)/,
  filter: /filter\(([^)]*)\)/,
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
  [regex.update, (_, key = _.replace(':', '')) => (dbData) => ({ prevPathKey, params, data }) => {
    {let match; if (match = prevPathKey.match(regex.find)) {
      const identity = match[1].replace(':', '');
      const index = dbData.findIndex(item => item[identity] === params[identity]);

      if (index !== -1) {
        return dbData[index] = Object.assign(dbData[index], data[key]);
      }
    }}

    return undefined;
  }],
  [regex.delete, (_, key = _.replace(':', '')) => (dbData) => ({ prevPathKey, data }) => {
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
  [regex.filter, (key) => (dbData) => ()  => {
    const columns = key.split(',');

    return dbData.map(item => columns.reduce((acc, val) => {
      acc[val] = item[val];
      return acc;
    }, {}));
  }],
  [regex.create, (key) => (dbData) => ({ data }) => {
    key = key.replace(':', '');
    const schema = Schema.create(key, data[key], dbData);
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

      
      if (syntaxRegex === regex.delete && (nextMatch && nextMatch[1])) {
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


async function exec({type, db, path, params, data }) {
  const pathArray = Array.isArray(path) ? path : path.split('.');

  let result = db.data;

  
  for (let index = 0; index < pathArray.length; index++) {
    const prevPathKey = pathArray[index - 1];
    const pathKey = pathArray[index];
    const nextPathKey = pathArray[index + 1];

    
    const cmd = findCommand(pathKey, nextPathKey);
    if (cmd) {
      if (type === 'query') {
        result = cmd(result)({ params });
      } else if (type === 'mutation') {
        result = cmd(result)({ prevPathKey, params, data });
      }
    } else {
      result = result && result[pathKey] !== undefined ? result[pathKey] : undefined;
    }
  }

  if (type === 'mutation') {
    await db.write();

    const findCmdIndex = pathArray.findIndex((path) => path.match(regex.find));

    if (findCmdIndex !== -1) {
      return exec({
        type: 'query',
        db,
        path: pathArray.slice(
          0,
          pathArray.findIndex((path) => path.match(regex.find)) + 1
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
    let match;

    for (const key in regex) {
      if (Object.prototype.hasOwnProperty.call(regex, key)) {
        if (sql.match(regex[key])) {
          match = sql.match(regex[key])[1];

          if (match) {
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
          path: match,
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
          path: match,
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