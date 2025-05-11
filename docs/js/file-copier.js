/**
 * File directory generator for the speaking site
 */
(function() {
    console.log('File listing utility loaded');

    // Add a file explorer button
    document.addEventListener('DOMContentLoaded', function() {
        const fileBtn = document.createElement('button');
        fileBtn.textContent = 'File Explorer';
        fileBtn.style.position = 'fixed';
        fileBtn.style.bottom = '40px';
        fileBtn.style.right = '10px';
        fileBtn.style.zIndex = '9997';
        fileBtn.style.background = '#2de2e6';
        fileBtn.style.color = '#000';
        fileBtn.style.border = 'none';
        fileBtn.style.borderRadius = '4px';
        fileBtn.style.padding = '5px 10px';

        // Create file explorer panel
        const filePanel = document.createElement('div');
        filePanel.style.display = 'none';
        filePanel.style.position = 'fixed';
        filePanel.style.top = '50%';
        filePanel.style.left = '50%';
        filePanel.style.transform = 'translate(-50%, -50%)';
        filePanel.style.background = '#fff';
        filePanel.style.color = '#000';
        filePanel.style.padding = '20px';
        filePanel.style.borderRadius = '8px';
        filePanel.style.width = '80%';
        filePanel.style.maxWidth = '800px';
        filePanel.style.height = '80%';
        filePanel.style.maxHeight = '600px';
        filePanel.style.overflow = 'auto';
        filePanel.style.zIndex = '9996';
        filePanel.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

        // Toggle file explorer panel
        fileBtn.addEventListener('click', function() {
            filePanel.style.display = filePanel.style.display === 'none' ? 'block' : 'none';
            if (filePanel.style.display === 'block') {
                updateFileExplorer();
            }
        });

        function updateFileExplorer() {
            filePanel.innerHTML = `
                <h2>GitHub Repository Explorer</h2>
                <p>View files and directories directly in this repository:</p>
                <div style="margin: 15px 0;">
                    <button id="view-conferences">Conferences</button>
                    <button id="view-podcasts">Podcasts</button>
                    <button id="view-books">Books</button>
                </div>
                <div id="file-explorer-content" style="border: 1px solid #ccc; padding: 10px; height: 70%; overflow: auto;">
                    <p>Click on a category above to view files.</p>
                </div>
                <div style="margin-top: 15px; text-align: right;">
                    <button id="close-explorer">Close</button>
                </div>
            `;

            // Close button
            document.getElementById('close-explorer').addEventListener('click', function() {
                filePanel.style.display = 'none';
            });

            // Conferences button
            document.getElementById('view-conferences').addEventListener('click', function() {
                showFileList('conferences');
            });

            // Podcasts button
            document.getElementById('view-podcasts').addEventListener('click', function() {
                showFileList('podcasts');
            });

            // Books button
            document.getElementById('view-books').addEventListener('click', function() {
                showFileList('books');
            });
        }

        function showFileList(category) {
            const content = document.getElementById('file-explorer-content');

            // Clear content
            content.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;

            // Create file list based on category
            if (category === 'conferences') {
                content.innerHTML += `
                    <ul>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/apidays" target="_blank">API Days</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/apisec" target="_blank">APISec</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/dc604" target="_blank">DC604</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/in-cyber-forum" target="_blank">In-Cyber Forum</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/isaca" target="_blank">ISACA</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/lakera" target="_blank">Lakera</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/mako-lab" target="_blank">Mako Lab</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/mlopscommunity" target="_blank">MLOps Community</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/owasp" target="_blank">OWASP</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/rsa-usa" target="_blank">RSA Conference</a></li>
                    </ul>
                `;
            } else if (category === 'podcasts') {
                content.innerHTML += `
                    <ul>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/bareknuckles_and_brass_tacks" target="_blank">Bare Knuckles and Brass Tacks</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/chai_chat_podcast" target="_blank">ChAI Chat Podcast</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/f5_dev_central" target="_blank">F5 DevCentral</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/mlops_community" target="_blank">MLOps Community</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/owasp" target="_blank">OWASP</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/software_testing_and_quality_talks" target="_blank">Software Testing & Quality Talks</a></li>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/podcasts/synack" target="_blank">Synack</a></li>
                    </ul>
                `;
            } else if (category === 'books') {
                content.innerHTML += `
                    <ul>
                        <li><a href="https://github.com/GangGreenTemperTatum/speaking/tree/main/books/packt/llm_sec_handbook/chapter_8_mitigating_llm_risks-strategies_techniques" target="_blank">LLM Security Handbook - Chapter 8</a></li>
                    </ul>
                `;
            }
        }

        document.body.appendChild(fileBtn);
        document.body.appendChild(filePanel);
    });
})();
