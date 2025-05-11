/**
 * Simple debug utility for the speaking site
 */
(function() {
    console.log('Debug utility loaded');

    // Add a debug panel
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Debug';
    debugBtn.style.position = 'fixed';
    debugBtn.style.bottom = '10px';
    debugBtn.style.right = '10px';
    debugBtn.style.zIndex = '9999';
    debugBtn.style.background = '#ff3864';
    debugBtn.style.color = '#fff';
    debugBtn.style.border = 'none';
    debugBtn.style.borderRadius = '4px';
    debugBtn.style.padding = '5px 10px';

    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.style.display = 'none';
    debugPanel.style.position = 'fixed';
    debugPanel.style.bottom = '40px';
    debugPanel.style.right = '10px';
    debugPanel.style.background = 'rgba(0,0,0,0.8)';
    debugPanel.style.color = '#fff';
    debugPanel.style.padding = '10px';
    debugPanel.style.borderRadius = '4px';
    debugPanel.style.maxWidth = '300px';
    debugPanel.style.maxHeight = '400px';
    debugPanel.style.overflow = 'auto';
    debugPanel.style.zIndex = '9998';

    // Toggle debug panel
    debugBtn.addEventListener('click', function() {
        debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
        if (debugPanel.style.display === 'block') {
            updateDebugInfo();
        }
    });

    function updateDebugInfo() {
        const activeSection = document.querySelector('.content-section.active');
        const sectionItems = activeSection ? activeSection.querySelectorAll('.comic-panel') : [];

        // Get the URL params if we're on the view page
        const params = new URLSearchParams(window.location.search);
        const paramInfo = [];
        params.forEach((value, key) => {
            paramInfo.push(`${key}: ${value}`);
        });

        debugPanel.innerHTML = `
            <h3>Debug Info</h3>
            <p>URL: ${window.location.href}</p>
            <p>Path: ${window.location.pathname}</p>
            <p>Server Root: ${window.location.origin}</p>
            ${paramInfo.length > 0 ? `<p>Parameters:<br>${paramInfo.join('<br>')}</p>` : ''}
            <p>Active Section: ${activeSection ? activeSection.id : 'None'}</p>
            <p>Items in Section: ${sectionItems.length}</p>
            <hr>
            <h4>File Test</h4>
            <div id="file-test-result">Click button to test file access</div>
            <button id="test-readme">Test README Access</button>
            <button id="reload-page">Reload Page</button>
        `;

        // Add event listeners
        document.getElementById('test-readme').addEventListener('click', function() {
            testFileAccess();
        });

        document.getElementById('reload-page').addEventListener('click', function() {
            location.reload();
        });
    }

    // Test file access
    async function testFileAccess() {
        const testResult = document.getElementById('file-test-result');
        testResult.innerHTML = 'Testing file access...';

        const testPaths = [
            'conferences/apidays/2023/README.md',
            'podcasts/bareknuckles_and_brass_tacks/README.md',
            'books/packt/llm_sec_handbook/chapter_8_mitigating_llm_risks-strategies_techniques/README.md'
        ];

        const results = [];

        for (const path of testPaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    results.push(`✅ ${path}: OK (${response.status})`);
                } else {
                    results.push(`❌ ${path}: Not found (${response.status})`);
                }
            } catch (error) {
                results.push(`❌ ${path}: ${error.message}`);
            }
        }

        testResult.innerHTML = results.join('<br>');
    }

    // Add elements to the page when it's ready
    window.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(debugBtn);
        document.body.appendChild(debugPanel);
    });
})();
