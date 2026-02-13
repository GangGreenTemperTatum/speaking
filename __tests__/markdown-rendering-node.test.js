/**
 * Node.js based tests for markdown rendering
 * These tests validate the renderMarkdown logic matches actual browser behavior
 */

const fs = require('fs');
const path = require('path');

// Copy of the renderMarkdown function from content-viewer.html
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
        // Make relative paths absolute
        if (!src.startsWith('http') && !src.startsWith('//')) {
            src = `${contentPath}/${src}`;
        }
        const placeholder = `<!--IMAGE_${imagePlaceholders.length}-->`;
        imagePlaceholders.push(`<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:20px 0;box-shadow:0 4px 12px rgba(0,0,0,0.1);">`);
        return placeholder;
    });
    
    // Process existing HTML img tags - fix relative paths
    html = html.replace(/<img([^>]*)src=["']([^"']+)["']([^>]*)>/gi, (match, before, src, after) => {
        if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
            src = `${contentPath}/${src}`;
        }
        return `<img${before}src="${src}"${after} style="max-width:100%;height:auto;border-radius:8px;margin:20px 0;box-shadow:0 4px 12px rgba(0,0,0,0.1);">`;
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
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Convert unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Convert ordered lists
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');
    
    // Convert blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');
    
    // Convert horizontal rules
    html = html.replace(/^---+$/gim, '<hr>');
    html = html.replace(/^___+$/gim, '<hr>');
    html = html.replace(/^\*\*\*+$/gim, '<hr>');
    
    // Restore image placeholders
    imagePlaceholders.forEach((imgHtml, index) => {
        html = html.replace(`<!--IMAGE_${index}-->`, imgHtml);
    });
    
    // Restore code blocks
    codeBlocks.forEach((block, index) => {
        const code = block.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
        const escapeHtml = (text) => {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, (m) => map[m]);
        };
        html = html.replace(`<!--CODE_BLOCK_${index}-->`, `<pre style="background:#f5f5f5;padding:15px;border-radius:8px;overflow-x:auto;"><code>${escapeHtml(code)}</code></pre>`);
    });
    
    // Convert remaining newlines to <br>
    html = html.replace(/\n/g, '<br>');
    
    // Clean up excessive <br> tags
    html = html.replace(/(<br>\s*){3,}/g, '<br><br>');
    
    return html;
}

describe('Markdown Rendering Tests', () => {
    describe('CyberToronto December 2025 README', () => {
        let readmeContent;
        let parsedBody;
        let rendered;

        beforeAll(() => {
            const readmePath = path.join(__dirname, '../docs/conferences/cyber-toronto/2025/december/README.md');
            readmeContent = fs.readFileSync(readmePath, 'utf8');
            
            // Parse like content-viewer.html does
            const lines = readmeContent.split('\n');
            let body = '';
            
            lines.forEach((line, index) => {
                if (index === 0 && line.startsWith('#')) {
                    // Skip title
                } else if (index === 1 && line.startsWith('##')) {
                    // Skip description
                } else {
                    body += line + '\n';
                }
            });
            
            parsedBody = body;
            rendered = renderMarkdown(body, 'conferences/cyber-toronto/2025/december');
        });

        test('should extract body content correctly', () => {
            expect(parsedBody.length).toBeGreaterThan(0);
            expect(parsedBody).toContain('Register Here');
            expect(parsedBody).toContain('LinkedIn Post');
        });

        test('should convert markdown links to <a> tags', () => {
            expect(rendered).toContain('<a href=');
            expect(rendered).not.toContain('[Register Here](');
            expect(rendered).not.toContain('[LinkedIn Post](');
        });

        test('should have correct number of links', () => {
            const linkCount = (rendered.match(/<a href=/g) || []).length;
            expect(linkCount).toBeGreaterThanOrEqual(2); // At least "Register Here" and "LinkedIn Post"
        });

        test('should convert markdown images to <img> tags', () => {
            expect(rendered).toContain('<img src=');
            expect(rendered).not.toContain('![Community-Panel.jpeg]');
        });

        test('should have at least one image', () => {
            const imgCount = (rendered.match(/<img src=/g) || []).length;
            expect(imgCount).toBeGreaterThanOrEqual(1);
        });

        test('should use full URL for images that are already full URLs', () => {
            expect(rendered).toContain('https://raw.githubusercontent.com');
        });

        test('links should have target="_blank"', () => {
            expect(rendered).toContain('target="_blank"');
        });

        test('links should have rel="noopener noreferrer"', () => {
            expect(rendered).toContain('rel="noopener noreferrer"');
        });

        test('should convert **bold** to <strong> tags', () => {
            expect(rendered).toContain('<strong>Event:</strong>');
            expect(rendered).toContain('<strong>Date:</strong>');
        });

        test('should convert _italic_ to <em> tags', () => {
            expect(rendered).toContain('<em>');
        });

        test('should NOT contain raw markdown syntax', () => {
            // Should not have markdown link syntax
            expect(rendered).not.toMatch(/\[.+\]\(http.+\)/);
            // Should not have markdown image syntax
            expect(rendered).not.toMatch(/!\[.+\]\(.+\)/);
        });
    });

    describe('TAICO February 2026 README', () => {
        let readmeContent;
        let rendered;

        beforeAll(() => {
            const readmePath = path.join(__dirname, '../docs/conferences/taico/2026/february/README.md');
            
            if (!fs.existsSync(readmePath)) {
                console.warn(`README not found at ${readmePath}, skipping tests`);
                return;
            }
            
            readmeContent = fs.readFileSync(readmePath, 'utf8');
            
            // Parse like content-viewer.html does
            const lines = readmeContent.split('\n');
            let body = '';
            
            lines.forEach((line, index) => {
                if (index === 0 && line.startsWith('#')) {
                    // Skip title
                } else if (index === 1 && line.startsWith('##')) {
                    // Skip description
                } else {
                    body += line + '\n';
                }
            });
            
            rendered = renderMarkdown(body, 'conferences/taico/2026/february');
        });

        test('should convert markdown images to <img> tags', () => {
            if (!readmeContent) {
                console.warn('Skipping test - README not found');
                return;
            }
            
            if (readmeContent.includes('![')) {
                expect(rendered).toContain('<img src=');
                expect(rendered).not.toMatch(/!\[.+\]\(.+\)/);
            }
        });

        test('should convert HTML img tags and fix relative paths', () => {
            if (!readmeContent) {
                console.warn('Skipping test - README not found');
                return;
            }
            
            if (readmeContent.includes('<img')) {
                expect(rendered).toContain('<img');
                // Relative paths should be prefixed with content path
                if (readmeContent.match(/<img[^>]*src=["'](?!http)[^"']+["']/)) {
                    expect(rendered).toContain('conferences/taico/2026/february');
                }
            }
        });
    });

    describe('Basic Markdown Syntax', () => {
        test('should convert simple link', () => {
            const input = '[Click Here](https://example.com)';
            const output = renderMarkdown(input, '');
            expect(output).toContain('<a href="https://example.com"');
            expect(output).toContain('>Click Here</a>');
        });

        test('should convert multiple links', () => {
            const input = 'Visit [Site A](https://a.com) and [Site B](https://b.com)';
            const output = renderMarkdown(input, '');
            const linkCount = (output.match(/<a href=/g) || []).length;
            expect(linkCount).toBe(2);
        });

        test('should convert simple image', () => {
            const input = '![Alt text](image.png)';
            const output = renderMarkdown(input, 'path/to/content');
            expect(output).toContain('<img src="path/to/content/image.png"');
            expect(output).toContain('alt="Alt text"');
        });

        test('should convert header with link', () => {
            const input = '# [Title Link](https://example.com)';
            const output = renderMarkdown(input, '');
            expect(output).toContain('<h1>');
            expect(output).toContain('<a href="https://example.com"');
            expect(output).toContain('>Title Link</a>');
        });

        test('should convert bold text', () => {
            const input = '**Bold text**';
            const output = renderMarkdown(input, '');
            expect(output).toContain('<strong>Bold text</strong>');
        });

        test('should convert italic text', () => {
            const input = '_Italic text_';
            const output = renderMarkdown(input, '');
            expect(output).toContain('<em>Italic text</em>');
        });
    });
});
