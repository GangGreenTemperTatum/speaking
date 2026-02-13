module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.js'],
    moduleFileExtensions: ['js', 'json'],
    collectCoverageFrom: [
        'docs/js/*.js',
        '!docs/js/content-loader.js',
        '!docs/js/debug.js',
        '!docs/js/file-copier.js',
        '!docs/js/main.js',
        '!docs/js/viewer.js',
        '!docs/js/game.js',
        '!docs/js/modal.js'
    ],
    coverageThreshold: {
        global: {
            branches: 25,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
