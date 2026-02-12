module.exports = {
    testDir: './__tests__',
    testMatch: '*.spec.js',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        actionTimeout: 0,
        baseURL: 'http://localhost:8080',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium'
            }
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox'
            }
        },
        {
            name: 'webkit',
            use: {
                browserName: 'webkit'
            }
        }
    ],
    webServer: {
        command: 'npx http-server docs -p 8080',
        port: 8080,
        reuseExistingServer: !process.env.CI
    }
};
