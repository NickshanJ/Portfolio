let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function adminFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    unauthorizedHandler?.();
  }

  return response;
}