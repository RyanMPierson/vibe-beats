class VibeBeatGame {
    constructor() {
        // Game state
        this.isPlaying = false;
        this.isUserControlling = false;
        this.currentBPM = 120;
        this.beatInterval = null;
        this.userBeatInterval = null;
        this.gameTimer = null;
        this.timeLeft = 15;
        this.gameDuration = 15; // 15 seconds
        this.lastBeatTime = 0;
        this.expectedBeatTime = 0;
        this.beatCount = 0;
        this.userBeatTimes = [];
        this.accuracy = 0;
        this.streak = 0;
        this.score = 0;
        this.maxStreak = 0;
        
        // Audio context for beat sounds
        this.audioContext = null;
        this.masterGain = null;
        this.gameGain = null;
        
        // DOM elements
        this.elements = {
            bpmValue: document.getElementById('bpmValue'),
            tempoIndicator: document.getElementById('tempoIndicator'),
            beatCircle: document.getElementById('beatCircle'),
            beatPulse: document.getElementById('beatPulse'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            timeLeft: document.getElementById('timeLeft'),
            accuracy: document.getElementById('accuracy'),
            streak: document.getElementById('streak'),
            score: document.getElementById('score'),
            visualizer: document.getElementById('visualizer')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.initAudio();
    }
    
    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.gameGain = this.audioContext.createGain();
            
            this.masterGain.connect(this.audioContext.destination);
            this.gameGain.connect(this.masterGain);
            
            this.masterGain.gain.value = 0.7;
            this.gameGain.gain.value = 1.0;
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    setupEventListeners() {
        // Button controls
        this.elements.startBtn.addEventListener('click', () => this.startTempo());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        // Beat circle click
        this.elements.beatCircle.addEventListener('click', () => {
            if (!this.isPlaying) {
                this.startTempo();
            } else if (!this.isUserControlling) {
                this.takeControlNaturally();
            } else {
                this.userBeat();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.isPlaying) {
                    this.startTempo();
                } else if (!this.isUserControlling) {
                    this.takeControlNaturally();
                } else {
                    this.userBeat();
                }
            }
        });
        
        // BPM adjustment with mouse wheel on BPM display
        this.elements.bpmValue.addEventListener('wheel', (e) => {
            if (!this.isPlaying) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -5 : 5;
                this.setBPM(this.currentBPM + delta);
            }
        });
    }
    
    setBPM(bpm) {
        this.currentBPM = Math.max(60, Math.min(200, bpm));
        this.elements.bpmValue.textContent = this.currentBPM;
        
        if (this.isPlaying && !this.isUserControlling) {
            this.startTempo(); // Restart with new BPM
        }
    }
    
    startTempo() {
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        this.isUserControlling = false;
        this.beatCount = 0;
        this.lastBeatTime = Date.now();
        
        this.elements.startBtn.textContent = 'PLAYING...';
        this.elements.startBtn.disabled = true;
        
        // Clear any existing intervals
        if (this.beatInterval) clearInterval(this.beatInterval);
        
        // Calculate beat interval in milliseconds
        const beatIntervalMs = (60 / this.currentBPM) * 1000;
        
        // Play first beat immediately
        this.playGameBeat();
        
        // Set up interval for subsequent beats
        this.beatInterval = setInterval(() => {
            this.playGameBeat();
        }, beatIntervalMs);
        
        this.updateVisualizer();
    }
    
    takeControlNaturally() {
        // Calculate the next expected beat based on current tempo
        const beatIntervalMs = (60 / this.currentBPM) * 1000;
        const now = Date.now();
        const timeSinceLastBeat = now - this.lastBeatTime;
        const nextBeatTime = this.lastBeatTime + beatIntervalMs;
        
        this.isUserControlling = true;
        this.userBeatTimes = [];
        this.beatCount = 0;
        this.expectedBeatTime = nextBeatTime;
        this.timeLeft = this.gameDuration;
        
        // Update UI
        this.elements.startBtn.textContent = 'USER PLAYING';
        
        // Clear game beat interval
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
        
        // Gradually fade out game audio over 2 beats
        if (this.gameGain) {
            const fadeTime = beatIntervalMs * 2 / 1000; // 2 beats in seconds
            this.gameGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + fadeTime);
        }
        
        // Play the current beat as user beat to maintain flow
        this.playUserBeat();
        this.animateBeatCircle();
        
        // Record this as the first user beat
        this.userBeatTimes.push(now);
        
        // Start expecting user beats
        this.startUserBeatDetection();
        
        // Start the game timer
        this.startGameTimer();
        
        // Update expected time for next beat
        this.expectedBeatTime = now + beatIntervalMs;
    }
    
    startGameTimer() {
        this.updateTimerDisplay();
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        this.elements.timeLeft.textContent = this.timeLeft > 0 ? `${this.timeLeft}s` : '0s';
        
        // Change color based on time remaining
        if (this.timeLeft <= 5) {
            this.elements.timeLeft.style.color = '#ff4444';
        } else if (this.timeLeft <= 10) {
            this.elements.timeLeft.style.color = '#ffff00';
        } else {
            this.elements.timeLeft.style.color = '#00ff00';
        }
    }
    
    endGame() {
        // Stop all intervals
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        if (this.userBeatInterval) {
            clearInterval(this.userBeatInterval);
            this.userBeatInterval = null;
        }
        
        // Update game state
        this.isPlaying = false;
        this.isUserControlling = false;
        
        // Show final results
        this.elements.startBtn.textContent = `GAME OVER! Score: ${this.score}`;
        this.elements.startBtn.disabled = false;
        
        // Play end game sound
        this.playBeep(200, 0.5, 0.4);
        
        console.log(`🎵 Game Over! Final Score: ${this.score}, Max Streak: ${this.maxStreak}, Accuracy: ${this.accuracy}%`);
    }
    
    startUserBeatDetection() {
        // Check for missed beats every 100ms
        this.userBeatInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceExpected = now - this.expectedBeatTime;
            const tolerance = (60 / this.currentBPM) * 1000 * 0.3; // 30% tolerance
            
            if (timeSinceExpected > tolerance) {
                // Missed beat
                this.streak = 0;
                this.expectedBeatTime = now + (60 / this.currentBPM) * 1000;
                this.updateDisplay();
            }
        }, 100);
    }
    
    userBeat() {
        if (!this.isUserControlling) {
            // If user tries to beat while game is playing, take control naturally
            if (this.isPlaying) {
                this.takeControlNaturally();
            }
            return;
        }
        
        const now = Date.now();
        this.userBeatTimes.push(now);
        
        // Visual feedback
        this.playUserBeat();
        this.animateBeatCircle();
        
        // Calculate timing accuracy
        const timingError = Math.abs(now - this.expectedBeatTime);
        const beatInterval = (60 / this.currentBPM) * 1000;
        const maxError = beatInterval * 0.3; // 30% tolerance
        
        if (timingError <= maxError) {
            // Good timing
            const accuracyPercent = Math.max(0, 100 - (timingError / maxError) * 100);
            this.streak++;
            this.score += Math.floor(accuracyPercent * (1 + this.streak * 0.1));
            
            // Update accuracy calculation
            this.beatCount++;
            const totalAccuracy = this.userBeatTimes.reduce((sum, time, index) => {
                if (index === 0) return 100;
                const expectedTime = this.userBeatTimes[0] + (index * beatInterval);
                const error = Math.abs(time - expectedTime);
                return sum + Math.max(0, 100 - (error / maxError) * 100);
            }, 0);
            
            this.accuracy = Math.floor(totalAccuracy / this.beatCount);
        } else {
            // Poor timing
            this.streak = 0;
        }
        
        this.maxStreak = Math.max(this.maxStreak, this.streak);
        
        // Set next expected beat time
        this.expectedBeatTime = now + beatInterval;
        
        this.updateDisplay();
        this.updateTempoIndicator(timingError, maxError);
    }
    
    playGameBeat() {
        this.lastBeatTime = Date.now(); // Track when this beat occurred
        this.playBeep(800, 0.1, 0.3); // Higher pitched beep for game
        this.animateBeatCircle();
        this.beatCount++;
    }
    
    playUserBeat() {
        this.playBeep(400, 0.1, 0.5); // Lower pitched beep for user
    }
    
    playBeep(frequency, duration, volume = 0.3) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.isUserControlling ? this.masterGain : this.gameGain);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    animateBeatCircle() {
        this.elements.beatPulse.classList.remove('active');
        // Force reflow
        this.elements.beatPulse.offsetHeight;
        this.elements.beatPulse.classList.add('active');
    }
    
    updateTempoIndicator(error, maxError) {
        const accuracy = Math.max(0, 100 - (error / maxError) * 100);
        this.elements.tempoIndicator.style.setProperty('--accuracy', `${accuracy}%`);
        
        // Update the indicator width
        const indicator = this.elements.tempoIndicator;
        indicator.style.background = `linear-gradient(90deg, 
            ${accuracy > 70 ? '#00ff00' : accuracy > 40 ? '#ffff00' : '#ff4444'} 0%, 
            ${accuracy > 70 ? '#00ff00' : accuracy > 40 ? '#ffff00' : '#ff4444'} ${accuracy}%, 
            rgba(255,255,255,0.1) ${accuracy}%)`;
    }
    
    updateDisplay() {
        this.elements.accuracy.textContent = `${this.accuracy}%`;
        this.elements.streak.textContent = this.streak;
        this.elements.score.textContent = this.score;
        
        if (!this.isUserControlling) {
            this.elements.timeLeft.textContent = '--';
            this.elements.timeLeft.style.color = '#8a2be2';
        }
    }
    
    updateVisualizer() {
        if (!this.isPlaying) return;
        
        const bars = this.elements.visualizer.querySelectorAll('.vis-bar');
        bars.forEach((bar, index) => {
            bar.style.animationDelay = `${index * 0.1}s`;
        });
        
        setTimeout(() => this.updateVisualizer(), 500);
    }
    
    reset() {
        this.isPlaying = false;
        this.isUserControlling = false;
        this.beatCount = 0;
        this.userBeatTimes = [];
        this.accuracy = 0;
        this.streak = 0;
        this.score = 0;
        this.maxStreak = 0;
        this.timeLeft = this.gameDuration;
        
        // Clear intervals
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
        
        if (this.userBeatInterval) {
            clearInterval(this.userBeatInterval);
            this.userBeatInterval = null;
        }
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        // Reset audio
        if (this.gameGain) {
            this.gameGain.gain.cancelScheduledValues(this.audioContext.currentTime);
            this.gameGain.gain.value = 1.0;
        }
        
        // Reset UI
        this.elements.startBtn.textContent = 'START TEMPO';
        this.elements.startBtn.disabled = false;
        
        // Reset tempo indicator
        this.elements.tempoIndicator.style.background = 'rgba(255, 255, 255, 0.1)';
        
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new VibeBeatGame();
    
    // Add some helpful keyboard shortcuts info
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyR' && e.ctrlKey) {
            e.preventDefault();
            game.reset();
        }
    });
    
    console.log('🎵 Vibe Beats loaded! Use SPACEBAR to play, mouse wheel on BPM to adjust tempo.');
});