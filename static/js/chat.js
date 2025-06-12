class SpeechHandler {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isEnabled = false;
        this.currentVoice = null;
        this.queue = [];
        this.isPlaying = false;

        this.init();
    }

    init() {
        const toggleBtn = document.getElementById('toggleSpeech');
        const voiceSelect = document.getElementById('voiceSelect');

        // Initialize voices
        this.loadVoices(voiceSelect);
        
        // Handle voice changes
        speechSynthesis.onvoiceschanged = () => this.loadVoices(voiceSelect);

        // Toggle speech
        toggleBtn.addEventListener('click', () => {
            this.isEnabled = !this.isEnabled;
            toggleBtn.classList.toggle('active', this.isEnabled);
            toggleBtn.querySelector('i').className = this.isEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        });

        // Handle voice selection
        voiceSelect.addEventListener('change', () => {
            this.currentVoice = this.synth.getVoices()[voiceSelect.value];
        });
    }

    loadVoices(select) {
        const voices = this.synth.getVoices();
        select.innerHTML = voices
            .filter(voice => voice.lang.startsWith('en'))
            .map((voice, index) => `
                <option value="${index}">
                    ${voice.name} (${voice.lang})
                </option>
            `).join('');
        
        this.currentVoice = voices[0];
    }

    speak(text, isBot = false) {
        if (!this.isEnabled) return;

        this.queue.push({ text, isBot });
        if (!this.isPlaying) {
            this.playNext();
        }
    }

    playNext() {
        if (this.queue.length === 0) {
            this.isPlaying = false;
            return;
        }

        this.isPlaying = true;
        const { text, isBot } = this.queue.shift();
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.voice = this.currentVoice;
        utterance.rate = isBot ? 1 : 1.1;
        utterance.pitch = isBot ? 1 : 1.2;

        utterance.onend = () => {
            this.playNext();
        };

        this.synth.speak(utterance);
    }

    stop() {
        this.synth.cancel();
        this.queue = [];
        this.isPlaying = false;
    }
}

class VoiceHandler {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('userInput').value = transcript;
                document.getElementById('chatForm').dispatchEvent(new Event('submit'));
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        }
    }

    toggleListening() {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        this.isListening = true;
        this.recognition.start();
        document.getElementById('voiceInputBtn').classList.add('recording');
        this.updateStatus('Listening...');
    }

    stopListening() {
        this.isListening = false;
        this.recognition.stop();
        document.getElementById('voiceInputBtn').classList.remove('recording');
        this.updateStatus('Ready to chat');
    }

    speak(text) {
        if (this.isSpeaking) {
            this.synthesis.cancel();
        }

        if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => {
                this.isSpeaking = false;
                document.getElementById('speakerBtn').classList.remove('active');
            };
            this.isSpeaking = true;
            document.getElementById('speakerBtn').classList.add('active');
            this.synthesis.speak(utterance);
        }
    }

    updateStatus(status) {
        const statusEl = document.getElementById('botStatus');
        statusEl.textContent = status;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const messageArea = document.getElementById('messageArea');
    
    if (!chatForm || !userInput || !messageArea) {
        console.error('Required chat elements not found!');
        return;
    }

    // Configure marked to handle code blocks
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    function createMessageElement(type, content) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        
        const formattedContent = marked.parse(content);
        
        div.innerHTML = `
            ${type === 'bot' ? `
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
            ` : ''}
            <div class="message-container">
                <div class="message-bubble">
                    <div class="message-content markdown-content">
                        ${formattedContent}
                    </div>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;

        return div;
    }

    function addMessage(type, content) {
        const messageEl = createMessageElement(type, content);
        messageArea.appendChild(messageEl);
        messageArea.scrollTop = messageArea.scrollHeight;

        // Initialize copy buttons for code blocks
        messageEl.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
            addCopyButton(block);
        });
    }

    function addCopyButton(block) {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });

        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing';
        indicator.innerHTML = `
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        messageArea.appendChild(indicator);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.querySelector('.typing');
        if (indicator) {
            indicator.remove();
        }
    }

    function showThinkingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot thinking';
        indicator.innerHTML = `
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="thinking-bubble">
                <div class="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="thinking-text">Ana is thinking</div>
            </div>
        `;
        messageArea.appendChild(indicator);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    let messageQueue = [];
    let isProcessing = false;

    async function processMessageQueue() {
        if (isProcessing || messageQueue.length === 0) return;
        
        isProcessing = true;
        const message = messageQueue[0];
        
        try {
            showTypingIndicator();
            
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message }),
                timeout: 30000 // 30 second timeout
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data.status === 'success') {
                addMessage('bot', data.message);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }

            // Remove processed message from queue
            messageQueue.shift();
            
        } catch (error) {
            console.error('Chat error:', error);
            addMessage('bot', 'Sorry, I had trouble processing that. Please try again! 🙏');
            messageQueue = []; // Clear queue on error
        } finally {
            removeTypingIndicator();
            isProcessing = false;
            
            // Process next message if any
            if (messageQueue.length > 0) {
                setTimeout(processMessageQueue, 1000);
            }
        }
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        
        // Add message to queue and process
        messageQueue.push(message);
        processMessageQueue();
    });
});

// Add voice button handler
document.getElementById('voiceInputBtn').addEventListener('click', () => {
    voiceHandler.toggleListening();
});

// Add speaker button handler
document.getElementById('speakerBtn').addEventListener('click', () => {
    const lastBotMessage = document.querySelector('.message.bot:last-child .message-content p');
    if (lastBotMessage) {
        voiceHandler.speak(lastBotMessage.textContent);
    }
});

// Update the bot status during chat
window.updateBotStatus = (status) => {
    voiceHandler.updateStatus(status);
};

function createMessage(type, content) {
    return `
        <div class="message ${type}">
            ${type === 'bot' ? `
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
            ` : ''}
            <div class="message-container">
                <div class="message-bubble">
                    <div class="markdown-content">
                        ${type === 'bot' ? marked(content) : content}
                    </div>
                </div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        </div>
    `;
}

function createTypingIndicator() {
    return `
        <div class="message bot typing">
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = '#2ea043';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    });
}
function addFeedbackButtons(messageDiv, conversationId) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'message-feedback';
    feedbackDiv.innerHTML = `
        <button onclick="submitFeedback(${conversationId}, 1)" class="feedback-btn positive">
            <i class="fas fa-thumbs-up"></i>
        </button>
        <button onclick="submitFeedback(${conversationId}, -1)" class="feedback-btn negative">
            <i class="fas fa-thumbs-down"></i>
        </button>
    `;
    messageDiv.querySelector('.message-container').appendChild(feedbackDiv);
}

async function submitFeedback(conversationId, score) {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                score: score
            })
        });
        
        if (response.ok) {
            showToast('Thank you for your feedback! 🙏');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
}