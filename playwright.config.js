module.exports = {
    testDir: './__tests__',
    testMatch: '*.spec.js',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    // Booting the panel costs ~12MB (wasm engine + shareware WAD). Running browser projects
    // concurrently starves Firefox, so keep all Doom tests serialized in every environment.
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',
    use: {
        actionTimeout: 0,
        baseURL: 'http://localhost:8081',
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
        command: 'npx http-server docs -p 8081',
        port: 8081,
        reuseExistingServer: !process.env.CI
    }
};
