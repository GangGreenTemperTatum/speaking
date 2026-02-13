/**
 * @jest-environment jsdom
 */

describe('Content Viewer Markdown Rendering', () => {
    // Mock the renderMarkdown function logic from content-viewer.html
    function renderMarkdown(text, contentPath) {
        if (!contentPath) contentPath = '';
        
        let html = text;
        
        // Handle code blocks first (preserve them)
        const codeBlocks = [];
        html = html.replace(/```[\s\S]*?```/g, (match) => {
            codeBlocks.push(match);
            return `<!--CODE_BLOCK_${codeBlocks.length - 1}-->`;
        });
        
        // Process markdown images: ![alt](url) - convert to placeholders first
        const imagePlaceholders = [];
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            if (!src.startsWith('http') && !src.startsWith('//')) {
                src = `${contentPath}/${src}`;
            }
            const placeholder = `<!--IMAGE_${imagePlaceholders.length}-->`;
            imagePlaceholders.push(`<img src="${src}" alt="${alt}">`);
            return placeholder;
        });
        
        // Convert links - handle markdown links [text](url) BEFORE headers
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Convert headers (after links so header links work)
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Convert bold and italic
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Convert unordered lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // Convert blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        
        // Restore image placeholders
        imagePlaceholders.forEach((imgHtml, index) => {
            html = html.replace(`<!--IMAGE_${index}-->`, imgHtml);
        });
        
        // Restore code blocks
        codeBlocks.forEach((block, index) => {
            html = html.replace(`<!--CODE_BLOCK_${index}-->`, '<pre><code>code</code></pre>');
        });
        
        return html;
    }

    test('should render markdown links correctly', () => {
        const markdown = '[Click here](https://example.com)';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">Click here</a>');
    });

    test('should render markdown images correctly', () => {
        const markdown = '![Alt text](image.png)';
        const contentPath = 'conferences/test';
        const html = renderMarkdown(markdown, contentPath);
        expect(html).toContain('<img src="conferences/test/image.png" alt="Alt text">');
    });

    test('should render absolute image URLs unchanged', () => {
        const markdown = '![Alt text](https://example.com/image.png)';
        const html = renderMarkdown(markdown, 'conferences/test');
        expect(html).toContain('<img src="https://example.com/image.png" alt="Alt text">');
    });

    test('should render headers correctly', () => {
        const markdown = '# Header 1\n## Header 2\n### Header 3';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<h1>Header 1</h1>');
        expect(html).toContain('<h2>Header 2</h2>');
        expect(html).toContain('<h3>Header 3</h3>');
    });

    test('should render bold text correctly', () => {
        const markdown = 'This is **bold** text';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<strong>bold</strong>');
    });

    test('should render italic text correctly', () => {
        const markdown = 'This is *italic* text';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<em>italic</em>');
    });

    test('should render unordered lists correctly', () => {
        const markdown = '* Item 1\n* Item 2\n* Item 3';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<li>Item 1</li>');
        expect(html).toContain('<li>Item 2</li>');
        expect(html).toContain('<li>Item 3</li>');
        expect(html).toContain('<ul>');
    });

    test('should render blockquotes correctly', () => {
        const markdown = '> This is a quote';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<blockquote>This is a quote</blockquote>');
    });

    test('should handle links in headers correctly', () => {
        const markdown = '# [Title](https://example.com)';
        const html = renderMarkdown(markdown);
        expect(html).toContain('<h1><a href="https://example.com" target="_blank" rel="noopener noreferrer">Title</a></h1>');
    });

    test('should handle CyberToronto content with header links', () => {
        const markdown = `# [CyberToronto 2025 - Community Leaders Panel](https://us06web.zoom.us/webinar/register/8617638577233/WN_M647f9GdQlGtPQ12nCtqLQ#/registration)
## [CyberToronto Conference](https://cybertoronto.ca/)

- **Event:** CyberToronto 2025
- 📝 **Event Registration:** [Register Here](https://us06web.zoom.us/webinar/register/8617638577233/WN_M647f9GdQlGtPQ12nCtqLQ#/registration)`;

        const contentPath = 'conferences/cyber-toronto/2025/december';
        const html = renderMarkdown(markdown, contentPath);
        
        expect(html).toContain('<h1>');
        expect(html).toContain('<a href="https://us06web.zoom.us/webinar/register/8617638577233/WN_M647f9GdQlGtPQ12nCtqLQ#/registration" target="_blank" rel="noopener noreferrer">CyberToronto 2025 - Community Leaders Panel</a>');
        expect(html).toContain('<h2><a href="https://cybertoronto.ca/" target="_blank" rel="noopener noreferrer">CyberToronto Conference</a></h2>');
        expect(html).toContain('<strong>Event:</strong>');
        expect(html).toContain('<a href="https://us06web.zoom.us/webinar/register/8617638577233/WN_M647f9GdQlGtPQ12nCtqLQ#/registration" target="_blank" rel="noopener noreferrer">Register Here</a>');
    });

    test('should handle Boring AppSec Podcast content', () => {
        const markdown = `# [The Boring AppSec Podcast](https://open.spotify.com/show/podcast-show-url)
## The Future of Autonomous Red Teaming

- **Episode:** The Future of Autonomous Red Teaming with Ads Dawson
- 🎧 **Spotify Episode** [Listen](https://open.spotify.com/episode/1GHef4viw4wdeEQHQy8MhQ)`;

        const contentPath = 'podcasts/the_boring_appsec_podcast';
        const html = renderMarkdown(markdown, contentPath);
        
        expect(html).toContain('<h1>');
        expect(html).toContain('<a href="https://open.spotify.com/show/podcast-show-url" target="_blank" rel="noopener noreferrer">The Boring AppSec Podcast</a>');
        expect(html).toContain('<h2>The Future of Autonomous Red Teaming</h2>');
        expect(html).toContain('<strong>Episode:</strong>');
        expect(html).toContain('<a href="https://open.spotify.com/episode/1GHef4viw4wdeEQHQy8MhQ" target="_blank" rel="noopener noreferrer">Listen</a>');
    });
});
