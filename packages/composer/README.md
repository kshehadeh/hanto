# @hanto/composer

A library used to render a simplified html-like declarative language to rich terminal text.  

For example,

```xml
<bold>Title</bold>
<color name="gray">Subtitle goes here</color>
A description using the default text will appear here.  But you can also include 
<underline><italics>nested</italics></underline> values.
```

## Installation

``` bun add @hanto/composer ```

## Usage

```typescript
import { compile } from "@hanto/composer"
console.log(compile('<bold>This is bold</bold>'))

// Output: "\u001b[1mThis is bold\u001b[21m"
```

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

## About the Markup Language

The markup language follows XML rules in that it uses a declarative tag-based system of angle brackets and attributes.  The supported tags available today are:

1. Color - attributes include `color` which is a string containing the name of the color (e.g. "red")
2. Bold - No attributes
3. Italics - No attributes
4. Underline - No attributes

Additionally you can have regular text that is not enclosed in a tag.

Tags can be nested and will render the way you would expect.  So, for example,

```
<color name="red">This is red but <color name="blue"> this is blue </color> and this is red again </color>
```

## Updating the Grammar

The parser code in this context is generated from a grammar file (terminal-markup.peggy) using the peggy library. If you want to update the parser, you would need to modify the grammar file and then re-run the generate.ts script to create a new parser. Here are the steps:

1. Navigate to the terminal-markup.peggy file in your project directory.
2. Make the necessary changes to the grammar. This could involve adding new rules, modifying existing ones, or fixing bugs.
3. Run the generate.ts script to generate a new parser. You can do this by running `bun parser:generate`
4. The updated parser will be written to `generated-parser.js`.
5. Any new grammar that added or fixed remember to add a test to `test/fixtures.json`
