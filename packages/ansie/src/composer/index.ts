import { 
    BoldComposerNode, 
    BreakComposerNode, 
    ColorComposerNode, 
    ItalicsComposerNode, 
    RawComponentNode, 
    TextComposerNode, 
    UnderlineComposerNode, 
    type ComposerNode, 
    ListComposerNode,
    BundleComposerNode,
    ParagraphComposerNode
} from "./nodes";

export class Composer {
    private _nodes: ComposerNode[] = [];

    public add(node: ComposerNode|ComposerNode[]) {
        this._nodes = this._nodes.concat(Array.isArray(node) ? node : [node]);
    }
    
    // Non-chainable - Produces string
    toString() {        
        return this._nodes.map(n => n.toString()).join('');
    }
}

export function compose(composition: ComposerNode[] = []) {
    const c =  new Composer();
    c.add(composition);
    return c;
}

// Chainable
export function color(...args: ConstructorParameters<typeof ColorComposerNode>) {
    return new ColorComposerNode(...args);
}

export function bold(...args: ConstructorParameters<typeof BoldComposerNode>) {
    return new BoldComposerNode(...args);
}

export function underline(...args: ConstructorParameters<typeof UnderlineComposerNode>) {
    return new UnderlineComposerNode(...args);    
}

export function italics(...args: ConstructorParameters<typeof ItalicsComposerNode>) {
    return new ItalicsComposerNode(...args);    
}

export function br(...args: ConstructorParameters<typeof BreakComposerNode>) {
    return new BreakComposerNode(...args);    
}

export function raw(...args: ConstructorParameters<typeof RawComponentNode>) {
    return new RawComponentNode(...args);    
}

export function text(...args: ConstructorParameters<typeof TextComposerNode>) {
    return new TextComposerNode(...args);    
}

export function list(...args: ConstructorParameters<typeof ListComposerNode>) {
    return  new ListComposerNode(...args);    
}

export function bundle(...args: ConstructorParameters<typeof BundleComposerNode>) {
    return new BundleComposerNode(...args);
}

export function p(...args: ConstructorParameters<typeof BundleComposerNode>) {
    return new ParagraphComposerNode(...args);
}


// const result = compose([
//     bold(['Title', br()]),    
//     italics(['Subtitle', br()]),    
//     text('This is some text that is not formatted'),
//     color('red', undefined, 'Some red text'),
//     list('* ', ['One', 'Two', 'Three']),
// ])

// console.log(result.toString())


// <color fg=red bg=green><bold>Hello World</bold></color>
