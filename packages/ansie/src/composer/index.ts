import { 
    BoldComposerNode, 
    BreakComposerNode, 
    ColorComposerNode, 
    ItalicsComposerNode, 
    RawComponentNode, 
    TextComposerNode, 
    UnderlineComposerNode, 
    type ComposerNode 
} from "./nodes";

export class Composer {
    private _nodes: ComposerNode[] = [];

    static start() {
        return new Composer();
    }

    // Chainable
    color(...args: ConstructorParameters<typeof ColorComposerNode>) {
        this._nodes.push(new ColorComposerNode(...args));
        return this;
    }

    bold(...args: ConstructorParameters<typeof BoldComposerNode>) {
        this._nodes.push(new BoldComposerNode(...args));
        return this;
    }

    underline(...args: ConstructorParameters<typeof UnderlineComposerNode>) {
        this._nodes.push(new UnderlineComposerNode(...args));
        return this;
    }

    italics(...args: ConstructorParameters<typeof ItalicsComposerNode>) {
        this._nodes.push(new ItalicsComposerNode(...args));
        return this;
    }

    br(...args: ConstructorParameters<typeof BreakComposerNode>) {
        this._nodes.push(new BreakComposerNode(...args));
        return this;
    }

    raw(...args: ConstructorParameters<typeof RawComponentNode>) {
        this._nodes.push(new RawComponentNode(...args));
        return this;
    }

    text(...args: ConstructorParameters<typeof TextComposerNode>) {
        this._nodes.push(new TextComposerNode(...args));
        return this;
    }

    // Non-chainable - Produces string
    end() {
        return this._nodes.map(n => n.toString()).join('');
    }
f
    // Non-chainable - Produces string
    toString() {
        return this.end();
    }
}

const result = Composer.start()
    .bold('Title')
    .br()
    .italics('Subtitle')
    .br()
    .text('This is some text that is not formatted')
    .color('red', undefined, 'Some red text')
    .end();
console.log(result);

// <color fg=red bg=green><bold>Hello World</bold></color>
