export const prerender = false;

const WALLPAPER_SOURCES = {
	pc: "https://t.alcy.cc/pc",
	mp: "https://t.alcy.cc/mp",
} as const;

export async function GET({ url }: { url: URL }) {
	const type = url.searchParams.get("type") === "mp" ? "mp" : "pc";
	const source = WALLPAPER_SOURCES[type];

	try {
		const response = await fetch(source, {
			cache: "no-store",
			headers: {
				Accept: "image/avif,image/webp,image/jpeg,image/png,image/*,*/*;q=0.8",
				"User-Agent": "Firefly-Wallpaper-Proxy/1.0",
			},
		});

		if (!response.ok) return new Response(`Wallpaper source returned ${response.status}`, { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

		const contentType = response.headers.get("content-type") || "image/jpeg";
		if (!contentType.toLowerCase().startsWith("image/")) return new Response("Wallpaper source did not return an image", { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

		return new Response(response.body, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "no-store, max-age=0",
				"CDN-Cache-Control": "no-store",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error("[Wallpaper Proxy] Failed:", error);
		return new Response("Failed to fetch wallpaper", { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
	}
}
