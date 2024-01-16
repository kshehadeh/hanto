
export interface AnsieStyle {
    font?: {
        color?: {
            fg?: string;
            bg?: string;    
        };    
        bold?: boolean;
        underline: 'single' | 'double' | 'none';
        italics?: boolean;        
    },

    list?: {
        prefix: string;
        newLineCount: number;
    },

    paragraph?: {
        newLineCount: number;
    },
}

export const body: AnsieStyle = {
    font: {
        color: {
            fg: 'default',
            bg: 'default'
        },
        bold: false,
        underline: 'none',
        italics: false,        
    },
};

export const h1: AnsieStyle = {
    font: {
        color: {
            fg: 'blue',
        },
        bold: true,
        underline: 'double',
        italics: false,        
    },
};

export const h2: AnsieStyle = {
    font: {
        color: {
            fg: 'default',
        },
        bold: true,
        underline: 'single',
        italics: false,        
    },
};

export const h3: AnsieStyle = {
    font: {
        color: {
            fg: 'gray',
        },
        bold: true,
        underline: 'none',
        italics: false,        
    },
};

export const paragraph: AnsieStyle = {
    paragraph: {
        newLineCount: 1,
    },
};

export const list: AnsieStyle = {
    list: {
        prefix: '* ',
        newLineCount: 1,
    },
};

export interface AnsieTheme {
    h1: AnsieStyle;
    h2: AnsieStyle;
    h3: AnsieStyle;
    body: AnsieStyle;
    paragraph: AnsieStyle;
    list: AnsieStyle;
}

export const defaultTheme: AnsieTheme = {
    h1,
    h2,
    h3,
    body,
    paragraph,
    list,
};
