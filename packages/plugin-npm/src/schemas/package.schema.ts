import { z } from 'zod';

export default z
    .object({
        name: z
            .string()
            .regex(
                /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/,
            )
            .min(1)
            .max(214)
            .describe('The name of the package.')
            .optional(),
        version: z
            .string()
            .describe(
                'Version must be parseable by node-semver, which is bundled with npm as a dependency.',
            )
            .optional(),
        description: z
            .string()
            .describe(
                "This helps people discover your package, as it's listed in 'npm search'.",
            )
            .optional(),
        keywords: z
            .array(z.string())
            .describe(
                "This helps people discover your package as it's listed in 'npm search'.",
            )
            .optional(),
        homepage: z
            .string()
            .describe('The url to the project homepage.')
            .optional(),
        bugs: z
            .union([
                z
                    .object({
                        url: z
                            .string()
                            .url()
                            .describe(
                                "The url to your project's issue tracker.",
                            )
                            .optional(),
                        email: z
                            .string()
                            .email()
                            .describe(
                                'The email address to which issues should be reported.',
                            )
                            .optional(),
                    })
                    .describe(
                        "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.",
                    ),
                z
                    .string()
                    .describe(
                        "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.",
                    ),
            ])
            .describe(
                "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.",
            )
            .optional(),
        license: z
            .any()
            .describe(
                "You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.",
            )
            .optional(),
        licenses: z
            .array(
                z.object({
                    type: z.any().optional(),
                    url: z.string().url().optional(),
                }),
            )
            .describe(
                'DEPRECATED: Instead, use SPDX expressions, like this: { "license": "ISC" } or { "license": "(MIT OR Apache-2.0)" } see: \'https://docs.npmjs.com/files/package.json#license\'.',
            )
            .optional(),
        author: z.any().optional(),
        contributors: z
            .array(z.any())
            .describe('A list of people who contributed to this package.')
            .optional(),
        maintainers: z
            .array(z.any())
            .describe('A list of people who maintains this package.')
            .optional(),
        files: z
            .array(z.string())
            .describe(
                "The 'files' field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder.",
            )
            .optional(),
        main: z
            .string()
            .describe(
                'The main field is a module ID that is the primary entry point to your program.',
            )
            .optional(),
        exports: z
            .any()
            .superRefine((x, ctx) => {
                const schemas = [
                    z
                        .any()
                        .describe(
                            'The module path that is resolved when the module specifier matches "name", shadows the "main" field.',
                        ),
                    z
                        .object({
                            '.': z
                                .any()
                                .describe(
                                    'The module path that is resolved when the module specifier matches "name", shadows the "main" field.',
                                )
                                .optional(),
                        })
                        .catchall(
                            z.union([
                                z
                                    .any()
                                    .describe(
                                        'The module path prefix that is resolved when the module specifier starts with "name/", set to "./*" to allow external modules to import any subpath.',
                                    ),
                                z.never(),
                            ]),
                        )
                        .superRefine((value, ctx) => {
                            for (const key in value) {
                                let evaluated = ['.'].includes(key);
                                if (RegExp(/^\.\/.+/).exec(key)) {
                                    evaluated = true;
                                    const result = z
                                        .any()
                                        .describe(
                                            'The module path prefix that is resolved when the module specifier starts with "name/", set to "./*" to allow external modules to import any subpath.',
                                        )
                                        .safeParse(value[key]);
                                    if (!result.success) {
                                        ctx.addIssue({
                                            path: [...ctx.path, key],
                                            code: 'custom',
                                            message: `Invalid input: Key matching regex /${key}/ must match schema`,
                                            params: {
                                                issues: result.error.issues,
                                            },
                                        });
                                    }
                                }
                                if (!evaluated) {
                                    const result = z
                                        .never()
                                        .safeParse(value[key]);
                                    if (!result.success) {
                                        ctx.addIssue({
                                            path: [...ctx.path, key],
                                            code: 'custom',
                                            message: `Invalid input: must match catchall schema`,
                                            params: {
                                                issues: result.error.issues,
                                            },
                                        });
                                    }
                                }
                            }
                        }),
                    z
                        .any()
                        .describe(
                            'The module path that is resolved when the module specifier matches "name", shadows the "main" field.',
                        ),
                    z
                        .any()
                        .describe(
                            'The module path that is resolved when the module specifier matches "name", shadows the "main" field.',
                        ),
                ];
                const errors = schemas.reduce(
                    (errors: z.ZodError[], schema) =>
                        (result =>
                            'error' in result
                                ? [...errors, result.error]
                                : errors)(schema.safeParse(x)),
                    [],
                );
                if (schemas.length - errors.length !== 1) {
                    ctx.addIssue({
                        path: ctx.path,
                        code: 'invalid_union',
                        unionErrors: errors,
                        message: 'Invalid input: Should pass single schema',
                    });
                }
            })
            .describe(
                'The "exports" field is used to restrict external access to non-exported module files, also enables a module to import itself using "name".',
            )
            .optional(),
        bin: z.union([z.string(), z.record(z.string())]).optional(),
        type: z
            .enum(['commonjs', 'module'])
            .describe(
                'When set to "module", the type field allows a package to specify all .js files within are ES modules. If the "type" field is omitted or set to "commonjs", all .js files are treated as CommonJS.',
            )
            .default('commonjs'),
        types: z
            .string()
            .describe(
                'Set the types property to point to your bundled declaration file.',
            )
            .optional(),
        typings: z
            .string()
            .describe(
                'Note that the "typings" field is synonymous with "types", and could be used as well.',
            )
            .optional(),
        typesVersions: z
            .record(
                z
                    .object({
                        '*': z
                            .array(z.string().regex(/^[^*]*(?:\*[^*]*)?$/))
                            .describe(
                                'Maps all file paths to the file paths specified in the array.',
                            )
                            .optional(),
                    })
                    .catchall(
                        z.union([
                            z
                                .array(z.string())
                                .describe(
                                    'Maps the file path matching the property key to the file paths specified in the array.',
                                ),
                            z
                                .array(z.string().regex(/^[^*]*(?:\*[^*]*)?$/))
                                .describe(
                                    'Maps file paths matching the pattern specified in property key to file paths specified in the array.',
                                ),
                            z.never(),
                        ]),
                    )
                    .superRefine((value, ctx) => {
                        for (const key in value) {
                            let evaluated = ['*'].includes(key);
                            if (RegExp(/^[^*]+$/).exec(key)) {
                                evaluated = true;
                                const result = z
                                    .array(z.string())
                                    .describe(
                                        'Maps the file path matching the property key to the file paths specified in the array.',
                                    )
                                    .safeParse(value[key]);
                                if (!result.success) {
                                    ctx.addIssue({
                                        path: [...ctx.path, key],
                                        code: 'custom',
                                        message: `Invalid input: Key matching regex /${key}/ must match schema`,
                                        params: {
                                            issues: result.error.issues,
                                        },
                                    });
                                }
                            }
                            if (RegExp(/^[^*]*\*[^*]*$/).exec(key)) {
                                evaluated = true;
                                const result = z
                                    .array(
                                        z.string().regex(/^[^*]*(?:\*[^*]*)?$/),
                                    )
                                    .describe(
                                        'Maps file paths matching the pattern specified in property key to file paths specified in the array.',
                                    )
                                    .safeParse(value[key]);
                                if (!result.success) {
                                    ctx.addIssue({
                                        path: [...ctx.path, key],
                                        code: 'custom',
                                        message: `Invalid input: Key matching regex /${key}/ must match schema`,
                                        params: {
                                            issues: result.error.issues,
                                        },
                                    });
                                }
                            }
                            if (!evaluated) {
                                const result = z.never().safeParse(value[key]);
                                if (!result.success) {
                                    ctx.addIssue({
                                        path: [...ctx.path, key],
                                        code: 'custom',
                                        message: `Invalid input: must match catchall schema`,
                                        params: {
                                            issues: result.error.issues,
                                        },
                                    });
                                }
                            }
                        }
                    })
                    .describe(
                        'Contains overrides for the TypeScript version that matches the version range matching the property key.',
                    ),
            )
            .describe(
                'The "typesVersions" field is used since TypeScript 3.1 to support features that were only made available in newer TypeScript versions.',
            )
            .optional(),
        man: z
            .union([
                z
                    .array(z.string())
                    .describe(
                        'Specify either a single file or an array of filenames to put in place for the man program to find.',
                    ),
                z
                    .string()
                    .describe(
                        'Specify either a single file or an array of filenames to put in place for the man program to find.',
                    ),
            ])
            .describe(
                'Specify either a single file or an array of filenames to put in place for the man program to find.',
            )
            .optional(),
        directories: z
            .object({
                bin: z
                    .string()
                    .describe(
                        "If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash.",
                    )
                    .optional(),
                doc: z
                    .string()
                    .describe(
                        'Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.',
                    )
                    .optional(),
                example: z
                    .string()
                    .describe(
                        'Put example scripts in here. Someday, it might be exposed in some clever way.',
                    )
                    .optional(),
                lib: z
                    .string()
                    .describe(
                        "Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info.",
                    )
                    .optional(),
                man: z
                    .string()
                    .describe(
                        "A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder.",
                    )
                    .optional(),
                test: z.string().optional(),
            })
            .optional(),
        repository: z
            .union([
                z
                    .object({
                        type: z.string().optional(),
                        url: z.string().optional(),
                        directory: z.string().optional(),
                    })
                    .describe(
                        'Specify the place where your code lives. This is helpful for people who want to contribute.',
                    ),
                z
                    .string()
                    .describe(
                        'Specify the place where your code lives. This is helpful for people who want to contribute.',
                    ),
            ])
            .describe(
                'Specify the place where your code lives. This is helpful for people who want to contribute.',
            )
            .optional(),
        funding: z
            .any()
            .superRefine((x, ctx) => {
                const schemas = [
                    z.any(),
                    z.any(),
                    z
                        .array(
                            z.any().superRefine((x, ctx) => {
                                const schemas = [z.any(), z.any()];
                                const errors = schemas.reduce(
                                    (errors: z.ZodError[], schema) =>
                                        (result =>
                                            'error' in result
                                                ? [...errors, result.error]
                                                : errors)(schema.safeParse(x)),
                                    [],
                                );
                                if (schemas.length - errors.length !== 1) {
                                    ctx.addIssue({
                                        path: ctx.path,
                                        code: 'invalid_union',
                                        unionErrors: errors,
                                        message:
                                            'Invalid input: Should pass single schema',
                                    });
                                }
                            }),
                        )
                        .min(1),
                ];
                const errors = schemas.reduce(
                    (errors: z.ZodError[], schema) =>
                        (result =>
                            'error' in result
                                ? [...errors, result.error]
                                : errors)(schema.safeParse(x)),
                    [],
                );
                if (schemas.length - errors.length !== 1) {
                    ctx.addIssue({
                        path: ctx.path,
                        code: 'invalid_union',
                        unionErrors: errors,
                        message: 'Invalid input: Should pass single schema',
                    });
                }
            })
            .optional(),
        scripts: z
            .object({
                lint: z
                    .string()
                    .describe(
                        'Run code quality tools, e.g. ESLint, TSLint, etc.',
                    )
                    .optional(),
                prepublish: z
                    .string()
                    .describe(
                        'Run BEFORE the package is published (Also run on local npm install without any arguments).',
                    )
                    .optional(),
                prepare: z
                    .string()
                    .describe(
                        'Run both BEFORE the package is packed and published, and on local npm install without any arguments. This is run AFTER prepublish, but BEFORE prepublishOnly.',
                    )
                    .optional(),
                prepublishOnly: z
                    .string()
                    .describe(
                        'Run BEFORE the package is prepared and packed, ONLY on npm publish.',
                    )
                    .optional(),
                prepack: z
                    .string()
                    .describe(
                        'run BEFORE a tarball is packed (on npm pack, npm publish, and when installing git dependencies).',
                    )
                    .optional(),
                postpack: z
                    .string()
                    .describe(
                        'Run AFTER the tarball has been generated and moved to its final destination.',
                    )
                    .optional(),
                publish: z
                    .string()
                    .describe(
                        'Publishes a package to the registry so that it can be installed by name. See https://docs.npmjs.com/cli/v8/commands/npm-publish',
                    )
                    .optional(),
                postpublish: z.any().optional(),
                preinstall: z
                    .string()
                    .describe('Run BEFORE the package is installed.')
                    .optional(),
                install: z.any().optional(),
                postinstall: z.any().optional(),
                preuninstall: z.any().optional(),
                uninstall: z.any().optional(),
                postuninstall: z
                    .string()
                    .describe('Run AFTER the package is uninstalled.')
                    .optional(),
                preversion: z.any().optional(),
                version: z.any().optional(),
                postversion: z
                    .string()
                    .describe('Run AFTER bump the package version.')
                    .optional(),
                pretest: z.any().optional(),
                test: z.any().optional(),
                posttest: z.any().optional(),
                prestop: z.any().optional(),
                stop: z.any().optional(),
                poststop: z.any().optional(),
                prestart: z.any().optional(),
                start: z.any().optional(),
                poststart: z.any().optional(),
                prerestart: z.any().optional(),
                restart: z.any().optional(),
                postrestart: z.any().optional(),
                serve: z
                    .string()
                    .describe('Start dev server to serve application files')
                    .optional(),
            })
            .catchall(z.string())
            .describe(
                "The 'scripts' member is an object hash of script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.",
            )
            .optional(),
        config: z
            .record(z.any())
            .describe(
                "A 'config' hash can be used to set configuration parameters used in package scripts that persist across upgrades.",
            )
            .optional(),
        dependencies: z.any().optional(),
        devDependencies: z.any().optional(),
        optionalDependencies: z.any().optional(),
        peerDependencies: z.any().optional(),
        peerDependenciesMeta: z
            .record(
                z
                    .object({
                        optional: z
                            .boolean()
                            .describe(
                                'Specifies that this peer dependency is optional and should not be installed automatically.',
                            )
                            .optional(),
                    })
                    .catchall(z.any()),
            )
            .describe(
                'When a user installs your package, warnings are emitted if packages specified in "peerDependencies" are not already installed. The "peerDependenciesMeta" field serves to provide more information on how your peer dependencies are utilized. Most commonly, it allows peer dependencies to be marked as optional. Metadata for this field is specified with a simple hash of the package name to a metadata object.',
            )
            .optional(),
        bundledDependencies: z
            .any()
            .superRefine((x, ctx) => {
                const schemas = [z.array(z.string()), z.boolean()];
                const errors = schemas.reduce(
                    (errors: z.ZodError[], schema) =>
                        (result =>
                            'error' in result
                                ? [...errors, result.error]
                                : errors)(schema.safeParse(x)),
                    [],
                );
                if (schemas.length - errors.length !== 1) {
                    ctx.addIssue({
                        path: ctx.path,
                        code: 'invalid_union',
                        unionErrors: errors,
                        message: 'Invalid input: Should pass single schema',
                    });
                }
            })
            .describe(
                'Array of package names that will be bundled when publishing the package.',
            )
            .optional(),
        bundleDependencies: z
            .any()
            .superRefine((x, ctx) => {
                const schemas = [z.array(z.string()), z.boolean()];
                const errors = schemas.reduce(
                    (errors: z.ZodError[], schema) =>
                        (result =>
                            'error' in result
                                ? [...errors, result.error]
                                : errors)(schema.safeParse(x)),
                    [],
                );
                if (schemas.length - errors.length !== 1) {
                    ctx.addIssue({
                        path: ctx.path,
                        code: 'invalid_union',
                        unionErrors: errors,
                        message: 'Invalid input: Should pass single schema',
                    });
                }
            })
            .describe(
                'DEPRECATED: This field is honored, but "bundledDependencies" is the correct field name.',
            )
            .optional(),
        resolutions: z
            .record(z.any())
            .describe(
                'Resolutions is used to support selective version resolutions using yarn, which lets you define custom package versions or ranges inside your dependencies. For npm, use overrides instead. See: https://classic.yarnpkg.com/en/docs/selective-version-resolutions',
            )
            .optional(),
        overrides: z
            .record(z.any())
            .describe(
                'Overrides is used to support selective version overrides using npm, which lets you define custom package versions or ranges inside your dependencies. For yarn, use resolutions instead. See: https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides',
            )
            .optional(),
        packageManager: z
            .string()
            .regex(/(npm|pnpm|yarn|bun)@\d+\.\d+\.\d+(-.+)?/)
            .describe(
                'Defines which package manager is expected to be used when working on the current project. This field is currently experimental and needs to be opted-in; see https://nodejs.org/api/corepack.html',
            )
            .optional(),
        engines: z
            .object({ node: z.string().optional() })
            .catchall(z.string())
            .optional(),
        volta: z
            .object({
                extends: z
                    .string()
                    .describe(
                        'The value of that entry should be a path to another JSON file which also has a "volta" section',
                    )
                    .optional(),
            })
            .catchall(z.string())
            .superRefine((value, ctx) => {
                for (const key in value) {
                    if (RegExp(/(node|npm|pnpm|yarn)/).exec(key)) {
                        const result = z.string().safeParse(value[key]);
                        if (!result.success) {
                            ctx.addIssue({
                                path: [...ctx.path, key],
                                code: 'custom',
                                message: `Invalid input: Key matching regex /${key}/ must match schema`,
                                params: {
                                    issues: result.error.issues,
                                },
                            });
                        }
                    }
                }
            })
            .describe(
                'Defines which tools and versions are expected to be used when Volta is installed.',
            )
            .optional(),
        engineStrict: z.boolean().optional(),
        os: z
            .array(z.string())
            .describe(
                'Specify which operating systems your module will run on.',
            )
            .optional(),
        cpu: z
            .array(z.string())
            .describe(
                'Specify that your code only runs on certain cpu architectures.',
            )
            .optional(),
        preferGlobal: z
            .boolean()
            .describe(
                'DEPRECATED: This option used to trigger an npm warning, but it will no longer warn. It is purely there for informational purposes. It is now recommended that you install any binaries as local devDependencies wherever possible.',
            )
            .optional(),
        private: z
            .any()
            .superRefine((x, ctx) => {
                const schemas = [z.boolean(), z.enum(['false', 'true'])];
                const errors = schemas.reduce(
                    (errors: z.ZodError[], schema) =>
                        (result =>
                            'error' in result
                                ? [...errors, result.error]
                                : errors)(schema.safeParse(x)),
                    [],
                );
                if (schemas.length - errors.length !== 1) {
                    ctx.addIssue({
                        path: ctx.path,
                        code: 'invalid_union',
                        unionErrors: errors,
                        message: 'Invalid input: Should pass single schema',
                    });
                }
            })
            .describe('If set to true, then npm will refuse to publish it.')
            .optional(),
        publishConfig: z
            .object({
                access: z.enum(['public', 'restricted']).optional(),
                tag: z.string().optional(),
                registry: z.string().url().optional(),
            })
            .catchall(z.any())
            .optional(),
        dist: z
            .object({
                shasum: z.string().optional(),
                tarball: z.string().optional(),
            })
            .optional(),
        readme: z.string().optional(),
        module: z
            .string()
            .describe(
                'An ECMAScript module ID that is the primary entry point to your program.',
            )
            .optional(),
        esnext: z
            .union([
                z
                    .string()
                    .describe(
                        'A module ID with untranspiled code that is the primary entry point to your program.',
                    ),
                z
                    .object({
                        main: z.string().optional(),
                        browser: z.string().optional(),
                    })
                    .catchall(z.string())
                    .describe(
                        'A module ID with untranspiled code that is the primary entry point to your program.',
                    ),
            ])
            .describe(
                'A module ID with untranspiled code that is the primary entry point to your program.',
            )
            .optional(),
        workspaces: z
            .union([
                z
                    .array(z.string())
                    .describe(
                        'Workspace package paths. Glob patterns are supported.',
                    ),
                z.object({
                    packages: z
                        .array(z.string())
                        .describe(
                            'Workspace package paths. Glob patterns are supported.',
                        )
                        .optional(),
                    nohoist: z
                        .array(z.string())
                        .describe(
                            'Packages to block from hoisting to the workspace root. Currently only supported in Yarn only.',
                        )
                        .optional(),
                }),
            ])
            .describe(
                'Allows packages within a directory to depend on one another using direct linking of local files. Additionally, dependencies within a workspace are hoisted to the workspace root when possible to reduce duplication. Note: It\'s also a good idea to set "private" to true when using this feature.',
            )
            .optional(),
        jspm: z.any().optional(),
        eslintConfig: z.any().optional(),
        prettier: z.any().optional(),
        stylelint: z.any().optional(),
        ava: z.any().optional(),
        release: z.any().optional(),
        jscpd: z.any().optional(),
    })
    .catchall(z.any().describe('Any property starting with _ is valid.'))
    .superRefine((value, ctx) => {
        for (const key in value) {
            if (RegExp(/^_/).exec(key)) {
                const result = z
                    .any()
                    .describe('Any property starting with _ is valid.')
                    .safeParse(value[key]);
                if (!result.success) {
                    ctx.addIssue({
                        path: [...ctx.path, key],
                        code: 'custom',
                        message: `Invalid input: Key matching regex /${key}/ must match schema`,
                        params: {
                            issues: result.error.issues,
                        },
                    });
                }
            }
        }
    })
    .and(z.union([z.record(z.any()), z.record(z.any()), z.record(z.any())]));
