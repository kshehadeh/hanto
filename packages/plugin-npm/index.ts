import { NpmLoader } from "./src/loader";
import { PackageLockCheckedInRule } from "./src/rules/package-lock-checked-in";

export default {
    loader: new NpmLoader(),
    rules: [
        new PackageLockCheckedInRule(),
    ]
}
