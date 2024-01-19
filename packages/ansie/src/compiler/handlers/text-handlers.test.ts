import { describe, expect, it } from 'bun:test';
import { _testableFunctions } from './text-handlers';
import type { CompilerFormat } from '../base';

describe('renderTextAttributesEnd', () => {
    it('should return the ANSI escape code for resetting a color attribute', () => {
        const node = { node: 'h1' as const, fg: 'blue' as const, content: [] };
        const format = 'ansi';
        const expectedOutput = '\x1b[39m';
        expect(_testableFunctions.renderTextAttributesEnd(node, format)).toBe(
            expectedOutput,
        );
    });

    it('should return the ANSIE escape codes for multiple attributes', () => {
        const attributes = {
            node: 'h1' as const,
            fg: 'blue' as const,
            bg: 'red' as const,
            bold: true,
        };
        const format = 'ansi';
        const expectedOutput = '\x1b[39;49;22m';
        expect(
            _testableFunctions.renderTextAttributesEnd(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return an empty string for text attributes in markup format', () => {
        const attributes = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '';
        expect(
            _testableFunctions.renderTextAttributesEnd(attributes, format),
        ).toBe(expectedOutput);
    });
});

describe('renderTextAttributesStart', () => {
    it('should return the ANSI escape code for setting a color attribute', () => {
        const attributes = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[34m';
        expect(
            _testableFunctions.renderTextAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return the markup attribute for setting a color attribute', () => {
        const attributes = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = 'fg="blue"';
        expect(
            _testableFunctions.renderTextAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return an empty string for text attributes in markup format', () => {
        const attributes = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = 'fg="blue"';
        expect(
            _testableFunctions.renderTextAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return the proper ansi string for multiple attributes', () => {
        const attributes = {
            node: 'h1' as const,
            fg: 'blue' as const,
            bg: 'red' as const,
            bold: true,
        };
        const format = 'ansi';
        const expectedOutput = '\x1b[34;41;1m';
        expect(
            _testableFunctions.renderTextAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });
});

describe('renderSpaceAttributesStart', () => {
    it('should return the ANSI escape code for setting spacing attributes', () => {
        const attributes = { node: 'h1' as const, margin: 2 };
        const format = 'ansi';
        const expectedOutput = '\n\n  ';
        expect(
            _testableFunctions.renderSpaceAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return the ANSI codes for specific marginXXX attributes over margin when there is contention', () => {
        const attributes = {
            node: 'h1' as const,
            margin: 2,
            marginLeft: 1,
            marginRight: 3,
            marginTop: 4,
            marginBottom: 5,
        };
        const format = 'ansi';
        const expectedOutput = '\n\n\n\n ';
        expect(
            _testableFunctions.renderSpaceAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return the markup attributes for setting spacing attributes', () => {
        const attributes = { node: 'h1' as const, margin: 2 };
        const format = 'markup';
        const expectedOutput = 'margin="2"';
        expect(
            _testableFunctions.renderSpaceAttributesStart(attributes, format),
        ).toBe(expectedOutput);
    });
});

describe('renderSpaceAttributesEnd', () => {
    it('should return the ANSI escape code for setting spacing attributes', () => {
        const attributes = { node: 'h1' as const, margin: 2 };
        const format = 'ansi';
        const expectedOutput = '  \n\n';
        expect(
            _testableFunctions.renderSpaceAttributesEnd(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return the ANSI codes for specific marginXXX attributes over margin when there is contention', () => {
        const attributes = {
            node: 'h1' as const,
            margin: 2,
            marginLeft: 1,
            marginRight: 3,
            marginTop: 4,
            marginBottom: 5,
        };
        const format = 'ansi';
        const expectedOutput = '   \n\n\n\n\n';
        expect(
            _testableFunctions.renderSpaceAttributesEnd(attributes, format),
        ).toBe(expectedOutput);
    });

    it('should return the markup attributes for setting spacing attributes', () => {
        const attributes = { node: 'h1' as const, margin: 2 };
        const format = 'markup';
        const expectedOutput = '';
        expect(
            _testableFunctions.renderSpaceAttributesEnd(attributes, format),
        ).toBe(expectedOutput);
    });
});

describe('buildStart', () => {
    it('should return the ANSI escape code for setting spacing and text attributes in ANSI format', () => {
        const node = { node: 'h1' as const, margin: 2, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\n\n  \x1b[34m';
        expect(_testableFunctions.buildStart(node, [], format)).toBe(
            expectedOutput,
        );
    });

    it('should return the markup tag with attributes for setting spacing and text attributes in markup format', () => {
        const node = { node: 'h1' as const, margin: 2, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '<h1 margin="2" fg="blue">';
        expect(_testableFunctions.buildStart(node, [], format)).toBe(
            expectedOutput,
        );
    });

    it('should return the ANSI escape code for setting text attributes in ANSI format', () => {
        const node = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[34m';
        expect(_testableFunctions.buildStart(node, [], format)).toBe(
            expectedOutput,
        );
    });

    it('should return the markup tag with attributes for setting text attributes in markup format', () => {
        const node = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '<h1 fg="blue">';
        expect(_testableFunctions.buildStart(node, [], format)).toBe(
            expectedOutput,
        );
    });

    it('should return an empty string for unsupported format', () => {
        const node = { node: 'h1' as const, margin: 2, fg: 'blue' as const };
        const format = 'unsupported';        
        expect(
            () => _testableFunctions.buildStart(node, [], format as CompilerFormat),
        ).toThrow();
    });
});

describe('buildEnd', () => {
    it('should return the ANSI escape code for ending text and spacing attributes in ANSI format', () => {
        const node = { node: 'h1' as const, margin: 2, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[39m  \n\n';
        expect(_testableFunctions.buildEnd(node, [], format)).toBe(expectedOutput);
    });

    it('should return the closing markup tag for ending text and spacing attributes in markup format', () => {
        const node = { node: 'h1' as const, margin: 2, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '</h1>';
        expect(_testableFunctions.buildEnd(node, [], format)).toBe(expectedOutput);
    });

    it('should return the ANSI escape code for ending text attributes in ANSI format', () => {
        const node = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'ansi';
        const expectedOutput = '\x1b[39m';
        expect(_testableFunctions.buildEnd(node, [], format)).toBe(expectedOutput);
    });

    it('should return the closing markup tag for ending text attributes in markup format', () => {
        const node = { node: 'h1' as const, fg: 'blue' as const };
        const format = 'markup';
        const expectedOutput = '</h1>';
        expect(_testableFunctions.buildEnd(node, [], format)).toBe(expectedOutput);
    });
});
