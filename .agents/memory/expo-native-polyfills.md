---
name: Expo native-only polyfills
description: Platform-specific imports for React Native polyfills in the Expo workspace.
---

Keep native-only polyfills in a `.native.ts` module and keep the shared client module platform-neutral. Expo's web bundler may fail to resolve a native polyfill import from a shared module even when the polyfill itself guards against running on web.

**Why:** The web preview failed to bundle `react-native-url-polyfill/auto` from a shared Supabase client module, while native exports succeeded. Moving the import to a native-only wrapper made web and native bundles succeed.

**How to apply:** When a React Native dependency adds a runtime polyfill, check both Expo web and native exports; isolate imports by platform if Metro cannot resolve them on web.
