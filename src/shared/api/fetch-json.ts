// Reads the { error } body our proxy sends on failures; falls back to the
// HTTP status when the body is not JSON (e.g. a platform-level error page).
const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body: { error?: string } = await response.json();
    return body.error ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

// Typed JSON fetch for our own proxy routes. The proxy already validated
// the YUMEMI data with Zod, so no client-side re-validation is needed.
export const fetchJson = async <ResponseData>(
  url: string,
): Promise<ResponseData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
};
