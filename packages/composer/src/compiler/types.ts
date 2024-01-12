import { z } from 'zod';

export const BaseNodeSchema = z.object({
    node: z.union([
        z.literal('color'),
        z.literal('bold'),
        z.literal('italics'),
        z.literal('underline'),
        z.literal('text'),
    ]),
})

export const AstSchema = z.array(BaseNodeSchema);