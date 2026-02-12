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
        '!docs/js/viewer.js'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
