(() => {
    'use strict';

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

    function safeContentPath(value) {
        const path = String(value ?? '').trim();
        if (hasUnsafePath(path) || path.startsWith('/')) return '';
        return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
    }

    function resolveLocalURL(url, contentPath) {
        const raw = String(url || '').trim();
        if (/^(https?:\/\/|mailto:|tel:|#)/i.test(raw)) return safeURL(raw);
        const localPath = raw.replace(/^\.\//, '');
        if (!contentPath || localPath.startsWith('/') || hasUnsafePath(localPath)) return '#';
        return safeURL(`${contentPath}/${localPath}`);
    }

    function replaceMarkdownLinks(input, replacer) {
        let output = '';
        let cursor = 0;
        while (cursor < input.length) {
            const image = input.startsWith('![', cursor);
            const link = !image && input[cursor] === '[';
            if (!image && !link) {
                output += input[cursor++];
                continue;
            }

            const labelStart = cursor + (image ? 2 : 1);
            let marker = -1;
            let bracketDepth = 0;
            for (let index = labelStart; index < input.length; index += 1) {
                if (input[index] === '[') bracketDepth += 1;
                if (input[index] === ']') {
                    if (bracketDepth === 0 && input[index + 1] === '(') {
                        marker = index;
                        break;
                    }
                    if (bracketDepth > 0) bracketDepth -= 1;
                }
            }
            if (marker === -1) {
                output += input[cursor++];
                continue;
            }
            let destinationEnd = -1;
            const destinationStart = marker + 2;
            if (input[destinationStart] === '<') {
                const closingAngle = input.indexOf('>', destinationStart + 1);
                if (closingAngle !== -1 && input[closingAngle + 1] === ')') destinationEnd = closingAngle;
            } else {
                let depth = 0;
                for (let index = destinationStart; index < input.length; index += 1) {
                    if (input[index] === '(') depth += 1;
                    if (input[index] === ')') {
                        if (depth === 0) {
                            destinationEnd = index;
                            break;
                        }
                        depth -= 1;
                    }
                }
            }

            if (destinationEnd === -1) {
                output += input[cursor++];
                continue;
            }

            const label = input.slice(labelStart, marker);
            const destination = input.slice(destinationStart + (input[destinationStart] === '<' ? 1 : 0), destinationEnd);
            output += replacer({ image, label, destination });
            cursor = destinationEnd + 1 + (input[destinationStart] === '<' ? 1 : 0);
        }
        return output;
    }

    function renderMarkdown(source, contentPath = '') {
        const codeBlocks = [];
        const images = [];
        const links = [];
        const blockquotes = [];
        let sourceText = String(source || '').replace(/```(?:[\w-]+\n)?([\s\S]*?)```/g, (_, code) => {
            codeBlocks.push(`<pre><code>${escapeHTML(code.replace(/\n$/, ''))}</code></pre>`);
            return `@@CODE${codeBlocks.length - 1}@@`;
        });


        sourceText = sourceText.replace(/<img\b([^>]*)>/gi, (_, attributes) => {
            const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || '';
            const alt = attributes.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] || '';
            const resolved = resolveLocalURL(src, contentPath);
            images.push(`<img src="${escapeHTML(resolved)}" alt="${escapeHTML(alt)}" loading="lazy">`);
            return `@@IMAGE${images.length - 1}@@`;
        });

        sourceText = replaceMarkdownLinks(sourceText, ({ image, label, destination }) => {
            const resolved = resolveLocalURL(destination, contentPath);
            if (image) {
                images.push(`<img src="${escapeHTML(resolved)}" alt="${escapeHTML(label)}" loading="lazy">`);
                return `@@IMAGE${images.length - 1}@@`;
            }
            links.push(`<a href="${escapeHTML(resolved)}"${linkAttributes(resolved)}>${escapeHTML(label)}</a>`);
            return `@@LINK${links.length - 1}@@`;
        });
        sourceText = sourceText.replace(/^>\s?(.*$)/gim, (_, text) => {
            const quoted = escapeHTML(text)
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/__(.*?)__/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/_(.*?)_/g, '<em>$1</em>');
            blockquotes.push(`<blockquote><p>${quoted}</p></blockquote>`);
            return `@@QUOTE${blockquotes.length - 1}@@`;
        });

        let html = escapeHTML(sourceText);
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^\s*\*\*\*+$/gim, '<hr>');
        html = html.replace(/^\s*---+$/gim, '<hr>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');
        html = html.replace(/^\s*[-*] (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/(<br>\s*){3,}/g, '<br><br>');

        blockquotes.forEach((fragment, index) => {
            html = html.replace(`@@QUOTE${index}@@`, fragment);
        });
        images.forEach((fragment, index) => {
            html = html.replace(`@@IMAGE${index}@@`, fragment);
        });
        links.forEach((fragment, index) => {
            html = html.replace(`@@LINK${index}@@`, fragment);
        });
        codeBlocks.forEach((fragment, index) => {
            html = html.replace(`@@CODE${index}@@`, fragment);
        });
        return html;
    }

    function stripLeadingTitle(markdown) {
        return String(markdown || '').replace(/^#\s+[^\n]+\n+/, '');
    }

    const api = { escapeHTML, hasUnsafePath, safeURL, isExternal, linkAttributes, safeContentPath, resolveLocalURL, renderMarkdown, stripLeadingTitle };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (typeof window !== 'undefined') window.ViewerMarkdown = api;
})();
