import { loadJSON } from '@/js/loaders';
import MusicPlayer from '@/js/MusicPlayer';

export function loadMusicSheet(name) {
  return loadJSON(`/music/${name}.json`)
    .then((musicSheet) => {
      const musicPlayer = new MusicPlayer();
      for (const [name, track] of Object.entries(musicSheet)) {
        musicPlayer.addTrack(name, track.url);
      }
      return musicPlayer;
    });
}
