const routes = { GET: [], POST: [], PUT: [], DELETE: [] };

export function addRoute(method, path, handle) {
  routes[method].push({ path, handle });
}

export function matchRoute(req, res) {
  const method = req.method;
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const urlParts = parsedUrl.pathname.split("/").filter(Boolean);
  const methodRoutes = routes[method] || [];

  for (const route of methodRoutes) {
    const routeParts = route.path.split("/").filter(Boolean);
    const params = {};

    if (routeParts.length !== urlParts.length) continue;

    let matched = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        params[routeParts[i].slice(1)] = urlParts[i];
      } else if (routeParts[i] !== urlParts[i]) {
        matched = false;
        break;
      }
    }

    if (matched) {
      route.handle(req, res, params);
      return true;
    }
  }

  return false;
}
