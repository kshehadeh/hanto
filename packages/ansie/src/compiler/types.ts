import { z } from 'zod';
import { BreakNodeSchema } from './handlers/break-handler';
import { RawTextNodeSchema } from './handlers/raw-text-handler';
import { H1NodeSchema, H2NodeSchema, H3NodeSchema, BodyNodeSchema, SpanNodeSchema, ParagraphNodeSchema, DivNodeSchema } from './handlers/text-handlers';

export const NodeUnionSchema = z.discriminatedUnion('node', [
    RawTextNodeSchema,
    BreakNodeSchema,
    H1NodeSchema,
    H2NodeSchema,
    H3NodeSchema,    
    BodyNodeSchema,
    SpanNodeSchema,
    ParagraphNodeSchema,
    DivNodeSchema,
]);

export type AnsieNode = z.infer<typeof NodeUnionSchema> & {
    content?:
        | z.infer<typeof NodeUnionSchema>
        | z.infer<typeof NodeUnionSchema>[];
};

export const NodeSchema: z.ZodType<AnsieNode> = z.object({
    content: z.lazy(() => z.union([z.array(NodeUnionSchema), NodeUnionSchema])),
});


export const AstSchema = z.array(NodeUnionSchema);
export type Ast = z.infer<typeof AstSchema>;

