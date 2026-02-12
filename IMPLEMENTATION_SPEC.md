# Flappy Portfolio - Implementation Specification

## Overview
Transform the comic-themed portfolio into an interactive Flappy Bird game while maintaining access to all existing content.

## Architecture

### File Structure
```
docs/
├── index.html                    # Main entry - game canvas + archive modal
├── css/
│   ├── style.css                 # Existing (keep for archive view)
│   ├── game.css                  # NEW: Game canvas styles
│   └── modal.css                 # NEW: Content card modals
├── js/
│   ├── content-data.js           # NEW: Centralized content data (extracted)
│   ├── game.js                   # NEW: Flappy Bird game engine
│   ├── game-entities.js          # NEW: Bird, pipes, collectibles classes
│   ├── game-renderer.js          # NEW: Canvas rendering
│   ├── archive-view.js           # NEW: Archive list controller
│   └── modal.js                  # NEW: Modal system
├── assets/
│   ├── bird/
│   │   ├── bird-up.svg
│   │   ├── bird-mid.svg
│   │   └── bird-down.svg
│   ├── zones/
│   │   ├── conference-pipe.svg
│   │   ├── podcast-pipe.svg
│   │   ├── publication-pipe.svg
│   │   ├── volunteer-pipe.svg
│   │   └── television-pipe.svg
│   ├── collectibles/
│   │   └── bug-gold.svg
│   └── backgrounds/
│       └── terminal-bg.svg
├── content-viewer.html           # EXISTING: Detail view (keep)
└── data/
    └── content.json              # EXISTING: Generated data
```

## Technical Specifications

### 1. Content Data Module (`content-data.js`)

**Purpose**: Single source of truth for all content data

**Exports**:
```javascript
export const contentData = {
  conferences: [...],    // 35+ items
  podcasts: [...],       // 8 items
  publications: [...],   // 27+ items
  volunteering: [...],   // 4 items
  television: [...]      // 1 item
};

// Featured items (most recent)
export const featuredContent = {
  conferences: contentData.conferences.slice(0, 5),
  podcasts: contentData.podcasts.slice(0, 3),
  publications: contentData.publications.slice(0, 5),
  volunteering: contentData.volunteering,
  television: contentData.television
};

// Get items by zone
export function getZoneContent(zoneType) { ... }

// Get featured item by ID
export function getContentById(id) { ... }
```

**Data Structure**:
```javascript
{
  id: "unique-id",
  name: "Display Name",
  year: "2025",
  icon: "fas fa-bug",
  description: "Brief description",
  path: "conferences/bugcrowd/2025/july",
  type: "conference", // conference | podcast | publication | volunteer | television
  date: "2025-07-15", // ISO date for sorting
  featured: true      // Show in game
}
```

### 2. Game Engine (`game.js`)

**Canvas Setup**:
- Resolution: 400x600 (mobile-first), scales responsively
- 60fps game loop using requestAnimationFrame
- Touch + keyboard (spacebar) controls

**Game States**:
```javascript
const GAME_STATES = {
  START: 'start',      // Title screen with "Tap to Start"
  PLAYING: 'playing',  // Active gameplay
  PAUSED: 'paused',    // Pause overlay
  GAMEOVER: 'gameover', // Score + "Try Again" + "View Archive"
  MODAL: 'modal'       // Content card showing
};
```

**Core Mechanics**:
- **Gravity**: 0.25 per frame
- **Jump velocity**: -4.6 (calibrated for mobile)
- **Pipe speed**: 2px per frame (scales with difficulty)
- **Pipe gap**: 120px (standard)
- **Spawn rate**: Every 100 frames (~1.6s)

**Zone System**:
- 5 zones rotate every 10 pipes
- Zone transition shown with gate graphic
- Each zone has distinct pipe color + icon

**Scoring**:
- +1 per pipe passed
- Golden bugs collected add to "Content Discovered" counter
- High score saved to localStorage

### 3. Game Entities (`game-entities.js`)

**Bird Class**:
```javascript
class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.width = 34;
    this.height = 24;
    this.rotation = 0;
    this.frame = 0;
    this.sprites = [birdUp, birdMid, birdDown];
  }
  
  update() {
    this.velocity += GRAVITY;
    this.y += this.velocity;
    this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, 
      (this.velocity * 0.1)));
    this.frame += 0.1;
  }
  
  jump() {
    this.velocity = JUMP_FORCE;
  }
  
  draw(ctx) {
    // Draw with rotation
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.sprites[Math.floor(this.frame) % 3], 
      -this.width/2, -this.height/2);
    ctx.restore();
  }
}
```

**Pipe Class**:
```javascript
class Pipe {
  constructor(x, zone) {
    this.x = x;
    this.topHeight = random(50, 250);
    this.gap = 120;
    this.width = 52;
    this.zone = zone; // 'conference' | 'podcast' | etc.
    this.passed = false;
    this.hasCollectible = Math.random() > 0.5 && featuredContent[zone].length > 0;
    this.collectible = this.hasCollectible ? 
      new Collectible(x, this.topHeight + this.gap/2, zone) : null;
  }
  
  update() {
    this.x -= PIPE_SPEED;
    if (this.collectible) this.collectible.update();
  }
  
  draw(ctx) {
    // Draw top pipe
    ctx.drawImage(zonePipes[this.zone].top, this.x, 
      this.topHeight - zonePipes[this.zone].top.height);
    // Draw bottom pipe
    ctx.drawImage(zonePipes[this.zone].bottom, this.x, 
      this.topHeight + this.gap);
    // Draw collectible
    if (this.collectible) this.collectible.draw(ctx);
  }
}
```

**Collectible Class**:
```javascript
class Collectible {
  constructor(x, y, zone) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.zone = zone;
    this.collected = false;
    this.contentItem = getRandomFeaturedItem(zone);
    this.bobOffset = 0;
  }
  
  update() {
    this.x -= PIPE_SPEED;
    this.bobOffset += 0.1;
  }
  
  draw(ctx) {
    if (this.collected) return;
    
    ctx.save();
    ctx.translate(this.x, this.y + Math.sin(this.bobOffset) * 5);
    ctx.drawImage(bugGold, -this.radius, -this.radius);
    ctx.restore();
  }
  
  checkCollision(bird) {
    const dx = this.x - bird.x;
    const dy = (this.y + Math.sin(this.bobOffset) * 5) - bird.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    return distance < this.radius + bird.width/2;
  }
}
```

### 4. Game Renderer (`game-renderer.js`)

**Layers** (drawn in order):
1. Background (terminal gradient + grid)
2. Far pipes (for depth)
3. Collectibles
4. Bird
5. Near pipes
6. Foreground effects (particles)
7. UI (score, zone indicator)

**Visual Effects**:
- Matrix-style code rain in background
- Particle burst on collectible pickup
- Screen shake on collision
- Glow effect around golden bugs

### 5. Modal System (`modal.js`)

**Content Card Modal**:
- Triggered by collecting a golden bug
- Shows: Title, date, description, icon
- Buttons: "View Details" (opens content-viewer.html), "Continue"
- Auto-pauses game while open

**Zone Modal**:
- Triggered by hitting a pipe (optional)
- Shows 3 featured items from that zone
- Swipeable cards on mobile

**Archive Modal**:
- Full-screen overlay
- Traditional list view with filters
- Tabs: Conferences, Podcasts, Publications, Volunteering, TV
- Search bar
- Year filters
- "Back to Game" button

### 6. Mobile Optimization

**Touch Controls**:
- Tap anywhere to flap
- Prevent default on touch events to avoid scrolling
- Support for both portrait and landscape

**Responsive Breakpoints**:
```css
/* Mobile portrait */
@media (max-width: 480px) {
  canvas { width: 100vw; height: 100vh; }
}

/* Mobile landscape */
@media (max-width: 896px) and (orientation: landscape) {
  canvas { width: 100vw; height: 100vh; }
  .archive-btn { top: 10px; right: 10px; }
}

/* Tablet */
@media (min-width: 768px) {
  canvas { max-width: 600px; max-height: 800px; }
}
```

**Performance**:
- Use requestAnimationFrame with delta time
- Limit particle count to 50
- Pool pipe objects to reduce GC
- Use transform3d for hardware acceleration

### 7. CSS Styling (`game.css` + `modal.css`)

**Game Container**:
```css
#game-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #0d0221 0%, #1a1a2e 100%);
  overflow: hidden;
}

#game-canvas {
  display: block;
  margin: 0 auto;
}

.archive-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(255, 56, 100, 0.9);
  color: white;
  border: none;
  border-radius: 20px;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(255, 56, 100, 0.4);
}
```

**Modal Styles**:
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-card {
  background: #1a1a2e;
  border: 2px solid #2de2e6;
  border-radius: 15px;
  padding: 20px;
  max-width: 90%;
  width: 400px;
  color: white;
  font-family: 'Roboto Mono', monospace;
}
```

### 8. HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Ads Dawson | AI/ML Security Researcher</title>
  <link rel="stylesheet" href="css/game.css">
  <link rel="stylesheet" href="css/modal.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Game Container -->
  <div id="game-container">
    <canvas id="game-canvas"></canvas>
    
    <!-- Archive Button -->
    <button id="archive-btn" class="archive-btn">📚 View Full Archive</button>
    
    <!-- Score Display -->
    <div id="score-display" class="score-display">0</div>
    
    <!-- Content Discovered Counter -->
    <div id="content-counter" class="content-counter">
      <span class="bug-icon">🐛</span>
      <span id="collected-count">0</span>
    </div>
    
    <!-- Zone Indicator -->
    <div id="zone-indicator" class="zone-indicator">
      <span id="current-zone">Conference Zone</span>
    </div>
  </div>
  
  <!-- Content Card Modal -->
  <div id="content-modal" class="modal-overlay" style="display: none;">
    <div class="content-card">
      <div class="card-header">
        <i id="card-icon" class="fas fa-microphone-alt"></i>
        <span id="card-year" class="year-badge">2025</span>
      </div>
      <h2 id="card-title">Content Title</h2>
      <p id="card-description">Description goes here...</p>
      <div class="card-actions">
        <button id="btn-view-details" class="btn-primary">View Details</button>
        <button id="btn-continue" class="btn-secondary">Continue Flying</button>
      </div>
    </div>
  </div>
  
  <!-- Archive Modal -->
  <div id="archive-modal" class="modal-overlay archive-modal" style="display: none;">
    <div class="archive-container">
      <header class="archive-header">
        <h1>📚 Full Archive</h1>
        <button id="btn-close-archive" class="btn-close">✕</button>
      </header>
      
      <nav class="archive-tabs">
        <button class="tab-btn active" data-tab="conferences">Conferences</button>
        <button class="tab-btn" data-tab="podcasts">Podcasts</button>
        <button class="tab-btn" data-tab="publications">Publications</button>
        <button class="tab-btn" data-tab="volunteering">Volunteering</button>
        <button class="tab-btn" data-tab="television">TV</button>
      </nav>
      
      <div class="archive-filters">
        <input type="search" id="archive-search" placeholder="Search...">
        <select id="year-filter">
          <option value="all">All Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
      
      <div id="archive-content" class="archive-content">
        <!-- Content injected via JS -->
      </div>
      
      <button id="btn-back-to-game" class="btn-back">← Back to Game</button>
    </div>
  </div>
  
  <!-- Scripts -->
  <script src="js/content-data.js"></script>
  <script src="js/game-entities.js"></script>
  <script src="js/game-renderer.js"></script>
  <script src="js/modal.js"></script>
  <script src="js/archive-view.js"></script>
  <script src="js/game.js"></script>
</body>
</html>
```

## Implementation Order

1. **Phase 1: Data Extraction**
   - Create `content-data.js` with all content
   - Add date fields for sorting
   - Export featured items

2. **Phase 2: Game Core**
   - Set up Canvas and game loop
   - Implement Bird physics
   - Add basic pipe generation
   - Touch/keyboard controls

3. **Phase 3: Graphics**
   - Create SVG bird sprites (up/mid/down positions)
   - Create zone pipe SVGs (5 colors)
   - Create golden bug collectible
   - Background terminal gradient

4. **Phase 4: Content Integration**
   - Add collectible spawning
   - Collision detection
   - Content card modal
   - Zone transitions

5. **Phase 5: Archive View**
   - Build archive modal
   - Tab navigation
   - Search/filter functionality
   - Content listing

6. **Phase 6: Polish**
   - Particle effects
   - Sound effects (optional)
   - Mobile responsiveness
   - Performance optimization
   - localStorage for high score

## Testing Checklist

- [ ] Game loads without errors
- [ ] Bird responds to tap/spacebar
- [ ] Pipes spawn and scroll correctly
- [ ] Golden bugs appear between pipes
- [ ] Collecting bug shows content card
- [ ] Content card has correct data
- [ ] "View Details" opens content-viewer.html
- [ ] Archive button opens archive modal
- [ ] Archive tabs switch content
- [ ] Year filter works
- [ ] Search filters content
- [ ] Mobile touch controls work
- [ ] Responsive design works on all sizes
- [ ] Game state persists correctly
- [ ] No console errors
- [ ] 60fps maintained on mobile

## Performance Targets

- First paint: < 1s
- Time to interactive: < 2s
- Game loop: 60fps consistently
- Memory usage: < 50MB
- Bundle size: < 200KB (excluding assets)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Accessibility

- Alt text for all images
- Keyboard navigation (spacebar to flap)
- Reduced motion support (`prefers-reduced-motion`)
- Screen reader labels for buttons
- Focus states for all interactive elements
- Color contrast WCAG 2.1 AA compliant
