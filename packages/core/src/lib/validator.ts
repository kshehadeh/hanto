import { Issue } from '@/interfaces';
import orchestrator from './orchestrator';
import { Rule } from './rule';

export class Validator {
    protected _projectId: string;
    protected _valid: boolean;
    protected _errors: Issue[];
    protected _warnings: Issue[];
    protected _rules: Rule[];

    public constructor() {
        this._projectId = '';
        this._valid = false;
        this._errors = [];
        this._warnings = [];
        this._rules = [];
    }

    public initialize(projectId: string): boolean {
        this._projectId = projectId;

        this._rules.forEach(r => {
            if (!r.initialize(projectId)) {
                this._errors.push({
                    message: `Failed to initialize rule ${r.name}`,
                });
            }
        });

        return this._errors.length === 0;
    }

    public add(rule: Rule) {
        this._rules.push(rule);
    }

    public get rules() {
        return this._rules;
    }

    public async validate(): Promise<boolean> {
        for (const rule of this._rules) {
            if (!rule.active) {
                continue;
            }

            const result = await rule.check();
            if (!result) {
                // If the rule is not valid, then we need to add the errors and warnings
                //  as-is because it means that the check wasn't able to run at all for some
                //  reason.
                this._errors.push(...rule.errors);
                this._warnings.push(...rule.warnings);
            } else {
                // Always add the warnings to the validator but...
                //  If the rule is configured to treat errors as warnings, then add the errors
                //  to the warnings list.  Otherwise, add them to the errors list.
                this._warnings.push(...rule.warnings);

                if (rule.isErrorAsWarning) {
                    this._warnings.push(...rule.errors);
                } else {
                    this._errors.push(...rule.errors);
                }
            }
        }

        return this._errors.length === 0;
    }

    public get project() {
        return orchestrator.project(this._projectId);
    }

    public get errors() {
        return this._errors;
    }

    public get warnings() {
        return this._warnings;
    }
}
