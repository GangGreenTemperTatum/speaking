/**
 * Flappy Portfolio Game Engine
 * Interactive portfolio with Flappy Bird mechanics
 */

(function() {
    'use strict';

    // Game constants
    const GAME_CONFIG = {
        width: 400,
        height: 600,
        gravity: 0.25,
        jumpForce: -4.6,
        pipeSpeed: 2,
        pipeGap: 120,
        pipeWidth: 52,
        spawnRate: 100, // frames
        zoneSwitchRate: 10, // pipes per zone
        groundHeight: 80
    };

    // Zone types in order
    const ZONE_TYPES = ['conference', 'podcast', 'publication', 'volunteering', 'television'];

    // Game state
    const GAME_STATES = {
        START: 'start',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAMEOVER: 'gameover',
        MODAL: 'modal'
    };

    // Canvas and context
    let canvas, ctx;
    let gameState = GAME_STATES.START;
    let frameCount = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
    let collectedBugs = 0;
    let currentZoneIndex = 0;
    let pipesPassedInZone = 0;

    // Game entities
    let bird;
    let pipes = [];
    let particles = [];
    let backgrounds = [];

    // Input handling
    let isTouching = false;

    /**
     * Initialize the game
     */
    function init() {
        canvas = document.getElementById('game-canvas');
        if (!canvas) {
            console.error('Game canvas not found');
            return;
        }

        ctx = canvas.getContext('2d');
        
        // Set canvas size
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize game entities
        resetGame();

        // Setup input handlers
        setupInputHandlers();

        // Start game loop
        requestAnimationFrame(gameLoop);

        console.log('Flappy Portfolio game initialized');
    }

    /**
     * Resize canvas for responsive design
     */
    function resizeCanvas() {
        const container = document.getElementById('game-container');
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Maintain aspect ratio
        const aspectRatio = GAME_CONFIG.width / GAME_CONFIG.height;
        let newWidth = containerWidth;
        let newHeight = containerWidth / aspectRatio;

        if (newHeight > containerHeight) {
            newHeight = containerHeight;
            newWidth = containerHeight * aspectRatio;
        }

        canvas.width = GAME_CONFIG.width;
        canvas.height = GAME_CONFIG.height;
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
    }

    /**
     * Reset game to initial state
     */
    function resetGame() {
        // Initialize bird
        bird = {
            x: 80,
            y: GAME_CONFIG.height / 2,
            velocity: 0,
            width: 34,
            height: 24,
            rotation: 0,
            frame: 0,
            spriteFrame: 0
        };

        // Reset game state
        pipes = [];
        particles = [];
        score = 0;
        frameCount = 0;
        currentZoneIndex = 0;
        pipesPassedInZone = 0;

        // Update UI
        updateScoreDisplay();
        updateZoneDisplay();

        console.log('Game reset');
    }

    /**
     * Setup input handlers for touch and keyboard
     */
    function setupInputHandlers() {
        // Touch events
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Mouse events (for desktop testing)
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);

        // Keyboard events
        document.addEventListener('keydown', handleKeyDown);

        // Prevent scrolling on mobile
        document.body.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }

    function handleTouchStart(e) {
        e.preventDefault();
        if (!isTouching) {
            isTouching = true;
            handleInput();
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        isTouching = false;
    }

    function handleMouseDown(e) {
        isTouching = true;
        handleInput();
    }

    function handleMouseUp(e) {
        isTouching = false;
    }

    function handleKeyDown(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            handleInput();
        }
    }

    /**
     * Handle game input (flap action)
     */
    function handleInput() {
        switch (gameState) {
            case GAME_STATES.START:
                startGame();
                break;
            case GAME_STATES.PLAYING:
                flap();
                break;
            case GAME_STATES.GAMEOVER:
                resetGame();
                gameState = GAME_STATES.START;
                break;
        }
    }

    /**
     * Start the game
     */
    function startGame() {
        gameState = GAME_STATES.PLAYING;
        resetGame();
        console.log('Game started');
    }

    /**
     * Make the bird flap
     */
    function flap() {
        bird.velocity = GAME_CONFIG.jumpForce;
        createFlapParticles();
    }

    /**
     * Main game loop
     */
    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }

    /**
     * Update game logic
     */
    function update() {
        if (gameState === GAME_STATES.PLAYING) {
            frameCount++;

            // Update bird
            updateBird();

            // Spawn pipes
            if (frameCount % GAME_CONFIG.spawnRate === 0) {
                spawnPipe();
            }

            // Update pipes
            updatePipes();

            // Update particles
            updateParticles();

            // Check collisions
            checkCollisions();
        }
    }

    /**
     * Update bird physics
     */
    function updateBird() {
        // Apply gravity
        bird.velocity += GAME_CONFIG.gravity;
        bird.y += bird.velocity;

        // Update rotation based on velocity
        bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1));

        // Update sprite animation frame
        bird.frame += 0.1;
        bird.spriteFrame = Math.floor(bird.frame) % 3;

        // Check ground collision
        if (bird.y + bird.height / 2 >= GAME_CONFIG.height - GAME_CONFIG.groundHeight) {
            bird.y = GAME_CONFIG.height - GAME_CONFIG.groundHeight - bird.height / 2;
            gameOver();
        }

        // Check ceiling collision
        if (bird.y - bird.height / 2 <= 0) {
            bird.y = bird.height / 2;
            bird.velocity = 0;
        }
    }

    /**
     * Spawn a new pipe
     */
    function spawnPipe() {
        const zoneType = ZONE_TYPES[currentZoneIndex];
        const minHeight = 50;
        const maxHeight = GAME_CONFIG.height - GAME_CONFIG.groundHeight - GAME_CONFIG.pipeGap - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);

        const pipe = {
            x: GAME_CONFIG.width,
            topHeight: topHeight,
            gap: GAME_CONFIG.pipeGap,
            width: GAME_CONFIG.pipeWidth,
            zone: zoneType,
            passed: false,
            hasCollectible: false,
            collectibleCollected: false
        };

        // 50% chance to have a collectible
        if (Math.random() > 0.5) {
            const featuredContent = window.ContentData ? window.ContentData.getFeaturedContent() : null;
            if (featuredContent && featuredContent[zoneType] && featuredContent[zoneType].length > 0) {
                pipe.hasCollectible = true;
                const items = featuredContent[zoneType];
                pipe.contentItem = items[Math.floor(Math.random() * items.length)];
            }
        }

        pipes.push(pipe);
        console.log(`Spawned pipe in zone: ${zoneType}, collectible: ${pipe.hasCollectible}`);
    }

    /**
     * Update all pipes
     */
    function updatePipes() {
        for (let i = pipes.length - 1; i >= 0; i--) {
            const pipe = pipes[i];
            pipe.x -= GAME_CONFIG.pipeSpeed;

            // Check if bird passed the pipe
            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                pipe.passed = true;
                score++;
                pipesPassedInZone++;
                updateScoreDisplay();

                // Check for zone switch
                if (pipesPassedInZone >= GAME_CONFIG.zoneSwitchRate) {
                    switchZone();
                }
            }

            // Remove off-screen pipes
            if (pipe.x + pipe.width < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    /**
     * Switch to next zone
     */
    function switchZone() {
        currentZoneIndex = (currentZoneIndex + 1) % ZONE_TYPES.length;
        pipesPassedInZone = 0;
        updateZoneDisplay();
        console.log(`Switched to zone: ${ZONE_TYPES[currentZoneIndex]}`);
    }

    /**
     * Update particles
     */
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.alpha = p.life / p.maxLife;

            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    /**
     * Check for collisions
     */
    function checkCollisions() {
        const birdLeft = bird.x - bird.width / 2;
        const birdRight = bird.x + bird.width / 2;
        const birdTop = bird.y - bird.height / 2;
        const birdBottom = bird.y + bird.height / 2;

        for (const pipe of pipes) {
            // Check pipe collision
            if (birdRight > pipe.x && birdLeft < pipe.x + pipe.width) {
                // Top pipe collision
                if (birdTop < pipe.topHeight) {
                    gameOver();
                    return;
                }
                // Bottom pipe collision
                if (birdBottom > pipe.topHeight + pipe.gap) {
                    gameOver();
                    return;
                }
            }

            // Check collectible collision
            if (pipe.hasCollectible && !pipe.collectibleCollected) {
                const collectibleX = pipe.x + pipe.width / 2;
                const collectibleY = pipe.topHeight + pipe.gap / 2;
                const distance = Math.sqrt(
                    Math.pow(bird.x - collectibleX, 2) + 
                    Math.pow(bird.y - collectibleY, 2)
                );

                if (distance < 20) { // Collectible radius
                    pipe.collectibleCollected = true;
                    collectedBugs++;
                    createCollectParticles(collectibleX, collectibleY);
                    showContentCard(pipe.contentItem);
                }
            }
        }
    }

    /**
     * Create particles when bird flaps
     */
    function createFlapParticles() {
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: bird.x - 10,
                y: bird.y,
                vx: -2 - Math.random() * 2,
                vy: Math.random() * 2 - 1,
                life: 20,
                maxLife: 20,
                alpha: 1,
                color: '#2de2e6',
                size: 3
            });
        }
    }

    /**
     * Create particles when collecting bug
     */
    function createCollectParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 30,
                maxLife: 30,
                alpha: 1,
                color: '#f6f740',
                size: 4
            });
        }
    }

    /**
     * Game over
     */
    function gameOver() {
        gameState = GAME_STATES.GAMEOVER;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
        }

        console.log(`Game over! Score: ${score}, High Score: ${highScore}`);
    }

    /**
     * Show content card modal
     */
    function showContentCard(contentItem) {
        gameState = GAME_STATES.MODAL;
        
        // Pause the game
        const modal = document.getElementById('content-modal');
        if (modal && typeof window.showContentModal === 'function') {
            window.showContentModal(contentItem);
        }
    }

    /**
     * Resume game after modal
     */
    window.resumeGame = function() {
        if (gameState === GAME_STATES.MODAL) {
            gameState = GAME_STATES.PLAYING;
        }
    };

    /**
     * Render the game
     */
    function render() {
        // Clear canvas
        ctx.fillStyle = '#0d0221';
        ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

        // Draw background
        drawBackground();

        // Draw pipes
        drawPipes();

        // Draw particles
        drawParticles();

        // Draw bird
        drawBird();

        // Draw ground
        drawGround();

        // Draw UI
        drawUI();
    }

    /**
     * Draw background
     */
    function drawBackground() {
        // Draw gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.height);
        gradient.addColorStop(0, '#0d0221');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

        // Draw grid pattern
        ctx.strokeStyle = 'rgba(45, 226, 230, 0.1)';
        ctx.lineWidth = 1;
        
        const gridSize = 40;
        const offset = (frameCount * 0.5) % gridSize;
        
        for (let x = 0; x < GAME_CONFIG.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, GAME_CONFIG.height);
            ctx.stroke();
        }
        
        for (let y = offset; y < GAME_CONFIG.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(GAME_CONFIG.width, y);
            ctx.stroke();
        }

        // Draw stars/dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 73) % GAME_CONFIG.width;
            const y = (i * 37 + frameCount * 0.2) % (GAME_CONFIG.height - GAME_CONFIG.groundHeight);
            ctx.fillRect(x, y, 2, 2);
        }
    }

    /**
     * Draw bird
     */
    function drawBird() {
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(bird.rotation);

        // Draw bird body (simple shape for now)
        ctx.fillStyle = '#ff3864';
        ctx.beginPath();
        ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw wing
        ctx.fillStyle = '#2de2e6';
        const wingOffset = bird.spriteFrame === 0 ? -5 : (bird.spriteFrame === 1 ? 0 : 5);
        ctx.beginPath();
        ctx.ellipse(-5, wingOffset, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(8, -4, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(10, -4, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw beak
        ctx.fillStyle = '#f6f740';
        ctx.beginPath();
        ctx.moveTo(12, 2);
        ctx.lineTo(22, 5);
        ctx.lineTo(12, 8);
        ctx.fill();

        // Draw sunglasses (hacker style)
        ctx.fillStyle = '#000000';
        ctx.fillRect(2, -8, 14, 6);
        ctx.fillStyle = '#333333';
        ctx.fillRect(4, -7, 10, 4);

        ctx.restore();
    }

    /**
     * Draw pipes
     */
    function drawPipes() {
        const zoneColors = {
            conference: '#3b82f6',
            podcast: '#a855f7',
            publication: '#22c55e',
            volunteering: '#f97316',
            television: '#ef4444'
        };

        for (const pipe of pipes) {
            const color = zoneColors[pipe.zone] || '#3b82f6';
            
            // Draw top pipe
            ctx.fillStyle = color;
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            
            // Top pipe cap
            ctx.fillStyle = shadeColor(color, -20);
            ctx.fillRect(pipe.x - 2, pipe.topHeight - 20, pipe.width + 4, 20);

            // Draw bottom pipe
            const bottomY = pipe.topHeight + pipe.gap;
            const bottomHeight = GAME_CONFIG.height - GAME_CONFIG.groundHeight - bottomY;
            ctx.fillStyle = color;
            ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);
            
            // Bottom pipe cap
            ctx.fillStyle = shadeColor(color, -20);
            ctx.fillRect(pipe.x - 2, bottomY, pipe.width + 4, 20);

            // Draw collectible
            if (pipe.hasCollectible && !pipe.collectibleCollected) {
                const collectibleX = pipe.x + pipe.width / 2;
                const collectibleY = pipe.topHeight + pipe.gap / 2;
                const bobOffset = Math.sin(frameCount * 0.1) * 5;

                // Glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#f6f740';

                // Golden bug
                ctx.fillStyle = '#f6f740';
                ctx.beginPath();
                ctx.arc(collectibleX, collectibleY + bobOffset, 12, 0, Math.PI * 2);
                ctx.fill();

                // Bug body
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🐛', collectibleX, collectibleY + bobOffset);

                ctx.shadowBlur = 0;
            }
        }
    }

    /**
     * Draw particles
     */
    function drawParticles() {
        for (const p of particles) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    /**
     * Draw ground
     */
    function drawGround() {
        const groundY = GAME_CONFIG.height - GAME_CONFIG.groundHeight;
        
        // Ground base
        ctx.fillStyle = '#0a0118';
        ctx.fillRect(0, groundY, GAME_CONFIG.width, GAME_CONFIG.groundHeight);

        // Ground top line
        ctx.fillStyle = '#2de2e6';
        ctx.fillRect(0, groundY, GAME_CONFIG.width, 3);

        // Ground pattern
        ctx.fillStyle = 'rgba(45, 226, 230, 0.2)';
        const patternOffset = (frameCount * GAME_CONFIG.pipeSpeed) % 20;
        for (let x = -patternOffset; x < GAME_CONFIG.width; x += 20) {
            ctx.fillRect(x, groundY + 10, 10, GAME_CONFIG.groundHeight - 20);
        }
    }

    /**
     * Draw UI elements
     */
    function drawUI() {
        if (gameState === GAME_STATES.START) {
            // Title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('FLAPPY PORTFOLIO', GAME_CONFIG.width / 2, 150);

            // Subtitle
            ctx.font = '16px Arial';
            ctx.fillStyle = '#2de2e6';
            ctx.fillText('Tap, click, or press SPACE to fly', GAME_CONFIG.width / 2, 200);
            ctx.fillText('Collect bugs to discover content!', GAME_CONFIG.width / 2, 225);

            // Instructions
            ctx.font = '14px Arial';
            ctx.fillStyle = '#888888';
            ctx.fillText(`High Score: ${highScore}`, GAME_CONFIG.width / 2, 280);
        }

        if (gameState === GAME_STATES.GAMEOVER) {
            // Game over text
            ctx.fillStyle = '#ff3864';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', GAME_CONFIG.width / 2, 200);

            // Score
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.fillText(`Score: ${score}`, GAME_CONFIG.width / 2, 260);
            ctx.fillText(`Best: ${highScore}`, GAME_CONFIG.width / 2, 290);

            // Restart instruction
            ctx.font = '16px Arial';
            ctx.fillStyle = '#2de2e6';
            ctx.fillText('Tap to play again', GAME_CONFIG.width / 2, 350);
        }
    }

    /**
     * Helper function to darken/lighten colors
     */
    function shadeColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    /**
     * Update score display in UI
     */
    function updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }

        const collectedDisplay = document.getElementById('collected-count');
        if (collectedDisplay) {
            collectedDisplay.textContent = collectedBugs;
        }
    }

    /**
     * Update zone display in UI
     */
    function updateZoneDisplay() {
        const zoneIndicator = document.getElementById('current-zone');
        if (zoneIndicator && window.ContentData) {
            const zoneType = ZONE_TYPES[currentZoneIndex];
            const zoneInfo = window.ContentData.zones[zoneType];
            if (zoneInfo) {
                zoneIndicator.textContent = zoneInfo.name;
                zoneIndicator.style.color = zoneInfo.color;
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose game functions globally
    window.FlappyGame = {
        start: startGame,
        pause: () => { gameState = GAME_STATES.PAUSED; },
        resume: () => { if (gameState === GAME_STATES.PAUSED) gameState = GAME_STATES.PLAYING; },
        getState: () => gameState,
        getScore: () => score
    };

})();
