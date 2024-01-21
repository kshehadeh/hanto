import { describe, expect, it } from 'bun:test';
import { _testableFunctions } from './text-handlers';
import type { CompilerFormat } from '../base';
import { ValidTags } from '../types';


describe('buildStart', () => {
    it('should return the ANSI escape code for setting spacing and text attributes in ANSI format', () => {
        const node = { node: ValidTags.h1, margin: 2, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\n\n  \x1b[34m';
        expect(_testableFunctions.buildStart(node, [], format, {isBlock: false})).toBe(
            expectedOutput,
        );
    });

    it('should return the markup tag with attributes for setting spacing and text attributes in markup format', () => {
        const node = { node: ValidTags.h1, margin: 2, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '<h1 margin="2" fg="blue">';
        expect(_testableFunctions.buildStart(node, [], format, {isBlock: false})).toBe(
            expectedOutput,
        );
    });

    it('should return the ANSI escape code for setting text attributes in ANSI format', () => {
        const node = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[34m';
        expect(_testableFunctions.buildStart(node, [], format, {isBlock: false})).toBe(
            expectedOutput,
        );
    });

    it('should return the markup tag with attributes for setting text attributes in markup format', () => {
        const node = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '<h1 fg="blue">';
        expect(_testableFunctions.buildStart(node, [], format, {isBlock: false})).toBe(
            expectedOutput,
        );
    });

    it('should return an empty string for unsupported format', () => {
        const node = { node: ValidTags.h1, margin: 2, fg: 'blue' as const };
        const format = 'unsupported';        
        expect(
            () => _testableFunctions.buildStart(node, [], format as CompilerFormat, {isBlock: false}),
        ).toThrow();
    });
});

describe('buildEnd', () => {
    it('should return the ANSI escape code for ending text and spacing attributes in ANSI format', () => {
        const node = { node: ValidTags.h1, margin: 2, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[39m  \n\n';
        expect(_testableFunctions.buildEnd(node, [], format, {isBlock: false})).toBe(expectedOutput);
    });

    it('should return the closing markup tag for ending text and spacing attributes in markup format', () => {
        const node = { node: ValidTags.h1, margin: 2, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '</h1>';
        expect(_testableFunctions.buildEnd(node, [], format, {isBlock: false})).toBe(expectedOutput);
    });

    it('should return the ANSI escape code for ending text attributes in ANSI format', () => {
        const node = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[39m';
        expect(_testableFunctions.buildEnd(node, [], format, {isBlock: false})).toBe(expectedOutput);
    });

    it('should return the closing markup tag for ending text attributes in markup format', () => {
        const node = { node: ValidTags.h1, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '</h1>';
        expect(_testableFunctions.buildEnd(node, [], format, {isBlock: false})).toBe(expectedOutput);
    });
});
