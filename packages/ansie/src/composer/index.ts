import { ComposerNode } from './nodes';
import { type BreakNodeParams, BreakComposerNode } from './nodes/break';
import { type BundleNodeParams, BundleComposerNode } from './nodes/bundle';
import { type ListNodeParams, ListComposerNode } from './nodes/list';
import { MarkupComponentNode, type MarkupNodeParams } from './nodes/markup';
import { type ParagraphNodeParams, ParagraphComposerNode } from './nodes/paragraph';
import { type TextNodeParams, TextComposerNode, H1ComposerNode, H2ComposerNode, H3ComposerNode, BodyComposerNode } from './nodes/text';
import { h1 as h1Style, type AnsieTheme, defaultTheme } from './styles';

export class Composer {
    private _nodes: ComposerNode[] = [];
    private _theme: AnsieTheme;

    constructor(theme: AnsieTheme) {
        this._theme = theme;
    }

    public add(node: ComposerNode | ComposerNode[]) {
        const nodeArr = Array.isArray(node) ? node : [node];
        nodeArr.forEach(n => n.theme = this._theme);
        this._nodes = this._nodes.concat(nodeArr);
    }
    
    toString() {
        return this._nodes.map(n => n.toString()).join('');
    }
}

export function compose(composition: ComposerNode[] = [], theme: AnsieTheme = defaultTheme) {
    const c = new Composer(theme);
    c.add(composition);
    return c;
}

// Chainable

export function br(opts: BreakNodeParams) {
    return new BreakComposerNode(opts);
}

export function markup(opts: MarkupNodeParams) {
    return new MarkupComponentNode(opts);
}

export function text(opts: TextNodeParams) {
    return new TextComposerNode(opts);
}

export function list(opts: ListNodeParams) {
    return new ListComposerNode(opts);
}

export function bundle(opts: BundleNodeParams) {
    return new BundleComposerNode(opts);
}

export function p(opts: ParagraphNodeParams) {
    return new ParagraphComposerNode(opts);
}

export function h1(opts: TextNodeParams) {
    return new H1ComposerNode(opts);
}
export function h2(opts: TextNodeParams) {
    return new H2ComposerNode(opts);
}

export function h3(opts: TextNodeParams) {
    return new H3ComposerNode(opts);
}

export function body(opts: TextNodeParams) {
    return new BodyComposerNode(opts);
}

const result = compose([h1({ nodes: ['Title'], style: h1Style })]);
// const result = compose([
//     bold(['Title', br()]),
//     italics(['Subtitle', br()]),
//     text('This is some text that is not formatted'),
//     color('red', undefined, 'Some red text'),
//     list('* ', ['One', 'Two', 'Three']),
// ])

console.log(result.toString());

// <color fg=red bg=green><bold>Hello World</bold></color>
