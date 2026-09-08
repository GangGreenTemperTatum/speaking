/**
 * @jest-environment jsdom
 */

const { renderMarkdown, stripLeadingTitle } = require('../docs/js/viewer-markdown.js');

describe('Content Viewer Markdown Rendering', () => {
    test('renders external links with opener isolation', () => {
        const html = renderMarkdown('[Click here](https://example.com)', '');
        expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">Click here</a>');
    });

    test('resolves local images against the archived record path', () => {
        const html = renderMarkdown('![Alt text](image.png)', 'conferences/test');
        expect(html).toContain('<img src="conferences/test/image.png" alt="Alt text"');
    });

    test('renders headings, emphasis, lists, and blockquotes', () => {
        const html = renderMarkdown('# Heading\n\n**bold** _italic_\n\n* item\n\n> quote', '');
        expect(html).toContain('<h2>Heading</h2>');
        expect(html).toContain('<strong>bold</strong>');
        expect(html).toContain('<em>italic</em>');
        expect(html).toContain('<li>item</li>');
        expect(html).toContain('<blockquote>');
        const fidelity = renderMarkdown('- dash item\n`inline code`\n> **Status:** [details](https://example.com)', '');
        expect(fidelity).toContain('<li>dash item</li>');
        expect(fidelity).toContain('<code>inline code</code>');
        expect(fidelity).toContain('<strong>Status:</strong>');
        expect(fidelity).toContain('>details</a>');
        const bracketed = renderMarkdown('[REDACTED] and [Here](https://example.com)', '');
        expect(bracketed).toContain('[REDACTED]');
        expect((bracketed.match(/<a href=/g) || []).length).toBe(1);
        expect(renderMarkdown('![Poster](./image.png)', 'conferences/test')).toContain('src="conferences/test/image.png"');
    });

    test('removes only the leading README title', () => {
        expect(stripLeadingTitle('# Title\n\n## Keep this section\nBody')).toBe('## Keep this section\nBody');
    });
});
