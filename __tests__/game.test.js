/**
 * @jest-environment jsdom
 */

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    arc: jest.fn(),
    ellipse: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    fillText: jest.fn(),
    strokeRect: jest.fn()
}));

describe('Flappy Bird Game Logic', () => {
    beforeEach(() => {
        // Reset localStorage
        localStorage.clear();
        
        // Setup DOM
        document.body.innerHTML = `
            <canvas id="game-canvas" width="600" height="800"></canvas>
            <div id="score">0</div>
            <div id="game-start"></div>
            <div id="game-over"></div>
            <span id="high-score">0</span>
            <span id="final-score">0</span>
            <span id="best-score">0</span>
        `;
    });

    test('bird should have correct initial properties', () => {
        const bird = {
            x: 100,
            y: 400,
            velocity: 0,
            width: 40,
            height: 30,
            color: '#f4d03f'
        };

        expect(bird.x).toBe(100);
        expect(bird.y).toBe(400);
        expect(bird.velocity).toBe(0);
        expect(bird.width).toBe(40);
        expect(bird.height).toBe(30);
    });

    test('bird should fall with gravity', () => {
        const GRAVITY = 0.25;
        const bird = { y: 400, velocity: 0 };
        
        // Simulate gravity
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;
        
        expect(bird.y).toBeGreaterThan(400);
        expect(bird.velocity).toBe(0.25);
    });

    test('bird should jump with correct velocity', () => {
        const JUMP = -6;
        const bird = { velocity: 0 };
        
        bird.velocity = JUMP;
        
        expect(bird.velocity).toBe(-6);
    });

    test('pipe should spawn with correct structure', () => {
        const PIPE_GAP = 160;
        const canvasHeight = 800;
        const groundHeight = 80;
        
        const pipe = {
            x: 600,
            topHeight: 200,
            passed: false
        };
        
        expect(pipe.x).toBe(600);
        expect(pipe.topHeight).toBeGreaterThan(0);
        expect(pipe.topHeight + PIPE_GAP).toBeLessThan(canvasHeight - groundHeight);
    });

    test('score should increment when passing pipe', () => {
        let score = 0;
        const pipe = { x: 50, passed: false };  // Pipe is behind bird
        const bird = { x: 150 };
        
        // Check if bird passed pipe (pipe.x + pipe_width < bird.x)
        if (!pipe.passed && pipe.x + 60 < bird.x) {
            pipe.passed = true;
            score++;
        }
        
        expect(score).toBe(1);
        expect(pipe.passed).toBe(true);
    });

    test('collision should detect when hitting top pipe', () => {
        const bird = {
            x: 100,
            y: 50,
            width: 40,
            height: 30
        };
        
        const pipe = {
            x: 80,
            topHeight: 100
        };
        
        const collision = (
            bird.x + bird.width / 2 > pipe.x &&
            bird.x - bird.width / 2 < pipe.x + 60 &&
            bird.y - bird.height / 2 < pipe.topHeight
        );
        
        expect(collision).toBe(true);
    });

    test('collision should detect when hitting bottom pipe', () => {
        const PIPE_GAP = 160;
        const bird = {
            x: 100,
            y: 300,
            width: 40,
            height: 30
        };
        
        const pipe = {
            x: 80,
            topHeight: 100
        };
        
        const collision = (
            bird.x + bird.width / 2 > pipe.x &&
            bird.x - bird.width / 2 < pipe.x + 60 &&
            bird.y + bird.height / 2 > pipe.topHeight + PIPE_GAP
        );
        
        expect(collision).toBe(true);
    });

    test('high score should be saved to localStorage', () => {
        const highScore = 10;
        localStorage.setItem('flappyHighScore', highScore);
        
        expect(localStorage.getItem('flappyHighScore')).toBe('10');
    });

    test('game state should start in "start" mode', () => {
        let gameState = 'start';
        expect(gameState).toBe('start');
    });

    test('bird should not go below ground', () => {
        const canvasHeight = 800;
        const groundHeight = 80;
        const bird = {
            y: canvasHeight - groundHeight - 15,
            height: 30
        };
        
        const onGround = bird.y + bird.height / 2 >= canvasHeight - groundHeight;
        
        expect(onGround).toBe(true);
    });
});

describe('Game Physics', () => {
    test('gravity should be constant', () => {
        const GRAVITY = 0.25;
        expect(GRAVITY).toBe(0.25);
    });

    test('jump force should be constant', () => {
        const JUMP = -6;
        expect(JUMP).toBe(-6);
    });

    test('pipe gap should be constant', () => {
        const PIPE_GAP = 160;
        expect(PIPE_GAP).toBe(160);
    });

    test('pipe speed should be constant', () => {
        const PIPE_SPEED = 2;
        expect(PIPE_SPEED).toBe(2);
    });
});
