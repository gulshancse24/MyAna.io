class SpeechManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.isReady = false;

        // Initialize voices when available
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.initVoices();
        }
    }

    initVoices() {
        this.voices = this.synth.getVoices();
        // Prefer female English voices
        this.currentVoice = this.voices.find(voice => 
            voice.name.toLowerCase().includes('female') && 
            voice.lang.startsWith('en')
        ) || this.voices[0];
        this.isReady = true;
    }

    speak(text) {
        if (!this.isReady) return;
        
        // Stop any ongoing speech
        this.stop();

        // Clean the text
        const cleanText = text.replace(/[*#`]/g, '').trim();
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.currentVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        
        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
    }
}