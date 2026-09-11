export function isValidInternalRedirect(path: string | null | undefined): boolean {
  if (!path) return false;
  // Must start with exactly one slash, not two (which would be protocol-relative)
  return path.startsWith('/') && !path.startsWith('//');
}

export function getSafeRedirect(requestedPath: string | null | undefined, fallback: string = '/onboarding'): string {
  return isValidInternalRedirect(requestedPath) ? requestedPath! : fallback;
}
