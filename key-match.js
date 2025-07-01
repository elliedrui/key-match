<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letter Arrow Matching Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Arial', sans-serif;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        .box {
            position: absolute;
            width: 72px;
            height: 72px;
            background: white;
            border: 3px solid #333;
            border-radius: 8px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .left-box {
            left: calc(50% - 144px - 36px);
        }

        .right-box {
            right: calc(50% - 144px - 36px);
        }

        .letter {
            position: absolute;
            font-size: 32px;
            font-weight: bold;
            color: #ff6b6b;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            top: 50%;
            transform: translateY(-50%);
            left: -50px;
            animation: driftRight 3s linear;
        }

        .arrow {
            position: absolute;
            font-size: 32px;
            font-weight: bold;
            color: #4ecdc4;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            top: 50%;
            transform: translateY(-50%);
            right: -50px;
            animation: driftLeft 3s linear;
        }

        @keyframes driftRight {
            from { left: -50px; }
            to { left: calc(50% - 144px + 36px); }
        }

        @keyframes driftLeft {
            from { right: -50px; }
            to { right: calc(50% - 144px + 36px); }
        }

        .controls {
            position: absolute;
            bottom: 50px;
            display: flex;
            gap: 20px;
            z-index: 100;
        }

        .btn {
            padding: 15px 30px;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .start-btn {
            background: #4CAF50;
            color: white;
        }

        .start-btn:hover {
            background: #45a049;
            transform: translateY(-2px);
        }

        .stop-btn {
            background: #f44336;
            color: white;
        }

        .stop-btn:hover {
            background: #da190b;
            transform: translateY(-2px);
        }

        .result {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 48px;
            font-weight: bold;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
            z-index: 50;
            animation: resultPop 0.5s ease-out;
        }

        .win {
            color: #4CAF50;
        }

        .fail {
            color: #f44336;
        }

        @keyframes resultPop {
            0% { transform: translateX(-50%) scale(0); }
            50% { transform: translateX(-50%) scale(1.2); }
            100% { transform: translateX(-50%) scale(1); }
        }

        .instructions {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            text-align: center;
            font-size: 16px;
            background: rgba(0,0,0,0.3);
            padding: 10px 20px;
            border-radius: 8px;
        }

        .controls-panel {
            position: absolute;
            top: 80px;
            left: 20px;
            background: rgba(0,0,0,0.4);
            padding: 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            min-width: 200px;
        }

        .slider-container {
            margin: 15px 0;
        }

        .slider-container label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .slider {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #ddd;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
        }

        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: pointer;
            border: none;
        }

        .slider-value {
            font-size: 12px;
            color: #ccc;
            margin-top: 3px;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="instructions">
            Press the matching letter (A,S,D,W) and arrow (↑,↓,←,→) keys when they enter the white boxes!
        </div>
        
        <div class="controls-panel">
            <div class="slider-container">
                <label for="speedSlider">Element Speed</label>
                <input type="range" id="speedSlider" class="slider" min="1" max="6" value="4.5" step="0.5">
                <div class="slider-value" id="speedValue">4.5s (Slower)</div>
            </div>
            
            <div class="slider-container">
                <label for="spacingSlider">Round Spacing</label>
                <input type="range" id="spacingSlider" class="slider" min="0.5" max="8" value="1.5" step="0.5">
                <div class="slider-value" id="spacingValue">1.5s</div>
            </div>
        </div>
        <div class="box left-box" id="leftBox"></div>
        <div class="box right-box" id="rightBox"></div>
        
        <div class="controls">
            <button class="btn start-btn" onclick="startGame()">START</button>
            <button class="btn stop-btn" onclick="stopGame()">STOP</button>
        </div>
    </div>

    <script>
        let gameRunning = false;
        let gameInterval;
        let resultTimeout;
        let currentSpeed = 4.5; // seconds
        let currentSpacing = 1.5; // seconds between rounds
        let activePairs = new Map(); // Track active letter/arrow pairs

        const letters = ['A', 'S', 'D', 'W'];
        const arrows = ['↑', '↓', '←', '→'];
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        
        // Audio contexts for sounds
        let audioContext;
        
        function initAudio() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        function playWinSound() {
            if (!audioContext) initAudio();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        }

        function playFailSound() {
            if (!audioContext) initAudio();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }

        function startGame() {
            if (gameRunning) return;
            
            gameRunning = true;
            clearResult();
            spawnElements();
            
            gameInterval = setInterval(() => {
                if (gameRunning) {
                    spawnElements();
                }
            }, currentSpacing * 1000);
        }

        function stopGame() {
            gameRunning = false;
            if (gameInterval) {
                clearInterval(gameInterval);
            }
            clearResult();
            clearElements();
            activePairs.clear();
        }

        function spawnElements() {
            // Random letter and arrow
            const newLetter = letters[Math.floor(Math.random() * letters.length)];
            const newArrow = arrows[Math.floor(Math.random() * arrows.length)];
            
            // Create unique pair ID
            const pairId = Date.now() + Math.random();
            
            // Track this pair
            activePairs.set(pairId, {
                letter: newLetter,
                arrow: newArrow,
                letterPressed: false,
                arrowPressed: false
            });
            
            // Create letter element with dynamic speed
            const letterEl = document.createElement('div');
            letterEl.className = 'letter';
            letterEl.textContent = newLetter;
            letterEl.style.animationDuration = currentSpeed + 's';
            letterEl.setAttribute('data-letter', newLetter);
            letterEl.setAttribute('data-pair', pairId);
            document.querySelector('.game-container').appendChild(letterEl);
            
            // Create arrow element with dynamic speed
            const arrowEl = document.createElement('div');
            arrowEl.className = 'arrow';
            arrowEl.textContent = newArrow;
            arrowEl.style.animationDuration = currentSpeed + 's';
            arrowEl.setAttribute('data-arrow', newArrow);
            arrowEl.setAttribute('data-pair', pairId);
            document.querySelector('.game-container').appendChild(arrowEl);
            
            // Check for success after elements reach boxes
            setTimeout(() => {
                if (gameRunning && activePairs.has(pairId)) {
                    checkResultForPair(pairId);
                }
            }, currentSpeed * 1000);
            
            // Remove elements after animation
            setTimeout(() => {
                if (letterEl.parentNode) letterEl.remove();
                if (arrowEl.parentNode) arrowEl.remove();
                activePairs.delete(pairId);
            }, (currentSpeed * 1000) + 500);
        }

        function clearElements() {
            const letters = document.querySelectorAll('.letter');
            const arrows = document.querySelectorAll('.arrow');
            letters.forEach(el => el.remove());
            arrows.forEach(el => el.remove());
        }

        function checkResultForPair(pairId) {
            const pair = activePairs.get(pairId);
            if (pair) {
                if (pair.letterPressed && pair.arrowPressed) {
                    showResult('WIN', true);
                    playWinSound();
                } else {
                    showResult('FAIL', false);
                    playFailSound();
                }
            }
        }

        function showResult(text, isWin) {
            clearResult();
            
            const resultEl = document.createElement('div');
            resultEl.className = `result ${isWin ? 'win' : 'fail'}`;
            resultEl.textContent = text;
            document.querySelector('.game-container').appendChild(resultEl);
            
            resultTimeout = setTimeout(() => {
                if (resultEl.parentNode) {
                    resultEl.remove();
                }
            }, 2000);
        }

        function clearResult() {
            const result = document.querySelector('.result');
            if (result) result.remove();
            if (resultTimeout) {
                clearTimeout(resultTimeout);
            }
        }

        // Keyboard event listeners
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;
            
            // Check all active pairs to see if this key press matches any
            for (let [pairId, pair] of activePairs) {
                // Check letter keys
                if (e.key.toUpperCase() === pair.letter) {
                    pair.letterPressed = true;
                }
                
                // Check arrow keys
                const arrowIndex = arrowKeys.indexOf(e.key);
                if (arrowIndex !== -1 && arrows[arrowIndex] === pair.arrow) {
                    pair.arrowPressed = true;
                }
            }
        });

        // Reset key states when elements spawn
        document.addEventListener('keyup', (e) => {
            // Optional: Reset on key release if desired
        });

        // Initialize audio on first user interaction
        document.addEventListener('click', () => {
            if (!audioContext) {
                initAudio();
            }
        }, { once: true });

        // Slider event listeners
        document.getElementById('speedSlider').addEventListener('input', function(e) {
            currentSpeed = parseFloat(e.target.value);
            const speedText = currentSpeed === 1 ? '1.0s (Very Fast)' :
                            currentSpeed === 1.5 ? '1.5s (Fast)' :
                            currentSpeed === 2 ? '2.0s (Medium-Fast)' :
                            currentSpeed === 2.5 ? '2.5s (Medium)' :
                            currentSpeed === 3 ? '3.0s (Normal)' :
                            currentSpeed === 3.5 ? '3.5s (Medium-Slow)' :
                            currentSpeed === 4 ? '4.0s (Slow)' :
                            currentSpeed === 4.5 ? '4.5s (Slower)' :
                            currentSpeed === 5 ? '5.0s (Very Slow)' :
                            currentSpeed === 5.5 ? '5.5s (Slowest)' :
                            '6.0s (Crawling)';
            document.getElementById('speedValue').textContent = speedText;
        });

        document.getElementById('spacingSlider').addEventListener('input', function(e) {
            currentSpacing = parseFloat(e.target.value);
            document.getElementById('spacingValue').textContent = currentSpacing + 's';
            
            // Restart the interval if game is running
            if (gameRunning && gameInterval) {
                clearInterval(gameInterval);
                gameInterval = setInterval(() => {
                    if (gameRunning) {
                        spawnElements();
                    }
                }, currentSpacing * 1000);
            }
        });
    </script>
</body>
</html>
