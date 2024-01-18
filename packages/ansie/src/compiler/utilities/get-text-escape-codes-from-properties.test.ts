import { describe, expect, it } from 'bun:test';
import { TerminalStyle, escapeCodeFromName } from "./escape-code-from-name";
import { colorToTerminalStyle, getTextEscapeCodesFromProperties } from './get-text-escape-codes-from-properties';
import type { TextAttributes } from '../handlers/text-handlers';

describe('colorToTerminalStyle', () => {
    it('should return foreground terminal style for valid color', () => {
        const color = 'red';
        const foreground = true;
        const expectedOutput = TerminalStyle.fgRed;
        expect(colorToTerminalStyle(color, foreground)).toBe(expectedOutput);
    });

    it('should return background terminal style for valid color', () => {
        const color = 'blue';
        const foreground = false;
        const expectedOutput = TerminalStyle.bgBlue;
        expect(colorToTerminalStyle(color, foreground)).toBe(expectedOutput);
    });
});

describe('getTextEscapeCodesFromProperties', () => {
    it('should return the correct escape codes for text attributes', () => {
        const properties: TextAttributes = {
            fg: 'red',
            bg: 'blue',
            bold: true,
            underline: 'single',
            italics: true,
        };
        const expectedOutput = {
            on: escapeCodeFromName([TerminalStyle.fgRed, TerminalStyle.bgBlue, TerminalStyle.bold, TerminalStyle.underline, TerminalStyle.italic]),
            off: escapeCodeFromName([TerminalStyle.fgDefault, TerminalStyle.bgDefault, TerminalStyle.boldOff, TerminalStyle.underlineOff, TerminalStyle.italicOff]),
        };
        expect(getTextEscapeCodesFromProperties(properties)).toEqual(expectedOutput);
    });

    it('should return the correct escape codes when some attributes are missing', () => {
        const properties: TextAttributes = {
            fg: 'green',
            bold: true,
        };
        const expectedOutput = {
            on: escapeCodeFromName([TerminalStyle.fgGreen, TerminalStyle.bold]),
            off: escapeCodeFromName([TerminalStyle.fgDefault, TerminalStyle.boldOff]),
        };
        expect(getTextEscapeCodesFromProperties(properties)).toEqual(expectedOutput);
    });

    it('should return empty escape codes when no attributes are provided', () => {
        const properties: TextAttributes = {};
        const expectedOutput = {
            on: '',
            off: '',
        };
        expect(getTextEscapeCodesFromProperties(properties)).toEqual(expectedOutput);
    });
});