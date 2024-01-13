import { resolve, join } from 'path'
import { build, type Target } from 'bun'

const projectDir = import.meta.dir
const targets: Target[] = ['node', 'bun']

for (const target of targets) {
    build({
        entrypoints: [join(projectDir, './index.ts'), join(projectDir, './cli.ts')],
        outdir: resolve(projectDir, `./dist/${target}`),
        minify: true,
        sourcemap: 'external',
        target,
    })    
}
