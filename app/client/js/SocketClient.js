class SocketClient {
  constructor() {
    this.webSocketWorker = null;
    this.listeners = {};

    this.connect();
  }

  connect() {
    this.webSocketWorker = new SharedWorker(`js/web-sockets-worker.js`);

    // Event to listen for incoming data from the worker and update the DOM.
    this.webSocketWorker.port.addEventListener('message', ({ data }) => {
      const callback = this.listeners[data.event];
      if (callback) {
        callback(data.data);
      }
    });

    // Initialize the port connection.
    this.webSocketWorker.port.start();

    // Remove the current worker port from the connected ports list.
    // This way your connectedPorts list stays true to the actual connected ports,
    // as they array won't get automatically updated when a port is disconnected.
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
  }

  disconnect() {
    console.log('disconnect');
    this.webSocketWorker.port.postMessage({
      action: 'unload',
      value: null,
    });

    this.webSocketWorker.port.close();
    this.webSocketWorker = null;
  }

  /**
   * Sends a message to the worker and passes that to the Web Socket.
   * @param {any} message
   */
  emit(message) {
    this.webSocketWorker.port.postMessage({
      action: 'send',
      value: message,
    });
  }

  listen(event, callback) {
    this.listeners[event] = callback;
  }
}

export default SocketClient;
