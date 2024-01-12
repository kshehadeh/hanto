export default [
    '<bold>bold</bold>',
    '<italics>italics</italics>',
    '<underline>underline</underline>',
    '<color name="red">red</color>',
    '<color name="green">green</color>',
    '<color name="blue">blue</color>',
    '<color name="yellow">yellow</color>',
    '<color name="magenta">magenta</color>',
    '<color name="cyan">cyan</color>',
    '<color name="white">white</color>',
    '<color name="black">black</color>',
    '<color name="red"><color name="green">red green</color></color>',

    '<color name="red"><bold>red bold</bold></color>',
    '<bold><color name="red">bold red</color></bold>',

    'Plain Text <bold>Bold Text</bold> Plain Text',
    'Plain Text <italics>Italics Text</italics> Plain Text',
    'Plain Text <underline>Underline Text</underline> Plain Text',
    'Plain Text <color name="red">Red Text</color> Plain Text',


    'Plain Text',
    'Plain Text <color name="red">Red Text <color name="blue">Blue Text</color></color> Plain Text',
]