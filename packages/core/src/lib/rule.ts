import { Issue } from '@/interfaces';
import orchestrator from './orchestrator';

export abstract class Rule {
    protected _projectId: string;
    protected _valid: boolean;
    protected _errors: Issue[];
    protected _warnings: Issue[];
    protected _active: boolean;
    protected _errorsAsWarnings: boolean;

    public constructor() {
        this._projectId = '';
        this._valid = false;
        this._errors = [];
        this._warnings = [];
        this._active = true;
        this._errorsAsWarnings = false;
    }

    public initialize(projectId: string): boolean {
        this._projectId = projectId;
        return true;
    }

    abstract get name(): string;
    abstract get description(): string;
    abstract check(): Promise<boolean>;

    public get project() {
        return orchestrator.project(this._projectId);
    }

    public get errors() {
        return this._errors;
    }

    public get warnings() {
        return this._warnings;
    }

    public get isErrorAsWarning() {
        return this._errorsAsWarnings;
    }

    public get active() {
        return this._active;
    }

    public set active(value: boolean) {
        this._active = value;
    }

    public set errorsAsWarnings(value: boolean) {
        this._errorsAsWarnings = value;
    }
}
