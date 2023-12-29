import { render } from "ink";
import { NodeContainerBase } from "../../../web/lib/containers/base";
import { BaseRenderer } from "../BaseRenderer";
import { ModuleView } from "./ModuleView";
import { ModuleContainer } from "../../../web/lib/containers/module";

export class ModuleAnalyzerRenderer extends BaseRenderer {
    
    onRender(container: NodeContainerBase): void {
        if (container.type === 'Program') {
            render(<ModuleView module={container as ModuleContainer} />);
        }        
    }
}