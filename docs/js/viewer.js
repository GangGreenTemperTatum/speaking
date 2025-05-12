document.addEventListener('DOMContentLoaded', function() {
    console.log('⭐ Viewer.js loaded ⭐');
    console.log('Full URL:', window.location.href);

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const org = params.get('org');
    const year = params.get('year');
    const subdir = params.get('subdir');

    console.log(`Parameters parsed: type=${type}, org=${org}, year=${year}, subdir=${subdir}`);

    // Exit if no parameters found
    if (!type || !org || !year) {
        document.getElementById('content-container').innerHTML = `
            <div class="comic-panel">
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Missing content parameters
                    </div>
                    <p>Please return to the <a href="./">main page</a> and try again.</p>
                </div>
            </div>
        `;
        return;
    }

    // Set copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Set the content type display
    const contentTypeMap = {
        'conference': { title: 'Conference Talk', loadFunction: loadConferenceContent },
        'podcast': { title: 'Podcast Appearance', loadFunction: loadPodcastContent },
        'publication': { title: 'Publication', loadFunction: loadPublicationContent },
        'television': { title: 'Television Appearance', loadFunction: loadTelevisionContent }
    };

    // Get organization name from path
    function getOrgDisplayName(orgPath) {
        // Extract the last part of the path and format it nicely
        const parts = orgPath.split('/');
        const lastPart = parts[parts.length - 1];
        return lastPart
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Set title and subtitle
    const contentType = contentTypeMap[type] || { title: 'Content', loadFunction: () => {} };
    document.getElementById('view-title').textContent = getOrgDisplayName(org);
    document.getElementById('view-subtitle').textContent = `${contentType.title} (${year})`;

    // Set document title for better browser history
    document.title = `${getOrgDisplayName(org)} | ${contentType.title} (${year})`;

    // Load the appropriate content based on type
    contentType.loadFunction(org, year, subdir);

    // Conference content loader
    function loadConferenceContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');
        if (!contentContainer) return;

        // Show loading indicator
        contentContainer.innerHTML = `
            <div class="comic-panel">
                <div class="panel-content">
                    <div class="loading-indicator">
                        <i class="fas fa-spinner fa-spin"></i> Loading conference content...
                    </div>
                </div>
            </div>
        `;

        const basePath = `conferences/${org}/${year}`;
        const dirPath = subdir ? `${basePath}/${subdir}` : basePath;

        // Try to load README.md
        const readmePath = `${dirPath}/README.md`;

        // Fetch the README.md file
        fetch(readmePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('README not found');
                }
                return response.text();
            })
            .then(markdown => {
                // Display the README content
                contentContainer.innerHTML = `
                    <div class="comic-panel">
                        <div class="panel-content">
                            <div id="readme-content"></div>
                        </div>
                    </div>
                `;

                // Convert markdown to HTML (basic conversion)
                document.getElementById('readme-content').innerHTML = convertMarkdown(markdown);

                // Now add file listing
                listDirectoryFiles(dirPath, contentContainer);

                // Add animation to panels
                animatePanels();
            })
            .catch(error => {
                console.error('Error loading README:', error);
                contentContainer.innerHTML = `
                    <div class="comic-panel">
                        <div class="panel-content">
                            <div class="comic-error">
                                <i class="fas fa-exclamation-triangle"></i> Content not found
                            </div>
                            <p>Could not load content for ${getOrgDisplayName(org)} (${year}).</p>
                            <p>Error: ${error.message}</p>
                        </div>
                    </div>
                `;
            });
    }

    // Podcast content loader
    function loadPodcastContent(org, year) {
        const contentContainer = document.getElementById('content-container');
        if (!contentContainer) return;

        // Show loading indicator
        contentContainer.innerHTML = `
            <div class="comic-panel">
                <div class="panel-content">
                    <div class="loading-indicator">
                        <i class="fas fa-spinner fa-spin"></i> Loading podcast content...
                    </div>
                </div>
            </div>
        `;

        // Determine path
        const basePath = `podcasts/${org}`;

        // Try to load README.md
        const readmePath = `${basePath}/README.md`;

        // Fetch the README.md file
        fetch(readmePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('README not found');
                }
                return response.text();
            })
            .then(markdown => {
                // Display the README content
                contentContainer.innerHTML = `
                    <div class="comic-panel">
                        <div class="panel-content">
                            <div id="readme-content"></div>
                        </div>
                    </div>
                `;

                // Convert markdown to HTML (basic conversion)
                document.getElementById('readme-content').innerHTML = convertMarkdown(markdown);

                // Add animation to panels
                animatePanels();
            })
            .catch(error => {
                console.error('Error loading README:', error);
                contentContainer.innerHTML = `
                    <div class="comic-panel">
                        <div class="panel-content">
                            <div class="comic-error">
                                <i class="fas fa-exclamation-triangle"></i> Content not found
                            </div>
                            <p>Could not load content for ${getOrgDisplayName(org)} podcast.</p>
                            <p>Error: ${error.message}</p>
                        </div>
                    </div>
                `;
            });
    }

    // Publication content loader
    function loadPublicationContent(org, year) {
        const contentContainer = document.getElementById('content-container');
        if (!contentContainer) return;

        contentContainer.innerHTML = `
            <div class="comic-panel">
                <div class="panel-content">
                    <p>Publication content for ${org} (${year}) will be added soon.</p>
                </div>
            </div>
        `;

        // Add animation to panels
        animatePanels();
    }

    // Television content loader
    function loadTelevisionContent(org, year) {
        const contentContainer = document.getElementById('content-container');
        if (!contentContainer) return;

        // Show loading indicator
        contentContainer.innerHTML = `
            <div class="comic-panel">
                <div class="panel-content">
                    <div class="loading-indicator">
                        <i class="fas fa-spinner fa-spin"></i> Loading television content...
                    </div>
                </div>
            </div>
        `;

        // Determine path
        const basePath = `television/${org}`;

        // Try to load README.md
        const readmePath = `${basePath}/README.md`;

        // Fetch the README.md file
        fetch(readmePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('README not found');
                }
                return response.text();
            })
            .then(markdown => {
                // Display the README content
                contentContainer.innerHTML = `
                    <div class="comic-panel">
                        <div class="panel-content">
                            <div id="readme-content"></div>
                        </div>
                    </div>
                `;

                // Convert markdown to HTML (basic conversion)
                document.getElementById('readme-content').innerHTML = convertMarkdown(markdown);

                // Add animation to panels
                animatePanels();
            })
            .catch(error => {
                console.error('Error loading README:', error);
                contentContainer.innerHTML = `
                    <div class="comic-panel">
                        <div class="panel-content">
                            <div class="comic-error">
                                <i class="fas fa-exclamation-triangle"></i> Content not found
                            </div>
                            <p>Could not load content for ${getOrgDisplayName(org)} television appearance.</p>
                            <p>Error: ${error.message}</p>
                        </div>
                    </div>
                `;
            });
    }

    // Function to list files in a directory
    function listDirectoryFiles(dirPath, container) {
        // For specific directories, add known files
        if (dirPath === "conferences/apidays/2023") {
            const filesSection = document.createElement('div');
            filesSection.className = 'comic-panel';
            filesSection.innerHTML = `
                <div class="panel-content">
                    <h3><i class="fas fa-file-alt"></i> Files</h3>
                    <ul class="file-list">
                        <li><a href="${dirPath}/Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf" target="_blank">
                            <i class="fas fa-file-pdf"></i> API Security Slides (PDF)
                        </a></li>
                    </ul>
                </div>
            `;
            container.appendChild(filesSection);

            // Add animation to the new panel
            setTimeout(animatePanels, 100);
        }
    }

    // Function to animate panels
    function animatePanels() {
        const panels = document.querySelectorAll('.comic-panel');
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.classList.add('animate');
            }, index * 150);
        });
    }

    // Call this once when the page loads
    setTimeout(animatePanels, 300);

    // Simple markdown to HTML converter
    function convertMarkdown(markdown) {
        if (!markdown) return '';

        // Replace headers with comic styled headers
        let html = markdown
            .replace(/^# (.*$)/gm, '<h1 class="comic-title">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="comic-subtitle">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="comic-heading">$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4 class="comic-subheading">$1</h4>')
            .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
            .replace(/^###### (.*$)/gm, '<h6>$1</h6>');

        // Replace bold and italic
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>');

        // Replace links with comic styled links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="comic-link" target="_blank">$1</a>');

        // Replace lists
        html = html.replace(/^\s*\*\s(.*$)/gm, '<li class="comic-list-item">$1</li>');
        html = html.replace(/(<li.*>.*<\/li>\n)+/g, '<ul class="comic-list">$&</ul>');

        // Replace paragraphs with comic styled paragraphs
        html = html.replace(/^([^<].*)\n$/gm, '<p class="comic-text">$1</p>');

        // Remove empty lines
        html = html.replace(/^\s*[\r\n]/gm, '');

        return html;
    }
});