import { parse } from './parser';

const tests = [
  '<color  name="red" blah="test">This is something</color>',
  '<color name="red"> This is something</color>',
  '<color name="red"> <color name="blue">Blue text</color> This is something</color>',
  'plain text', 
]

for (const test of tests) {
  console.log(test, parse(test));
}