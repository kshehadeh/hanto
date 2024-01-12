import { describe, it, expect} from "bun:test";
import fixtures from '../test/fixtures.json';
import { parseString } from ".";

describe('Parser', () => {
    fixtures.forEach((fixture: {input: string, ast: any, output: string}) => {        
        it(fixture.input, () => {
            const ast = parseString(fixture.input)
            expect(ast).toEqual(fixture.ast);
        });
    });
});