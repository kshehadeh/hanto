import { BreakComposerNode } from "./break";
import { BundleComposerNode } from "./bundle";
import { ListComposerNode } from "./list";
import { MarkupComponentNode } from "./markup";
import { ParagraphComposerNode } from "./paragraph";
import { BodyComposerNode, H1ComposerNode, H2ComposerNode, H3ComposerNode, RawTextComposerNode } from "./text";

export const AvailableComposerNodes = [
    BreakComposerNode,
    ListComposerNode,
    MarkupComponentNode,
    BundleComposerNode,
    ParagraphComposerNode,
    H1ComposerNode,
    H2ComposerNode,
    H3ComposerNode,
    BodyComposerNode,
    RawTextComposerNode, // Text node should always be last as it accepts strings as input.  This allows other nodes to override the behavior of the text input if necessary.
] as const;
