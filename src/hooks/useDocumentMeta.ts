import { useEffect } from "react";

export type DocumentMeta = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const META_KEYS = [
  "description",
  "og:title",
  "og:description",
  "og:image",
  "og:url",
  "og:type",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
] as const;

function setMetaTag(property: string, content: string, isProperty = true) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useDocumentMeta(meta: DocumentMeta | null) {
  useEffect(() => {
    if (!meta) return;

    const previousTitle = document.title;
    const previousMeta = new Map<string, string | null>();

    for (const key of META_KEYS) {
      const attr = key.startsWith("og:") ? "property" : "name";
      const el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      previousMeta.set(key, el?.getAttribute("content") ?? null);
    }

    const prevCanonical =
      (document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null)?.href ?? null;

    if (meta.title) document.title = meta.title;
    if (meta.description) setMetaTag("description", meta.description, false);
    if (meta.title) setMetaTag("og:title", meta.title);
    if (meta.description) setMetaTag("og:description", meta.description);
    if (meta.image) {
      setMetaTag("og:image", meta.image);
      setMetaTag("twitter:image", meta.image);
    }
    if (meta.url) {
      setMetaTag("og:url", meta.url);
      setCanonical(meta.url);
    }
    setMetaTag("og:type", "website");
    setMetaTag("twitter:card", "summary_large_image", false);
    if (meta.title) setMetaTag("twitter:title", meta.title, false);
    if (meta.description) setMetaTag("twitter:description", meta.description, false);

    return () => {
      document.title = previousTitle;
      for (const key of META_KEYS) {
        const attr = key.startsWith("og:") ? "property" : "name";
        const el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
        const prev = previousMeta.get(key);
        if (el && prev != null) el.setAttribute("content", prev);
      }
      const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (canonical) {
        if (prevCanonical) canonical.href = prevCanonical;
        else canonical.remove();
      }
    };
  }, [meta?.title, meta?.description, meta?.image, meta?.url]);
}
