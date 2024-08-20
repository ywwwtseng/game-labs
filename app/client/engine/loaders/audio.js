import AudioBoard from '@/engine/AudioBoard';
import { loadJSON } from '@/engine/loaders';
import { isSafari } from '@/engine/device';

export function loadAudioBoard(name, audioContext) {
  const loadAudio = createAudioLoader(audioContext);
  return loadJSON(`/sounds/${name}.json`).then((audioSheet) => {
    const audioBoard = new AudioBoard(audioContext);
    const fx = audioSheet.fx;
    const jobs = [];
    Object.keys(fx).forEach((name) => {
      const url = fx[name].url;
      const job = loadAudio(url).then((buffer) => {
        audioBoard.addAudio(name, buffer);
      });
      jobs.push(job);
    });
    return Promise.all(jobs).then(() => audioBoard);
  });
}

export function createAudioLoader(context) {
  return function loadAudio(url) {
    return fetch(url)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        if (isSafari) {
          return new Promise((resolve, reject) => {
            context.decodeAudioData(arrayBuffer, resolve, reject);
          });
        } else {
          return context.decodeAudioData(arrayBuffer);
        }
      });
  };
}
