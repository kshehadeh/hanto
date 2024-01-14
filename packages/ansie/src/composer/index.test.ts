import { describe, it, expect } from 'bun:test';
import { bold, br, compose, color, italics, list, text, underline } from './index';
import { compile } from '../compiler';

describe('Composer functions', () => {
    it('should create a new ColorComposerNode', () => {
        const node = compose([color('red', 'blue')]);
        expect(node.toString()).toBe('<color fg="red" bg="blue"></color>');
    });

    it('should create a new BoldComposerNode', () => {
        const node = compose([bold('Hello, world!')]);
        expect(node.toString()).toBe('<bold>Hello, world!</bold>');
    });

    it('should create a new UnderlineComposerNode', () => {
        const node = compose([underline('double', 'Hello, world!')]);
        expect(node.toString()).toBe(
            '<underline type="double">Hello, world!</underline>',
        );
    });

    it('should create a new ItalicsComposerNode', () => {
        const node = compose([italics('Hello, world!')]);
        expect(node.toString()).toBe('<italics>Hello, world!</italics>');
    });

    it('should create a new BreakComposerNode', () => {
        const node = compose([br()]);
        expect(node.toString()).toBe('<br/>');
    });

    it('should create a new TextComposerNode', () => {
        const node = compose([text('Hello, world!')]);
        expect(node.toString()).toBe('Hello, world!');
    });

    it('should handle empty string in ItalicsComposerNode', () => {
        const node = compose([italics('')]);
        expect(node.toString()).toBe('<italics></italics>');
    });

    it('should handle special characters in ItalicsComposerNode', () => {
        const node = compose([italics('Hello, world!@#$%^&*()')]);
        expect(node.toString()).toBe(
            '<italics>Hello, world!@#$%^&*()</italics>',
        );
    });

    it('should handle empty string in TextComposerNode', () => {
        const node = compose([text('')]);
        expect(node.toString()).toBe('');
    });

    it('should handle special characters in TextComposerNode', () => {
        const node = compose([text('Hello, world!@#$%^&*()')])
        expect(node.toString()).toBe('Hello, world!@#$%^&*()');
    });

    it('should handle empty string in ColorComposerNode', () => {
        const node = compose([
            bold('Title'),
            br(),
            underline('single', 'Subtitle'),
            br(),
            text('This is some text that is not formatted'),
            color('red', undefined, 'Some red text')
        ])

        // Check that the markup is correct.
        expect(node.toString()).toBe(
            '<bold>Title</bold><br/><underline type="single">Subtitle</underline><br/>This is some text that is not formatted<color fg="red" >Some red text</color>',
        );

        // Check the compiled version is correct
        expect(compile(node.toString())).toBe('\x1b[1mTitle\x1b[22m\n\x1b[4mSubtitle\x1b[24m\nThis is some text that is not formatted\x1b[31mSome red text\x1b[39;49m');
    });

    it('should handle lists', () => {
        const node = compose([list('* ', ['one', br(), 'two', 'three'])]);
        expect(node.toString()).toBe('  * one<br/>  * <br/><br/>  * two<br/>  * three<br/>');
    })
});
