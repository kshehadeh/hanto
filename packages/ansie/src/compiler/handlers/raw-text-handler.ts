import { type NodeHandler } from '..';
import { type CompilerFormat } from '../base';
import type { AnsieNode, RawTextNode } from '../types';

//// Raw Text Node - This is a node that represents raw text that should be output as-is with some exceptions (like emoji)

const EmojiMap: Record<string, string> = {
    ":exclamation:": "❗",
    ":warning:": "⚠️",
    ":no_entry:": "⛔",
    ":heavy_check_mark:": "✔️",
    ":x:": "❌",
    ":bangbang:": "‼️",
    ":triangular_flag_on_post:": "🚩",
    ":fire:": "🔥",
    ":sos:": "🆘",
    ":lock:": "🔒",
    ":key:": "🔑",
    ":heart:": "❤️",
    ":broken_heart:": "💔",
    ":skull_and_crossbones:": "☠️",
    ":grin:": "😁",
    ":joy:": "😂",
    ":heart_eyes:": "😍",
    ":smirk:": "😏",
    ":sunglasses:": "😎",
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎",
    ":clap:": "👏",
    ":pray:": "🙏",
    ":cry:": "😢",
    ":sob:": "😭",
    ":rocket:": "🚀",
    ":sunny:": "☀️",
    ":umbrella:": "☔",
    ":camera:": "📷",
    ":book:": "📖",
    ":moneybag:": "💰",
    ":gift:": "🎁",
    ":bell:": "🔔",
    ":hammer:": "🔨",
    ":thumbsup::skin-tone-2:": "👍🏻",
    ":thumbsup::skin-tone-3:": "👍🏼",
    ":thumbsup::skin-tone-4:": "👍🏽",
    ":thumbsup::skin-tone-5:": "👍🏾",
    ":thumbsup::skin-tone-6:": "👍🏿"    
}

function replaceEmojiCodes(text: string): string {
    // Use regex to find all the emoji names that use the format :emoji_name: and
    //  replace them with the emoji in the emoji map if it exists
    let updatedText = text;
    const emojiMatches = text.match(/:[a-z_]+:/g);
    if (emojiMatches) {
        emojiMatches.forEach((match) => {
            const emoji = EmojiMap[match];
            if (emoji) {
                updatedText = updatedText.replace(match, emoji);
            }
        });
    }    
    return updatedText
}

export const RawTextNodeHandler: NodeHandler<RawTextNode> = {
    handleEnter(node: RawTextNode, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return node.value
        } else {
            return replaceEmojiCodes(node.value);
        }        
    },

    handleExit() {
        return '';
    },

    isType(node: unknown): node is RawTextNode {
        return (node as RawTextNode).node === 'text';
    }
};

export const _testableFunctions = {
    replaceEmojiCodes
}