export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be"
      ? pathParts[0]
      : parsed.searchParams.get("v") ??
        (pathParts[0] === "shorts" || pathParts[0] === "embed" || pathParts[0] === "live"
          ? pathParts[1]
          : undefined);

    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`
    : null;
}
