/**
 * @jest-environment node
 */

const contentData = require('../docs/js/content-data.js');

describe('Content Data Module', () => {
    test('should have all content types', () => {
        expect(contentData.conferences).toBeDefined();
        expect(contentData.podcasts).toBeDefined();
        expect(contentData.publications).toBeDefined();
        expect(contentData.volunteering).toBeDefined();
        expect(contentData.television).toBeDefined();
    });

    test('should have correct number of conferences', () => {
        expect(contentData.conferences.length).toBeGreaterThan(30);
        expect(contentData.conferences.length).toBeLessThan(50);
    });

    test('should have correct number of podcasts', () => {
        expect(contentData.podcasts.length).toBeGreaterThanOrEqual(5);
        expect(contentData.podcasts.length).toBeLessThan(15);
    });

    test('should have correct number of publications', () => {
        expect(contentData.publications.length).toBeGreaterThan(15);
        expect(contentData.publications.length).toBeLessThan(30);
    });

    test('should have correct number of volunteering entries', () => {
        expect(contentData.volunteering.length).toBeGreaterThanOrEqual(3);
        expect(contentData.volunteering.length).toBeLessThan(10);
    });

    test('should have television entries', () => {
        expect(contentData.television.length).toBeGreaterThanOrEqual(1);
    });

    test('each conference should have required fields', () => {
        contentData.conferences.forEach(conf => {
            expect(conf.id).toBeDefined();
            expect(conf.name).toBeDefined();
            expect(conf.year).toBeDefined();
            expect(conf.type).toBe('conference');
            expect(conf.description).toBeDefined();
        });
    });

    test('each podcast should have required fields', () => {
        contentData.podcasts.forEach(pod => {
            expect(pod.id).toBeDefined();
            expect(pod.name).toBeDefined();
            expect(pod.year).toBeDefined();
            expect(pod.type).toBe('podcast');
            expect(pod.description).toBeDefined();
        });
    });

    test('each publication should have required fields', () => {
        contentData.publications.forEach(pub => {
            expect(pub.id).toBeDefined();
            expect(pub.title).toBeDefined();
            expect(pub.year).toBeDefined();
            expect(pub.type).toBe('publication');
            expect(pub.description).toBeDefined();
        });
    });

    test('should have zones defined', () => {
        expect(contentData.zones).toBeDefined();
        expect(contentData.zones.conference).toBeDefined();
        expect(contentData.zones.podcast).toBeDefined();
        expect(contentData.zones.publication).toBeDefined();
        expect(contentData.zones.volunteering).toBeDefined();
        expect(contentData.zones.television).toBeDefined();
    });

    test('getContentById should return correct item', () => {
        const item = contentData.getContentById('apidays-2023');
        expect(item).toBeDefined();
        expect(item.id).toBe('apidays-2023');
    });

    test('getAllContent should return all content', () => {
        const all = contentData.getAllContent();
        expect(Object.keys(all)).toHaveLength(5);
        expect(all.conferences.length).toBe(contentData.conferences.length);
    });

    test('filterByYear should filter content correctly', () => {
        const filtered = contentData.filterByYear(contentData.conferences, '2025');
        expect(filtered.every(c => c.year === '2025')).toBe(true);
    });
});
