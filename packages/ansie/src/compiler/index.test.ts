import { describe, it, expect } from 'bun:test';
import fixtures from '../../test/fixtures.json';
import { compile } from '.';

describe('Compiler', () => {
    fixtures.forEach((fixture: { input: string; ast: any; output: string }) => {
        it(fixture.input, () => {
            const output = compile(fixture.input);
            expect(output).toEqual(fixture.output);
        });
    });
});
