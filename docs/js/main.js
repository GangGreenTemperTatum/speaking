document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Debug info in console
    console.log('Page loaded. DOM content ready.');
    document.querySelectorAll('.content-section').forEach(section => {
        console.log(`Section: ${section.id}, Display: ${section.style.display || 'default'}, Classes: ${section.className}`);
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            console.log(`Navigation clicked: ${target}`);

            // For podcasts and publications, offer direct links if dynamic loading fails
            if ((target === 'podcasts' || target === 'publications') && !document.querySelector(`#${target} .comic-panel:not(:first-child)`)) {
                console.log(`No content found in ${target}, adding direct link option`);

                // Show a link to the dedicated page if no panels are present
                const directLinkMsg = document.createElement('div');
                directLinkMsg.className = 'comic-panel';
                directLinkMsg.innerHTML = `
                    <div class="panel-content">
                        <h3>For best experience</h3>
                        <p>You can also view all ${target} directly on a dedicated page:</p>
                        <div class="pub-meta">
                            <a href="/${target}/index.html" class="btn-read">View All ${target.charAt(0).toUpperCase() + target.slice(1)}</a>
                        </div>
                    </div>
                `;

                // Append message if not already present
                const msgExists = document.querySelector(`#${target} .comic-panel a[href="/${target}/index.html"]`);
                if (!msgExists) {
                    document.getElementById(target).appendChild(directLinkMsg);
                }
            }

            // Log what's inside the target section before activation
            const targetSection = document.getElementById(target);
            console.log(`Target section ${target} has ${targetSection.children.length} child elements before activation`);

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                    console.log(`Activated section: ${section.id} with ${section.children.length} children`);
                }
            });
        });
    });

    // Add comic book entrance animation
    const panels = document.querySelectorAll('.comic-panel');

    function animatePanelsOnScroll() {
        panels.forEach(panel => {
            const panelTop = panel.getBoundingClientRect().top;
            const panelBottom = panel.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (panelTop < windowHeight && panelBottom > 0) {
                panel.classList.add('animate');
            }
        });
    }

    // Initial check on load
    animatePanelsOnScroll();

    // Check on scroll
    window.addEventListener('scroll', animatePanelsOnScroll);

    // Random comic book sound effect on clicks
    const soundEffects = ['POW!', 'BAM!', 'ZOOM!', 'WHAM!', 'KAPOW!', 'SPLAT!', 'ZAP!'];

    document.body.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            const sound = document.createElement('div');
            sound.className = 'sound-effect';
            sound.textContent = soundEffects[Math.floor(Math.random() * soundEffects.length)];
            sound.style.left = (e.pageX - 30) + 'px';
            sound.style.top = (e.pageY - 30) + 'px';
            document.body.appendChild(sound);

            setTimeout(() => {
                sound.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(sound);
                }, 500);
            }, 1000);
        }
    });

    // Add filter functionality for conferences by year and organization
    const filterButtons = document.querySelectorAll('.filter-btn');
    const conferenceItems = document.querySelectorAll('.conference-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter-type');
            const filterValue = this.getAttribute('data-filter-value');

            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter-type') === filterType) {
                    btn.classList.remove('active');
                }
            });
            this.classList.add('active');

            conferenceItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute(`data-${filterType}`) === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Add animation CSS for sound effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .sound-effect {
        position: absolute;
        font-family: 'Bangers', cursive;
        font-size: 2rem;
        color: #ff3864;
        background-color: #f6f740;
        padding: 0.5rem;
        border: 3px solid #000;
        border-radius: 50%;
        transform: rotate(-15deg);
        z-index: 9999;
        animation: pop 0.3s ease-out;
    }

    .fade-out {
        opacity: 0;
        transition: opacity 0.5s ease-out;
    }

    @keyframes pop {
        0% { transform: scale(0) rotate(-15deg); }
        70% { transform: scale(1.2) rotate(-15deg); }
        100% { transform: scale(1) rotate(-15deg); }
    }

    .comic-panel {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .comic-panel.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);