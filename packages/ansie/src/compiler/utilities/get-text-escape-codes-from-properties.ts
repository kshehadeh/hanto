import type { TextAttributes } from "../handlers/text-handlers";
import { TerminalStyle, escapeCodeFromName } from "./escape-code-from-name";


function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Retrieves the escape codes for the given text attributes.  It will return both the escape codes for turning 
 * on and off the text attributes.
 * @param properties The text attributes.
 * @returns An object containing the escape codes for turning on and off the specified text attributes.
 */
export function getTextEscapeCodesFromProperties(properties: TextAttributes): {on: string, off: string} {
    const on: TerminalStyle[] = [];
    const off: TerminalStyle[] = [];
    if (properties.fg) {
        on.push(colorToTerminalStyle(properties.fg, true));
        off.push(TerminalStyle.fgDefault);
    }
    if (properties.bg) {
        on.push(colorToTerminalStyle(properties.bg, false));
        off.push(TerminalStyle.bgDefault);
    }
    if (properties.bold) {
        on.push(TerminalStyle.bold);
        off.push(TerminalStyle.boldOff);
    }
    if (properties.underline) {
        if (properties.underline === 'single') {
            on.push(TerminalStyle.underline);
        } else if (properties.underline === 'double') {
            on.push(TerminalStyle.doubleunderline);
        }        
        off.push(TerminalStyle.underlineOff);
    }
    if (properties.italics) {
        on.push(TerminalStyle.italic);
        off.push(TerminalStyle.italicOff);
    }
    return {
        on: escapeCodeFromName(on),
        off: escapeCodeFromName(off),
    };
}

function colorToTerminalStyle(color: string, foreground: boolean): TerminalStyle {
    if (foreground) {
        return TerminalStyle[`fg${capitalize(color)}`];
    } else {
        return TerminalStyle[`bg${capitalize(color)}`];
    }
}
