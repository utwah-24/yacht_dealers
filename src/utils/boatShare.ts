const SITE_NAME = "Yacht Dealers Tanzania";

export function getBoatSharePath(boatId: string): string {
  return `/boat/${boatId}`;
}

export function getBoatShareUrl(boatId: string, origin = ""): string {
  const path = getBoatSharePath(boatId);
  return origin ? `${origin.replace(/\/$/, "")}${path}` : path;
}

/** Static OG image copied to public/og at build time (stable URL for link previews). */
export function getBoatOgImagePath(boatId: string): string {
  return `/og/${boatId}.jpg`;
}

export function getBoatShareTitle(boatName: string): string {
  return `${boatName} | ${SITE_NAME}`;
}

export function getBoatShareDescription(boatName: string, description?: string): string {
  const trimmed = description?.trim();
  if (trimmed) {
    return trimmed.length > 200 ? `${trimmed.slice(0, 197)}...` : trimmed;
  }
  return `Charter ${boatName} with ${SITE_NAME} in Dar es Salaam & Zanzibar.`;
}

export function toAbsoluteUrl(path: string, origin: string): string {
  if (!path) return origin;
  if (/^https?:\/\//i.test(path)) return path;
  const base = origin.replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
