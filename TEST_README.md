# Test Suite Documentation

## Overview

This project has a comprehensive test suite including:
- **Unit Tests** (Jest): Testing individual functions and logic
- **E2E Tests** (Playwright): Testing full user flows
- **CI/CD** (GitHub Actions): Automated testing on push/PR

## Test Structure

```
__tests__/
├── game.test.js          # Unit tests for Flappy Bird game
├── content-data.test.js  # Unit tests for content data module
└── e2e.spec.js          # E2E tests with Playwright

jest.config.js           # Jest configuration
playwright.config.js     # Playwright configuration
jest.setup.js            # Jest setup and mocks
```

## Running Tests

### Unit Tests (Jest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## What's Tested

### Unit Tests

**Game Logic (`game.test.js`)**
- Bird physics (gravity, velocity)
- Jump mechanics
- Pipe generation and collision
- Score tracking
- Game state management
- High score localStorage persistence

**Content Data (`content-data.test.js`)**
- All content types exist (conferences, podcasts, etc.)
- Content has required fields
- Zone configuration
- Filtering and search functions
- Content retrieval by ID

### E2E Tests

**Main Page (`e2e.spec.js`)**
- Page loads correctly
- Game canvas is visible
- Start screen displays
- Game starts on click
- Score displays
- Content tabs work
- Tab switching
- Content cards display
- Year filtering
- Search functionality
- Content viewer navigation
- Mobile responsiveness
- localStorage persistence

## Coverage

Current coverage requirements:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

View coverage report after running:
```bash
npm run test:coverage
```

Report will be in `coverage/` directory.

## CI/CD

Tests run automatically on:
- Push to `main` branch
- Push to `feature/*` branches
- Pull requests to `main`

### Test Jobs

1. **unit-tests**: Runs Jest unit tests with coverage
2. **e2e-tests**: Runs Playwright E2E tests on Chromium, Firefox, and WebKit
3. **lint**: Checks JavaScript syntax

## Writing New Tests

### Unit Test Example

```javascript
describe('Feature Name', () => {
    test('should do something', () => {
        // Arrange
        const input = 'test';
        
        // Act
        const result = myFunction(input);
        
        // Assert
        expect(result).toBe('expected');
    });
});
```

### E2E Test Example

```javascript
test('should complete user flow', async ({ page }) => {
    // Navigate
    await page.goto('http://localhost:8080');
    
    // Interact
    await page.click('#game-canvas');
    
    // Assert
    await expect(page.locator('#score')).toContainText('0');
});
```

## Browser Support

E2E tests run on:
- Chromium (Chrome)
- Firefox
- WebKit (Safari)

## Debugging

### Unit Tests
```bash
# Debug specific test
npm test -- --testNamePattern="should do something"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests
```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test --grep "should display"

# Show report
npx playwright show-report
```

## Troubleshooting

### Tests fail with "Cannot find module"
Run `npm install` to ensure all dependencies are installed.

### E2E tests timeout
Ensure the server is running:
```bash
npm start
# In another terminal:
npm run test:e2e
```

### Playwright browsers not installed
```bash
npx playwright install
```
