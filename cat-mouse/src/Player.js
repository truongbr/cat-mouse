import { sounds, cachedAudio } from './resources';

class Player {
    recording = false;
    queue = [];
    times = [];

    play(key) {
        const sound = sounds[key];
        if (!sound) return;
        
        const cached = cachedAudio[key];
        if (cached.paused || !cached.duration) {
            cached.play();
        } else {
            const audio = new Audio(sound);
            audio.onended = audio.remove;
            audio.play();
        }

        if (this.recording) {
            this.queue.push(key);
            this.times.push((new Date()).getTime());
        }
    }

    playRecording(initCallback = null, endCallback = null, speed = 1) {
        const playback = (i) => {
            const key = this.queue[i];
            if (initCallback) initCallback(key);

            const audio = new Audio(sounds[key]);
            
            if (this.times.length - 1 === i) {
                audio.onended = () => {
                    if (endCallback) endCallback();
                    audio.remove();
                }
                audio.play();
            } else {
                audio.onended = audio.remove;
                audio.play();

                const next = Math.floor(this.times[i + 1] - this.times[i]) / speed;
                setTimeout(() => playback(i + 1), next);
            }
        }
        playback(0);
    }

    reverseRecording() {
        this.queue.reverse();
        this.times.reverse();
    }

    clearRecording() {
        this.queue = [];
        this.times = [];
    }
}

export default Player;