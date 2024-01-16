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

RawText  = Text / Break / H1 / H2 / H3 / BODY

H1    "h1"     
    = '<h1'i attrs:TextAttributes '>'
        __ content:(Element)* __ 
        '</h1'i __ '>' __ { return node ('h1', attrs, content) }

H2   "h2"     
    = '<h2'i attrs:TextAttributes '>'
        __ content:(Element)* __ 
        '</h2'i __ '>' __ { return node ('h2', attrs, content) }

H3   "h3"
    = '<h3'i attrs:TextAttributes '>'
        __ content:(Element)* __ 
        '</h3'i __ '>' __ { return node ('h3', attrs, content) }

BODY "body"  
    = '<body'i attrs:Attributes '>'
        __ content:(Element)* __ 
        '</body'i __ '>' __ { return node ('body', attrs, content) }
    

Break   "br"     
    = '<br'i  __ '/>' __ { return node ('break', {}, '\n') }

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
TextAttributes = __ attrs:TextAttribute* __ { return reduceToObj(attrs) }

Attribute "attribute"
  = name:Symbol __ text:(__ '=' __ s:String { return s })? __ { return {name, text} }
  / !'/>' [^> ]+ __ { return null }

Symbol = h:[a-zA-Z0-9_\-] t:[a-zA-Z0-9:_\-]* { return h + t.join('') }


///// TEXT ATTRIBUTES (like h1, h2, h3, etc) /////

TextAttribute "text attribute"
    = name:TextAttributeNames __ text:(__ '=' __ s:String { return s })? __ { return {name, text} }
    / !'/>' [^> ]+ __ { return null }

TextAttributeNames = 'fg' / 'bg' / 'bold' / 'italics' / 'underline'







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

Comment   "comment"   = '/*' text:CommentText '-->' __ {
    node ('comment', null, text)
  }

CommentText = ch:(!( '*/' ) .)* {
    return ch.join( '' )
  }

__ "space characters"
  = [\r\n \t\u000C]*  
