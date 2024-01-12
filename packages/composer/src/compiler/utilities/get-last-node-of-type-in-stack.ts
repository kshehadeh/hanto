import type { z } from "zod";
import type { BaseNodeSchema } from "../types";


/**
 * This function retrieves the last node of a specific type from a stack of nodes (such as the stack of nodes in the compiler).
 * 
 * Node that it does a reverse search of the stack, so it will return the last node of the specified type, not the first.
 *
 * @example
 * 
 * let stack = [{node: 'color', ...}, {node: 'bold', ...}, {node: 'underline', ...}];
 * let result = getLastNodeOfTypeFromStack('bold', stack);
 * // result will be the last node of type 'bold' in the stack
 */
export function getLastNodeOfTypeFromStack<T extends z.infer<typeof BaseNodeSchema>['node']>(nodeType: T, stack: z.infer<typeof BaseNodeSchema>[]) {
    for (let i = stack.length - 1; i >= 0; i--) {
        const stackNode = stack[i];
        if (stackNode.node === nodeType) {
            return stackNode as z.infer<typeof BaseNodeSchema> & { node: T };
        }
    }
    return null;
}