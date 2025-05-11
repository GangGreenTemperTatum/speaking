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
        'publication': { title: 'Publication', loadFunction: loadPublicationContent }
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
            // Gather potential paths for README.md
            const possiblePaths = [];

            // Add full path with subdirectory if provided
            if (subdir) {
                possiblePaths.push(`../${org}/${year}/${subdir}/README.md`);
            }

            // Try alternate paths
            possiblePaths.push(`../${org}/${year}/README.md`);
            possiblePaths.push(`../${org}/README.md`);

            let foundReadme = null;
            let readmeError = null;

            // Try to find a README.md in any of the possible locations
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load README from: ${path}`);
                    const response = await fetch(path);
                    if (response.ok) {
                        const markdown = await response.text();
                        foundReadme = marked.parse(markdown);
                        console.log(`Successfully loaded README from: ${path}`);
                        break;
                    }
                } catch (error) {
                    readmeError = error;
                    console.warn(`Failed to load README from ${path}: ${error.message}`);
                }
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
                // Display files with a nice message if README is not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">
                            <h3><i class="fas fa-info-circle"></i> Event Details</h3>
                            <p>${getOrgDisplayName(org)} ${year}</p>
                            <p>This section contains presentation files and resources from this event.</p>
                        </div>
                        ${files.length > 0 ? '<div class="files-section"><h3>Available Files</h3><ul class="files-list">' +
                            files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
                            '</ul></div>' :
                            '<p>No specific files found for this event. Check back soon!</p>'}
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
            // Gather potential paths for README.md
            const possiblePaths = [];

            // Add paths with subdirectory if provided
            if (subdir) {
                possiblePaths.push(`../${org}/${subdir}/README.md`);
            }

            // Try regular paths
            possiblePaths.push(`../${org}/README.md`);

            let foundReadme = null;
            let readmeError = null;

            // Try to find a README.md in any of the possible locations
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load README from: ${path}`);
                    const response = await fetch(path);
                    if (response.ok) {
                        const markdown = await response.text();
                        foundReadme = marked.parse(markdown);
                        console.log(`Successfully loaded README from: ${path}`);
                        break;
                    }
                } catch (error) {
                    readmeError = error;
                    console.warn(`Failed to load README from ${path}: ${error.message}`);
                }
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
                // Create a nice placeholder with podcast info
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">
                            <h3><i class="fas fa-podcast"></i> ${getOrgDisplayName(org)}</h3>
                            <p>Podcast appearance from ${year}</p>
                            <p>Details about this podcast appearance will be available soon.</p>
                        </div>
                        <div class="comic-panel">
                            <p>In the meantime, you might be interested in:</p>
                            <ul>
                                <li><a href="/">Other conference talks and podcasts</a></li>
                                <li><a href="https://github.com/GangGreenTemperTatum">GitHub profile</a></li>
                                <li><a href="https://linkedin.com/in/adamdawson0">LinkedIn profile</a></li>
                            </ul>
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
            // Try to load README.md for the publication
            const readmePath = `../${org}/README.md`;
            console.log(`Attempting to load publication README from: ${readmePath}`);

            let foundReadme = null;
            let images = [];

            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                }
            } catch (readmeError) {
                console.warn(`Publication README not found: ${readmeError.message}`);
            }

            // Look for images in the directory
            if (org === 'packt/llm_sec_handbook/chapter_8_mitigating_llm_risks-strategies_techniques') {
                images = [
                    { name: "LLM Applications", path: `../${org}/LLM Applications.png` },
                    { name: "LLM Backdoor Attack via Plugin", path: `../${org}/LLM Backdoor Attack via Plugin.png` },
                    { name: "OWASP Top 10 for LLM Applications", path: `../${org}/OWASP Top 10 for LLM Applications and Generative AI - LLM Application Architecture and Threat Modeling.png` },
                    { name: "Shared Responsibility", path: `../${org}/Shared Responsibility.png` },
                    { name: "Trust Boundary STRIDE Threat Modeling", path: `../${org}/Trust Boundary STRIDE Threat Modeling.png` }
                ];
            }

            if (foundReadme) {
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme}
                        </div>
                        ${images.length > 0 ?
                          '<div class="image-gallery"><h3>Images</h3>' +
                          images.map(img => `<div class="gallery-item"><img src="${img.path}" alt="${img.name}"><p>${img.name}</p></div>`).join('') +
                          '</div>' : ''}
                    </div>
                `;
            } else {
                // Show a placeholder with the publication information we have
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">
                            <h3><i class="fas fa-book"></i> ${getOrgDisplayName(org)}</h3>
                            <p>This publication was released in ${year}.</p>
                            <p>Full details about this publication will be available soon.</p>
                        </div>
                        ${images.length > 0 ?
                          '<div class="image-gallery"><h3>Publication Images</h3>' +
                          images.map(img => `<div class="gallery-item"><img src="${img.path}" alt="${img.name}"><p>${img.name}</p></div>`).join('') +
                          '</div>' : ''}
                    </div>
                `;
            }
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

    // Function to find relevant files for a conference
    function findRelevantFiles(org, year, subdir) {
        // This is a static version since we can't dynamically fetch files
        // In a real implementation this would query your server or read from a manifest file
        const basePath = `../${org}/${year}`;
        const subdirPath = subdir ? `${basePath}/${subdir}` : basePath;

        const files = [];

        // Known files by path
        if (org === 'isaca' && year === '2024' && subdir === 'feb/appsec-security-sector-days') {
            files.push(
                {
                    name: "ISACA Application Security Sector Day 2024 (PDF)",
                    path: `${subdirPath}/ISACA Application Security Sector Day 2024 - LLM and NLP API Architecture A Journey to Avoiding Data Breaches - 02-15-2024 - v1.1 LIVE.pptx.pdf`
                },
                {
                    name: "OWASP Top 10 for LLM Applications (Image)",
                    path: `${subdirPath}/Ads TM Edit - OWASP Top 10 for LLM Applications.jpeg`
                }
            );
        }
        else if (org === 'apidays' && year === '2023' && subdir === 'interface') {
            files.push(
                {
                    name: "API Security Slides (PDF)",
                    path: `${subdirPath}/Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf`
                }
            );
        }
        else if (org === 'apisec' && year === '2023' && subdir === 'december') {
            files.push(
                {
                    name: "Securing LLM and NLP APIs (PDF)",
                    path: `${subdirPath}/APISec - December 2023 - Securing LLM and NLP APIs - A Journey to Avoiding Data Breaches - 12-14-2023 - v1.0 LIVE.pptx.pdf`
                }
            );
        }
        else if (org === 'rsa-usa' && year === '2024' && subdir === 'may') {
            files.push(
                {
                    name: "OWASP RSAC 2024 Keynote (PDF)",
                    path: `${subdirPath}/OWASP RSAC 2024 Keynote - Ads n Steve.pptx.pdf`
                },
                {
                    name: "OWASP RSAC 2024 Panel Session (PDF)",
                    path: `${subdirPath}/OWASP RSAC 2024 Panel Session.pptx.pdf`
                }
            );
        }
        else if (org === 'owasp/owasp-toronto' && year === '2024' && subdir === 'june') {
            files.push(
                {
                    name: "OWASP Toronto Chapter - June 2024 (PDF)",
                    path: `${subdirPath}/OWASP Toronto Chapter - June 2024 - OWASP Toronto _ OWASP Top 10 for LLM Applications and Generative AI - 06-11-2024 - v0.1 LIVE.pdf`
                }
            );
        }
        else if (org === 'owasp/owasp-toronto' && year === '2025' && subdir === 'march') {
            files.push(
                {
                    name: "OWASP Toronto - March 2025 (PDF)",
                    path: `${subdirPath}/Ads Dawson - OWASP Toronto March 19 2025 - Shiny Rocks in Offensive AI (The stored XSS kind and more) _ Dreadnode - OWASP Toronto - March 19 2025 - How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling.pdf`
                },
                {
                    name: "Event Photo 1",
                    path: `${subdirPath}/signal-2025-03-19-192727_002.jpeg`
                },
                {
                    name: "Event Photo 2",
                    path: `${subdirPath}/signal-2025-03-19-192727_003.jpeg`
                }
            );
        }
        else if (org === 'owasp/owasp-vancouver' && year === '2023' && subdir === 'november') {
            files.push(
                {
                    name: "OWASP Vancouver Chapter - November 2023 (PDF)",
                    path: `${subdirPath}/#MARS OWASP Vancouver Chapter - November 2023 - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 11-13-2023 - v1.1 Live.pdf`
                }
            );
        }
        else if (org === 'in-cyber-forum' && year === '2024' && subdir === 'october') {
            files.push(
                {
                    name: "In-Cyber Forum Montreal - October 2024 (PDF)",
                    path: `${subdirPath}/Ads Dawson - DT01 TECH LAB - In-Cyber Forum Montreal Canada - Language AI Security at the API level  LLM and NLP API Architecture_ A Journey to Avoiding Data Breaches Oct 29 24.pdf`
                }
            );
        }

        return files;
    }
});