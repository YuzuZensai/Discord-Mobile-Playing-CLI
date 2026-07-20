const USER_AGENT =
	"Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile OceanHero/6 Safari/537.36";

export type PresenceUpdate = "START" | "UPDATE" | "STOP";

export async function setPresence(
	token: string,
	packageName: string,
	update: PresenceUpdate,
) {
	const response = await fetch("https://discord.com/api/v6/presences", {
		method: "POST",
		headers: {
			Authorization: token,
			"User-Agent": USER_AGENT,
			"Content-Type": "application/json",
			"Cache-Control": "max-age=121",
		},
		body: JSON.stringify({
			package_name: packageName,
			update,
		}),
	});

	if (!response.ok) {
		throw new Error(`Discord API responded with ${response.status}`);
	}
}
