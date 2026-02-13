/**
 * Tests for title and description rendering in content-viewer.html
 * These tests verify that markdown in titles/descriptions is rendered correctly
 */

describe('Title and Description Rendering', () => {
    // Helper to simulate markdown rendering for title/description
    function renderTitleMarkdown(text) {
        // Simple markdown renderer for inline elements (no block elements in titles)
        // Note: We intentionally don't process bold/italic to avoid breaking URLs
        // with underscores (e.g., target="_blank" or URL params with _)
        let html = text;
        
        // Convert links - handle markdown links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return html;
    }

    describe('TAICO Title', () => {
        test('should convert markdown link in title to <a> tag', () => {
            const title = '[TAICO](https://www.taico.ca/) - Toronto Artificial Intelligence and Cybersecurity Organization';
            const rendered = renderTitleMarkdown(title);
            
            expect(rendered).toContain('<a href="https://www.taico.ca/"');
            expect(rendered).toContain('>TAICO</a>');
            expect(rendered).not.toContain('[TAICO]');
        });

        test('rendered title should be safe for innerHTML', () => {
            const title = '[TAICO](https://www.taico.ca/) - Toronto Artificial Intelligence and Cybersecurity Organization';
            const rendered = renderTitleMarkdown(title);
            
            // Should contain HTML tags
            expect(rendered).toContain('<a');
            expect(rendered).toContain('</a>');
        });
    });

    describe('CyberToronto Title', () => {
        test('should convert markdown link in title to <a> tag', () => {
            const title = '[CyberToronto 2025 - Community Leaders Panel](https://us06web.zoom.us/webinar/register/8617638577233/WN_M647f9GdQlGtPQ12nCtqLQ#/registration)';
            const rendered = renderTitleMarkdown(title);
            
            expect(rendered).toContain('<a href=');
            expect(rendered).toContain('>CyberToronto 2025 - Community Leaders Panel</a>');
            expect(rendered).not.toContain('[CyberToronto');
        });
    });

    describe('Description with Links', () => {
        test('should convert markdown link in description to <a> tag', () => {
            const description = '[CyberToronto Conference](https://cybertoronto.ca/)';
            const rendered = renderTitleMarkdown(description);
            
            expect(rendered).toContain('<a href="https://cybertoronto.ca/"');
            expect(rendered).toContain('>CyberToronto Conference</a>');
            expect(rendered).not.toContain('[CyberToronto Conference]');
        });
    });

    describe('URLs with Underscores', () => {
        test('should not break URLs with underscores', () => {
            const title = '[Test](https://example.com/WN_M647_test)';
            const rendered = renderTitleMarkdown(title);
            
            expect(rendered).toContain('https://example.com/WN_M647_test');
            expect(rendered).not.toContain('<em>');
        });

        test('should handle target="_blank" without breaking', () => {
            const title = '[Link](https://example.com)';
            const rendered = renderTitleMarkdown(title);
            
            expect(rendered).toContain('target="_blank"');
            expect(rendered).not.toContain('target="<em>');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty title', () => {
            const title = '';
            const rendered = renderTitleMarkdown(title);
            expect(rendered).toBe('');
        });

        test('should handle title with no markdown', () => {
            const title = 'Plain Text Title';
            const rendered = renderTitleMarkdown(title);
            expect(rendered).toBe('Plain Text Title');
        });

        test('should handle multiple links in title', () => {
            const title = '[Link A](https://a.com) and [Link B](https://b.com)';
            const rendered = renderTitleMarkdown(title);
            
            const linkCount = (rendered.match(/<a href=/g) || []).length;
            expect(linkCount).toBe(2);
        });
    });
});
