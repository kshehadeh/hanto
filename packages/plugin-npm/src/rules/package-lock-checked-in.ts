import { Rule } from "@hanto/core";

export class PackageLockCheckedInRule extends Rule{
    get name(): string {
        return "package-lock-checked-in";
    }
    get description(): string {
        return "Checks if package-lock.json is checked in";
    }
    async check(): Promise<boolean> {
        if (!this.project) {
            this._errors.push({
                message: 'project is required for package-lock-checked-in rule',
            });
            return false;
        }

        const gitLoader = this.project.loader('git');
        if (!gitLoader) {
            this._errors.push({
                message: 'git loader is required for package-lock-checked-in rule',
            });
            return false;
        }        

        const result = gitLoader.call('isFileTracked', {
            relativePath: 'package-lock.json',
        })

        if (!result) {
            this._errors.push({
                message: 'package-lock.json being tracked in git',
            });
        }

        return true
    }
    
}