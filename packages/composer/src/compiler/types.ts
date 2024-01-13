import { z } from 'zod';
import { BoldNodeSchema } from './handlers/bold-handler';
import { BreakNodeSchema } from './handlers/break-handler';
import { ColorNodeSchema } from './handlers/color-handler';
import { ItalicsNodeSchema } from './handlers/italics-handler';
import { TextNodeSchema } from './handlers/text-handler';
import { UnderlineNodeSchema } from './handlers/underline-handler';

export const NodeUnionSchema = z.discriminatedUnion('node', [
    ColorNodeSchema,
    ItalicsNodeSchema,
    TextNodeSchema,
    BoldNodeSchema,
    UnderlineNodeSchema,
    BreakNodeSchema,
]);

type Node = z.infer<typeof NodeUnionSchema> & {
    content?:
        | z.infer<typeof NodeUnionSchema>
        | z.infer<typeof NodeUnionSchema>[];
};

export const NodeSchema: z.ZodType<Node> = z.object({
    content: z.lazy(() => z.union([z.array(NodeUnionSchema), NodeUnionSchema])),
});

export const AstSchema = z.array(NodeUnionSchema);

export type NodeUnion = z.infer<typeof NodeUnionSchema>;
export type Ast = z.infer<typeof AstSchema>;
