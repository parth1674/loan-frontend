const LOCAL_API_URL = "http://localhost:3000";
const PRODUCTION_API_URL = "https://finance-app-i0ff.onrender.com";

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && !isLocalHost(window.location.hostname)) {
    return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export function buildUploadUrl(path?: string | null) {
  if (!path) return null;

  const value = String(path).trim();
  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  return buildApiUrl(`/uploads/${value}`);
}
