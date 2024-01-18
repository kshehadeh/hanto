import { describe, expect, it } from 'bun:test';
import { getLastNodeOfTypeFromStack } from "./get-last-node-of-type-in-stack";
import type { AnsieNode } from '../types';

describe('getLastNodeOfTypeFromStack', () => {
    it('should return the last node of the specified type from the stack', () => {
        const stack = [
            { node: 'div' as const },
            { node: 'span'as const },
            { node: 'h1' as const },
            { node: 'div' as const },
            { node: 'h2' as const },
        ];
        const expectedOutput = { node: 'div' as const };
        expect(getLastNodeOfTypeFromStack('div', stack)).toEqual(expectedOutput);
    });

    it('should return null if the specified type is not found in the stack', () => {
        const stack = [
            { node: 'div' as const },
            { node: 'span' as const  },
            { node: 'h1' as const  },
        ];
        const expectedOutput = null;
        expect(getLastNodeOfTypeFromStack('h2', stack)).toEqual(expectedOutput);
    });

    it('should return null if the stack is empty', () => {
        const stack: AnsieNode[] = [];
        const expectedOutput = null;
        expect(getLastNodeOfTypeFromStack('h2', stack)).toEqual(expectedOutput);
    });
});