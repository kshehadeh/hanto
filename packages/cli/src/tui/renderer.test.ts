import { describe, it, expect } from 'bun:test';
import { renderMarkdown } from './renderer';

describe('TerminalRendererOptions interface', () => {
    // Test to verify that the renderer generates the correct output from
    //  a given markdown input
    it('should render markdown correctly', () => {
        const result = renderMarkdown('# Heading\n\nParagraph');
        const expected =
            '\u001B[32m\u001B[4m\u001B[1mHeading\u001B[22m\u001B[24m\u001B[39m\n\n\u001B[0mParagraph\u001B[0m\n\n';
        expect(result).toEqual(expected);
    });
    describe('TerminalRendererOptions interface', () => {
        // Test to verify that the renderer correctly renders a list
        it('should render a list correctly', () => {
            const result = renderMarkdown('* Item 1\n* Item 2');
            const expected =
                '    * \u001B[0mItem 1\u001B[0m\n    * \u001B[0mItem 2\u001B[0m\n\n';
            expect(result).toEqual(expected);
        });

        // Test to verify that the renderer correctly renders a blockquote
        it('should render a blockquote correctly', () => {
            const result = renderMarkdown('> Blockquote');
            const expected =
                '\u001B[90m\u001B[3m    \u001B[0mBlockquote\u001B[0m\u001B[23m\u001B[39m\n\n';
            expect(result).toEqual(expected);
        });

        // Test to verify that the renderer correctly renders a code block
        it('should render a code block correctly', () => {
            const result = renderMarkdown('```\nCode block\n```');
            const expected = '    \u001B[33mCode block\u001B[39m\n\n';
            expect(result).toEqual(expected);
        });
    });
});
