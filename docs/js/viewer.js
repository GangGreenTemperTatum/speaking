document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const org = params.get('org');
    const year = params.get('year');
    const subdir = params.get('subdir');

    console.log(`Loading content: type=${type}, org=${org}, year=${year}, subdir=${subdir}`);

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
        return lastPart.replace(/-/g, ' ').replace('owasp', 'OWASP').toUpperCase();
    }

    // Set title and subtitle
    const contentType = contentTypeMap[type] || { title: 'Content', loadFunction: () => {} };
    document.getElementById('view-title').textContent = getOrgDisplayName(org);
    document.getElementById('view-subtitle').textContent = `${contentType.title} (${year})`;

    // Set document title for better browser history
    document.title = `${getOrgDisplayName(org)} | ${contentType.title} (${year})`;

    // Load the appropriate content type
    contentType.loadFunction(org, year, subdir);

    // Function to load conference content
    async function loadConferenceContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');

        try {
            // Determine the base path within our docs directory
            const basePath = `conferences/${org}/${year}${subdir ? '/' + subdir : ''}`;

            // Try to load README.md
            const readmePath = `${basePath}/README.md`;
            console.log(`Trying to load README from: ${readmePath}`);

            let foundReadme = null;

            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                    console.log(`Successfully loaded README from: ${readmePath}`);
                } else {
                    console.warn(`README not found at ${readmePath}`);
                }
            } catch (error) {
                console.warn(`Error loading README from ${readmePath}: ${error.message}`);
            }

            // Find any relevant files to display
            const files = findRelevantFiles(org, year, subdir);
            console.log(`Found ${files.length} relevant files`);

            // Build the HTML content
            if (foundReadme) {
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme}
                        </div>
                        ${files.length > 0 ? '<div class="files-section"><h3>Files</h3><ul class="files-list">' +
                            files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
                            '</ul></div>' : ''}
                    </div>
                `;
            } else {
                // Show friendly message if README not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">
                            <h3><i class="fas fa-info-circle"></i> ${getOrgDisplayName(org)} ${year}</h3>
                            <p>Content information is available in the files below.</p>
                        </div>
                        ${files.length > 0 ? '<div class="files-section"><h3>Available Files</h3><ul class="files-list">' +
                            files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
                            '</ul></div>' :
                            '<p>No specific files found for this event. Check back later!</p>'}
                    </div>
                `;
            }
        } catch (error) {
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading content
                    </div>
                    <p>${error.message}</p>
                    <p>Try going back to the <a href="/">main page</a>.</p>
                </div>
            `;
        }
    }

    // Function to load podcast content
    async function loadPodcastContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');

        try {
            // Path to podcast README
            const readmePath = `podcasts/${org}/README.md`;
            console.log(`Trying to load podcast README from: ${readmePath}`);

            let foundReadme = null;

            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                    console.log(`Successfully loaded README from: ${readmePath}`);
                } else {
                    console.warn(`README not found at ${readmePath}`);
                }
            } catch (error) {
                console.warn(`Error loading README from ${readmePath}: ${error.message}`);
            }

            if (foundReadme) {
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme}
                        </div>
                    </div>
                `;
            } else {
                // Show friendly message if README not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">
                            <h3><i class="fas fa-podcast"></i> ${getOrgDisplayName(org)}</h3>
                            <p>Podcast appearance from ${year}</p>
                            <p>Details about this podcast will be available soon.</p>
                            <p><a href="podcasts/${org}/README.md" class="btn-listen" target="_blank">View README</a></p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading podcast content
                    </div>
                    <p>${error.message}</p>
                    <p>Try going back to the <a href="/">main page</a>.</p>
                </div>
            `;
        }
    }

    // Function to load publication content
    async function loadPublicationContent(org, year) {
        const contentContainer = document.getElementById('content-container');

        try {
            // Redirect to GitHub for publications as well
            let githubRepoUrl;
            if (org.startsWith('packt')) {
                githubRepoUrl = `https://github.com/GangGreenTemperTatum/speaking/tree/main/books/${org}`;
            } else if (org.startsWith('owasp')) {
                githubRepoUrl = `https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/${org}`;
            } else {
                // External URL provided
                githubRepoUrl = org; // Should be a full URL
            }

            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="readme-placeholder">
                        <h3><i class="fas fa-book"></i> ${getOrgDisplayName(org)}</h3>
                        <p>Publication from ${year}</p>
                        <p><a href="${githubRepoUrl}" target="_blank" class="btn-read">View Content</a></p>
                    </div>
                </div>
            `;
        } catch (error) {
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading publication content
                    </div>
                    <p>${error.message}</p>
                    <p>Try going back to the <a href="/">main page</a>.</p>
                </div>
            `;
        }
    }

    // Function to load television content
    async function loadTelevisionContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');

        try {
            // Path to television README
            const readmePath = `television/${org}/README.md`;
            console.log(`Trying to load television README from: ${readmePath}`);

            let foundReadme = null;

            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                    console.log(`Successfully loaded README from: ${readmePath}`);
                } else {
                    console.warn(`README not found at ${readmePath}`);
                }
            } catch (error) {
                console.warn(`Error loading README from ${readmePath}: ${error.message}`);
            }

            // Build the HTML content
            if (foundReadme) {
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme}
                        </div>
                    </div>
                `;
            } else {
                // Show friendly message if README not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">
                            <h3><i class="fas fa-tv"></i> ${getOrgDisplayName(org)}</h3>
                            <p>Television appearance from ${year}</p>
                            <p>Details about this appearance will be available soon.</p>
                            <p><a href="television/${org}/README.md" class="btn-watch" target="_blank">View README</a></p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading television content
                    </div>
                    <p>${error.message}</p>
                    <p>Try going back to the <a href="/">main page</a>.</p>
                </div>
            `;
        }
    }

    // Function to find relevant files for a conference
    function findRelevantFiles(org, year, subdir) {
        const files = [];

        // Local path within docs directory
        const basePath = `conferences/${org}/${year}`;
        const dirPath = subdir ? `${basePath}/${subdir}` : basePath;

        // Based on the org/year/subdir combination, add known files
        if (org === 'apidays' && year === '2023') {
            files.push({
                name: "API Security Slides (PDF)",
                path: `${dirPath}/Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf`
            });
        }
        else if (org === 'apisec' && year === '2023' && subdir === 'december') {
            files.push({
                name: "Securing LLM and NLP APIs (PDF)",
                path: `${dirPath}/APISec - December 2023 - Securing LLM and NLP APIs - A Journey to Avoiding Data Breaches - 12-14-2023 - v1.0 LIVE.pptx.pdf`
            });
        }
        else if (org === 'dc604' && year === '2023' && subdir === 'hacker-summer-camp-23') {
            files.push({
                name: "DC604 Hacker Summer Camp (PDF)",
                path: `${dirPath}/DC604 Hacker Summer Camp _ Lightning Talks _ Ads _ August 2023.pdf`
            });
        }
        else if (org === 'in-cyber-forum' && year === '2024' && subdir === 'october') {
            files.push({
                name: "In-Cyber Forum Presentation (PDF)",
                path: `${dirPath}/Ads Dawson - DT01 TECH LAB - In-Cyber Forum Montreal Canada - Language AI Security at the API level  LLM and NLP API Architecture_ A Journey to Avoiding Data Breaches Oct 29 24.pdf`
            });
        }
        else if (org === 'isaca' && year === '2024' && subdir === 'feb/appsec-security-sector-days') {
            files.push({
                name: "ISACA Application Security Sector Day (PDF)",
                path: `${dirPath}/ISACA Application Security Sector Day 2024 - LLM and NLP API Architecture A Journey to Avoiding Data Breaches - 02-15-2024 - v1.1 LIVE.pptx.pdf`
            });
        }
        else if (org === 'owasp/owasp-toronto' && year === '2024' && subdir === 'june') {
            files.push({
                name: "OWASP Toronto Chapter (PDF)",
                path: `${dirPath}/OWASP Toronto Chapter - June 2024 - OWASP Toronto _ OWASP Top 10 for LLM Applications and Generative AI - 06-11-2024 - v0.1 LIVE.pdf`
            });
        }
        else if (org === 'owasp/owasp-toronto' && year === '2025' && subdir === 'march') {
            files.push({
                name: "OWASP Toronto - March 2025 (PDF)",
                path: `${dirPath}/Ads Dawson - OWASP Toronto March 19 2025 - Shiny Rocks in Offensive AI (The stored XSS kind and more) _ Dreadnode - OWASP Toronto - March 19 2025 - How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling.pdf`
            });
        }
        else if (org === 'owasp/owasp-vancouver' && year === '2023' && subdir === 'november') {
            files.push({
                name: "OWASP Vancouver Chapter (PDF)",
                path: `${dirPath}/#MARS OWASP Vancouver Chapter - November 2023 - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 11-13-2023 - v1.1 Live.pdf`
            });
        }
        else if (org === 'rsa-usa' && year === '2024' && subdir === 'may') {
            files.push({
                name: "OWASP RSAC 2024 Keynote (PDF)",
                path: `${dirPath}/OWASP RSAC 2024 Keynote - Ads n Steve.pptx.pdf`
            });
            files.push({
                name: "OWASP RSAC 2024 Panel Session (PDF)",
                path: `${dirPath}/OWASP RSAC 2024 Panel Session.pptx.pdf`
            });
        }

        return files;
    }
});