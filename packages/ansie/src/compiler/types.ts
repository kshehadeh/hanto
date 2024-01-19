export type BaseAnsieNode = {
    node: string;
    content?: AnsieNode | AnsieNode[];
};

const SpaceAttributeKeys = [
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
] as const;

////// Space Attributes - These are the attributes that can be associated with semantic elements that have a concept of spacing such as <div> and <p>
export type SpaceAttributes = {
    [key in (typeof SpaceAttributeKeys)[number]]?: number;
};

type ColorAttributeValue =
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'default'
    | 'brightblack'
    | 'brightred'
    | 'brightgreen'
    | 'brightyellow'
    | 'brightblue'
    | 'brightmagenta'
    | 'brightcyan'
    | 'gray';

///// Text Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>

export type TextAttributes = {
    fg?: ColorAttributeValue;
    bg?: ColorAttributeValue;
    bold?: boolean;
    italics?: boolean;
    underline?: 'single' | 'double' | 'none' | boolean;
};

export const TextAttributeList: (keyof TextAttributes)[] = [
    'fg',
    'bg',
    'bold',
    'italics',
    'underline',
];

export const SpaceAttributeKeysList: (keyof SpaceAttributes)[] = [
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight'    
];

export type AllAttributeKeys = (typeof SpaceAttributeKeys[number]) | (typeof TextAttributeList[number]);

export const AllAttributeKeysList: (keyof SpaceAttributes | keyof TextAttributes)[] = [
    ...SpaceAttributeKeysList,
    ...TextAttributeList,
];

export function isAttribute(key: string): key is AllAttributeKeys {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return AllAttributeKeysList.includes(key as any);
}

// NOTE: Add new attribute sets here
export interface BlockAttributes extends SpaceAttributes, TextAttributes {}

export type TextNode = BaseAnsieNode & TextAttributes;
export type SpaceNode = BaseAnsieNode & SpaceAttributes;


export interface RawTextNode extends BaseAnsieNode {
    node: 'text';
    value: string;
}

export interface BreakNode extends BaseAnsieNode {
    node: 'break';
}

export interface H1Node extends SpaceNode, TextNode {
    node: 'h1';
}

export interface H2Node extends SpaceNode, TextNode {
    node: 'h2';
}

export interface H3Node extends SpaceNode, TextNode {
    node: 'h3';
}

export interface BodyNode extends SpaceNode, TextNode {
    node: 'body';
}

export interface SpanNode extends TextNode {
    node: 'span';
}

export interface ParagraphNode extends SpaceNode, TextNode {
    node: 'p';
}

export interface DivNode extends SpaceNode, TextNode {
    node: 'div';
}

export type AnsieNode = BaseAnsieNode &
    (
        | RawTextNode
        | BreakNode
        | H1Node
        | H2Node
        | H3Node
        | BodyNode
        | SpanNode
        | ParagraphNode
        | DivNode
    );

export type Ast = AnsieNode[];
