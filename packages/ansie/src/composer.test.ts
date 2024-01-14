import { describe, it, beforeEach, expect } from 'bun:test';
import { Composer } from './composer';

describe('Composer', () => {
    let composer: Composer;

    beforeEach(() => {
        composer = new Composer();
    });

    it('should be created', () => {
        expect(composer).toBeTruthy();
    });

    it('should add h1 heading', () => {
        composer.h1('Test Heading');
        expect(composer.render()).toBe('\n# Test Heading');
    });

    it('should add h2 heading', () => {
        composer.h2('Test Heading');
        expect(composer.render()).toBe('\n## Test Heading');
    });
});
