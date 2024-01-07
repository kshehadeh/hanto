import { build, clean } from '@hanto/build'

clean()
await build(import.meta.dir, 'bun', true)
