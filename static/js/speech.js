class SpeechHandler {
    constructor() {
        this.synth = window.speechSynthesis;
        this.speaking = false;
        this.voice = null;
        
        // Initialize voice
        this.loadVoice();
        
        // Handle voice changes
        speechSynthesis.onvoiceschanged = () => this.loadVoice();
    }

    loadVoice() {
        const voices = this.synth.getVoices();
        // Prefer female English voice
        this.voice = voices.find(voice => 
            voice.name.includes('Female') && 
            voice.lang.startsWith('en')
        ) || voices[0];
    }

    speak(text) {
        if (this.speaking) {
            this.synth.cancel();
        }

        // Clean text of markdown and emojis
        const cleanText = text.replace(/\*|#|\[.*?\]|\(.*?\)|```[\s\S]*?```|:[a-zA-Z_]+:/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.voice;
        utterance.rate = 1;
        utterance.pitch = 1.1;
        utterance.volume = 1;

        utterance.onstart = () => {
            this.speaking = true;
            document.getElementById('speakerBtn').classList.add('speaking');
        };

        utterance.onend = () => {
            this.speaking = false;
            document.getElementById('speakerBtn').classList.remove('speaking');
        };

        this.synth.speak(utterance);
    }

    stop() {
        if (this.speaking) {
            this.synth.cancel();
            this.speaking = false;
            document.getElementById('speakerBtn').classList.remove('speaking');
        }
    }
}