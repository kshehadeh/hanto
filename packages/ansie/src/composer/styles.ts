
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

    spacing?: {
        margin?: number;
        marginLeft?: number;
        marginRight?: number;
        marginTop?: number;
        marginBottom?: number;
    }

    list?: {
        prefix: string;
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
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
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
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1,
    }
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
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1,
    }
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
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1,
    }
};

export const p: AnsieStyle = {
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1,
    }
};

export const span: AnsieStyle = {
};

export const list: AnsieStyle = {
    list: {
        prefix: '* ',
    },
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1,
    }
};

export const div: AnsieStyle = {
    spacing: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 1,
        marginBottom: 1,
    }
};

export interface AnsieTheme {
    h1: AnsieStyle;
    h2: AnsieStyle;
    h3: AnsieStyle;
    body: AnsieStyle;
    div: AnsieStyle;
    span: AnsieStyle;
    list: AnsieStyle;
    p: AnsieStyle
}

export const defaultTheme: AnsieTheme = {
    h1,
    h2,
    h3,
    body,
    p,
    list,
    span,
    div
};
