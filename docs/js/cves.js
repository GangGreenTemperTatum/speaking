(() => {
    'use strict';

    const list = document.getElementById('cve-list');
    const count = document.getElementById('cve-count');
    const records = Array.isArray(window.ContentData?.cves) ? window.ContentData.cves.filter(record => record && typeof record === 'object') : [];
    const requestedId = new URLSearchParams(window.location.search).get('id');

    function escapeHTML(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function safeUrl(value) {
        const url = String(value ?? '');
        return /^(https:\/\/|cves\.html(?:[?#]|$))/i.test(url) ? url : '#';
    }

    function dateLabel(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return value || 'Not specified';
        return new Intl.DateTimeFormat('en', {
            dateStyle: 'medium',
            timeZone: 'UTC'
        }).format(new Date(`${value}T00:00:00Z`));
    }

    function timestampLabel(value) {
        if (!/^\d{4}-\d{2}-\d{2}T/.test(value ?? '')) return 'Not specified';
        const timestamp = new Date(value);
        if (Number.isNaN(timestamp.getTime())) return 'Not specified';
        return `${new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(timestamp)} UTC`;
    }

    function externalLink(reference) {
        const source = reference && typeof reference === 'object' ? reference : {};
        const url = safeUrl(source.url);
        const external = /^https:\/\//i.test(url);
        return `<li><a href="${escapeHTML(url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(source.label || 'Reference')} <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a></li>`;
    }

    function renderFacts(record) {
        const cvss = record.cvss || {};
        return `
            <div class="fact-grid">
                <div class="fact"><span class="meta-label">Affected</span><span class="fact-value">${escapeHTML(record.affectedVersion)}</span></div>
                <div class="fact"><span class="meta-label">Unaffected from</span><span class="fact-value">${escapeHTML(record.unaffectedFrom)}</span></div>
                <div class="fact"><span class="meta-label">Weakness</span><span class="fact-value">${escapeHTML(record.cwe)}</span></div>
                <div class="fact"><span class="meta-label">Reporter</span><span class="fact-value">${escapeHTML(record.researcher)}</span></div>
            </div>
            <div class="cve-section">
                <h3>CVSS 3.1</h3>
                <div class="cvss-score"><strong>${escapeHTML(cvss.score)}</strong><span>${escapeHTML(cvss.severity)}</span></div>
                <p class="vector">${escapeHTML(cvss.vector)}</p>
            </div>
        `;
    }
    function renderTimeline(record) {
        return `
            <div class="timeline" aria-label="Record timeline">
                <div class="timeline-item"><span class="meta-label">Reserved</span><strong>${escapeHTML(timestampLabel(record.dateReserved))}</strong></div>
                <div class="timeline-item"><span class="meta-label">Published</span><strong>${escapeHTML(timestampLabel(record.datePublished))}</strong></div>
                <div class="timeline-item"><span class="meta-label">Record updated</span><strong>${escapeHTML(timestampLabel(record.dateUpdated))}</strong></div>
            </div>
        `;
    }

    function renderRecord(record, index) {
        const cvss = record.cvss || {};
        const cisa = record.cisaEnrichment;
        const references = Array.isArray(record.references) ? record.references.map(externalLink).join('') : '';
        const reportLink = safeUrl(record.reportUrl);
        const reportTarget = /^https:\/\//i.test(reportLink) ? ' target="_blank" rel="noopener noreferrer"' : '';

        return `
            <article class="cve-entry" id="${escapeHTML(record.id)}" aria-labelledby="${escapeHTML(record.id)}-title">
                <header class="cve-entry-header">
                    <div>
                        <div class="cve-index">Case file ${String(index + 1).padStart(2, '0')}</div>
                        <h2 id="${escapeHTML(record.id)}-title">${escapeHTML(record.cveId)}</h2>
                        <p class="cve-entry-title">${escapeHTML(String(record.title ?? '').replace(`${String(record.cveId ?? '')} — `, ''))}</p>
                    </div>
                    <div class="cve-badges" aria-label="CVE status and severity">
                        <span class="badge badge-status">${escapeHTML(record.state)}</span>
                        <span class="badge badge-severity">${escapeHTML(cvss.severity)} / ${escapeHTML(cvss.score)}</span>
                    </div>
                </header>
                <div class="cve-entry-body">
                    <aside class="cve-rail" aria-label="CVE facts">
                        <div class="fact"><span class="meta-label">Vendor</span><span class="fact-value">${escapeHTML(record.organization)}</span></div>
                        <div class="fact"><span class="meta-label">Product</span><span class="fact-value">${escapeHTML(record.product)}</span></div>
                        <div class="fact"><span class="meta-label">Published</span><span class="fact-value">${escapeHTML(dateLabel(record.date))}</span></div>
                        <div class="fact"><span class="meta-label">CVE state</span><span class="fact-value">${escapeHTML(record.state)}</span></div>
                    </aside>
                    <div class="cve-article">
                        <section class="cve-section">
                            <p class="cve-lead">${escapeHTML(record.description)}.</p>
                        </section>
                        <section class="cve-section">
                            <h3>Report context</h3>
                            <p>Researcher-provided context from the HackerOne disclosure:</p>
                            <p class="evidence"><code>${escapeHTML(record.reportContext)}</code></p>
                            <p class="source-note"><a href="${escapeHTML(reportLink)}"${reportTarget}>Read the original HackerOne report <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
                        </section>
                        <section class="cve-section">
                            <h3>Scope and scoring</h3>
                            ${renderFacts(record)}
                        </section>
                        <section class="cve-section">
                            <h3>Record timeline</h3>
                            ${renderTimeline(record)}
                        </section>
                        ${cisa ? `<section class="cve-section"><h3>CISA ADP enrichment</h3><p class="enrichment"><strong>SSVC:</strong> Exploitation ${escapeHTML(cisa.exploitation)} · Automatable ${escapeHTML(cisa.automatable)} · Technical impact ${escapeHTML(cisa.technicalImpact)}. Recorded ${escapeHTML(timestampLabel(cisa.timestamp))}.</p></section>` : ''}
                        <section class="cve-section">
                            <h3>Authoritative references</h3>
                            <ul class="reference-list">${references}</ul>
                        </section>
                    </div>
                </div>
            </article>
        `;
    }

    function renderEmpty(message) {
        list.innerHTML = `<p class="empty-state">${escapeHTML(message)} <a href="cves.html">View all CVE records.</a></p>`;
    }

    if (!list || !count) return;

    if (!records.length) {
        count.textContent = 'No published records';
        renderEmpty('No CVE records are available yet.');
        list.setAttribute('aria-busy', 'false');
        return;
    }

    const selected = requestedId
        ? records.filter(record => record.id === requestedId || String(record.cveId ?? '').toLowerCase() === requestedId.toLowerCase())
        : records;

    count.textContent = `${records.length} published ${records.length === 1 ? 'record' : 'records'}`;

    if (!selected.length) {
        count.textContent = `${records.length} published ${records.length === 1 ? 'record' : 'records'}`;
        renderEmpty('That CVE record could not be found.');
    } else {
        list.innerHTML = selected.map(renderRecord).join('');
    }

    list.setAttribute('aria-busy', 'false');
})();
