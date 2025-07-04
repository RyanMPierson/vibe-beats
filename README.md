# 🎵 Vibe Beats - Tempo Master

A futuristic rhythm game that tests your ability to maintain perfect tempo. Listen to the beat, jump in when ready, and prove your timing skills in this neon-styled arcade experience.

![Vibe Beats Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![CSS3](https://img.shields.io/badge/CSS3-Futuristic-blue) ![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange)

## How to Play

1. **Listen**: Click "START TEMPO" to hear the reference beat
2. **Jump In**: Press SPACEBAR or click the beat circle when you feel ready to take control
3. **Beat the Clock**: You have 15 seconds to maintain perfect timing
4. **Score Points**: Stay accurate to build streaks and maximize your score

## Features

### **Futuristic Design**
- **Neon Aesthetics**: Cyan, magenta, and yellow color scheme with glow effects
- **Modern Typography**: Orbitron font for that sci-fi feel
- **Smooth Animations**: Pulsing beat circles, gradient text, and visual feedback
- **Glass-morphism UI**: Translucent panels with backdrop blur effects
- **Audio Visualizer**: Animated bars that dance to the rhythm

### **Advanced Audio System**
- **Web Audio API**: Real-time audio generation with synthetic beeps
- **Dual Audio Channels**: Separate channels for game beats (800Hz) and user beats (400Hz)
- **Seamless Transitions**: Game audio fades gracefully when user takes control
- **No Audio Files Required**: Everything is generated procedurally

### **Intelligent Gameplay**
- **Natural Beat Takeover**: Jump in anytime without stopping the flow
- **Precision Timing**: 30% tolerance window for beat accuracy
- **Dynamic Scoring**: Points based on accuracy percentage and streak multipliers
- **Real-time Feedback**: Visual tempo indicator shows timing precision
- **Streak System**: Consecutive accurate beats increase your score multiplier

### **Intuitive Controls**
- **Keyboard**: SPACEBAR for all interactions
- **Mouse**: Click the beat circle or use control buttons
- **BPM Adjustment**: Mouse wheel on BPM display (60-200 BPM range)
- **Quick Reset**: Ctrl+R keyboard shortcut

## Getting Started

### Prerequisites
- Modern web browser with Web Audio API support (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibe-beats.git
   ```

2. Navigate to the project directory:
   ```bash
   cd vibe-beats
   ```

3. Open `index.html` in your web browser:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node.js (if installed)
   npx serve .
   
   # Or simply open index.html directly in your browser
   ```

4. Start playing! 🎵

## Project Structure

```
vibe-beats/
├── index.html          # Main HTML structure
├── style.css           # Futuristic CSS styling with animations
├── script.js           # Game logic and audio system
└── README.md          # This file
```

## Game Mechanics

### Scoring System
- **Base Points**: Accuracy percentage (0-100) per beat
- **Streak Multiplier**: `1 + (streak × 0.1)` bonus
- **Final Score**: `accuracyPercent × streakMultiplier`

### Timing Tolerance
- **Perfect**: ±0% of beat interval = 100% accuracy
- **Good**: ±15% of beat interval = 85% accuracy  
- **Acceptable**: ±30% of beat interval = 70% accuracy
- **Miss**: >30% of beat interval = streak reset

### Time Pressure
- **Listen Phase**: Unlimited time to learn the tempo
- **Play Phase**: Exactly 15 seconds to score points
- **Visual Countdown**: Timer changes color as time runs out

## Customization

### Adjusting Game Difficulty
Modify these values in `script.js`:

```javascript
// Game duration (seconds)
this.gameDuration = 15; // Change to 30 for easier, 10 for harder

// Timing tolerance (30% = forgiving, 15% = strict)
const maxError = beatInterval * 0.3; // Line ~270

// BPM range
this.currentBPM = Math.max(60, Math.min(200, bpm)); // Line ~105
```

### Styling Modifications
The CSS uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #00ffff;    /* Cyan */
  --secondary-color: #ff00ff;  /* Magenta */
  --accent-color: #ffff00;     /* Yellow */
  --danger-color: #ff4444;     /* Red */
}
```

## Advanced Features

### Audio Customization
- **Game Beat Frequency**: 800Hz (configurable in `playGameBeat()`)
- **User Beat Frequency**: 400Hz (configurable in `playUserBeat()`)
- **Master Volume**: 70% (configurable in `initAudio()`)
- **Beat Duration**: 100ms (configurable in `playBeep()`)

### Responsive Design
- **Desktop**: Full grid layout with side panels
- **Mobile**: Stacked layout optimized for touch
- **Tablet**: Adaptive layout that scales smoothly

## 🔧 Technical Details

### Browser Compatibility
- **Chrome/Edge**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Mobile Browsers**: Touch-optimized ✅

### Performance
- **60 FPS Animations**: Hardware-accelerated CSS transforms
- **Low Latency Audio**: Web Audio API with minimal processing
- **Memory Efficient**: No external assets, everything generated in real-time

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Ideas
- [ ] Multiple difficulty levels
- [ ] Different sound themes
- [ ] High score persistence
- [ ] Multiplayer mode
- [ ] Mobile app version
- [ ] Custom beat patterns

## License

This project is licensed under the MIT License.

## Inspiration

Inspired by rhythm games like Guitar Hero, Beat Saber, and classic arcade timing games. Built to demonstrate the power of modern web technologies for creating engaging, real-time audio experiences.

## Acknowledgments

- **Web Audio API** for making real-time audio synthesis possible
- **CSS Grid** for the responsive layout system
- **Orbitron Font** by Google Fonts for the futuristic typography
- **Modern JavaScript** for clean, maintainable code architecture

---

**Made with ❤️ by Ryan Pierson**

*Ready to test your rhythm? Play Vibe Beats now!* 🎮✨
