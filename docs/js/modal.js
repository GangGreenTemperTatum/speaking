/**
 * Modal System for Flappy Portfolio
 * Handles content cards and archive view
 */

(function() {
    'use strict';

    // Current modal state
    let currentContentItem = null;
    let currentTab = 'conferences';

    /**
     * Initialize modal system
     */
    function init() {
        setupEventListeners();
        console.log('Modal system initialized');
    }

    /**
     * Setup event listeners for modals
     */
    function setupEventListeners() {
        // Content modal buttons
        const btnViewDetails = document.getElementById('btn-view-details');
        const btnContinue = document.getElementById('btn-continue');

        if (btnViewDetails) {
            btnViewDetails.addEventListener('click', handleViewDetails);
        }

        if (btnContinue) {
            btnContinue.addEventListener('click', handleContinue);
        }

        // Archive button
        const archiveBtn = document.getElementById('archive-btn');
        if (archiveBtn) {
            archiveBtn.addEventListener('click', openArchiveModal);
        }

        // Archive modal buttons
        const btnCloseArchive = document.getElementById('btn-close-archive');
        const btnBackToGame = document.getElementById('btn-back-to-game');

        if (btnCloseArchive) {
            btnCloseArchive.addEventListener('click', closeArchiveModal);
        }

        if (btnBackToGame) {
            btnBackToGame.addEventListener('click', closeArchiveModal);
        }

        // Archive tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', handleTabClick);
        });

        // Search and filter
        const searchInput = document.getElementById('archive-search');
        const yearFilter = document.getElementById('year-filter');

        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', handleYearFilter);
        }

        // Close modal on overlay click
        const contentModal = document.getElementById('content-modal');
        const archiveModal = document.getElementById('archive-modal');

        if (contentModal) {
            contentModal.addEventListener('click', function(e) {
                if (e.target === contentModal) {
                    handleContinue();
                }
            });
        }

        if (archiveModal) {
            archiveModal.addEventListener('click', function(e) {
                if (e.target === archiveModal) {
                    closeArchiveModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * Show content card modal
     */
    window.showContentModal = function(contentItem) {
        currentContentItem = contentItem;
        
        const modal = document.getElementById('content-modal');
        if (!modal) return;

        // Update card content
        const title = document.getElementById('card-title');
        const description = document.getElementById('card-description');
        const year = document.getElementById('card-year');
        const icon = document.getElementById('card-icon');

        if (title) title.textContent = contentItem.displayName || contentItem.title || contentItem.name;
        if (description) description.textContent = contentItem.description;
        if (year) year.textContent = contentItem.year;
        if (icon) {
            icon.className = contentItem.icon || 'fas fa-star';
            // Set color based on zone type
            const zoneColors = {
                conference: '#3b82f6',
                podcast: '#a855f7',
                publication: '#22c55e',
                volunteering: '#f97316',
                television: '#ef4444'
            };
            icon.style.color = zoneColors[contentItem.type] || '#2de2e6';
        }

        // Show modal
        modal.style.display = 'flex';
        
        // Add entrance animation
        const card = modal.querySelector('.content-card');
        if (card) {
            card.style.animation = 'slideInUp 0.3s ease-out';
        }

        console.log('Content modal shown:', contentItem.id);
    };

    /**
     * Handle view details button
     */
    function handleViewDetails() {
        if (!currentContentItem) return;

        let url;
        
        if (currentContentItem.type === 'publication' && currentContentItem.url) {
            // External URL for publications
            url = currentContentItem.url;
            window.open(url, '_blank');
        } else {
            // Internal viewer for other content types
            const type = currentContentItem.type;
            const path = currentContentItem.path;
            const year = currentContentItem.year;
            const subdir = currentContentItem.subdir || '';
            
            url = `content-viewer.html?type=${type}&org=${path}&year=${year}`;
            if (subdir) {
                url += `&subdir=${subdir}`;
            }
            
            window.location.href = url;
        }

        closeContentModal();
    }

    /**
     * Handle continue button
     */
    function handleContinue() {
        closeContentModal();
        
        // Resume game
        if (typeof window.resumeGame === 'function') {
            window.resumeGame();
        }
    }

    /**
     * Close content modal
     */
    function closeContentModal() {
        const modal = document.getElementById('content-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        currentContentItem = null;
    }

    /**
     * Open archive modal
     */
    function openArchiveModal() {
        const modal = document.getElementById('archive-modal');
        if (!modal) return;

        // Pause game if playing
        if (window.FlappyGame && window.FlappyGame.getState() === 'playing') {
            window.FlappyGame.pause();
        }

        // Render archive content
        renderArchiveContent();

        // Show modal
        modal.style.display = 'flex';
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        console.log('Archive modal opened');
    }

    /**
     * Close archive modal
     */
    function closeArchiveModal() {
        const modal = document.getElementById('archive-modal');
        if (modal) {
            modal.style.display = 'none';
        }

        // Resume body scroll
        document.body.style.overflow = '';

        // Resume game if it was paused
        if (window.FlappyGame && window.FlappyGame.getState() === 'paused') {
            window.FlappyGame.resume();
        }

        console.log('Archive modal closed');
    }

    /**
     * Handle tab click
     */
    function handleTabClick(e) {
        const tab = e.target.dataset.tab;
        if (!tab) return;

        currentTab = tab;

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Reset filters
        const searchInput = document.getElementById('archive-search');
        const yearFilter = document.getElementById('year-filter');
        if (searchInput) searchInput.value = '';
        if (yearFilter) yearFilter.value = 'all';

        // Render content
        renderArchiveContent();
    }

    /**
     * Handle search input
     */
    function handleSearch(e) {
        renderArchiveContent();
    }

    /**
     * Handle year filter
     */
    function handleYearFilter(e) {
        renderArchiveContent();
    }

    /**
     * Render archive content based on current tab and filters
     */
    function renderArchiveContent() {
        const container = document.getElementById('archive-content');
        if (!container || !window.ContentData) return;

        const searchInput = document.getElementById('archive-search');
        const yearFilter = document.getElementById('year-filter');
        
        const searchQuery = searchInput ? searchInput.value : '';
        const yearValue = yearFilter ? yearFilter.value : 'all';

        // Get content based on filters
        let content;
        if (searchQuery) {
            content = window.ContentData.searchContent(searchQuery, currentTab);
        } else {
            const allContent = window.ContentData.getAllContent();
            content = allContent[currentTab] || [];
        }

        // Apply year filter
        if (yearValue !== 'all') {
            content = content.filter(item => item.year === yearValue);
        }

        // Render items
        container.innerHTML = '';

        if (content.length === 0) {
            container.innerHTML = `
                <div class="archive-empty">
                    <i class="fas fa-search"></i>
                    <p>No items found</p>
                </div>
            `;
            return;
        }

        content.forEach(item => {
            const card = createArchiveCard(item);
            container.appendChild(card);
        });
    }

    /**
     * Create archive card element
     */
    function createArchiveCard(item) {
        const card = document.createElement('div');
        card.className = 'archive-card';

        const title = item.displayName || item.title || item.name || item.organization;
        const icon = item.icon || 'fas fa-star';
        const year = item.year;

        // Get URL
        let url;
        if (item.type === 'publication' && item.url) {
            url = item.url;
        } else if (item.type === 'volunteering' && item.url) {
            url = item.url;
        } else if (item.type === 'television' && item.videoUrl) {
            url = item.videoUrl;
        } else {
            const subdir = item.subdir || '';
            url = `content-viewer.html?type=${item.type}&org=${item.path}&year=${year}`;
            if (subdir) {
                url += `&subdir=${subdir}`;
            }
        }

        const isExternal = url.startsWith('http');

        card.innerHTML = `
            <div class="archive-card-header">
                <i class="${icon}"></i>
                <span class="archive-year">${year}</span>
            </div>
            <h3 class="archive-card-title">${title}</h3>
            <p class="archive-card-description">${item.description}</p>
            <a href="${url}" class="archive-card-link" ${isExternal ? 'target="_blank"' : ''}>
                ${isExternal ? 'View External Link <i class="fas fa-external-link-alt"></i>' : 'View Details <i class="fas fa-arrow-right"></i>'}
            </a>
        `;

        return card;
    }

    /**
     * Handle keyboard events
     */
    function handleKeyDown(e) {
        // Close modals on Escape
        if (e.key === 'Escape') {
            const contentModal = document.getElementById('content-modal');
            const archiveModal = document.getElementById('archive-modal');

            if (contentModal && contentModal.style.display === 'flex') {
                handleContinue();
            } else if (archiveModal && archiveModal.style.display === 'flex') {
                closeArchiveModal();
            }
        }
    }

    /**
     * Debounce function for search
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions globally
    window.ModalSystem = {
        showContentModal: window.showContentModal,
        openArchiveModal,
        closeArchiveModal
    };

})();
