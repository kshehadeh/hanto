import { z } from 'zod';
import { type NodeHandler } from '..';
import { type BaseNode } from '../base';
import { type CompilerFormat } from '../base';

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

export const TextNodeSchema = z.object({
    node: z.literal('text'),
    value: z.string(),
});

export type TextNode = z.infer<typeof TextNodeSchema>;

function replaceEmojiCodes(text: string): string {
    // Use regex to find all the emoji names that use the format :emoji_name: and
    //  replace them with the emoji in the emoji map if it exists
    let updatedText = text;
    let emojiMatches = text.match(/:[a-z_]+:/g);
    if (emojiMatches) {
        emojiMatches.forEach((match) => {
            let emoji = EmojiMap[match];
            if (emoji) {
                updatedText = text.replace(match, emoji);
            }
        });
    }    
    return updatedText
}

export const TextNodeHandler: NodeHandler<TextNode> = {
    handleEnter(node: z.infer<typeof TextNodeSchema>, stack: BaseNode[], format: CompilerFormat = 'ansi') {
        if (format === 'markup') {
            return node.value
        } else {
            return replaceEmojiCodes(node.value);
        }        
    },

    handleExit(node: z.infer<typeof TextNodeSchema>, stack: BaseNode[]) {
        return '';
    },

    isType(node: unknown): node is z.infer<typeof TextNodeSchema> {
        return (node as TextNode).node === 'text';
    },

    tagName: '',

    selfTerminated: true,

    attributes: [],

    schema: TextNodeSchema,
};
