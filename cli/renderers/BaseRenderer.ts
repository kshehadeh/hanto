import { containers } from "scribbler-lib";

export abstract class BaseRenderer {
    private _rendering: boolean;
    private _container: containers.NodeContainerBase;

    constructor(container: containers.NodeContainerBase) {
        this._rendering = false;
        this._container = container;
    }
    get rendering() {
        return this._rendering;
    }
    private set rendering(value) {
        this._rendering = value;
    }
    render() {
        this.rendering = true;
        this.onRender(this._container);
        this.rendering = false;
    }

    abstract onRender(container: containers.NodeContainerBase): void;
}