const WebSocket = require('ws');
const systemUsage = require('./utils/system_usage');

// 創建 WebSocket 伺服器
const wss = new WebSocket.Server({ port: 8080 });

// 當有客戶端連接時觸發
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 每60ms向客戶端發送一次數據
  const tickRate = 60;
  const sendData = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const data = {
        event: 'system',
        data: {
          timestamp: Date.now(),
          usage: systemUsage.usage(),
        },
      };

      ws.send(JSON.stringify(data));
      setTimeout(sendData, tickRate);
    }
  };

  sendData();

  // 當收到客戶端消息時觸發
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // 當客戶端斷開連接時觸發
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
