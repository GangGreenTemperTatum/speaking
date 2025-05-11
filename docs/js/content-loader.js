/**
 * Content Loader - Hard-coded data to ensure content displays
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Content loader initialized - DIRECT VERSION');

    // Load conferences directly
    loadConferences();

    // Load podcasts directly
    loadPodcasts();

    // Load publications directly
    loadPublications();

    function loadConferences() {
        const conferences = [
            {
                name: "API Days",
                path: "apidays",
                year: "2023",
                icon: "fas fa-cloud",
                description: "Talks on AI/ML Security at API level",
                subdirectory: "interface"
            },
            {
                name: "APISec",
                path: "apisec",
                year: "2023",
                icon: "fas fa-shield-alt",
                description: "Securing LLM and NLP APIs",
                subdirectory: "december"
            },
            {
                name: "DC604",
                path: "dc604",
                year: "2023",
                icon: "fas fa-users",
                description: "Hacker Summer Camp - Poisoning Web Training Data",
                subdirectory: "hacker-summer-camp-23"
            },
            {
                name: "In-Cyber Forum",
                path: "in-cyber-forum",
                year: "2024",
                icon: "fas fa-globe",
                description: "Language AI Security at the API level",
                subdirectory: "october"
            },
            {
                name: "ISACA",
                path: "isaca",
                year: "2024",
                icon: "fas fa-certificate",
                description: "Application Security Sector Day",
                subdirectory: "feb/appsec-security-sector-days"
            },
            {
                name: "OWASP Toronto",
                path: "owasp/owasp-toronto",
                year: "2024",
                icon: "fas fa-shield-virus",
                description: "OWASP Top 10 for LLM Applications",
                subdirectory: "june"
            },
            {
                name: "OWASP Toronto",
                path: "owasp/owasp-toronto",
                year: "2025",
                icon: "fas fa-shield-virus",
                description: "Shiny Rocks in Offensive AI",
                subdirectory: "march"
            },
            {
                name: "OWASP Vancouver",
                path: "owasp/owasp-vancouver",
                year: "2023",
                icon: "fas fa-shield-virus",
                description: "Language AI Security at the API level",
                subdirectory: "november"
            },
            {
                name: "RSA Conference",
                path: "rsa-usa",
                year: "2024",
                icon: "fas fa-lock",
                description: "Keynote on AI/ML Security",
                subdirectory: "may"
            }
        ];

        const conferencesSection = document.getElementById('conferences');
        if (!conferencesSection) return;

        // Keep section title
        const sectionTitle = conferencesSection.querySelector('.section-title');
        conferencesSection.innerHTML = '';
        conferencesSection.appendChild(sectionTitle);

        // Create simple conference items
        conferences.forEach(conf => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel conference-item';
            panel.setAttribute('data-year', conf.year);
            panel.setAttribute('data-org', conf.path.split('/')[0]);

            // Fix the link to correctly point to view.html with proper path info
            panel.innerHTML = `
                <div class="panel-content">
                    <div class="conf-logo"><i class="${conf.icon}"></i> ${conf.name}</div>
                    <h3>${conf.name} ${conf.year}</h3>
                    <p>${conf.description}</p>
                    <div class="conf-meta">
                        <span class="conf-date">${conf.year}</span>
                        <a href="view.html?type=conference&org=${conf.path}&year=${conf.year}&subdir=${conf.subdirectory || ''}" class="btn-view">View Details</a>
                    </div>
                </div>
            `;

            conferencesSection.appendChild(panel);
        });

        // Add year filter for conferences
        addYearFilter('conferences', conferences.map(c => c.year));
    }

    function loadPodcasts() {
        const podcasts = [
            {
                name: "Bare Knuckles and Brass Tacks",
                path: "podcasts/bareknuckles_and_brass_tacks",
                year: "2024",
                icon: "fas fa-fist-raised",
                description: "Discussion about AI and ML security"
            },
            {
                name: "ChAI Chat Podcast",
                path: "podcasts/chai_chat_podcast",
                year: "2023",
                icon: "fas fa-mug-hot",
                description: "Conversations on AI ethics and security challenges"
            },
            {
                name: "F5 DevCentral",
                path: "podcasts/f5_dev_central",
                year: "2023",
                icon: "fas fa-server",
                description: "Technical discussions on API security and AI integration"
            },
            {
                name: "MLOps Community",
                path: "podcasts/mlops_community",
                year: "2023",
                icon: "fas fa-cogs",
                description: "Exploring the intersection of MLOps and security",
                subdirectory: "2023/november"
            },
            {
                name: "OWASP LLM Apps Podcast",
                path: "podcasts/owasp/owasp-llm-apps-podcast",
                year: "2024",
                icon: "fas fa-shield-virus",
                description: "Security considerations for LLM applications"
            },
            {
                name: "Software Testing & Quality Talks",
                path: "podcasts/software_testing_and_quality_talks",
                year: "2024",
                icon: "fas fa-check-circle",
                description: "Testing methodologies for AI systems"
            },
            {
                name: "Synack Podcast",
                path: "podcasts/synack",
                year: "2023",
                icon: "fas fa-bug",
                description: "Ethical hacking and AI security vulnerabilities"
            }
        ];

        const podcastsSection = document.getElementById('podcasts');
        if (!podcastsSection) return;

        // Keep section title
        const sectionTitle = podcastsSection.querySelector('.section-title');
        podcastsSection.innerHTML = '';
        podcastsSection.appendChild(sectionTitle);

        // Add podcast panels
        podcasts.forEach(podcast => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel podcast-item';
            panel.setAttribute('data-year', podcast.year);

            // Fix the podcast link to use view.html correctly
            panel.innerHTML = `
                <div class="panel-content">
                    <div class="podcast-logo"><i class="${podcast.icon}"></i> ${podcast.name}</div>
                    <h3>${podcast.name}</h3>
                    <p>${podcast.description}</p>
                    <div class="podcast-meta">
                        <span class="podcast-date">${podcast.year}</span>
                        <a href="view.html?type=podcast&org=${podcast.path}&year=${podcast.year}&subdir=${podcast.subdirectory || ''}" class="btn-listen">View Details</a>
                    </div>
                </div>
            `;

            podcastsSection.appendChild(panel);
        });

        // Add year filter for podcasts
        addYearFilter('podcasts', podcasts.map(p => p.year));
    }

    function loadPublications() {
        const publications = [
            {
                title: "The Automation Advantage in AI Red Teaming",
                publisher: "arXiv",
                description: "Academic paper on automated approaches to AI security testing",
                url: "https://arxiv.org/abs/2504.19855",
                icon: "fas fa-file-alt",
                year: "2024"
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
                title: "Hacking LLM applications: A meticulous hacker's two cents",
                publisher: "BugCrowd",
                description: "Insights into vulnerabilities specific to LLM applications",
                url: "https://www.bugcrowd.com/blog/hacking-llm-applications-a-meticulous-hackers-two-cents/",
                icon: "fas fa-bug",
                year: "2023"
            },
            {
                title: "OWASP Top 10 for LLM Applications",
                publisher: "OWASP",
                description: "Contributing author to the OWASP Top 10 for LLM Applications guide",
                path: "owasp/owasp-llm-apps",
                icon: "fas fa-shield-virus",
                year: "2023"
            },
            {
                title: "LLM Security Handbook - Chapter 8: Mitigating LLM Risks",
                publisher: "Packt Publishing",
                description: "Strategies and techniques for mitigating risks in LLM applications",
                path: "packt/llm_sec_handbook/chapter_8_mitigating_llm_risks-strategies_techniques",
                icon: "fas fa-book",
                year: "2024"
            }
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

            const isExternal = pub.url && pub.url.startsWith('http');
            const btnTarget = isExternal ? 'target="_blank"' : '';

            // For internal links, use view.html
            let linkHtml;
            if (isExternal) {
                linkHtml = `<a href="${pub.url}" class="btn-read" ${btnTarget}>Visit External Link</a>`;
            } else {
                linkHtml = `<a href="view.html?type=publication&org=${pub.path}&year=${pub.year}" class="btn-read">View Details</a>`;
            }

            panel.innerHTML = `
                <div class="panel-content">
                    <div class="pub-logo"><i class="${pub.icon}"></i> ${pub.publisher}</div>
                    <h3>${pub.title}</h3>
                    <p>${pub.description}</p>
                    <div class="pub-meta">
                        <span class="pub-date">${pub.year}</span>
                        ${linkHtml}
                    </div>
                </div>
            `;

            publicationsSection.appendChild(panel);
        });

        // Add year filter for publications
        addYearFilter('publications', publications.map(p => p.year));
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
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'All';
        allBtn.setAttribute('data-filter-value', 'all');
        yearFilter.appendChild(allBtn);

        // Add year buttons
        uniqueYears.forEach(year => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = year;
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
                filterButtons.forEach(btn => btn.classList.remove('active'));
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