import { describe, expect, it } from 'bun:test';
import { RawTextNodeHandler, _testableFunctions } from "./raw-text-handler";
import type { CompilerFormat } from '../base';
import { ValidTags, type AnsieNode } from '../types';

describe('replaceEmojiCodes', () => {
    it('should replace emoji names with corresponding emojis', () => {
        const text = "Hello :grin: :heart: :rocket:";
        const expectedOutput = "Hello 😁 ❤️ 🚀";
        expect(_testableFunctions.replaceEmojiCodes(text)).toBe(expectedOutput);
    });

    it('should not replace emoji names that do not exist in the emoji map', () => {
        const text = "Hello :grin: :unknown_emoji:";
        const expectedOutput = "Hello 😁 :unknown_emoji:";
        expect(_testableFunctions.replaceEmojiCodes(text)).toBe(expectedOutput);
    });

    it('should not replace emoji names if no emoji names are found', () => {
        const text = "Hello world!";
        const expectedOutput = "Hello world!";
        expect(_testableFunctions.replaceEmojiCodes(text)).toBe(expectedOutput);
    });
});

describe('RawTextNodeHandler', () => {
    const handler = RawTextNodeHandler;

    it('should handleEnter correctly for format "markup"', () => {
        const node = { node: ValidTags.text, value: 'Hello world!' };
        const stack: AnsieNode[] = [];
        const format: CompilerFormat = 'markup';
        const result = handler.handleEnter(node, stack, format);
        expect(result).toBe('Hello world!');
    });

    it('should handleEnter correctly for format "ansi"', () => {
        const node = { node: ValidTags.text, value: 'Hello :grin: :heart: :rocket:' };
        const stack: AnsieNode[] = [];
        const format: CompilerFormat = 'ansi';
        const result = handler.handleEnter(node, stack, format);
        expect(result).toBe('Hello 😁 ❤️ 🚀');
    });

    it('should handleExit correctly', () => {
        const result = handler.handleExit({ node: ValidTags.text, value: 'Hello world!' }, [], 'ansi')
        expect(result).toBe('')
    });

    it('should return true for isType if node is of type RawTextNode', () => {
        const node = { node: ValidTags.text, value: 'Hello world!' };
        const result = handler.isType(node);
        expect(result).toBe(true);
    });

    it('should return false for isType if node is not of type RawTextNode', () => {
        const node = { node: ValidTags.div, src: 'image.png' };
        const result = handler.isType(node);
        expect(result).toBe(false);
    });
});