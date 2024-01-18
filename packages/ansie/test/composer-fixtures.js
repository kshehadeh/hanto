// AUTOMATICALLY GENERATED FILE - DO NOT EDIT - RUN yarn fixture:generate TO UPDATE
import {compose, h1, h2, h3, span, div, p, body, text, markup, list} from '../src/composer'
export default [
    { cmd: () => compose([h1("Hello")]).toString(), markup: "<h1 underline=\"double\" bold=\"true\" fg=\"blue\" marginTop=\"1\" marginBottom=\"1\">Hello</h1>" },
    { cmd: () => compose([h2("Hello")]).toString(), markup: "<h2 underline=\"single\" bold=\"true\" fg=\"default\" marginTop=\"1\" marginBottom=\"1\">Hello</h2>" },
    { cmd: () => compose([h3("Hello")]).toString(), markup: "<h3 underline=\"none\" bold=\"true\" fg=\"gray\" marginTop=\"1\" marginBottom=\"1\">Hello</h3>" },
    { cmd: () => compose([body("Hello")]).toString(), markup: "<body underline=\"none\" fg=\"default\" bg=\"default\">Hello</body>" },
    { cmd: () => compose([p("Hello")]).toString(), markup: "<p marginTop=\"1\" marginBottom=\"1\">Hello</p>" },
    { cmd: () => compose([div("Hello")]).toString(), markup: "<div marginTop=\"1\" marginBottom=\"1\">Hello</div>" },
    { cmd: () => compose([list(["List Item 1", "List Item 2"])]).toString(), markup: "* <div marginTop=\"1\" marginBottom=\"1\">List Item 1</div>* <div marginTop=\"1\" marginBottom=\"1\">List Item 2</div>" },
    { cmd: () => compose([markup("<h1>Hello</h1>")]).toString(), markup: "<h1>Hello</h1>" },
    { cmd: () => compose([span("<h1>Hello</h1>")]).toString(), markup: "<span ><h1>Hello</h1></span>" },
    { cmd: () => compose([h1("H1"), h2("H2"), h3("H3"), body("BODY")]).toString(), markup: "<h1 underline=\"double\" bold=\"true\" fg=\"blue\" marginTop=\"1\" marginBottom=\"1\">H1</h1><h2 underline=\"single\" bold=\"true\" fg=\"default\" marginTop=\"1\" marginBottom=\"1\">H2</h2><h3 underline=\"none\" bold=\"true\" fg=\"gray\" marginTop=\"1\" marginBottom=\"1\">H3</h3><body underline=\"none\" fg=\"default\" bg=\"default\">BODY</body>" },
    { cmd: () => compose([body([h1("H1"), h2("H2"), h3("H3"), p("p")])]).toString(), markup: "<body underline=\"none\" fg=\"default\" bg=\"default\"><h1 underline=\"double\" bold=\"true\" fg=\"blue\" marginTop=\"1\" marginBottom=\"1\">H1</h1><h2 underline=\"single\" bold=\"true\" fg=\"default\" marginTop=\"1\" marginBottom=\"1\">H2</h2><h3 underline=\"none\" bold=\"true\" fg=\"gray\" marginTop=\"1\" marginBottom=\"1\">H3</h3><p marginTop=\"1\" marginBottom=\"1\">p</p></body>" },
    { cmd: () => compose([body(h1("H1")), p(["text1", div("div"), text("text2")])]).toString(), markup: "<body underline=\"none\" fg=\"default\" bg=\"default\"><h1 underline=\"double\" bold=\"true\" fg=\"blue\" marginTop=\"1\" marginBottom=\"1\">H1</h1></body><p marginTop=\"1\" marginBottom=\"1\">text1<div marginTop=\"1\" marginBottom=\"1\">div</div>text2</p>" }
]