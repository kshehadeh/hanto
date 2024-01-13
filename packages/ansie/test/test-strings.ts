export default [
    '<bold>bold</bold>',
    '<italics>italics</italics>',
    '<underline type="single">underline</underline>',
    '<color fg="red">red</color>',
    '<color fg="green">green</color>',
    '<color fg="blue">blue</color>',
    '<color fg="yellow">yellow</color>',
    '<color fg="magenta">magenta</color>',
    '<color fg="cyan">cyan</color>',
    '<color fg="white">white</color>',
    '<color fg="black">black</color>',
    '<color fg="red"><color fg="green">green</color>red</color>',

    '<color fg="red"><bold>red bold</bold></color>',
    '<bold><color fg="red">bold red</color></bold>',

    'Plain Text <bold>Bold Text</bold> Plain Text',
    'Plain Text <italics>Italics Text</italics> Plain Text',
    'Plain Text <underline type="single">Underline Text</underline> Plain Text',
    'Plain Text <color fg="red">Red Text</color> Plain Text',


    'Plain Text',
    'Plain Text <color fg="red">Red Text <color fg="blue">Blue Text</color></color> Plain Text',
]