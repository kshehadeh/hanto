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
        if (x && x.name){
            obj[x.name] = x.text
        }
        return obj
    }
        , {})
  }
}

Document = __ nodes:Element* { return nodes }

Element  = RawText / Nested / Void / Comment

RawText  = Color / Bold / Italics / Underline / Text

Color     "color"     
    = '<color'i attrs:Attributes '>' 
        __ content:(Element)* __ 
        '</color'i __ '>' __ { return node ('color', attrs, content) }

Bold     "bold"     
    = '<bold'i '>' 
        __ content:(Element)* __ 
        '</bold'i __ '>' __ { return node ('bold', {}, content) }

Italics   "italics"     
    = '<italics'i '>' 
        __ content:(Element)* __ 
        '</italics'i __ '>' __ { return node ('italics', {}, content) }

Underline   "underline"     
    = '<underline'i  attrs:Attributes '>' 
        __ content:(Element)* __ 
        '</underline'i __ '>' __ { return node ('underline', attrs, content) }

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

Attribute "attribute"
  = name:Symbol __ text:(__ '=' __ s:String { return s })? __ { return {name, text} }
  / !'/>' [^> ]+ __ { return null }

Symbol = h:[a-zA-Z0-9_\-] t:[a-zA-Z0-9:_\-]* { return h + t.join('') }

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
