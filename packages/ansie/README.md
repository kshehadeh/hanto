# Ansie

A library used to render a simplified html-like declarative language to rich terminal text.

For example,

```xml
<bold>Title</bold>
<color fg="gray">Subtitle goes here</color>
A description using the default text will appear here.  But you can also include
<underline style="single"><italics>nested</italics></underline> values.
```

The library contains three components:

1. *Parser* - this is used to convert a string to an Abstract Syntax Tree.  You probably won't need to use this as it represents an incremental state
2. *Compiler* - Converts the abstract syntax tree to renderer terminal text.  You can use this if you want to just pass in markup to get your terminal string.
3. *Composer* - A convenient set of methods to build markup through a functional syntax.  You can use this if you want a nicer, functional way of building your markup.

## Installation

`bun add ansie`

## Usage

```typescript
import { compile } from 'ansie';
console.log(compile('<bold>This is bold</bold>'));

// Output: "\u001b[1mThis is bold\u001b[21m"
```

```typescript 
import { Composer } from 'ansie';
console.log(Composer.start().bold('This is bold').end());
// Output: "\u001b[1mThis is bold\u001b[21m"
```

## Ansie Markup

The markup language follows XML rules in that it uses a declarative tag-based system of angle brackets and attributes. The supported tags available today are:

1. `<color name="[see colors below]"></color>`
2. `<bold></bold>`
3. `<italics></italics>`
4. `<underline style="[single|double]"></underline>`

Additionally you can have regular text that is not enclosed in a tag.

Tags can be nested and will render the way you would expect. So, for example,

```xml
<color name="red">This is red but <color name="blue"> this is blue </color> and this is red again </color>
```

### Underline Table

| Underline Styles |
| ---------------- |
| single           |
| double           |

### Color Table

| Color Names   |
| ------------- |
| black         |
| red           |
| green         |
| yellow        |
| blue          |
| magenta       |
| cyan          |
| white         |
| gray          |
| brightred     |
| brightgreen   |
| brightyellow  |
| brightblue    |
| brightmagenta |
| brightcyan    |
| brightwhite   |
| brightgray    |

## Composition

The library includes a Composer that allows for easy composition through a programmatic interface. *This is not required to use Ansie*.  For some people it's a little easier to use an imperative approach for building views.  Here's an exmaple of how to build markup programmatically:

```typescript
const markup = compose([
    .bold('Title')
    .br()
    .underline('single', 'Subtitle')
    .br()
    .text('This is some text that is not formatted')
    .color('red', undefined, 'Some red text')
]).toString()

console.log(markup);
console.log(compile(markup))

// Line 1: <bold>Title</bold><br/><underline type="single">Subtitle</underline><br/>This is some text that is not formatted<color fg="red">Some red text</color>
// Line 2: \x1b[1mTitle\x1b[22m\n\x1b[4mSubtitle\x1b[24m\nThis is some text that is not formatted\x1b[31mSome red text\x1b[39;49m
```

### Convenience Functions
| Function    | Params                    | Description                                                                                     |
| ----------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| `bold`      | *Child Nodes*             | Contained items are surrounded with `<bold>`                                                    |
| `underline` | `type`, *Child Nodes*     | Contained items are surrounded with `<underline>`                                               |
| `italics`   | *Child Nodes*             | Contained items are surrounded with `<italics>`                                                 |
| `br`        | *None*                    | Inserts a `<br/>`                                                                               |
| `text`      | *None*                    | Inserts text as-is (but will replace `:emoji:`)                                                 |
| `color`     | `fg`, `bg`, *Child Nodes* | Contained items are surrounded with `<color>`                                                   |
| `list`      | `bullet`, *Child Nodes*   | Adds a bulleted list item for each item in the passed array of nodes                            |
| `bundle`    | *Sibling Nodes*           | Outputs a set of sibling nodes - useful when passing to other functions that need a single node |
| `raw`       | *Valid Markup*            | Allows you to combine raw markup with composed items from above                                 |

Some of these nodes accept children because they add some formatting to a finite set of contained items.  For these 
you will pass in the children as an array to the function, after the other properties that customize the styling. 

For example, the color function takes a foreground, background and an array of children:

```typescript
console.log(color('white', 'red', 'This text will be colored white with a red background'))

// <color fg="white" bg="red">This text will be colored white with a red background</color>
```

You can create lists with the `list` method which takes a bullet style followed by a list of items to prepend the bullet to.  

```typescript
console.log(list('* ', ['Item 1', 'Item 2', 'Item 3']))

// * Item 1<br/>* Item 2<br/>* Item 3<br/>
```

You can also create more complex output using bundles which will take arbitrary array of nodes and render them in order.

```typescript
console.log(bundle(['Property: ', bold('Bold Value')]))

// Property: <bold>Bold Value</bold>
```

```typescript
console.log(bundle(['Property: ', raw('<bold>Bold Text</bold>')]))

// Property: <bold>Bold Text</bold>
```

Using these you can create relatively complex compositions imperatively.

## Developing

To install dependencies:

```bash
bun install
```

To update the parser if you made changes to the grammar:

```bash
bun run parser:generate
```

If you added new tests to `test-strings.ts` you will need to generate a new `fixtures.json` file which you can do by running:

```bash
bun run test:record
```

### Updating the Grammar

The parser code in this context is generated from a grammar file (terminal-markup.peggy) using the peggy library. If you want to update the parser, you would need to modify the grammar file and then re-run the generate.ts script to create a new parser. Here are the steps:

1. Navigate to the terminal-markup.peggy file in your project directory.
2. Make the necessary changes to the grammar. This could involve adding new rules, modifying existing ones, or fixing bugs.
3. Run the generate.ts script to generate a new parser. You can do this by running `bun parser:generate`
4. The updated parser will be written to `generated-parser.js`.
5. Any new grammar that added or fixed remember to add a test to `test/fixtures.json`
