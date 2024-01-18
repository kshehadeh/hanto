import { describe, expect, it } from 'bun:test';
import { CompilerError } from './base';

describe('CompilerError', () => {
    it('should create a new instance with correct properties', () => {
        const message = 'Test error message';
        const markupNode = { node: 'div' as const }
        const markupStack = [ {node: 'body' as const }, markupNode];
        const fatal = true;

        const error = new CompilerError(message, markupNode, markupStack, fatal);

        expect(error.name).toBe('CompilerError');
        expect(error.message).toBe(message);
        expect(error.markupNode).toBe(markupNode);
        expect(error.markupStack).toBe(markupStack);
        expect(error.fatal).toBe(fatal);
    });

    it('should return a string representation of the error', () => {
        const message = 'Test error message';
        const markupNode = { node: 'div' as const }
        const markupStack = [ {node: 'body' as const }, markupNode];
        const fatal = false;

        const error = new CompilerError(message, markupNode, markupStack, fatal);
        const expectedString = 'CompilerError: Test error message (div, body, div)';

        expect(error.toString()).toBe(expectedString);
    });

    it('should return true for continue() if the error is not fatal', () => {
        const message = 'Test error message';
        const markupNode = { node: 'div' as const }
        const markupStack = [];
        const fatal = false;

        const error = new CompilerError(message, markupNode, markupStack, fatal);

        expect(error.continue()).toBe(true);
    });

    it('should return false for continue() if the error is fatal', () => {
        const message = 'Test error message';
        const markupNode = { node: 'div' as const }
        const markupStack = [];
        const fatal = true;

        const error = new CompilerError(message, markupNode, markupStack, fatal);

        expect(error.continue()).toBe(false);
    });
});
