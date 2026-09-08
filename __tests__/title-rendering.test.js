const { renderMarkdown } = require('../docs/js/viewer-markdown.js');

describe('Viewer title and description markdown behavior', () => {
    test('renders a linked heading safely', () => {
        const html = renderMarkdown('# [Talk title](https://example.com)', '');
        expect(html).toContain('<h2><a href="https://example.com" target="_blank" rel="noopener noreferrer">Talk title</a></h2>');
    });

    test('keeps URL underscores intact', () => {
        const html = renderMarkdown('[Profile](https://example.com/user_name)', '');
        expect(html).toContain('https://example.com/user_name');
        expect(html).toContain('>Profile</a>');
    });

    test('supports multiple links and empty content', () => {
        const html = renderMarkdown('[One](https://one.example) [Two](https://two.example)', '');
        expect((html.match(/<a href=/g) || []).length).toBe(2);
        expect(renderMarkdown('', '')).toBe('');
    });
});
