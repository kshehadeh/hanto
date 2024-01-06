import { marked } from 'marked';

import chalk, { ChalkInstance } from 'chalk';
import Table from 'cli-table3';
import cardinal, { CardinalOptions } from 'cardinal';
import * as emoji from 'node-emoji';
import ansiEscapes from 'ansi-escapes';
import supportsHyperlinks from 'supports-hyperlinks';

type TransformFunction = (str: string) => string;

interface TerminalRendererOptions {
    code: ChalkInstance | ((s: string) => string);
    blockquote: ChalkInstance | ((s: string) => string);
    html: ChalkInstance | ((s: string) => string);
    h1: ChalkInstance | ((s: string) => string);
    h2: ChalkInstance | ((s: string) => string);
    h3: ChalkInstance | ((s: string) => string);
    h4: ChalkInstance | ((s: string) => string);
    h5: ChalkInstance | ((s: string) => string);
    h6: ChalkInstance | ((s: string) => string);
    hr: ChalkInstance | ((s: string) => string);
    listitem: ChalkInstance | ((s: string) => string);
    table: ChalkInstance | ((s: string) => string);
    paragraph: ChalkInstance | ((s: string) => string);
    strong: ChalkInstance | ((s: string) => string);
    em: ChalkInstance | ((s: string) => string);
    codespan: ChalkInstance | ((s: string) => string);
    del: ChalkInstance | ((s: string) => string);
    link: ChalkInstance | ((s: string) => string);
    href: ChalkInstance | ((s: string) => string);
    text: ChalkInstance | ((s: string) => string);

    /** Reflow and print-out width. Only applicable when `reflowText` is true. */
    width: number;

    reflowText: boolean;

    /** Should it prefix headers? */
    showSectionPrefix: boolean;

    /** Whether or not to undo marked escaping of enitities (" -> &quot; etc) */
    unescape: boolean;

    /** Whether or not to show emojis */
    emoji: boolean;

    /** Options passed to cli-table */
    tableOptions: any;

    /** The size of tabs in number of spaces or as tab characters */
    tab: number;

    /** Whether or not to use Github Flavored Markdown */
    gfm: boolean;

    sanitize: boolean;
}

type TableRowFlags = {
    header: boolean;
    align: 'center' | 'left' | 'right' | null;
};

class Renderer {
    static TABLE_CELL_SPLIT = '^*||*^';
    static TABLE_ROW_WRAP = '*|*|*|*';
    static TABLE_ROW_WRAP_REGEXP = new RegExp(
        Renderer.escapeRegExp(Renderer.TABLE_ROW_WRAP),
        'g',
    );

    static COLON_REPLACER = '*#COLON|*';
    static COLON_REPLACER_REGEXP = new RegExp(
        Renderer.escapeRegExp(Renderer.COLON_REPLACER),
        'g',
    );

    static TAB_ALLOWED_CHARACTERS = ['\t'];

    static BULLET_POINT = '* ';

    static BULLET_POINT_REGEX = '\\*';
    static NUMBERED_POINT_REGEX = '\\d+\\.';
    static POINT_REGEX =
        '(?:' +
        [Renderer.BULLET_POINT_REGEX, Renderer.NUMBERED_POINT_REGEX].join('|') +
        ')';

    // HARD_RETURN holds a character sequence used to indicate text has a
    // hard (no-reflowing) line break.  Previously \r and \r\n were turned
    // into \n in marked's lexer- preprocessing step. So \r is safe to use
    // to indicate a hard (non-reflowed) return.
    static HARD_RETURN_RE = new RegExp('\r');
    static HARD_RETURN_GFM_RE = new RegExp('\r|<br />');

    o: TerminalRendererOptions;
    tab: string;
    emoji: (text: string) => string;
    unescape: (text: string) => string;
    highlightOptions: CardinalOptions;
    transform: TransformFunction;

    constructor(
        options: TerminalRendererOptions,
        highlightOptions: CardinalOptions,
    ) {
        this.o = options;
        this.tab = Renderer.sanitizeTab(this.o.tab, defaultOptions.tab);
        this.emoji = this.o.emoji ? Renderer.insertEmojis : Renderer.identity;
        this.unescape = this.o.unescape
            ? Renderer.unescapeEntities
            : Renderer.identity;
        this.highlightOptions = highlightOptions || {};

        this.transform = compose(
            Renderer.undoColon,
            this.o.unescape ? Renderer.unescapeEntities : undefined,
            this.o.emoji ? Renderer.insertEmojis : undefined,
        );
    }

    static undoColon(str: string) {
        return str?.replace(Renderer.COLON_REPLACER_REGEXP, ':');
    }

    static fixHardReturn(text: string, reflow: boolean) {
        return reflow ? text.replace('\r', '\n') : text;
    }

    text(text: string) {
        return this.o.text(text);
    }

    code(code: string, lang: string, escaped: boolean) {
        return Renderer.section(
            Renderer.indentify(this.tab, this.highlight(code, lang)),
        );
    }

    blockquote(quote: string) {
        return Renderer.section(
            this.o.blockquote(Renderer.indentify(this.tab, quote.trim())),
        );
    }

    html(html: string) {
        return this.o.html(html);
    }

    heading(text: string, level: number, raw: string) {
        text = this.transform(text);

        const prefix = this.o.showSectionPrefix
            ? new Array(level + 1).join('#') + ' '
            : '';
        text = prefix + text;
        if (this.o.reflowText) {
            text = Renderer.reflowText(text, this.o.width, true);
        }

        const levelFunc = (level: number) => {
            switch (level) {
                case 1:
                    return this.o.h1;
                case 2:
                    return this.o.h2;
                case 3:
                    return this.o.h3;
                case 4:
                    return this.o.h4;
                case 5:
                    return this.o.h5;
                case 6:
                    return this.o.h6;
                default:
                    return this.o.h1;
            }
        };

        return Renderer.section(levelFunc(level)(text));
    }

    hr() {
        return Renderer.section(
            this.o.hr(Renderer.drawLine('-', this.o.width)),
        );
    }

    list(body: string, ordered: boolean) {
        body = body.trim();
        body = ordered
            ? Renderer.numberedLines(body, this.tab)
            : Renderer.bulletPointLines(body, this.tab);
        return Renderer.section(
            Renderer.fixNestedLists(
                Renderer.indentLines(this.tab, body),
                this.tab,
            ),
        );
    }

    listitem(text: string) {
        const transform = compose(this.o.listitem, this.transform);
        const isNested = text.indexOf('\n') !== -1;
        if (isNested) text = text.trim();

        // Use BULLET_POINT as a marker for ordered or unordered list item
        return '\n' + Renderer.BULLET_POINT + transform(text);
    }

    checkbox(checked: boolean) {
        return '[' + (checked ? 'X' : ' ') + '] ';
    }

    paragraph(text: string) {
        const transform = compose(this.o.paragraph, this.transform);
        text = transform(text);
        if (this.o.reflowText) {
            text = Renderer.reflowText(text, this.o.width, this.o.gfm);
        }
        return Renderer.section(text);
    }

    table(header: string, body: string) {
        const table = new Table(
            Object.assign(
                {},
                {
                    head: Renderer.generateTableRow(header, this.transform)[0],
                },
                this.o.tableOptions,
            ),
        );

        Renderer.generateTableRow(body, this.transform).forEach(row => {
            table.push(row);
        });
        return Renderer.section(this.o.table(table.toString()));
    }

    tablerow(content: string) {
        return (
            Renderer.TABLE_ROW_WRAP + content + Renderer.TABLE_ROW_WRAP + '\n'
        );
    }

    tablecell(content: string, flags: TableRowFlags) {
        return content + Renderer.TABLE_CELL_SPLIT;
    }

    // span level renderer
    strong(text: string) {
        return this.o.strong(text);
    }

    em(text: string) {
        text = Renderer.fixHardReturn(text, this.o.reflowText);
        return this.o.em(text);
    }

    codespan(text: string) {
        text = Renderer.fixHardReturn(text, this.o.reflowText);
        return this.o.codespan(text.replace(/:/g, Renderer.COLON_REPLACER));
    }

    br() {
        return this.o.reflowText ? '\r' : '\n';
    }

    del(text: string) {
        return this.o.del?.(text);
    }

    link(href: string, title: string, text: string) {
        if (this.o.sanitize) {
            try {
                const prot = decodeURIComponent(this.unescape(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();

                if (prot.indexOf('javascript:') === 0) {
                    return '';
                }
            } catch (e) {
                return '';
            }
        }

        const hasText = text && text !== href;

        let out = '';

        if (supportsHyperlinks.stdout) {
            let link = '';
            if (text) {
                link = this.o.href(this.emoji?.(text));
            } else {
                link = this.o.href(href);
            }
            out = ansiEscapes.link(link, href);
        } else {
            if (hasText) out += this.emoji(text) + ' (';
            out += this.o.href(href);
            if (hasText) out += ')';
        }
        return this.o.link(out);
    }

    image(href: string, title: string, text: string) {
        let out = '![' + text;
        if (title) out += ' – ' + title;
        return out + '](' + href + ')\n';
    }

    highlight(code: string, lang: string) {
        if (chalk.level === 0) return code;

        const style = this.o.code;

        code = Renderer.fixHardReturn(code, this.o.reflowText);
        if (lang !== 'javascript' && lang !== 'js') {
            return style(code);
        }

        try {
            return cardinal.highlight(code, this.highlightOptions);
        } catch (e) {
            return style(code);
        }
    }

    static indentify(indent: string, text: string) {
        if (!text) return text;
        return indent + text.split('\n').join('\n' + indent);
    }

    // Munge \n's and spaces in "text" so that the number of
    // characters between \n's is less than or equal to "width".
    static reflowText(text: string, width: number, gfm: boolean) {
        // Hard break was inserted by br or is
        // <br /> when gfm is true
        const splitRe = gfm
            ? Renderer.HARD_RETURN_GFM_RE
            : Renderer.HARD_RETURN_RE;
        const sections = text.split(splitRe);
        const reflowed: string[] = [];

        sections.forEach(section => {
            // Split the section by escape codes so that we can
            // deal with them separately.
            const fragments = section.split(
                /(\u001b\[(?:\d{1,3})(?:;\d{1,3})*m)/g,
            );
            let column = 0;
            let currentLine = '';
            let lastWasEscapeChar = false;

            while (fragments.length) {
                const fragment = fragments[0];

                if (fragment === '') {
                    fragments.splice(0, 1);
                    lastWasEscapeChar = false;
                    continue;
                }

                // This is an escape code - leave it whole and
                // move to the next fragment.
                if (!Renderer.textLength(fragment)) {
                    currentLine += fragment;
                    fragments.splice(0, 1);
                    lastWasEscapeChar = true;
                    continue;
                }

                const words = fragment.split(/[ \t\n]+/);

                for (let i = 0; i < words.length; i++) {
                    let word = words[i];
                    let addSpace = column !== 0;
                    if (lastWasEscapeChar) addSpace = false;

                    // If adding the new word overflows the required width
                    if (column + word.length + (addSpace ? 1 : 0) > width) {
                        if (word.length <= width) {
                            // If the new word is smaller than the required width
                            // just add it at the beginning of a new line
                            reflowed.push(currentLine);
                            currentLine = word;
                            column = word.length;
                        } else {
                            // If the new word is longer than the required width
                            // split this word into smaller parts.
                            const w = word.substr(
                                0,
                                width - column - (addSpace ? 1 : 0),
                            );
                            if (addSpace) currentLine += ' ';
                            currentLine += w;
                            reflowed.push(currentLine);
                            currentLine = '';
                            column = 0;

                            word = word.substr(w.length);
                            while (word.length) {
                                const w = word.substr(0, width);

                                if (!w.length) break;

                                if (w.length < width) {
                                    currentLine = w;
                                    column = w.length;
                                    break;
                                } else {
                                    reflowed.push(w);
                                    word = word.substr(width);
                                }
                            }
                        }
                    } else {
                        if (addSpace) {
                            currentLine += ' ';
                            column++;
                        }

                        currentLine += word;
                        column += word.length;
                    }

                    lastWasEscapeChar = false;
                }

                fragments.splice(0, 1);
            }

            if (Renderer.textLength(currentLine)) reflowed.push(currentLine);
        });

        return reflowed.join('\n');
    }

    // Compute length of str not including ANSI escape codes.
    // See http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    static textLength(str: string) {
        return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, '').length;
    }

    static indentLines(indent: string, text: string) {
        return text.replace(/(^|\n)(.+)/g, '$1' + indent + '$2');
    }

    // Prevents nested lists from joining their parent list's last line
    static fixNestedLists(body: string, indent: string) {
        const regex = new RegExp(
            '' +
                '(\\S(?: |  )?)' + // Last char of current point, plus one or two spaces
                // to allow trailing spaces
                '((?:' +
                indent +
                ')+)' + // Indentation of sub point
                '(' +
                Renderer.POINT_REGEX +
                '(?:.*)+)$',
            'gm',
        ); // Body of subpoint
        return body.replace(regex, '$1\n' + indent + '$2$3');
    }

    static isPointedLine(line: string, indent: string) {
        return line.match('^(?:' + indent + ')*' + Renderer.POINT_REGEX);
    }

    static toSpaces(str: string) {
        return ' '.repeat(str.length);
    }

    static bulletPointLine(indent: string, line: string) {
        return Renderer.isPointedLine(line, indent)
            ? line
            : Renderer.toSpaces(Renderer.BULLET_POINT) + line;
    }

    static bulletPointLines(lines: string, indent: string) {
        return lines
            .split('\n')
            .filter(Renderer.identity)
            .map(line => Renderer.bulletPointLine(indent, line))
            .join('\n');
    }

    static numberedPoint(n: number) {
        return `${n}. `;
    }
    static numberedLine(indent: string, line: string, num: number) {
        return this.isPointedLine(line, indent)
            ? {
                  num: num + 1,
                  line: line.replace(
                      Renderer.BULLET_POINT,
                      this.numberedPoint(num + 1),
                  ),
              }
            : {
                  num: num,
                  line: this.toSpaces(Renderer.numberedPoint(num)) + line,
              };
    }

    static numberedLines(lines: string, indent: string) {
        let num = 0;
        return lines
            .split('\n')
            .filter(Renderer.identity)
            .map(line => {
                const numbered = Renderer.numberedLine(line, indent, num);
                num = numbered.num;

                return numbered.line;
            })
            .join('\n');
    }

    static section(text: string) {
        return text + '\n\n';
    }

    static insertEmojis(text: string) {
        return text?.replace(/:([A-Za-z0-9_\-\+]+?):/g, emojiString => {
            const emojiSign = emoji.get(emojiString);
            if (!emojiSign) return emojiString;
            return emojiSign + ' ';
        });
    }

    static drawLine(inputHrStr: string, length: number) {
        length = length || process.stdout.columns;
        return new Array(length).join(inputHrStr);
    }

    static generateTableRow(text: string, escape: TransformFunction) {
        if (!text) return [];
        escape = escape || Renderer.identity;
        const lines = escape(text).split('\n');

        const data: string[][] = [];
        lines.forEach(line => {
            if (!line) return;
            const parsed = line
                .replace(Renderer.TABLE_ROW_WRAP_REGEXP, '')
                .split(Renderer.TABLE_CELL_SPLIT);

            data.push(parsed.splice(0, parsed.length - 1));
        });
        return data;
    }

    static escapeRegExp(str: string) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    static unescapeEntities(html: string) {
        return html
            ?.replace(/&amp;/g, '&')
            ?.replace(/&lt;/g, '<')
            ?.replace(/&gt;/g, '>')
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'");
    }

    static identity(str: string) {
        return str;
    }

    static isAllowedTabString(str: string) {
        return Renderer.TAB_ALLOWED_CHARACTERS.some(char => {
            return str.match('^(' + char + ')+$');
        });
    }

    static sanitizeTab(tab: number | string, fallbackTab: number) {
        if (typeof tab === 'number') {
            return new Array(tab + 1).join(' ');
        } else if (
            typeof tab === 'string' &&
            Renderer.isAllowedTabString(tab)
        ) {
            return tab;
        } else {
            return new Array(fallbackTab + 1).join(' ');
        }
    }
}

/**
 * Compose multiple functions into a single function
 * @param fns The functions to compose
 * @returns The composed function
 */
function compose(...fns: (TransformFunction | undefined)[]): TransformFunction {
    return (initialValue: string): string => {
        return fns.reduce(
            (
                accumulator: string,
                currentFunction: TransformFunction | undefined,
            ) => {
                return currentFunction
                    ? currentFunction(accumulator)
                    : accumulator
                      ? accumulator
                      : '';
            },
            initialValue,
        );
    };
}

function markedTerminal(
    options: TerminalRendererOptions,
    highlightOptions: CardinalOptions,
) {
    const r = new Renderer(options, highlightOptions);

    const extension = {
        renderer: {
            code: r.code.bind(r),
            blockquote: r.blockquote.bind(r),
            html: r.html.bind(r),
            heading: r.heading.bind(r),
            hr: r.hr.bind(r),
            list: r.list.bind(r),
            listitem: r.listitem.bind(r),
            checkbox: r.checkbox.bind(r),
            paragraph: r.paragraph.bind(r),
            table: r.table.bind(r),
            tablerow: r.tablerow.bind(r),
            tablecell: r.tablecell.bind(r),
            strong: r.strong.bind(r),
            em: r.em.bind(r),
            codespan: r.codespan.bind(r),
            br: r.br.bind(r),
            del: r.del.bind(r),
            link: r.link.bind(r),
            image: r.image.bind(r),
            text: r.text.bind(r),
            options: r.o,
        },
    };

    return extension;
}

const defaultOptions: TerminalRendererOptions = {
    code: chalk.yellow,
    blockquote: chalk.gray.italic,
    html: chalk.gray,
    h1: chalk.green.underline.bold,
    h2: chalk.green.bold,
    h3: chalk.yellow.underline.bold,
    h4: chalk.yellow.bold,
    h5: chalk.gray.bold,
    h6: chalk.gray,
    hr: chalk.reset,
    listitem: chalk.reset,
    table: chalk.reset,
    paragraph: chalk.reset,
    strong: chalk.bold,
    em: chalk.italic,
    codespan: chalk.yellow,
    del: chalk.dim.gray.strikethrough,
    link: chalk.blue,
    href: chalk.blue.underline,
    text: Renderer.identity,
    unescape: true,
    emoji: true,
    sanitize: true,
    width: 80,
    showSectionPrefix: false,
    reflowText: false,
    tab: 4,
    tableOptions: {},
    gfm: true,
};

export type MarkdownText = string;
export function renderMarkdown(text: MarkdownText) {
    const options = {
        ...defaultOptions,
        unescape: true,
        emoji: true,
        sanitize: true,
        width: 80,
        showSectionPrefix: false,
        reflowText: false,
        tab: 4,
        tableOptions: {},
        gfm: true,
    };

    return marked(text, markedTerminal(options, {}));
}

// console.log(render(`
// # h1

// ## h2

// ### h3

// #### h4

// * List 1
// * List 2
// * List 3

// **Bold**

// *Italic*

// ----

// \`Code\`

// \`\`\`js
// const a = 1;
// const b = 2;
// const c = a + b;
// \`\`\`

// > Blockquote

// [Link](https://google.com)

// ![Image](https://google.com)

// `
// ));
