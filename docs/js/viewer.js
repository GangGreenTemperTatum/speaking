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

    // Load the appropriate content typet to the correct GitHub Pages path
    contentType.loadFunction(org, year, subdir);bute('href', '/speaking/');

    // Function to load conference content
    async function loadConferenceContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');
    // Function to load conference content
        try {ction loadConferenceContent(org, year, subdir) {
            // Determine the base path within our docs directoryt-container');
            const basePath = `conferences/${org}/${year}${subdir ? '/' + subdir : ''}`;
        try {
            // Try to load README.mdth within our docs directory
            const readmePath = `${basePath}/README.md`;}${subdir ? '/' + subdir : ''}`;
            console.log(`Trying to load README from: ${readmePath}`);
            // Try to load README.md
            let foundReadme = null;asePath}/README.md`;
            console.log(`Trying to load README from: ${readmePath}`);
            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                    console.log(`Successfully loaded README from: ${readmePath}`);
                } else {t markdown = await response.text();
                    console.warn(`README not found at ${readmePath}`);
                }   console.log(`Successfully loaded README from: ${readmePath}`);
            } catch (error) {
                console.warn(`Error loading README from ${readmePath}: ${error.message}`);
            }   }
            } catch (error) {
            // Find any relevant files to displayE from ${readmePath}: ${error.message}`);
            const files = findRelevantFiles(org, year, subdir);
            console.log(`Found ${files.length} relevant files`);
            // Find any relevant files to display
            // Build the HTML contenttFiles(org, year, subdir);
            if (foundReadme) { ${files.length} relevant files`);
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme} = `
                        </div>="panel-content">
                        ${files.length > 0 ? '<div class="files-section"><h3>Files</h3><ul class="files-list">' +
                            files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
                            '</ul></div>' : ''}
                    </div>files.length > 0 ? '<div class="files-section"><h3>Files</h3><ul class="files-list">' +
                `;          files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
            } else {        '</ul></div>' : ''}
                // Show friendly message if README not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">ound
                            <h3><i class="fas fa-info-circle"></i> ${getOrgDisplayName(org)} ${year}</h3>
                            <p>Content information is available in the files below.</p>
                        </div>lass="readme-placeholder">
                        ${files.length > 0 ? '<div class="files-section"><h3>Available Files</h3><ul class="files-list">' +
                            files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
                            '</ul></div>' :
                            '<p>No specific files found for this event. Check back later!</p>'}3><ul class="files-list">' +
                    </div>  files.map(file => `<li><a href="${file.path}" target="_blank">${file.name}</a></li>`).join('') +
                `;          '</ul></div>' :
            }               '<p>No specific files found for this event. Check back later!</p>'}
        } catch (error) {>
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading content
                    </div>="panel-content">
                    <p>${error.message}</p>">
                    <p>Try going back to the <a href="/speaking/">main page</a>.</p>oading content
                </div>div>
            `;      <p>${error.message}</p>
        }           <p>Try going back to the <a href="/">main page</a>.</p>
    }           </div>
            `;
    // Function to load podcast content
    async function loadPodcastContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');
    // Function to load podcast content
        try {ction loadPodcastContent(org, year, subdir) {
            // Path to podcast READMEment.getElementById('content-container');
            const readmePath = `podcasts/${org}/README.md`;
            console.log(`Trying to load podcast README from: ${readmePath}`);
            // Path to podcast README
            let foundReadme = null;casts/${org}/README.md`;
            console.log(`Trying to load podcast README from: ${readmePath}`);
            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                    console.log(`Successfully loaded README from: ${readmePath}`);
                } else {t markdown = await response.text();
                    console.warn(`README not found at ${readmePath}`);
                }   console.log(`Successfully loaded README from: ${readmePath}`);
            } catch (error) {
                console.warn(`Error loading README from ${readmePath}: ${error.message}`);
            }   }
            } catch (error) {
            if (foundReadme) {Error loading README from ${readmePath}: ${error.message}`);
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme} = `
                        </div>="panel-content">
                    </div>iv class="markdown-content">
                `;          ${foundReadme}
            } else {    </div>
                // Show friendly message if README not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">ound
                            <h3><i class="fas fa-podcast"></i> ${getOrgDisplayName(org)}</h3>
                            <p>Podcast appearance from ${year}</p>
                            <p>Details about this podcast will be available soon.</p>
                            <p><a href="podcasts/${org}/README.md" class="btn-listen" target="_blank">View README</a></p>
                        </div>>Podcast appearance from ${year}</p>
                    </div>  <p>Details about this podcast will be available soon.</p>
                `;          <p><a href="podcasts/${org}/README.md" class="btn-listen" target="_blank">View README</a></p>
            }           </div>
        } catch (error) {>
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading podcast content
                    </div>="panel-content">
                    <p>${error.message}</p>">
                    <p>Try going back to the <a href="/speaking/">main page</a>.</p>oading podcast content
                </div>div>
            `;      <p>${error.message}</p>
        }           <p>Try going back to the <a href="/">main page</a>.</p>
    }           </div>
            `;
    // Function to load publication content
    async function loadPublicationContent(org, year) {
        const contentContainer = document.getElementById('content-container');
    // Function to load publication content
        try {ction loadPublicationContent(org, year) {
            // Redirect to GitHub for publications as wellcontent-container');
            let githubRepoUrl;
            if (org.startsWith('packt')) {
                githubRepoUrl = `https://github.com/GangGreenTemperTatum/speaking/tree/main/books/${org}`;
            } else if (org.startsWith('owasp')) {
                githubRepoUrl = `https://github.com/GangGreenTemperTatum/speaking/tree/main/conferences/${org}`;
            } else {ubRepoUrl = `https://github.com/GangGreenTemperTatum/speaking/tree/main/books/${org}`;
                // External URL providedwasp')) {
                githubRepoUrl = org; // Should be a full URLnTemperTatum/speaking/tree/main/conferences/${org}`;
            } else {
                // External URL provided
            contentContainer.innerHTML = `ould be a full URL
                <div class="panel-content">
                    <div class="readme-placeholder">
                        <h3><i class="fas fa-book"></i> ${getOrgDisplayName(org)}</h3>
                        <p>Publication from ${year}</p>
                        <p><a href="${githubRepoUrl}" target="_blank" class="btn-read">View Content</a></p>
                    </div>3><i class="fas fa-book"></i> ${getOrgDisplayName(org)}</h3>
                </div>  <p>Publication from ${year}</p>
            `;          <p><a href="${githubRepoUrl}" target="_blank" class="btn-read">View Content</a></p>
        } catch (error) {>
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading publication content
                    </div>="panel-content">
                    <p>${error.message}</p>">
                    <p>Try going back to the <a href="/speaking/">main page</a>.</p>oading publication content
                </div>div>
            `;      <p>${error.message}</p>
        }           <p>Try going back to the <a href="/">main page</a>.</p>
    }           </div>
            `;
    // Function to load television content
    async function loadTelevisionContent(org, year, subdir) {
        const contentContainer = document.getElementById('content-container');
    // Function to load television content
        try {ction loadTelevisionContent(org, year, subdir) {
            // Path to television READMEt.getElementById('content-container');
            const readmePath = `television/${org}/README.md`;
            console.log(`Trying to load television README from: ${readmePath}`);
            // Path to television README
            let foundReadme = null;evision/${org}/README.md`;
            console.log(`Trying to load television README from: ${readmePath}`);
            try {
                const response = await fetch(readmePath);
                if (response.ok) {
                    const markdown = await response.text();
                    foundReadme = marked.parse(markdown);
                    console.log(`Successfully loaded README from: ${readmePath}`);
                } else {t markdown = await response.text();
                    console.warn(`README not found at ${readmePath}`);
                }   console.log(`Successfully loaded README from: ${readmePath}`);
            } catch (error) {
                console.warn(`Error loading README from ${readmePath}: ${error.message}`);
            }   }
            } catch (error) {
            // Build the HTML contentoading README from ${readmePath}: ${error.message}`);
            if (foundReadme) {
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="markdown-content">
                            ${foundReadme} = `
                        </div>="panel-content">
                    </div>iv class="markdown-content">
                `;          ${foundReadme}
            } else {    </div>
                // Show friendly message if README not found
                contentContainer.innerHTML = `
                    <div class="panel-content">
                        <div class="readme-placeholder">ound
                            <h3><i class="fas fa-tv"></i> ${getOrgDisplayName(org)}</h3>
                            <p>Television appearance from ${year}</p>
                            <p>Details about this appearance will be available soon.</p>
                            <p><a href="television/${org}/README.md" class="btn-watch" target="_blank">View README</a></p>
                        </div>>Television appearance from ${year}</p>
                    </div>  <p>Details about this appearance will be available soon.</p>
                `;          <p><a href="television/${org}/README.md" class="btn-watch" target="_blank">View README</a></p>
            }           </div>
        } catch (error) {>
            contentContainer.innerHTML = `
                <div class="panel-content">
                    <div class="comic-error">
                        <i class="fas fa-exclamation-triangle"></i> Error loading television content
                    </div>="panel-content">
                    <p>${error.message}</p>">
                    <p>Try going back to the <a href="/speaking/">main page</a>.</p>oading television content
                </div>div>
            `;      <p>${error.message}</p>
        }           <p>Try going back to the <a href="/">main page</a>.</p>
    }           </div>
            `;
    // Function to find relevant files for a conference
    function findRelevantFiles(org, year, subdir) {
        const files = [];
    // Function to find relevant files for a conference
        // Local path within docs directoryubdir) {
        const basePath = `conferences/${org}/${year}`;
        const dirPath = subdir ? `${basePath}/${subdir}` : basePath;
        // Local path within docs directory
        // Based on the org/year/subdir combination, add known files
        if (org === 'apidays' && year === '2023') {dir}` : basePath;
            files.push({
                name: "API Security Slides (PDF)",n, add known files
                path: `${dirPath}/Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf`
            });es.push({
        }       name: "API Security Slides (PDF)",
        else if (org === 'apisec' && year === '2023' && subdir === 'december') { AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf`
            files.push({
                name: "Securing LLM and NLP APIs (PDF)",
                path: `${dirPath}/APISec - December 2023 - Securing LLM and NLP APIs - A Journey to Avoiding Data Breaches - 12-14-2023 - v1.0 LIVE.pptx.pdf`
            });es.push({
        }       name: "Securing LLM and NLP APIs (PDF)",
        else if (org === 'dc604' && year === '2023' && subdir === 'hacker-summer-camp-23') {rney to Avoiding Data Breaches - 12-14-2023 - v1.0 LIVE.pptx.pdf`
            files.push({
                name: "DC604 Hacker Summer Camp (PDF)",
                path: `${dirPath}/DC604 Hacker Summer Camp _ Lightning Talks _ Ads _ August 2023.pdf`
            });es.push({
        }       name: "DC604 Hacker Summer Camp (PDF)",
        else if (org === 'in-cyber-forum' && year === '2024' && subdir === 'october') {gust 2023.pdf`
            files.push({
                name: "In-Cyber Forum Presentation (PDF)",
                path: `${dirPath}/Ads Dawson - DT01 TECH LAB - In-Cyber Forum Montreal Canada - Language AI Security at the API level  LLM and NLP API Architecture_ A Journey to Avoiding Data Breaches Oct 29 24.pdf`
            });es.push({
        }       name: "In-Cyber Forum Presentation (PDF)",
        else if (org === 'isaca' && year === '2024' && subdir === 'feb/appsec-security-sector-days') {ge AI Security at the API level  LLM and NLP API Architecture_ A Journey to Avoiding Data Breaches Oct 29 24.pdf`
            files.push({
                name: "ISACA Application Security Sector Day (PDF)",
                path: `${dirPath}/ISACA Application Security Sector Day 2024 - LLM and NLP API Architecture A Journey to Avoiding Data Breaches - 02-15-2024 - v1.1 LIVE.pptx.pdf`
            });es.push({
        }       name: "ISACA Application Security Sector Day (PDF)",
        else if (org === 'owasp/owasp-toronto' && year === '2024' && subdir === 'june') {P API Architecture A Journey to Avoiding Data Breaches - 02-15-2024 - v1.1 LIVE.pptx.pdf`
            files.push({
                name: "OWASP Toronto Chapter (PDF)",
                path: `${dirPath}/OWASP Toronto Chapter - June 2024 - OWASP Toronto _ OWASP Top 10 for LLM Applications and Generative AI - 06-11-2024 - v0.1 LIVE.pdf`
            });es.push({
        }       name: "OWASP Toronto Chapter (PDF)",
        else if (org === 'owasp/owasp-toronto' && year === '2025' && subdir === 'march') {P Top 10 for LLM Applications and Generative AI - 06-11-2024 - v0.1 LIVE.pdf`
            files.push({
                name: "OWASP Toronto - March 2025 (PDF)",
                path: `${dirPath}/Ads Dawson - OWASP Toronto March 19 2025 - Shiny Rocks in Offensive AI (The stored XSS kind and more) _ Dreadnode - OWASP Toronto - March 19 2025 - How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling.pdf`
            });es.push({
        }       name: "OWASP Toronto - March 2025 (PDF)",
        else if (org === 'owasp/owasp-vancouver' && year === '2023' && subdir === 'november') {ensive AI (The stored XSS kind and more) _ Dreadnode - OWASP Toronto - March 19 2025 - How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling.pdf`
            files.push({
                name: "OWASP Vancouver Chapter (PDF)",
                path: `${dirPath}/#MARS OWASP Vancouver Chapter - November 2023 - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 11-13-2023 - v1.1 Live.pdf`
            });es.push({
        }       name: "OWASP Vancouver Chapter (PDF)",
        else if (org === 'rsa-usa' && year === '2024' && subdir === 'may') {023 - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 11-13-2023 - v1.1 Live.pdf`
            files.push({
                name: "OWASP RSAC 2024 Keynote (PDF)",
                path: `${dirPath}/OWASP RSAC 2024 Keynote - Ads n Steve.pptx.pdf`
            });es.push({
            files.push({WASP RSAC 2024 Keynote (PDF)",
                name: "OWASP RSAC 2024 Panel Session (PDF)",Ads n Steve.pptx.pdf`
                path: `${dirPath}/OWASP RSAC 2024 Panel Session.pptx.pdf`
            });es.push({
        }       name: "OWASP RSAC 2024 Panel Session (PDF)",
                path: `${dirPath}/OWASP RSAC 2024 Panel Session.pptx.pdf`
        return files;
    }   }
});
        return files;
    }
});