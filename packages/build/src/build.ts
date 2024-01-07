import { type Target, build as bunBuild } from 'bun'
import { resolve } from 'path'

export async function build(projectDir: string, target: Target, externalizeCore: boolean = false) {    

    const result = await bunBuild({
        entrypoints: [resolve(projectDir, './index.ts')],
        outdir: resolve(projectDir, `./dist/${target}`),
        minify: true,
        sourcemap: 'external',
        external: externalizeCore ? ['@hanto/core'] : [],
        target,
    })

    // Construct a list of indexed errors for display in the table
    const errorsObject = result.logs
        .filter((l) => l.level === 'error')
        .reduce<Record<string, string>>((acc, cur, idx) => { 
            acc[`Error ${idx+1}`] = cur.message; 
            return acc 
        }, {})

    console.table({
        'Target': target,
        'Success': result.success,
        'Path': result.outputs?.[0]?.path,
        ...errorsObject,
    })
}