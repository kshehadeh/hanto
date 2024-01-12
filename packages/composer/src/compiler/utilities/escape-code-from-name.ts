
// A set of variables that map to the ANSI escape codes for terminal manipulation
// and colorization.  See https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
// for more information.
enum TerminalStyle {
    // Reset all styles
    reset = 0,

    // Make text bold
    bold = 1,

    // Make text italic
    italic = 3,

    // Underline text
    underline = 4,

    // Invert foreground and background colors
    inverse = 7,

    // Hide text (foreground color same as background)
    hidden = 8,

    // Strike-through text
    strikethrough = 9,

    // Reset bold
    boldOff = 22,

    // Reset italic
    italicOff = 23,

    // Reset underline
    underlineOff = 24,

    // Reset inverse
    inverseOff = 27,

    // Reset hidden
    hiddenOff = 28,

    // Reset strikethrough
    strikethroughOff = 29,

    // Set foreground color to black
    fgBlack = 30,

    // Set foreground color to red
    fgRed = 31,

    // Set foreground color to green
    fgGreen = 32,

    // Set foreground color to yellow
    fgYellow = 33,

    // Set foreground color to blue
    fgBlue = 34,

    // Set foreground color to magenta
    fgMagenta = 35,

    // Set foreground color to cyan
    fgCyan = 36,

    // Set foreground color to white
    fgWhite = 37,

    // Set foreground color to gray
    fgGray = 90,

    // Set foreground color to default
    fgDefault = 39,

    // Set background color to black
    bgBlack = 40,

    // Set background color to red
    bgRed = 41,

    // Set background color to green
    bgGreen = 42,

    // Set background color to yellow
    bgYellow = 43,

    // Set background color to blue
    bgBlue = 44,

    // Set background color to magenta
    bgMagenta = 45,

    // Set background color to cyan
    bgCyan = 46,

    // Set background color to white
    bgWhite = 47,

    // Set background color to default
    bgDefault = 49,

    // Double underline
    double = 21,

    // Framed
    framed = 51,

    // Encircled
    encircled = 52,

    // Overline
    overline = 53,
};

export function EscapeCodeFromName(name: keyof typeof TerminalStyle): string {
    const style = TerminalStyle[name];
    return style ? `\x1b[${style}m` : ''
}