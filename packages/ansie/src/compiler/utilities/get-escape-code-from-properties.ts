import type { TextAttributes } from "../handlers/text-handlers";
import { escapeCodeFromName } from "./escape-code-from-name";


function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Retrieves the escape codes for the given text attributes.  It will return both the escape codes for turning 
 * on and off the text attributes.
 * @param properties The text attributes.
 * @returns An object containing the escape codes for turning on and off the specified text attributes.
 */
export function getEscapeCodesFromProperties(properties: TextAttributes): {on: string, off: string} {
    const on: string[] = [];
    const off: string[] = [];
    if (properties.fg) {
        on.push(`fg${capitalize(properties.fg)}`);
        off.push('fgDefault');
    }
    if (properties.bg) {
        on.push(`bg${capitalize(properties.bg)}`);
        off.push('bgDefault');
    }
    if (properties.bold) {
        on.push('bold');
        off.push('boldOff');
    }
    if (properties.underline) {
        if (properties.underline || properties.underline === 'single') {
            on.push('underline');
        } else if (properties.underline === 'double') {
            on.push('doubleunderline');
        }        
        off.push('underlineOff');
    }
    if (properties.italics) {
        on.push('italic');
        off.push('italicOff');
    }
    return {
        on: escapeCodeFromName(on),
        off: escapeCodeFromName(off),
    };
}