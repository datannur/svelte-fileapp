import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'vite/index': 'src/vite/index.ts',
        'ssg/index': 'src/ssg/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      external: [
        ...builtinModules,
        'svelte',
        'svelte/store',
        'navigo',
        'sitemap',
        'sirv',
        'playwright',
      ],
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
      emitCss: false,
    }),
    dts({
      include: ['src/**/*'],
      exclude: ['test/**/*'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
    {
      name: 'copy-svelte-sources',
      writeBundle() {
        // Copy GenericRouter.svelte source with .js imports
        let svelteContent = fs.readFileSync(
          'src/router/GenericRouter.svelte',
          'utf-8',
        )

        // Transform imports to point to compiled .js modules
        svelteContent = svelteContent
          .replace(/from '\.\/router\.svelte'/g, "from './router.svelte.js'")
          .replace(/from '\.\/router-store'/g, "from './router-store.js'")
          .replace(/from '\.\/router-helpers'/g, "from './router-helpers.js'")
          .replace(
            /from '\.\/router-registration'/g,
            "from './router-registration.js'",
          )
          .replace(/from '\.\.\/url'/g, "from '../url.js'")

        const destDir = path.dirname('dist/router/GenericRouter.svelte')
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        fs.writeFileSync(
          'dist/router/GenericRouter.svelte',
          svelteContent,
          'utf-8',
        )

        // Create .d.ts for GenericRouter.svelte
        const dtsContent = `import { SvelteComponent } from 'svelte'
import type { RouterIndex } from './router-registration'

export interface GenericRouterProps<T extends string = string> {
  routerIndex: RouterIndex
  whenAppReady: Promise<void>
  onRouteChange?: (ctx: {
    entity: T
    params: Record<string, unknown>
    entityId: string
  }) => void
  getEntityData?: (entity: string, id: string) => unknown
  errorPage?: T
  loadingPage?: T
}

export default class GenericRouter<T extends string = string> extends SvelteComponent<GenericRouterProps<T>> {}
`
        fs.writeFileSync(
          'dist/router/GenericRouter.svelte.d.ts',
          dtsContent,
          'utf-8',
        )
      },
    },
  ],
})
