import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import { setup, useTestContext } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

const fixture = fileURLToPath(new URL('../../playground', import.meta.url))

await setup({
  rootDir: fixture,
  server: false,
  nuxtConfig: {
    ssr: false,
    nitro: {
      prerender: {
        routes: ['/', '/200.html']
      }
    }
  }
})

describe('ssr: false, target: static, generated files', () => {
  it('generated file', async () => {
    const ctx = useTestContext()
    const generateDir = resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public')
    const files = ['index.html', '200.html']
    for (const file of files) {
      const contents = await readFile(join(generateDir, file), 'utf-8')
      expect(contents).toContain("getItem('nuxt-color-mode')")
    }
  })
})
