(() => {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || '';
    const requestedId = params.get('id') || '';
    const requestedOrg = params.get('org') || '';
    const requestedYear = params.get('year') || '';
    const requestedSubdir = params.get('subdir') || '';
    const data = window.ContentData || {};
    const typeCollections = {
        conference: 'conferences',
        podcast: 'podcasts',
        publication: 'publications',
        volunteering: 'volunteering',
        television: 'television',
        achievement: 'achievements'
    };
    const typeNames = {
        conference: 'Conference',
        podcast: 'Podcast',
        publication: 'Publication',
        volunteering: 'Volunteering',
        television: 'Television',
        achievement: 'Achievement'
    };
    const titleEl = document.getElementById('view-title');
    const subtitleEl = document.getElementById('view-subtitle');
    const eyebrowEl = document.getElementById('viewer-eyebrow');
    const metaEl = document.getElementById('viewer-meta');
    const railEl = document.getElementById('content-rail');
    const bodyEl = document.getElementById('content-body');
    const entryEl = document.getElementById('content-entry');
    const resourcesEl = document.getElementById('files-list');
    const resourcesContainer = document.getElementById('files-container');
    const footerYear = document.getElementById('footer-year');
    const markdown = window.ViewerMarkdown;

    function escapeHTML(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function hasUnsafePath(value) {
        const path = String(value ?? '');
        return !path || path.startsWith('//') || /[\u0000-\u001f\u007f\\]/.test(path) || path.split('/').some(segment => segment === '.' || segment === '..');
    }

    function safeContentPath(value) {
        const path = String(value ?? '').trim();
        if (hasUnsafePath(path) || path.startsWith('/')) return '';
        return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
    }

    function safeURL(value) {
        const url = String(value ?? '').trim();
        if (!url || /^(javascript|data|vbscript):/i.test(url) || hasUnsafePath(url)) return '#';
        if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;
        if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?') || !url.includes(':')) return url;
        return '#';
    }

    function isExternal(url) {
        return /^https?:\/\//i.test(url);
    }

    function linkAttributes(url) {
        return isExternal(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    }

    function humanize(value) {
        return String(value || 'Content')
            .split('/')
            .pop()
            .replace(/[_-]+/g, ' ')
            .replace(/\b\w/g, character => character.toUpperCase());
    }

    function formatDate(value) {
        const raw = String(value || '');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw || 'Not specified';
        return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' })
            .format(new Date(`${raw}T00:00:00Z`));
    }

    function getCollection() {
        const collectionName = typeCollections[type];
        return Array.isArray(data[collectionName]) ? data[collectionName] : [];
    }

    function getRecord() {
        const collection = getCollection();
        if (requestedId) {
            return collection.find(item => item && item.id === requestedId) || null;
        }
        return collection.find(item => {
            if (!item) return false;
            const sameOrg = !requestedOrg || item.path === requestedOrg || item.organization === requestedOrg;
            const sameYear = !requestedYear || item.year === requestedYear;
            const sameSubdir = !requestedSubdir || item.subdir === requestedSubdir;
            return sameOrg && sameYear && sameSubdir;
        }) || null;
    }

    function getTitle(record) {
        return record?.displayName || record?.title || record?.name || record?.organization || humanize(requestedOrg);
    }

    function getDescription(record) {
        return record?.description || `${typeNames[type] || 'Portfolio'} record from ${record?.year || requestedYear || 'the portfolio'}.`;
    }

    function getContentBase(record) {
        if (record?.localPath) return safeContentPath(record.localPath);
        const org = record?.path || requestedOrg;
        const year = record?.year || requestedYear;
        const subdir = record?.subdir || requestedSubdir;
        if (!org) return '';
        if (type === 'conference') return safeContentPath(['conferences', org, year, subdir].filter(Boolean).join('/'));
        if (type === 'podcast') return safeContentPath(['podcasts', org].filter(Boolean).join('/'));
        if (type === 'television') return safeContentPath(['television', org].filter(Boolean).join('/'));
        return '';
    }

    function getReadmeCandidates(record) {
        const base = getContentBase(record);
        const candidates = [];
        if (base) candidates.push(`${base}/README.md`);
        if (type === 'conference' && requestedOrg) {
            const nested = safeContentPath(['conferences', requestedOrg, requestedYear, requestedSubdir].filter(Boolean).join('/'));
            const yearRoot = safeContentPath(['conferences', requestedOrg, requestedYear].filter(Boolean).join('/'));
            const orgRoot = safeContentPath(['conferences', requestedOrg].filter(Boolean).join('/'));
            if (nested) candidates.push(`${nested}/README.md`);
            if (yearRoot) candidates.push(`${yearRoot}/README.md`);
            if (orgRoot) candidates.push(`${orgRoot}/README.md`);
        }
        return [...new Set(candidates)];
    }


    async function fetchReadme(record) {
        for (const path of getReadmeCandidates(record)) {
            try {
                const response = await fetch(path, { cache: 'no-cache' });
                if (response.ok) {
                    return { markdown: await response.text(), path: path.replace(/\/README\.md$/, '') };
                }
            } catch (error) {
                // Continue to the next known path and fall back to record metadata.
            }
        }
        return null;
    }

    function renderFact(label, value) {
        if (!value) return '';
        return `<div class="fact"><span class="meta-label">${escapeHTML(label)}</span><span class="fact-value">${escapeHTML(value)}</span></div>`;
    }

    function renderHeader(record) {
        const title = getTitle(record);
        const description = getDescription(record);
        const typeLabel = typeNames[type] || 'Portfolio';
        const publisher = record?.publisher || record?.organization || record?.sector;
        const date = record?.date || record?.dateStart;
        const year = record?.year || requestedYear;

        eyebrowEl.textContent = `${typeLabel} / case file`;
        titleEl.textContent = title;
        subtitleEl.textContent = description;
        metaEl.innerHTML = [typeLabel, year, publisher, date ? formatDate(date) : '']
            .filter(Boolean)
            .map(value => `<span>${escapeHTML(value)}</span>`)
            .join('');
        document.title = `${title} | ${typeLabel} | Ads Dawson`;

        railEl.innerHTML = [
            renderFact('Record type', typeLabel),
            renderFact('Year', year),
            renderFact('Publisher / organization', publisher),
            renderFact('Date', date ? formatDate(date) : ''),
            renderFact('Sector', record?.sector)
        ].join('');
    }

    function renderSummary(record) {
        return `<section class="record-summary"><p>${escapeHTML(getDescription(record))}</p></section>`;
    }


    function renderFallback(record) {
        return `${renderSummary(record)}<h2>About this entry</h2><p class="source-note">The supporting archive for this record is not available in this path. Use the source links below for the original material.</p>`;
    }

    function resourceLink(label, url, icon) {
        const safe = safeURL(url);
        if (safe === '#') return '';
        return `<a class="resource-link" href="${escapeHTML(safe)}"${linkAttributes(safe)}><i class="fas ${icon}" aria-hidden="true"></i><span>${escapeHTML(label)}</span></a>`;
    }

    function renderResources(record, contentPath) {
        const resources = [];
        if (record?.url) resources.push(resourceLink(type === 'publication' ? 'Read the original publication' : 'Open source link', record.url, 'fa-arrow-up-right-from-square'));
        if (record?.videoUrl) resources.push(resourceLink('Watch video', record.videoUrl, 'fa-play'));
        if (record?.audioUrl) resources.push(resourceLink('Listen to audio', record.audioUrl, 'fa-volume-high'));
        if (contentPath) {
            resources.push(resourceLink('Browse archived materials', `https://github.com/GangGreenTemperTatum/speaking/tree/main/docs/${contentPath}`, 'fa-folder-open'));
        }
        const visible = resources.filter(Boolean).join('');
        resourcesContainer.innerHTML = visible;
        resourcesEl.hidden = !visible;
    }

    function showError(message) {
        titleEl.textContent = 'Case file unavailable';
        subtitleEl.textContent = 'The requested portfolio record could not be loaded.';
        metaEl.innerHTML = '';
        railEl.innerHTML = '';
        bodyEl.innerHTML = `<div class="content-error"><h2>Content not found</h2><p>${escapeHTML(message)}</p><a href="index.html">Return to the portfolio</a></div>`;
        resourcesEl.hidden = true;
    }

    async function load() {
        footerYear.textContent = new Date().getFullYear();
        if (!type) {
            showError('This link does not include a content type.');
            entryEl.setAttribute('aria-busy', 'false');
            return;
        }

        const record = getRecord();
        if (!record) {
            showError('The requested portfolio record was not found.');
            entryEl.setAttribute('aria-busy', 'false');
            return;
        }
        const fallbackRecord = record || { title: humanize(requestedOrg), description: '', year: requestedYear, path: requestedOrg, subdir: requestedSubdir };
        renderHeader(fallbackRecord);
        const readme = await fetchReadme(record || fallbackRecord);
        const contentPath = readme?.path || getContentBase(record || fallbackRecord);
        bodyEl.innerHTML = readme
            ? `${renderSummary(record || fallbackRecord)}${markdown.renderMarkdown(markdown.stripLeadingTitle(readme.markdown), contentPath)}`
            : renderFallback(record || fallbackRecord);
        renderResources(record || fallbackRecord, contentPath);
        entryEl.setAttribute('aria-busy', 'false');
    }

    load().catch(error => {
        showError('The case file could not be rendered. Please return to the portfolio and try again.');
        entryEl.setAttribute('aria-busy', 'false');
    });
})();
