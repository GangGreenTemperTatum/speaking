module.exports = {
    testDir: './__tests__',
    testMatch: '*.spec.js',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    // The Doom tests each boot a ~12MB wasm engine. Running a file's tests concurrently starves
    // the browser and times the suite out, so tests run in order within each project's worker;
    // the three browser projects still run in parallel (CI already uses a single worker).
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
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
