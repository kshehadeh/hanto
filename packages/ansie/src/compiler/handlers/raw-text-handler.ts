import { z } from 'zod';
import { type NodeHandler } from '..';
import { type CompilerFormat } from '../base';
import type { AnsieNode } from '../types';

//// Raw Text Node - This is a node that represents raw text that should be output as-is with some exceptions (like emoji)

const EmojiMap = {
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
    ":broken_heart:": "💔",
    ":skull_and_crossbones:": "☠️",
    ":grinning:": "😀",
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

export const RawTextNodeSchema = z.object({
    node: z.literal('text'),
    value: z.string(),
});

export type RawTextNode = z.infer<typeof RawTextNodeSchema>;

function replaceEmojiCodes(text: string): string {
    // Use regex to find all the emoji names that use the format :emoji_name: and
    //  replace them with the emoji in the emoji map if it exists
    let updatedText = text;
    const emojiMatches = text.match(/:[a-z_]+:/g);
    if (emojiMatches) {
        emojiMatches.forEach((match) => {
            const emoji = EmojiMap[match];
            if (emoji) {
                updatedText = text.replace(match, emoji);
            }
        });
    }    
    return updatedText
}

export const RawTextNodeHandler: NodeHandler<RawTextNode> = {
    handleEnter(node: z.infer<typeof RawTextNodeSchema>, stack: AnsieNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return node.value
        } else {
            return replaceEmojiCodes(node.value);
        }        
    },

    handleExit() {
        return '';
    },

    isType(node: unknown): node is z.infer<typeof RawTextNodeSchema> {
        return (node as RawTextNode).node === 'text';
    },

    schema: RawTextNodeSchema,
};
