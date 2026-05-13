# svelte-fileapp

> **Deprecated**
>
> This package is deprecated and no longer maintained. It was previously used for internal datannur projects but is no longer in use. There is no supported replacement.

A lightweight Svelte 5 library for building file-based applications with routing, SSG (Static Site Generation), and advanced URL management.

## Features

- 🚀 **File-based Routing** - Simple and intuitive routing system with hash or history mode
- 📦 **Static Site Generation** - Built-in SSG support with jsonjsdb integration
- 🔗 **Advanced URL Management** - Comprehensive URL parameters and hash handling
- 🎯 **App Bootstrap** - Smart hydration and mounting for SPA and static apps
- 📱 **Browser Utilities** - Device detection and responsive helpers
- ⚡ **Vite Plugins** - Custom Vite plugins for optimization

## Installation

```bash
npm install svelte-fileapp
```

## Quick Start

### Basic App Bootstrap

```typescript
import { bootstrapApp } from 'svelte-fileapp'
import App from './App.svelte'

// Simple bootstrap
await bootstrapApp(App)

// With custom target and initialization
await bootstrapApp(App, 'app', async () => {
  // Your initialization logic
  console.log('App initializing...')
})
```

### URL Management

```typescript
import { UrlParam, UrlHash } from 'svelte-fileapp'

// Get URL parameters
const value = UrlParam.get('search')

// Set URL parameters
UrlParam.set('filter', 'active')

// Delete parameters
UrlParam.delete('filter')

// Reset all parameters
UrlParam.reset()

// Get all parameters
const allParams = UrlParam.getAllParams()

// Hash management
const currentHash = UrlHash.getAll()
const level1 = UrlHash.getLevel1() // First segment
const level2 = UrlHash.getLevel2() // Second segment
```

### Router Setup

```typescript
import { router } from 'svelte-fileapp'

// Navigate programmatically
router.navigate('/home')

// Use in HTML with helper
window.goToHref(event, '/about')
```

### Browser Utilities

```typescript
import {
  isMobile,
  isFirefox,
  hasTouchScreen,
  isSmallMenu,
} from 'svelte-fileapp'

if (isMobile) {
  // Mobile-specific logic
}

// Reactive store for responsive layouts
isSmallMenu.subscribe(isSmall => {
  console.log('Small menu:', isSmall)
})
```

## Vite Configuration

### Using Vite Plugins

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {
  updateRouterIndex,
  htmlReplace,
  spaHtmlOptimizations,
  getAliases,
} from 'svelte-fileapp'

export default defineConfig({
  plugins: [
    svelte(),
    updateRouterIndex(),
    htmlReplace(),
    spaHtmlOptimizations(),
  ],
  resolve: {
    alias: getAliases(import.meta.url),
  },
})
```

## Static Site Generation

### Basic SSG

```typescript
import { generateStaticSite } from 'svelte-fileapp'

await generateStaticSite({
  routes: ['/', '/about', '/contact'],
  outDir: 'dist',
})
```

### Jsonjsdb SSG

```typescript
import { generateJsonjsdbStaticSite } from 'svelte-fileapp'

await generateJsonjsdbStaticSite({
  dbPath: './data',
  outDir: 'dist',
  entities: ['posts', 'users'],
})
```

## API Reference

### App Bootstrap

#### `bootstrapApp(AppComponent, targetId?, initFn?)`

Bootstraps a Svelte application with smart hydration support.

- **AppComponent**: The root Svelte component
- **targetId**: Target element ID (default: 'app')
- **initFn**: Optional async initialization function

### URL Management

#### `UrlParam` Class

- `get(key)` - Get URL parameter value
- `set(key, value)` - Set URL parameter
- `delete(key)` - Delete URL parameter
- `reset()` - Reset all parameters
- `getAllParams()` - Get all parameters as object
- `getAppMode()` - Get current app mode (spa/static_render/check_db)

#### `UrlHash` Class

- `getAll()` - Get complete hash value
- `getLevel1()` - Get first segment of hash
- `getLevel2()` - Get second segment of hash
- `default` - Default hash value ('homepage')

### Browser Utilities

#### Constants

- `isFirefox` - Boolean for Firefox detection
- `isMobile` - Boolean for mobile detection
- `hasTouchScreen` - Boolean for touch screen detection
- `documentWidth` - Current document width

#### Stores

- `isSmallMenu` - Writable store for responsive menu state

## App Modes

The library supports three app modes:

1. **SPA** (default) - Single Page Application with hash routing
2. **static_render** - Static site generation mode
3. **check_db** - Database check mode

Mode is automatically detected from:

- URL parameter `app_mode`
- Meta tag `<meta app-mode="static">`

## Router Helpers

```typescript
import {
  getInitialPage,
  getInitialComponent,
  updateRouteComponent,
} from 'svelte-fileapp'

// Get initial page based on static mode
const initialPage = getInitialPage(routerIndex, '_loading')

// Get component with hydration support
const component = getInitialComponent(routerIndex, initialPage, '_loading')
```

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
