/**
 * Content Loader - Local path version
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Content loader initialized - LOCAL PATH VERSION');

    // Remove loading indicators
    document.querySelectorAll('.loading-indicator').forEach(el => el.remove());

    // Load all content sections
    loadConferences();
    loadPodcasts();
    loadPublications();
    loadVolunteering();
    loadTelevision();

    function loadConferences() {
        const conferences = [
            {
                name: "API Days",
                displayName: "API Days 2023 - AI/ML Security at the API level",
                year: "2023",
                icon: "fas fa-cloud",
                description: "Talks on AI/ML Security at API level",
                path: "apidays",
                localPath: "conferences/apidays/2023"
            },
            {
                name: "APISec",
                displayName: "APISec 2023 - Securing LLM and NLP APIs",
                year: "2023",
                icon: "fas fa-shield-alt",
                description: "Securing LLM and NLP APIs",
                path: "apisec",
                subdir: "december",
                localPath: "conferences/apisec/2023/december"
            },
            {
                name: "DC604",
                displayName: "DC604 2023 - Hacker Summer Camp - Poisoning Web Training Data",
                year: "2023",
                icon: "fas fa-users",
                description: "Hacker Summer Camp - Poisoning Web Training Data",
                path: "dc604",
                subdir: "hacker-summer-camp-23",
                localPath: "conferences/dc604/2023/hacker-summer-camp-23"
            },
            {
                name: "In-Cyber Forum",
                displayName: "In-Cyber Forum 2024 - Language AI Security at the API level",
                year: "2024",
                icon: "fas fa-globe",
                description: "Language AI Security at the API level",
                path: "in-cyber-forum",
                subdir: "october",
                localPath: "conferences/in-cyber-forum/2024/october"
            },
            {
                name: "ISACA",
                displayName: "ISACA Application Security Sector Day",
                year: "2024",
                icon: "fas fa-certificate",
                description: "Application Security Sector Day",
                path: "isaca",
                subdir: "feb/appsec-security-sector-days",
                localPath: "conferences/isaca/2024/feb/appsec-security-sector-days"
            },
            {
                name: "OWASP",
                displayName: "OWASP Toronto - OWASP Top 10 for LLM Applications",
                year: "2024",
                icon: "fas fa-shield-virus",
                description: "OWASP Top 10 for LLM Applications",
                path: "owasp/owasp-toronto",
                subdir: "june",
                localPath: "conferences/owasp/owasp-toronto/2024/june"
            },
            {
                name: "OWASP",
                displayName: "OWASP Toronto (March) - Shiny Rocks in Offensive AI",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "Shiny Rocks in Offensive AI",
                path: "owasp/owasp-toronto",
                subdir: "march",
                localPath: "conferences/owasp/owasp-toronto/2025/march"
            },
            {
                name: "OWASP",
                displayName: "OWASP Toronto (September)- Becoming a Caido Power User: From Recon to Root",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "Becoming a Caido Power User: From Recon to Root",
                path: "owasp/owasp-toronto",
                subdir: "september",
                localPath: "conferences/owasp/owasp-toronto/2025/september"
            },
            {
                name: "OWASP",
                displayName: "OWASP Vancouver - Language AI Security at the API level",
                year: "2023",
                icon: "fas fa-shield-virus",
                description: "Language AI Security at the API level",
                path: "owasp/owasp-vancouver",
                subdir: "november",
                localPath: "conferences/owasp/owasp-vancouver/2023/november"
            },
            {
                name: "RSA Conference",
                displayName: "RSA Conference 2024 - Keynote on AI/ML Security",
                year: "2024",
                icon: "fas fa-lock",
                description: "Keynote on AI/ML Security",
                path: "rsa-usa",
                subdir: "may",
                localPath: "conferences/rsa-usa/2024/may"
            },
            {
                name: "OWASP",
                displayName: "OWASP Cairo",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "AI, Security, and Hacking Tools",
                path: "owasp/owasp-cairo",
                subdir: "july",
                localPath: "conferences/owasp/owasp-cairo/2025/july"
            },
            {
                name: "OWASP",
                displayName: "OWASP Atlanta - Harnessing AI for Offensive Security",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "Harnessing AI for Offensive Security",
                path: "owasp/owasp-atlanta",
                subdir: "june",
                localPath: "conferences/owasp/owasp-atlanta/2025/june"
            },
            {
                name: "ISC2",
                displayName: "ISC2 Behind the Prompt: Exposing and Mitigating the Top LLM Vulnerabilities",
                year: "2025",
                icon: "fas fa-certificate",
                description: "Behind the Prompt: Exposing and Mitigating the Top LLM Vulnerabilities",
                path: "isc2",
                subdir: "july",
                localPath: "conferences/isc2/2025/july"
            },
            {
                name: "Interface",
                displayName: "INTERFACE ApiSec 2023 - Language AI Security at the API level",
                year: "2023",
                icon: "fas fa-cloud",
                description: "Language AI Security at the API level",
                path: "interface",
                localPath: "conferences/interface"
            },
            {
                name: "Lakera",
                displayName: "Lakera December 2023 - How to Secure AI Applications",
                year: "2023",
                icon: "fas fa-shield-alt",
                description: "How to Secure AI Applications: Lessons from OWASP's Top 10 for LLMs",
                path: "lakera/december",
                subdir: "2023",
                localPath: "conferences/lakera/december/2023"
            },
            {
                name: "Lakera",
                displayName: "Lakera April 2024 - Decoding OWASP LLMSVS",
                year: "2024",
                icon: "fas fa-shield-alt",
                description: "Decoding OWASP Large Language Model Security Verification Standard (LLMSVS)",
                path: "lakera/april",
                subdir: "2024",
                localPath: "conferences/lakera/april/2024"
            },
            {
                name: "Mako Lab",
                displayName: "Mako Lab 2025 - Mastering AI chatbot security",
                year: "2025",
                icon: "fas fa-flask",
                description: "Mastering AI chatbot security",
                path: "mako-lab",
                localPath: "conferences/mako-lab"
            },
            {
                name: "MLOps Community",
                displayName: "MLOps Community Conference - AI in Production",
                description: "MLOps Community Conference - AI in Production",
                year: "2024",
                icon: "fas fa-cogs",
                description: "AI in Production",
                path: "mlopscommunity",
                subdir: "february",
                localPath: "conferences/mlopscommunity/2024/february"
            },
            {
                name: "OWASP",
                displayName: "OWASP LLM Apps - Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps - Ep.4",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps - Ep.4",
                path: "owasp/owasp-llm-apps",
                subdir: "march",
                localPath: "conferences/owasp/owasp-llm-apps/2025/march"
            },
            {
                name: "OWASP",
                displayName: "Gen AI Application Security & Risk Summit - The Stochastic Shall Inherit the Earth",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "Breakout: The Stochastic Shall Inherit the Earth (But Let's Secure It First), Top 10 Risk for LLMs and GenAI",
                path: "owasp/owasp-llm-apps",
                subdir: "october",
                localPath: "conferences/owasp/owasp-llm-apps/2025/october"
            },
            {
                name: "RSA Conference",
                displayName: "RSA USA Conference 2025 - OWASP AI Security Summit",
                year: "2025",
                icon: "fas fa-lock",
                description: "OWASP AI Security Summit — Safeguarding GenAI & Agentic Apps, Top 10 Risks in 2025",
                path: "rsa-usa",
                subdir: "april",
                localPath: "conferences/rsa-usa/2025/april"
            },
            {
                name: "BugCrowd",
                displayName: "BugCrowd x BugBoss v3 Show n Tell - July 2025",
                year: "2025",
                icon: "fas fa-bug",
                description: "BugCrowd x BugBoss Show n Tell - July 2025",
                path: "bugcrowd",
                subdir: "july/bugboss",
                localPath: "conferences/bugcrowd/2025/july/bugboss"
            },
            {
                name: "BugCrowd",
                displayName: "BugCrowd x Rhode Island College RHIC - July 2025",
                year: "2025",
                icon: "fas fa-bug",
                description: "BugCrowd x Rhode Island College RHIC - July 2025",
                path: "bugcrowd",
                subdir: "july/rhic",
                localPath: "conferences/bugcrowd/2025/july/rhic"
            },
            {
                name: "BugCrowd",
                displayName: "EdProtect: An Edtech Security Symposium",
                year: "2025",
                icon: "fas fa-bug",
                description: "Breakout 2 - Bug Bounty Student Training by Bugcrowd at UC Berkeley Center for Long-Term Cybersecurity",
                path: "bugcrowd",
                subdir: "september/edprotect",
                localPath: "conferences/bugcrowd/2025/september/edprotect"
            },
            {
                name: "BugCrowd",
                displayName: "RITSEC Rochester Institute of Technology - LLM AI AppSec Workshop",
                year: "2025",
                icon: "fas fa-bug",
                description: "LLM AI Application Security hacking presentation and workshop for RIT College Program students",
                path: "bugcrowd",
                subdir: "september/rit",
                localPath: "conferences/bugcrowd/2025/september/rit"
            },
            {
                name: "BugCrowd",
                displayName: "University of Texas - Austin",
                year: "2025",
                icon: "fas fa-bug",
                description: "BugCrowd College Program Educational Event",
                path: "bugcrowd",
                subdir: "october/ut",
                localPath: "conferences/bugcrowd/2025/october/ut"
            },
            {
                name: "BugCrowd",
                displayName: "WRAVEN x BugCrowd - A Bug Hunter's Journey from CTFs to Cash",
                year: "2025",
                icon: "fas fa-bug",
                description: "Bug Bounty Student Training by Bugcrowd",
                path: "bugcrowd",
                subdir: "october/wraven",
                localPath: "conferences/bugcrowd/2025/october/wraven"
            },
            {
                name: "BugCrowd",
                displayName: "CNU CyberClub - Prompt to Pwn: Offensive AI Security",
                year: "2025",
                icon: "fas fa-bug",
                description: "BugCrowd College Program Educational Event",
                path: "bugcrowd",
                subdir: "october/cnu",
                localPath: "conferences/bugcrowd/2025/october/cnu"
            },
            {
                name: "BugCrowd",
                displayName: "Merritt College - A Bug Hunter's Journey from CTFs to Cash",
                year: "2025",
                icon: "fas fa-bug",
                description: "Shifting to the Bug Bounty Hunter's Methodology",
                path: "bugcrowd",
                subdir: "october/merritcollege",
                localPath: "conferences/bugcrowd/2025/october/merritcollege"
            },
            {
                name: "BugCrowd",
                displayName: "UMBC CyberDawgs - A Bug Hunter's Journey from CTFs to Cash",
                year: "2025",
                icon: "fas fa-bug",
                description: "BugCrowd College Program Educational Event",
                path: "bugcrowd",
                subdir: "november/ubmc",
                localPath: "conferences/bugcrowd/2025/november/ubmc"
            },
            {
                name: "BugCrowd",
                displayName: "University of New Brunswick (UNB)",
                year: "2025",
                icon: "fas fa-bug",
                description: "BugCrowd College Program Educational Event",
                path: "bugcrowd",
                subdir: "november/unb",
                localPath: "conferences/bugcrowd/2025/november/unb"
            },
            {
                name: "Off By One Security",
                displayName: "Building and Deploying Offensive Security Agents with Dreadnode",
                year: "2025",
                icon: "fas fa-bug",
                description: "Building and Deploying Offensive Security Agents with Dreadnode",
                path: "offbyonesecurity",
                subdir: "july",
                localPath: "conferences/offbyonesecurity/2025/july"
            },
            {
                name: "DEFCON",
                displayName: "Bug Bounty Village: Misaligned: AI Jailbreaking Panel with Basi Team Six (BT6) & Jason Haddix",
                year: "2025",
                icon: "fas fa-skull-crossbones",
                description: "Bug Bounty Village: Misaligned: AI Jailbreaking Panel with Basi Team Six (BT6) & Jason Haddix",
                path: "defcon",
                subdir: "august/bb_village",
                localPath: "conferences/defcon/2025/august/bb_village"
            },
            {
                name: "PromptorGTFO",
                displayName: "PromptorGTFO 2025 - Deploying Offensive AI with Modular Agents",
                year: "2025",
                icon: "fas fa-terminal",
                description: "Dreadnode: Deploying Offensive AI with Modular Agents",
                path: "promptorgtfo",
                subdir: "august",
                localPath: "conferences/promptorgtfo/2025/august"
            },
            {
                name: "CyberToronto",
                displayName: "CyberToronto 2025 - Community Leaders Panel",
                year: "2025",
                icon: "fas fa-users",
                description: "Community Leaders Panel - Advancing Cybersecurity Through Community Leadership",
                path: "cyber-toronto",
                subdir: "december",
                localPath: "conferences/cyber-toronto/2025/december"
            },
            {
                name: "TAICO",
                displayName: "TAICO - Toronto AI and Cybersecurity Organization",
                year: "2026",
                icon: "fas fa-brain",
                description: "First TAICO meetup of 2026 featuring Q\u0026A, steganography talk, and lightning talks",
                path: "taico",
                subdir: "february",
                localPath: "conferences/taico/2026/february"
            }
        ];

        const conferencesSection = document.getElementById('conferences');
        if (!conferencesSection) return;

        // Keep section title
        const sectionTitle = conferencesSection.querySelector('.section-title');
        conferencesSection.innerHTML = '';
        conferencesSection.appendChild(sectionTitle);

        // Create simple conference items with local paths
        conferences.forEach(conf => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel conference-item';
            panel.setAttribute('data-year', conf.year);

            // Path to files within docs directory
            // Use content-viewer.html instead of view.html to prevent redirect issues
            const viewerLink = `content-viewer.html?type=conference&org=${conf.path}&year=${conf.year}${conf.subdir ? '&subdir=' + conf.subdir : ''}`;

            // Debug log
            console.log(`Generated link for ${conf.name}: ${viewerLink}`);

            // Find slide file if it exists
            let slideFile = "";
            if (conf.path === "apidays" && conf.year === "2023") {
                slideFile = `${conf.localPath}/Live Edit - INTERFACE ApiSec Slides - Language AI Security at the API level_  Avoiding Hacks, Injections and Breaches - 06-28-2023 v1.1.pdf`;
            }
            // ...add other slide files as needed...

            panel.innerHTML = `
                <div class="panel-content">
                    <div class="conf-logo"><i class="${conf.icon}"></i> ${conf.displayName || conf.name}</div>
                    <h3>${conf.displayName || conf.name} ${conf.year}</h3>
                    <p>${conf.description}</p>
                    <div class="conf-meta">
                        <span class="conf-date">${conf.year}</span>
                        <div class="button-group">
                            <a href="${viewerLink}" class="btn-view">View Details</a>
                            ${slideFile ? `<a href="${slideFile}" class="btn-slides" target="_blank"><i class="fas fa-file-pdf"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            `;

            conferencesSection.appendChild(panel);
        });

        // Add year filter for conferences
        addYearFilter('conferences', conferences.map(c => c.year));

        // Add name filter for conferences
        addNameFilter('conferences', conferences.map(c => c.name));
    }

    function loadPodcasts() {
        const podcasts = [
            {
                name: "Bare Knuckles and Brass Tacks",
                year: "2025",
                icon: "fas fa-fist-raised",
                description: "Discussion about AI and ML security",
                path: "bareknuckles_and_brass_tacks"
            },
            {
                name: "ChAI Chat Podcast",
                year: "2023",
                icon: "fas fa-mug-hot",
                description: "Conversations on AI ethics and security challenges",
                path: "chai_chat_podcast"
            },
            {
                name: "F5 DevCentral",
                year: "2023",
                icon: "fas fa-server",
                description: "Technical discussions on API security and AI integration",
                path: "f5_dev_central"
            },
            {
                name: "MLOps Community",
                year: "2023",
                icon: "fas fa-cogs",
                description: "Exploring the intersection of MLOps and security",
                path: "mlops_community/2023/november"
            },
            {
                name: "OWASP LLM Apps Podcast",
                year: "2024",
                icon: "fas fa-shield-virus",
                description: "Security considerations for LLM applications",
                path: "owasp/owasp-llm-apps-podcast"
            },
            {
                name: "Software Testing & Quality Talks",
                year: "2024",
                icon: "fas fa-check-circle",
                description: "Testing methodologies for AI systems",
                path: "software_testing_and_quality_talks"
            },
            {
                name: "Synack Podcast",
                year: "2023",
                icon: "fas fa-bug",
                description: "Ethical hacking and AI security vulnerabilities",
                path: "synack"
            },
            {
                name: "The Boring AppSec Podcast",
                year: "2025",
                icon: "fas fa-shield-alt",
                description: "AI Security Deep Dive - Modern AI attack vectors and LLM application security",
                path: "the_boring_appsec_podcast"
            }
        ];

        const podcastsSection = document.getElementById('podcasts');
        if (!podcastsSection) return;

        // Keep section title
        const sectionTitle = podcastsSection.querySelector('.section-title');
        podcastsSection.innerHTML = '';
        podcastsSection.appendChild(sectionTitle);

        // Add podcast panels with viewer.html links
        podcasts.forEach(podcast => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel podcast-item';
            panel.setAttribute('data-year', podcast.year);

            // Create a link to the viewer.html with the parameters
            // Use content-viewer.html instead of view.html to prevent redirect issues
            const viewerLink = `content-viewer.html?type=podcast&org=${podcast.path}&year=${podcast.year}`;

            // Debug log
            console.log(`Generated link for ${podcast.name}: ${viewerLink}`);

            // Also create direct link to README.md file
            const readmeLink = `podcasts/${podcast.path}/README.md`;

            panel.innerHTML = `
                <div class="panel-content">
                    <div class="podcast-logo"><i class="${podcast.icon}"></i> ${podcast.name}</div>
                    <h3>${podcast.name}</h3>
                    <p>${podcast.description}</p>
                    <div class="podcast-meta">
                        <span class="podcast-date">${podcast.year}</span>
                        <div class="button-group">
                            <a href="${viewerLink}" class="btn-listen">View Details</a>
                            <a href="${readmeLink}" class="btn-readme" target="_blank" title="View README"><i class="fas fa-file-alt"></i></a>
                        </div>
                    </div>
                </div>
            `;

            podcastsSection.appendChild(panel);
        });

        // Add year filter for podcasts
        addYearFilter('podcasts', podcasts.map(p => p.year));

        // Add name filter for podcasts
        addNameFilter('podcasts', podcasts.map(p => p.name));
    }

    function loadPublications() {
        const publications = [
            {
                title: "Bugcrowd Author Profile - Ads Dawson",
                publisher: "BugCrowd",
                description: "Complete collection of all my published articles,     research, and contributions on the Bugcrowd blog covering AI    security, red teaming, and vulnerability research.",
                url: "https://www.bugcrowd.com/blog/author/ads-dawson/",
                icon: "fas fa-user-edit",
                year: "2025"
            },
            {
                title: "arXiv:2511.15097 - MAIF: Enforcing AI Trust and Provenance with an Artifact-Centric Agentic Paradigm",
                publisher: "arXiv",
                description: "Academic paper on enforcing AI trust and provenance through an artifact-centric agentic paradigm for robust AI system accountability.",
                url: "https://arxiv.org/abs/2511.15097",
                icon: "fas fa-file-alt",
                year: "2025"
            },
            {
                title: "arXiv:2506.14682 - AIRTBench: Measuring Autonomous AI Red Teaming Capabilities in Language Models",
                publisher: "arXiv",
                description: "Academic paper on an AI red teaming benchmark for evaluating language models' ability to autonomously discover and exploit Artificial Intelligence and Machine Learning (AI/ML) security vulnerabilities.",
                url: "https://arxiv.org/abs/2506.14682",
                icon: "fas fa-file-alt",
                year: "2025"
            },
            {
                title: "AI Red Teaming Case Study: Claude 3.7 Sonnet Solves the Turtle Challenge",
                publisher: "Dreadnode",
                description: "Ads reveals groundbreaking research where AI models crushed a cybersecurity challenge so brutal that 94% of human hackers fail—yet three frontier AIs (Claude, Gemini, and Llama) each cracked it using wildly different strategies, from Claude's methodical 9-minute persistence to Llama's lightning-fast 1-minute creative deception. Using their AIRTBench benchmark of 70 AI/ML security challenges and their Strikes evaluation platform, Ads demonstrates that these aren't just pattern-matching machines but genuine problem-solvers adapting under pressure, marking a pivotal moment where AI offensive capabilities have officially surpassed most human experts—and they're sharing the complete dataset so the security community can prepare for what's coming next.",
                url: "https://dreadnode.io/blog/ai-red-teaming-case-study-claude-sonnet-solves-turtle",
                icon: "fas fa-skull",
                year: "2025"
            },
            {
                title: "Do LLM Agents Have AI Red Team Capabilities? We Built a Benchmark to Find Out",
                publisher: "Dreadnode",
                description: "We're excited to introduce AIRTBench, an AI red teaming framework that tests LLMs against AI/ML black-box capture-the-flag (CTF) challenges to see how they perform when attacking other AI systems. Think of it as a proving ground where models face the kind of adversarial scenarios they'd encounter in the wild, not just in carefully curated test suites.",
                url: "https://dreadnode.io/blog/ai-red-team-benchmark",
                icon: "fas fa-skull",
                year: "2025"
            },
            {
                title: "arXiv:2504.19855 - The Automation Advantage in AI Red Teaming",
                publisher: "arXiv",
                description: "Academic paper on automated approaches to AI security testing",
                url: "https://arxiv.org/abs/2504.19855",
                icon: "fas fa-file-alt",
                year: "2024"
            },
            {
                title: "Inside the Mind of a Hacker 2026",
                publisher: "BugCrowd",
                description: "Bugcrowd's annual report analyzing how today's hackers think and work, covering hacker motivations, team-based hacking trends, and AI adoption in vulnerability discovery",
                url: "https://www.bugcrowd.com/resources/report/inside-the-mind-of-a-hacker/",
                icon: "fas fa-bug",
                image: "publications/bugcrowd/itmoah-2026/itmoah-2026-ads-dawson.png",
                year: "2026"
            },
            {
                title: "Inside the Mind of a Hacker 2024 Edition",
                publisher: "BugCrowd",
                description: "Analysis of hacker motivations, methods, and impact in the evolving security landscape",
                url: "https://www.bugcrowd.com/blog/inside-the-mind-of-a-hacker-2024-edition/",
                icon: "fas fa-bug",
                year: "2024"
            },
            {
                title: "The 12 Hacker “Battlestations” of the Holidays",
                publisher: "BugCrowd",
                description: "AOnnnnnn the 12th day of Christmas, a hacker gave to me…",
                url: "https://www.bugcrowd.com/blog/the-12-hacker-battlestations-of-the-holidays/",
                icon: "fas fa-bug",
                year: "2024"
            },
            {
                title: "Hacker Spotlight: Ads Dawson",
                publisher: "BugCrowd",
                description: "Profile highlighting my journey, methodologies, and contributions to security research",
                url: "https://www.bugcrowd.com/blog/hacker-spotlight-ads-dawson/",
                icon: "fas fa-bug",
                year: "2023"
            },
            {
                title: "Defining and Prioritizing AI Vulnerabilities for Security Testing",
                publisher: "BugCrowd",
                description: "VRT version 1.12",
                url: "https://www.bugcrowd.com/blog/defining-and-prioritizing-ai-vulnerabilities-for-security-testing/",
                icon: "fas fa-bug",
                year: "2023"
            },
            {
                title: "The State of AI Security",
                publisher: "Cohere",
                description: "An in-depth look at current AI security challenges",
                url: "https://cohere.com/blog/the-state-of-ai-security",
                icon: "fas fa-brain",
                year: "2023"
            },
            {
                title: "Straight talk on AI security with Exabeam's Steve Wilson",
                publisher: "Cohere",
                description: "Interview discussing AI security challenges and solutions",
                url: "https://cohere.com/blog/straight-talk-on-ai-security-with-exabeams-steve-wilson",
                icon: "fas fa-brain",
                year: "2023"
            },
            {
                title: "How generative AI has changed security",
                publisher: "Cohere",
                description: "Analysis of the security landscape in the era of generative AI",
                url: "https://cohere.com/blog/how-generative-ai-has-changed-security-2",
                icon: "fas fa-brain",
                year: "2023"
            },
            {
                title: "Enterprise AI security: Deploying LLM applications safely",
                publisher: "Cohere",
                description: "Guidelines for secure enterprise LLM deployment",
                url: "https://cohere.com/blog/enterprise-ai-security-deploying-llm-applications-safely",
                icon: "fas fa-brain",
                year: "2023"
            },
            {
                title: "From Jeopardy! to The Terminator: AI vs. AGI vs. ASI",
                publisher: "BugCrowd",
                description: "I’ll be back (but first, let’s win Jeopardy!)",
                url: "https://www.bugcrowd.com/blog/from-jeopardy-to-the-terminator-ai-vs-agi-vs-asi/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "What Mission Impossible taught us about AI: The hacker roots of a face swap",
                publisher: "BugCrowd",
                description: "Is Tom Cruise the original deep fake hacker?",
                url: "https://www.bugcrowd.com/blog/what-mission-impossible-taught-us-about-ai-the-hacker-roots-of-a-face-swap/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "How I hacked my way to the big leagues: Fat bounties, interviews on NASDAQ, and advisory boards",
                publisher: "BugCrowd",
                description: "Breaking things for fun and profit - Though Leadership",
                url: "https://www.bugcrowd.com/blog/how-i-hacked-my-way-to-the-big-leagues-fat-bounties-interviews-on-nasdaq-and-advisory-boards/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "Rigging the system: The art of AI exploits",
                publisher: "BugCrowd",
                description: "Leveraging agents, crafting exploits, and mining the hidden gems of AI security",
                url: "https://www.bugcrowd.com/blog/rigging-the-system-the-art-of-ai-exploits/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "Hacking AI applications: In the trenches with DSPy",
                publisher: "BugCrowd",
                description: "An in-depth exploration of automated AI red teaming using DSPy",
                url: "https://www.bugcrowd.com/blog/hacking-llm-applications-in-the-trenches-with-dspy/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "Hacking LLM applications: A meticulous hacker's two cents",
                publisher: "BugCrowd",
                description: "Insights into vulnerabilities specific to LLM applications",
                url: "https://www.bugcrowd.com/blog/hacking-llm-applications-a-meticulous-hackers-two-cents/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "A low-cost hacking sidekick: Baby steps to using offensive AI agents",
                publisher: "BugCrowd",
                description: "Guide to leveraging AI for ethical hacking",
                url: "https://www.bugcrowd.com/blog/a-low-cost-hacking-sidekick-baby-steps-to-using-offensive-ai-agents/",
                icon: "fas fa-bug",
                year: "2025"
            },
            {
                title: "AI Native LLM Security: A comprehensive guide to leveraging OWASP Top 10 for LLM applications and beyond",
                publisher: "Packt Publishing",
                description: "A comprehensive guide exploring adversarial AI attacks and security challenges, built on the expertise of OWASP Top 10 for LLM applications pioneers",
                url: "https://www.packtpub.com/en-ca/product/ai-native-llm-security-9781836203742",
                icon: "fas fa-book",
                year: "2025"
            },
            {
                title: "Lakera 2024 GenAI Security Readiness Report",
                publisher: "Lakera",
                description: "Contributing advisor to the Lakera 2024 GenAI Security Readiness Report",
                url: "https://lakera-marketing-public.s3.eu-west-1.amazonaws.com/Lakera_AI_Global_GenAI_Security_Readiness_Report.pdf",
                icon: "fas fa-shield-alt",
                year: "2024"
            },
            {
                title: "Lakera 2025 GenAI Security Readiness Report",
                publisher: "Lakera",
                description: "Contributing advisor to the Lakera 2025 GenAI Security Readiness Report",
                url: "https://www.lakera.ai/genai-security-report-2025",
                icon: "fas fa-shield-alt",
                year: "2025"
            },
            {
                title: "OWASP Top 10 for LLM Applications",
                publisher: "OWASP",
                description: "Contributing author to the OWASP Top 10 for LLM Applications guide",
                url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
                icon: "fas fa-shield-virus",
                year: "2023"
            },
        ];

        const publicationsSection = document.getElementById('publications');
        if (!publicationsSection) return;

        // Keep section title
        const sectionTitle = publicationsSection.querySelector('.section-title');
        publicationsSection.innerHTML = '';
        publicationsSection.appendChild(sectionTitle);

        // Add publication panels
        publications.forEach(pub => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel publication-item';
            panel.setAttribute('data-year', pub.year);

            panel.innerHTML = `
                <div class="panel-content">
                    <div class="pub-logo"><i class="${pub.icon}"></i> ${pub.publisher}</div>
                    <h3>${pub.title}</h3>
                    <p>${pub.description}</p>
                    <div class="pub-meta">
                        <span class="pub-date">${pub.year}</span>
                        <a href="${pub.url}" class="btn-read" target="_blank">Read More</a>
                    </div>
                </div>
            `;

            publicationsSection.appendChild(panel);
        });

        // Add year filter for publications
        addYearFilter('publications', publications.map(p => p.year));

        // Add publisher filter for publications
        addNameFilter('publications', publications.map(p => p.publisher), 'Publisher');
    }

    function loadVolunteering() {
        const volunteering = [
            {
                title: "Hacker Ambassador",
                organization: "Caido",
                description: "Hacker/community ambassador contributing feature and enhancement development work, custom plugins to bridge the gap between community web app pentesters and bug bounty hunters, untapping Caido's full potential as a forefront security testing platform.",
                sector: "Science & Technology",
                date: "2024 – Present",
                icon: "fas fa-shield-alt",
                year: "2024",
                url: "https://caido.io/"
            },
            {
                title: "Hacker Advisory Board Member",
                organization: "Bugcrowd",
                description: "Representing the global hacker community on Bugcrowd's Hacker Advisory Board.",
                sector: "Science & Technology",
                date: "Nov 2024 – Present",
                icon: "fas fa-bug",
                year: "2024",
                url: "https://www.bugcrowd.com/blog/what-is-bugcrowds-hacker-advisory-board/"
            },
            {
                title: "Member – Artificial Intelligence Working Group",
                organization: "MITRE",
                description: "Contributing to AI security standards and working group initiatives.",
                sector: "Science & Technology",
                date: "Jul 2024 – Present",
                icon: "fas fa-brain",
                year: "2024",
                url: "https://cwe.mitre.org/community/working_groups.html"
            },
            {
                title: "Technical Lead & Founding Member",
                organization: "OWASP Top 10 for Large Language Model Applications",
                description: "Led the project from inception to becoming an OWASP Flagship.",
                sector: "Science & Technology",
                date: "May 2023 – Present",
                icon: "fas fa-shield-virus",
                year: "2023"
            }
            // Add more volunteering entries as needed
        ];

        const volunteeringSection = document.getElementById('volunteering');
        if (!volunteeringSection) return;

        // Clear loading indicator
        volunteeringSection.innerHTML = '<h2 class="section-title"><span class="highlight">Volunteering Experience</span></h2>';

        // Add dedicated page link
        const dedicatedLink = document.createElement('div');
        dedicatedLink.className = 'comic-panel';
        dedicatedLink.innerHTML = `
            <div class="panel-content" style="text-align: center;">
                <h3>View Full Volunteering Experience</h3>
                <p>Explore detailed information about all volunteering activities and community contributions.</p>
                <a href="volunteering/" class="btn-view">View Full Page</a>
            </div>
        `;
        volunteeringSection.appendChild(dedicatedLink);

        // Add recent volunteering items (limit to 3 most recent)
        volunteering.slice(0, 3).forEach(vol => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel volunteering-item';

            panel.innerHTML = `
                <div class="panel-content">
                    <div class="vol-logo"><i class="${vol.icon}"></i> ${vol.organization.split(' ')[0]}</div>
                    <h3>${vol.title}</h3>
                    <div class="vol-meta-header">
                        <span class="vol-company">${vol.organization}</span>
                        <span class="vol-date">${vol.date}</span>
                    </div>
                    <p>${vol.description}</p>
                    <div class="vol-meta">
                        <span class="vol-sector">${vol.sector}</span>
                        ${vol.url ? `<a href="${vol.url}" class="btn-read" target="_blank">Learn More</a>` : ''}
                    </div>
                </div>
            `;

            volunteeringSection.appendChild(panel);
        });
    }

    function loadTelevision() {
        const television = [
            {
                name: "CyberNews",
                year: "2025",
                icon: "fas fa-skull-crossbones",
                description: "The Dangerous Evolution of AI Hacking",
                path: "cybernews",
                date: "2025",
                videoUrl: "https://www.youtube.com/watch?v=-um9zKf1V30"
            },
            {
                name: "NASDAQ TradeTalks",
                year: "2025",
                icon: "fas fa-chart-line",
                description: "The Ever-Changing Landscape of AI Safety",
                path: "nasdaq-tradetalks",
                date: "2025",
                videoUrl: "https://www.youtube.com/watch?v=kWJyrbWsRNk"
            }
        ];

        const televisionSection = document.getElementById('television');
        if (!televisionSection) return;

        // Keep section title
        const sectionTitle = televisionSection.querySelector('.section-title');
        televisionSection.innerHTML = '';
        televisionSection.appendChild(sectionTitle);

        // Create simple television items
        television.forEach(tv => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel television-item';
            panel.setAttribute('data-year', tv.year);

            // Create a link to the viewer.html with the parameters
            // Use content-viewer.html instead of view.html to prevent redirect issues
            const viewerLink = `content-viewer.html?type=television&org=${tv.path}&year=${tv.year}`;

            // Debug log
            console.log(`Generated link for ${tv.name}: ${viewerLink}`);

            // Also create direct link to README.md file
            const readmeLink = `television/${tv.path}/README.md`;

            panel.innerHTML = `
                <div class="panel-content">
                    <div class="tv-logo"><i class="${tv.icon}"></i> ${tv.name}</div>
                    <h3>${tv.name}</h3>
                    <p>${tv.description}</p>
                    <div class="tv-meta">
                        <span class="tv-date">${tv.date}</span>
                        <div class="button-group">
                            ${tv.videoUrl ? `<a href="${tv.videoUrl}" class="btn-watch" target="_blank">Watch Recording</a>` : `<a href="${viewerLink}" class="btn-watch">View Details</a>`}
                            <a href="${readmeLink}" class="btn-readme" target="_blank" title="View README"><i class="fas fa-file-alt"></i></a>
                        </div>
                    </div>
                </div>
            `;

            televisionSection.appendChild(panel);
        });

        // Add year filter for television
        addYearFilter('television', television.map(t => t.year));

        // Add name filter for television
        addNameFilter('television', television.map(t => t.name));
    }

    // Helper function to create year filters
    function addYearFilter(sectionId, years) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Get unique years and sort in descending order
        const uniqueYears = [...new Set(years)].sort().reverse();

        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';

        // Create year filter
        const yearFilter = document.createElement('div');
        yearFilter.className = 'filter-group';
        yearFilter.innerHTML = '<span class="filter-label">Filter by Year:</span>';

        // Add "All" button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn';
        allBtn.textContent = 'All';
        allBtn.setAttribute('data-filter-type', 'year');
        allBtn.setAttribute('data-filter-value', 'all');
        yearFilter.appendChild(allBtn);

        // Add year buttons
        uniqueYears.forEach(year => {
            const btn = document.createElement('button');
            // Default to 2025 being active
            btn.className = year === '2025' ? 'filter-btn active' : 'filter-btn';
            btn.textContent = year;
            btn.setAttribute('data-filter-type', 'year');
            btn.setAttribute('data-filter-value', year);
            yearFilter.appendChild(btn);
        });

        filterContainer.appendChild(yearFilter);

        // Insert filter container after the section title
        const sectionTitle = section.querySelector('.section-title');
        if (sectionTitle) {
            section.insertBefore(filterContainer, sectionTitle.nextSibling);
        } else {
            section.prepend(filterContainer);
        }

        // Add event listeners to filter buttons
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const items = section.querySelectorAll(`[data-year]`);

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-filter-type') === 'year') {
                        btn.classList.remove('active');
                    }
                });
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter-value');

                // Filter items
                items.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-year') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Apply initial 2025 filter
        const yearItems = section.querySelectorAll(`[data-year]`);
        yearItems.forEach(item => {
            if (item.getAttribute('data-year') === '2025') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // New helper function to create name filters
    function addNameFilter(sectionId, names, labelText = 'Name') {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Get unique names and sort alphabetically
        const uniqueNames = [...new Set(names)].sort();

        // If there's only one or zero names, don't create a filter
        if (uniqueNames.length <= 1) return;

        // Find the filter container or create it
        let filterContainer = section.querySelector('.filter-container');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.className = 'filter-container';

            // Insert filter container after the section title
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle) {
                section.insertBefore(filterContainer, sectionTitle.nextSibling);
            } else {
                section.prepend(filterContainer);
            }
        }

        // Create name filter
        const nameFilter = document.createElement('div');
        nameFilter.className = 'filter-group';
        nameFilter.innerHTML = `<span class="filter-label">Filter by ${labelText}:</span>`;

        // Add "All" button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'All';
        allBtn.setAttribute('data-filter-type', 'name');
        allBtn.setAttribute('data-filter-value', 'all');
        nameFilter.appendChild(allBtn);

        // Add name buttons
        uniqueNames.forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = name.length > 15 ? name.substring(0, 15) + '...' : name;
            btn.setAttribute('data-filter-type', 'name');
            btn.setAttribute('data-filter-value', name);
            btn.title = name; // Add full name as tooltip for truncated names
            nameFilter.appendChild(btn);
        });

        filterContainer.appendChild(nameFilter);

        // Add event listeners and data attributes to items
        const items = section.querySelectorAll('.comic-panel');

        // Add data-name attribute to items
        items.forEach((item, index) => {
            if (sectionId === 'conferences') {
                const nameElement = item.querySelector('h3');
                if (nameElement) {
                    const fullText = nameElement.textContent;
                    const namePart = fullText.split(' ')[0] + (fullText.split(' ')[1] || '');
                    item.setAttribute('data-name', names[index]);
                }
            } else if (sectionId === 'podcasts') {
                const nameElement = item.querySelector('h3');
                if (nameElement) {
                    item.setAttribute('data-name', names[index]);
                }
            } else if (sectionId === 'publications') {
                const publisherElement = item.querySelector('.pub-logo');
                if (publisherElement) {
                    item.setAttribute('data-name', names[index]);
                }
            } else if (sectionId === 'television') {
                const nameElement = item.querySelector('h3');
                if (nameElement) {
                    item.setAttribute('data-name', names[index]);
                }
            }
        });

        // Add event listeners to filter buttons
        const filterButtons = nameFilter.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-filter-type') === 'name') {
                        btn.classList.remove('active');
                    }
                });
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter-value');

                // Filter items
                items.forEach(item => {
                    // Don't change display if year filter is active
                    const yearFilterActive = section.querySelector('.filter-btn[data-filter-type="year"].active');
                    const yearFilterValue = yearFilterActive ? yearFilterActive.getAttribute('data-filter-value') : 'all';

                    const matchesYear = yearFilterValue === 'all' || item.getAttribute('data-year') === yearFilterValue;
                    const matchesName = filterValue === 'all' || item.getAttribute('data-name') === filterValue;

                    if (matchesYear && matchesName) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Modify year filter buttons to respect name filter
        const yearFilterButtons = section.querySelectorAll('.filter-btn[data-filter-type="year"]');

        yearFilterButtons.forEach(button => {
            const originalClickHandler = button.onclick;
            button.onclick = null;

            button.addEventListener('click', function() {
                // Update active state for year buttons
                yearFilterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                const yearFilterValue = this.getAttribute('data-filter-value');

                // Check if name filter is active
                const nameFilterActive = section.querySelector('.filter-btn[data-filter-type="name"].active');
                const nameFilterValue = nameFilterActive ? nameFilterActive.getAttribute('data-filter-value') : 'all';

                // Filter items
                items.forEach(item => {
                    const matchesYear = yearFilterValue === 'all' || item.getAttribute('data-year') === yearFilterValue;
                    const matchesName = nameFilterValue === 'all' || item.getAttribute('data-name') === nameFilterValue;

                    if (matchesYear && matchesName) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Set up navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    });
});