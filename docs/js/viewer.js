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

        // Handle organizations without year subdirectories (like mako-lab, interface)
        const noYearOrgs = ['mako-lab', 'interface'];
        const basePath = noYearOrgs.includes(org) ? `conferences/${org}` : `conferences/${org}/${year}`;
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
        // Conference PDFs mapping
        const conferencePDFs = {
            "conferences/apidays/2023": {
                files: ["Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf"],
                titles: ["API Security Slides (PDF)"]
            },
            "conferences/apisec/2023/december": {
                files: ["APISec - December 2023 - Securing LLM and NLP APIs - A Journey to Avoiding Data Breaches - 12-14-2023 - v1.0 LIVE.pptx.pdf"],
                titles: ["APISec - Securing LLM and NLP APIs (PDF)"]
            },
            "conferences/dc604/hacker-summer-camp-23": {
                files: ["Ads | DC604 Hacker Summer Camp _ Lightning Talks | August 2023.pdf", "DC604 Hacker Summer Camp _ Lightning Talks _ Ads _ August 2023.pdf"],
                titles: ["DC604 Lightning Talks - Version 1 (PDF)", "DC604 Lightning Talks - Version 2 (PDF)"]
            },
            "conferences/in-cyber-forum/2024/october": {
                files: ["Ads Dawson - DT01 TECH LAB - In-Cyber Forum Montreal Canada - Language AI Security at the API level  LLM and NLP API Architecture_ A Journey to Avoiding Data Breaches Oct 29 24.pdf"],
                titles: ["In-Cyber Forum - Language AI Security (PDF)"]
            },
            "conferences/interface": {
                files: ["Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf"],
                titles: ["Interface - API Security Slides (PDF)"]
            },
            "conferences/isaca/2024/feb/appsec-security-sector-days": {
                files: ["ISACA Application Security Sector Day 2024 - LLM and NLP API Architecture A Journey to Avoiding Data Breaches - 02-15-2024 - v1.1 LIVE.pptx.pdf"],
                titles: ["ISACA Application Security Sector Day (PDF)"]
            },
            "conferences/owasp/owasp-toronto/2024/june": {
                files: ["OWASP Toronto Chapter - June 2024 - OWASP Toronto _ OWASP Top 10 for LLM Applications and Generative AI - 06-11-2024 - v0.1 LIVE.pdf"],
                titles: ["OWASP Top 10 for LLM Applications (PDF)"]
            },
            "conferences/owasp/owasp-toronto/2025/march": {
                files: ["Ads Dawson - OWASP Toronto March 19 2025 - Shiny Rocks in Offensive AI (The stored XSS kind and more) _ Dreadnode - OWASP Toronto - March 19 2025 - How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling.pdf"],
                titles: ["Shiny Rocks in Offensive AI (PDF)"]
            },
            "conferences/owasp/owasp-vancouver/2023/november": {
                files: ["#MARS OWASP Vancouver Chapter - November 2023 - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 11-13-2023 - v1.1 Live.pdf"],
                titles: ["OWASP Vancouver - Language AI Security (PDF)"]
            },
            "conferences/rsa-usa/2024/may": {
                files: ["OWASP RSAC 2024 Keynote - Ads n Steve.pptx.pdf", "OWASP RSAC 2024 Panel Session.pptx.pdf"],
                titles: ["RSA 2024 Keynote (PDF)", "RSA 2024 Panel Session (PDF)"]
            },
            "conferences/rsa-usa/2025/april": {
                files: ["RSA 2025 Ads and Steve - OWASP Top 10 for LLM Apps and GenAI Project_ The Stochastic Shall Inherit the Earth (But Let's Secure It First) - OWASP AI Security Summit 2025.pdf"],
                titles: ["RSA 2025 - OWASP AI Security Summit (PDF)"]
            },
            "conferences/owasp/owasp-atlanta/2025/june": {
                files: ["Ads Dawson - Harnessing AI for Offensive Security - OWASP Atlanta - June 2025 - Short.pdf"],
                titles: ["Harnessing AI for Offensive Security (PDF)"]
            },
            "conferences/isc2/2025/july": {
                files: ["ISACA 2025 Ads and Steve - Behind the Prompt_ Exposing and Mitigating the Top LLM Vulnerabilities - ISC2's Spotlight on AI virtual conference.pdf"],
                titles: ["Behind the Prompt - ISC2 Spotlight on AI (PDF)"]
            },
            "conferences/bugcrowd/2025/july/bugboss": {
                files: ["Ads Dawson - BugCrowd - BugBoss Show n Tell - July 2025.pdf"],
                titles: ["BugBoss Show n Tell Slides (PDF)"]
            },
            "conferences/bugcrowd/2025/july/rhic": {
                files: ["Ads Dawson - BugCrowd x Dreadnode Crucible - Rhode Island College RHIC - July 16 2025.pdf", "ads-rhic-x-bugcrowd-event-photo-wed-july-16-25.jpeg"],
                titles: ["RHIC Cyberrange Presentation (PDF)", "Event Photo (JPEG)"]
            },
            "conferences/defcon/2025/august/bb_village": {
                files: ["defcon33-misaligned_ai-jailbreaking-bt6-bug-bounty-village-2025.png", "defcon33-bb-village-agenda-snip.png"],
                titles: ["DEFCON 33 Bug Bounty Village Social Card (PNG)", "Bug Bounty Village Agenda (PNG)"]
            },
            "conferences/mako-lab": {
                files: ["makolab_mastering_ai_chatbot_security.png", "makolab_mastering_ai_chatbot_security_speaker.png"],
                titles: ["Event Poster (PNG)", "Speaker Card (PNG)"]
            },
            "conferences/dc604/hacker-summer-camp-23": {
                files: ["Ads | DC604 Hacker Summer Camp _ Lightning Talks | August 2023.pdf", "DC604 Hacker Summer Camp _ Lightning Talks _ Ads _ August 2023.pdf", "Ads Custom Flow Diagram _ James Kettle _ GitLab Race Condition _ Object masking via limit-Overrun.jpeg", "Ads _ Poisoning Web Training Datasets _ Flow Diagram.jpeg", "Ads _ Poisoning Web Training Datasets _ Flow Diagram - Exploit 1 Split-View Data Poisoning.jpeg", "Ads _ Poisoning Web Training Datasets _ Flow Diagram - Exploit 2 Frontrunning Data Poisoning.jpeg"],
                titles: ["Lightning Talks Slides - Version 1 (PDF)", "Lightning Talks Slides - Version 2 (PDF)", "GitLab Race Condition Flow Diagram (JPEG)", "Data Poisoning Overview Diagram (JPEG)", "Split-View Data Poisoning Diagram (JPEG)", "Frontrunning Data Poisoning Diagram (JPEG)"]
            },
            "conferences/owasp/owasp-atlanta/2025/june": {
                files: ["Ads Dawson - Harnessing AI for Offensive Security - OWASP Atlanta - June 2025 - Short.pdf", "AIRTBench-Agent-Flow.png", "dvra.py", "mcp_chat.py", "mcp_demo.py", "robopages.py", "list_robopages.py", "transforms.py"],
                titles: ["Harnessing AI for Offensive Security (PDF)", "AIRTBench Agent Flow Diagram (PNG)", "DVRA Security Demo Script (Python)", "MCP Chat Implementation (Python)", "MCP Demo Script (Python)", "Robot Pages Script (Python)", "List Robot Pages Script (Python)", "Data Transforms Utilities (Python)"]
            },
            "conferences/rsa-usa/2024/may": {
                files: ["OWASP RSAC 2024 Keynote - Ads n Steve.pptx.pdf", "OWASP RSAC 2024 Panel Session.pptx.pdf", "ads_square.jpg", "ads_twitter.jpg", "general_square.jpg", "general_twitter.jpg"],
                titles: ["RSA 2024 Keynote (PDF)", "RSA 2024 Panel Session (PDF)", "Speaker Photo - Square Format (JPG)", "Speaker Photo - Twitter Format (JPG)", "General Photo - Square Format (JPG)", "General Photo - Twitter Format (JPG)"]
            },
            "conferences/rsa-usa/2025/april": {
                files: ["RSA 2025 Ads and Steve - OWASP Top 10 for LLM Apps and GenAI Project_ The Stochastic Shall Inherit the Earth (But Let's Secure It First) - OWASP AI Security Summit 2025.pdf", "Ads Dawson RSA conference 2025 - Speaker social card.png", "Ads Dawson RSA conference 2025 - Speaker social card.jpg"],
                titles: ["RSA 2025 - OWASP AI Security Summit (PDF)", "Speaker Social Card (PNG)", "Speaker Social Card (JPG)"]
            },
            "conferences/owasp/owasp-toronto/2025/march": {
                files: ["Ads Dawson - OWASP Toronto March 19 2025 - Shiny Rocks in Offensive AI (The stored XSS kind and more) _ Dreadnode - OWASP Toronto - March 19 2025 - How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling.pdf", "signal-2025-03-19-192727_002.jpeg", "signal-2025-03-19-192727_003.jpeg", "signal-2025-03-19-231455_002.jpeg", "signal-2025-03-19-231455_003.jpeg", "signal-2025-03-20-120929_006.jpeg"],
                titles: ["Shiny Rocks in Offensive AI (PDF)", "Event Photo 1 (JPEG)", "Event Photo 2 (JPEG)", "Event Photo 3 (JPEG)", "Event Photo 4 (JPEG)", "Event Photo 5 (JPEG)"]
            },
            "conferences/isaca/2024/feb/appsec-security-sector-days": {
                files: ["ISACA Application Security Sector Day 2024 - LLM and NLP API Architecture A Journey to Avoiding Data Breaches - 02-15-2024 - v1.1 LIVE.pptx.pdf", "Ads TM Edit - OWASP Top 10 for LLM Applications.jpeg"],
                titles: ["ISACA Application Security Sector Day (PDF)", "OWASP Top 10 for LLM Applications Slide (JPEG)"]
            },
            "conferences/isc2/2025/july": {
                files: ["ISACA 2025 Ads and Steve - Behind the Prompt_ Exposing and Mitigating the Top LLM Vulnerabilities - ISC2's Spotlight on AI virtual conference.pdf", "behind_the_prompt_exposing_and_mitigating_the_top_llm_vulnerabilities-isc2-july-2025.png"],
                titles: ["Behind the Prompt - ISC2 Spotlight on AI (PDF)", "Presentation Slide (PNG)"]
            },
            "conferences/owasp/owasp-llm-apps/2025/october": {
                files: ["speaker-card.png", "agenda-snippet.png", "Ads Dawson – The Official Cybersecurity Summit - Speaker Card.pdf", "Gen AI Application Security & Risk – The Official Cybersecurity Summit - Agenda.pdf"],
                titles: ["Speaker Card (PNG)", "Event Agenda Snippet (PNG)", "Speaker Card (PDF)", "Event Agenda (PDF)"]
            }
        };

        // Check if this directory has PDFs
        const pdfInfo = conferencePDFs[dirPath];
        if (pdfInfo) {
            const filesSection = document.createElement('div');
            filesSection.className = 'comic-panel';

            let fileListHTML = '';
            pdfInfo.files.forEach((file, index) => {
                const title = pdfInfo.titles[index] || `File ${index + 1}`;
                const extension = file.split('.').pop().toLowerCase();

                // Choose appropriate icon based on file type
                let icon = 'fas fa-file';
                if (extension === 'pdf') icon = 'fas fa-file-pdf';
                else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)) icon = 'fas fa-file-image';
                else if (extension === 'py') icon = 'fab fa-python';
                else if (['js', 'html', 'css', 'json'].includes(extension)) icon = 'fas fa-file-code';
                else if (extension === 'md') icon = 'fas fa-file-alt';

                fileListHTML += `
                    <li><a href="${dirPath}/${encodeURIComponent(file)}" target="_blank">
                        <i class="${icon}"></i> ${title}
                    </a></li>
                `;
            });

            filesSection.innerHTML = `
                <div class="panel-content">
                    <h3><i class="fas fa-file-alt"></i> Files</h3>
                    <ul class="file-list">
                        ${fileListHTML}
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

        // Replace images first (before links, since images use similar syntax)
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="comic-image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;">');

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