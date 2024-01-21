import type { CompilerFormat } from "./base";


export enum ValidTags {
    'h1' = 'h1',
    'h2' = 'h2',
    'h3' = 'h3',
    'body' = 'body',
    'span' = 'span',
    'p' = 'p',
    'div' = 'div',
    'text' = 'text',
    'li' = 'li',
    'break' = 'break',
}

export const ValidTagsList = Object.keys(ValidTags);

export type ValidTagsType = keyof typeof ValidTags;

export const ColorAttributeValues = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'default',
    'brightblack',
    'brightred',
    'brightgreen',
    'brightyellow',
    'brightblue',
    'brightmagenta',
    'brightcyan',
    'gray',
]

const booleanValues = ['true', 'false', 'yes', 'no', 'y', 'n', '1', '0'];

////// A base node in the AST 
export type BaseAnsieNode = {
    node: ValidTags;
    content?: AnsieNode | AnsieNode[];
};

////// Space Attributes - These are the attributes that can be associated with semantic elements that have a concept of spacing such as <div> and <p>

export const SpaceAttributes = {
    'margin': ['number'],
    'marginTop': ['number'],
    'marginBottom': ['number'],
    'marginLeft': ['number'],
    'marginRight': ['number'],
}

export type SpaceAttributesInterface = {
    [key in (keyof typeof SpaceAttributes)]?: string;
};

export type SpaceNodeBase = BaseAnsieNode & SpaceAttributesInterface;


///// Text Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
export const TextAttributes = {
    fg: ColorAttributeValues,
    bg: ColorAttributeValues,
    bold: [...booleanValues],
    italics: [...booleanValues],
    underline: [...booleanValues, 'single', 'double', 'none'],
};

export type TextAttributesInterface = {
    [key in (keyof typeof TextAttributes)]?: string;
};

export type TextNodeBase = BaseAnsieNode & TextAttributesInterface;

///////

///// List Attributes - These are the attributes that can be associated with text-based semantic elements such as <span> and <p>
export const ListAttributes = {
    bullet: ['*', '-', '+'],
    indent: ['number'],
};

export type ListAttributesKeysType = keyof typeof ListAttributes;

export type ListAttributesInterface = {
    [key in (ListAttributesKeysType)]?: string;
};

export type ListItemNodeBase = BaseAnsieNode & ListAttributesInterface;
///////


export type AllAttributeKeys = keyof typeof TextAttributes | keyof typeof SpaceAttributes;

export const AllAttributeKeysList = [
    ...Object.keys(SpaceAttributes),
    ...Object.keys(TextAttributes),
    ...Object.keys(ListAttributes),
];

export function isAttribute(key: string): key is AllAttributeKeys {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return AllAttributeKeysList.includes(key as any);
}

// NOTE: Add new attribute sets here
export interface BlockAttributes extends SpaceAttributesInterface, TextAttributesInterface { }


export const TagAttributeMap = {
    'h1': {
        ...TextAttributes,
        ...SpaceAttributes,
    },
    'h2': {
        ...TextAttributes,
        ...SpaceAttributes,
    },
    'h3': {
        ...TextAttributes,
        ...SpaceAttributes,
    },
    'body': {
        ...TextAttributes,
        ...SpaceAttributes,
    },
    'span': {
        ...TextAttributes,
    },
    'p': {
        ...TextAttributes,
        ...SpaceAttributes,
    },
    'div': {
        ...TextAttributes,
        ...SpaceAttributes,
    },
    'li': {
        ...TextAttributes,
        ...SpaceAttributes,
        ...ListAttributes,
    },
    'text': {},
    'break': {
        ...SpaceAttributes,
    },
}

export interface RawTextNode extends TextNodeBase {
    value: string;
}

export interface BreakNode extends SpaceNodeBase {}

export interface H1Node extends SpaceNodeBase, TextNodeBase {}

export interface H2Node extends SpaceNodeBase, TextNodeBase {}

export interface H3Node extends SpaceNodeBase, TextNodeBase {}

export interface BodyNode extends SpaceNodeBase, TextNodeBase {}

export interface SpanNode extends TextNodeBase {}

export interface ParagraphNode extends SpaceNodeBase, TextNodeBase {}

export interface DivNode extends SpaceNodeBase, TextNodeBase {}

export interface ListItemNode extends SpaceNodeBase, TextNodeBase, ListItemNodeBase {}

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

export interface NodeHandler<T extends AnsieNode> {    
    handleEnter(node: T, stack: AnsieNode[], format: CompilerFormat): string;
    handleExit(node: T, stack: AnsieNode[], format: CompilerFormat): string;
    isType(node: AnsieNode): node is T;
}
