const os  = require('os');

class SystemUsage {
  constructor() {
    this.cpuUsage;
    this.memoryUsage;

    this._init();
  }

  usage() {
    return {
      cpu: this.cpuUsage,
      memory: this.memoryUsage,
    }
  }

  _init() {
    setInterval(() => {
      const startMeasure = this._getCPUUsage();
      
      setTimeout(() => {
        const endMeasure = this._getCPUUsage();
        const cpuUsage = this._calculateCPUPercentage(startMeasure, endMeasure);
        const memoryUsage = this._getMemoryUsage();

        this.cpuUsage = `${cpuUsage.toFixed(2)}%`;
        this.memoryUsage = `${memoryUsage.toFixed(2)}%`;
      }, 1000);
    }, 1000);
  }

  _getCPUUsage() {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
  
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    
    return { idle, total };
  }

  _calculateCPUPercentage(start, end) {
    const idleDiff = end.idle - start.idle;
    const totalDiff = end.total - start.total;
    return 100 - (100 * idleDiff / totalDiff);
  }

  _getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    return ((totalMem - freeMem) / totalMem) * 100;
  }

}

module.exports = new SystemUsage();