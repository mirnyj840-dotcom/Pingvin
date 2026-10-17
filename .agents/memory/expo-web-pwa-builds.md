---
name: Expo web/PWA builds
description: Build and serve an authenticated Expo app as a web PWA alongside its native Expo Go bundles.
---

For an authenticated Expo app that restores Supabase sessions from browser storage, use a client-only web export unless the app's storage access is safe during server rendering. Static prerendering can execute auth storage on Node, where `window` and `localStorage` do not exist. Native bundle builders should select an available Metro port and use it consistently for health checks, manifests, bundles, and assets; another Replit artifact may occupy the default port.

**Why:** Static prerendering failed while restoring the Supabase session, and a separate running artifact occupied Metro's usual port.

**How to apply:** For Expo PWA deployments, prefer single-page output plus an explicit history fallback when server rendering is not required. For builds that also generate Expo Go bundles, allocate a free Metro port dynamically and verify web routes and native manifests separately.
