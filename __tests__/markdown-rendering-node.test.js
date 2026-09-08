const fs = require('fs');
const path = require('path');
const {
    renderMarkdown,
    stripLeadingTitle,
    safeURL
} = require('../docs/js/viewer-markdown.js');

describe('Shipped markdown renderer', () => {
    test('renders a real conference README through the production helper', () => {
        const readme = fs.readFileSync(
            path.join(__dirname, '../docs/conferences/cyber-toronto/2025/december/README.md'),
            'utf8'
        );
        const rendered = renderMarkdown(stripLeadingTitle(readme), 'conferences/cyber-toronto/2025/december');
        expect(rendered).toContain('<a href=');
        expect(rendered).toContain('<img src=');
        expect(rendered).toContain('rel="noopener noreferrer"');
        expect(rendered).not.toMatch(/\[.+\]\(.+\)/);
    });

    test('preserves blockquotes, indented lists, and code blocks', () => {
        const rendered = renderMarkdown('> A finding\n  * One item\n```js\nalert(1)\n```', '');
        expect(rendered).toContain('<blockquote>');
        expect(rendered).toContain('<li>One item</li>');
        expect(rendered).toContain('<pre><code>alert(1)</code></pre>');
    });

    test('supports local and nested-parenthesis links', () => {
        const rendered = renderMarkdown(
            '[Archive](<folder/file (saved).html>) ![Poster](image (1).png)',
            'conferences/example'
        );
        expect(rendered).toContain('conferences/example/folder/file (saved).html');
        expect(rendered).toContain('conferences/example/image (1).png');
    });

    test('escapes raw HTML and blocks unsafe URL schemes', () => {
        const rendered = renderMarkdown('<script>alert(1)</script> [bad](javascript:alert(1)) [host](//attacker.example)', 'docs/example');
        expect(rendered).toContain('&lt;script&gt;');
        expect(rendered).not.toContain('<script>');
        expect(rendered).toContain('href="#"');
        expect(safeURL('javascript:alert(1)')).toBe('#');
        expect(safeURL('//attacker.example')).toBe('#');
    });
});
