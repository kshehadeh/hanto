{
  function node (name, attributes, content) {
    return {        
        node: name,
        ...attributes,
        content
    }
  }

  function reduceToObj (xs) {
    return xs.reduce((obj, x) => {
        if (x && x.name) {
            // If the value is empty or true or yes then assume it is a boolean that indicates true
            if ([undefined, null, "true", "yes", ""].includes(x.text)) {
                x.text = true

            // If the value is a string that equals false or no then assume it's a boolean
            } else if (["false", "no"].includes(x.text)) {
                x.text = false

            // If the value is a number then convert it to a number
            } else {
                const num = parseInt(x.text, 10);
                if (!isNaN(num)) {
                    x.text = num;
                }
            }
            
            obj[x.name] = x.text
        }
        return obj
    }
        , {})
  }
}

Document = __ nodes:Element* { return nodes }

Element  = RawText / Nested / Void / Comment

RawText  = Text / Break / H1 / H2 / H3 / BODY / DIV / P / SPAN

H1    "h1"     
    = '<h1'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</h1'i __ '>' __ { return node ('h1', attrs, content) }

H2   "h2"     
    = '<h2'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</h2'i __ '>' __ { return node ('h2', attrs, content) }

H3   "h3"
    = '<h3'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</h3'i __ '>' __ { return node ('h3', attrs, content) }

SPAN  "span"     
    = '<span'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</span'i __ '>' __ { return node ('span', attrs, content) }

DIV "div"     
    = '<div'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</div'i __ '>' __ { return node ('div', attrs, content) }

P "p"     
    = '<p'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</p'i __ '>' __ { return node ('p', attrs, content) }

BODY "body"
    = '<body'i attrs:BlockAttributes '>'
        __ content:(Element)* __ 
        '</body'i __ '>' __ { return node ('body', attrs, content) }
    

Break   "br"     
    = '<br'i attrs:(SpaceAttributes)  __ '/>' __ { return node ('break', {}, '\n') }

/**
 * Void element (with self closing tag, w/o content)
 * - 'area'i / 'base'i / 'br'i / 'col'i / 'embed'i / 'hr'i / 'img'i / 'input'i / 'keygen'i / 'link'i / 'meta'i / 'param'i / 'source'i / 'track'i / 'wbr'i
 */
Void      "element"   = '<' name:Symbol attrs:Attributes ('/>' / '>') __ { return node (name), attrs }

Text "text"
  = ch:(c:[^<] { return c })+ {
    return node ('text', {value: ch.join('')}, [])
  }
  / ch:(!TagEnd !Void !Comment c:. { return c })+ {
    return node ('text', {value: ch.join('')}, [])
  }

Attributes = __ attrs:Attribute* __ { return reduceToObj(attrs) }
TextAttributes = __ attrs:(TextAttribute)* __ { return reduceToObj(attrs) }
SpaceAttributes = __ attrs:(SpaceAttribute)* __ { return reduceToObj(attrs) }
BlockAttributes = __ attrs:(BlockAttribute)* __ { return reduceToObj(attrs) }

Attribute "attribute"
  = name:Symbol __ text:(__ '=' __ s:String { return s })? __ { return {name, text} }
  / !'/>' [^> ]+ __ { return null }

Symbol = h:[a-zA-Z0-9_\-] t:[a-zA-Z0-9:_\-]* { return h + t.join('') }


TextAttributeNames = 'fg' / 'bg' / 'bold' / 'italics' / 'underline'
SpaceAttributeNames = 'marginTop' / 'marginBottom' / 'marginLeft' / 'marginRight' / 'margin'
BlockAttributeNames = TextAttributeNames / SpaceAttributeNames

///// TEXT ATTRIBUTES (like fg, bg, bold, etc) /////

TextAttribute "text attribute"
    = name:TextAttributeNames __ text:(__ '=' __ s:String { return s })? __ { return {name, text} }
    / !'/>' [^> ]+ __ { return null }

///// SPACING ATTRIBUTES (like margin, etc) /////

SpaceAttribute "space attribute"
    = name:SpaceAttributeNames __ text:(__ '=' __ s:(Number/String) { return s })? __ { return {name, text} }
    / !'/>' [^> ]+ __ { return null }

///// BLOCK ATTRIBUTES (used for block tags like h1, h2, h3, div, body, p) /////

BlockAttribute "block attribute"
    = name:BlockAttributeNames __ text:(__ '=' __ s:(Number/String) { return s })? __ { return {name, text} }
    / !'/>' [^> ]+ __ { return null }

Nested    "element"   = begin:TagBegin __ content:Element* __ end:TagEnd __ &{ return begin.node == end } {
    node (begin.node, begin.attrs, content)
  }



TagBegin  "begin tag" = '<'  name:Symbol attrs:Attributes '>' { return node (name.toLowerCase(), attrs) }
TagEnd    "end tag"   = '</' name:Symbol __               '>' { return name.toLowerCase() }

/**
 * String - single, double, w/o quotes
 */
String "string"
  = '"'  ch:[^"]*      '"'  __ { return ch.join('') }
  / '\'' ch:[^']*      '\'' __ { return ch.join('') }
  /      ch:[^"'<>` ]+      __ { return ch.join('') }

Number "number"
  = ch:[0-9]+ __ { return parseInt(ch.join(''), 10) }

Comment   "comment"   = '/*' text:CommentText '-->' __ {
    node ('comment', null, text)
  }

CommentText = ch:(!( '*/' ) .)* {
    return ch.join( '' )
  }

__ "space characters"
  = [\r\n \t\u000C]*  
