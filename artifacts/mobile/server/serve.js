/**
 * Standalone production server for Expo static builds.
 *
 * Serves the output of build.js (static-build/) with two special routes:
 * - GET / or /manifest with expo-platform header → platform manifest JSON
 * - GET / without expo-platform → installable web app
 * - GET /expo → Expo Go landing page
 * Everything else falls through to static file serving and web route fallback.
 *
 * Zero external dependencies — uses only Node.js built-ins (http, fs, path).
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const STATIC_ROOT = path.resolve(__dirname, "..", "static-build");
const WEB_ROOT = path.join(STATIC_ROOT, "web");
const TEMPLATE_PATH = path.resolve(__dirname, "templates", "landing-page.html");
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

const STATIC_ASSET_EXTENSIONS = new Set([
  ".css",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".map",
  ".otf",
  ".png",
  ".svg",
  ".ttf",
  ".webmanifest",
  ".woff",
  ".woff2",
]);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
  ".webmanifest": "application/manifest+json",
};

function getAppName() {
  try {
    const appJsonPath = path.resolve(__dirname, "..", "app.json");
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}

function serveManifest(platform, res) {
  const manifestPath = path.join(STATIC_ROOT, platform, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ error: `Manifest not found for platform: ${platform}` }),
    );
    return;
  }

  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.writeHead(200, {
    "content-type": "application/json",
    "expo-protocol-version": "1",
    "expo-sfv-version": "0",
  });
  res.end(manifest);
}

function serveLandingPage(req, res, landingPageTemplate, appName) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"];
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function resolveStaticPath(root, urlPath) {
  const relativePath = path.normalize(urlPath).replace(/^[/\\]+/, "");
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return null;
  }
  return filePath;
}

function tryServeStaticFile(root, urlPath, res) {
  const filePath = resolveStaticPath(root, urlPath);
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return true;
  }

  let resolvedPath = filePath;
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    resolvedPath = path.join(resolvedPath, "index.html");
  }
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return false;
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(resolvedPath);
  res.writeHead(200, {
    "content-type": contentType,
    "cache-control":
      ext === ".html" || path.basename(resolvedPath) === "manifest.json"
        ? "no-cache"
        : "public, max-age=3600",
  });
  res.end(content);
  return true;
}

function serveWebFallback(res) {
  const indexPath = path.join(WEB_ROOT, "index.html");
  if (fs.existsSync(indexPath)) {
    return tryServeStaticFile(WEB_ROOT, "/index.html", res);
  }
  res.writeHead(404);
  res.end("Not Found");
  return true;
}

const landingPageTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");
const appName = getAppName();

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  if (pathname === "/" || pathname === "/manifest") {
    const platform = req.headers["expo-platform"];
    if (platform === "ios" || platform === "android") {
      return serveManifest(platform, res);
    }
  }

  if (pathname === "/expo") {
    return serveLandingPage(req, res, landingPageTemplate, appName);
  }

  if (tryServeStaticFile(STATIC_ROOT, pathname, res)) {
    return;
  }
  if (tryServeStaticFile(WEB_ROOT, pathname, res)) {
    return;
  }

  if (STATIC_ASSET_EXTENSIONS.has(path.extname(pathname).toLowerCase())) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  return serveWebFallback(res);
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Serving static Expo build on port ${port}`);
});
