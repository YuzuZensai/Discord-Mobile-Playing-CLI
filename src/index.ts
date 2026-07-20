import myRL from "serverline";
import { setPresence } from "./discord-presence";

const discordToken = process.env.TOKEN;

if (!discordToken) {
	console.error("No discord token provided in environment variables");
	process.exit(1);
}

const APP_NAME = "Discord-Mobile-Playing-CLI";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const commands = {
	set: {
		usage: "set [BUNDLE_ID]",
		description: "Set application bundle id",
		run: handleSet,
	},
	start: {
		usage: "start",
		description: "Start showing the presence",
		run: handleStart,
	},
	stop: {
		usage: "stop",
		description: "Stop showing the presence",
		run: handleStop,
	},
	update: {
		usage: "update",
		description: "Update the current presence with the new bundle id",
		run: handleUpdate,
	},
	exit: {
		usage: "exit",
		description: "Exit the application",
		run: handleExit,
	},
} as const satisfies Record<string, Command>;

type CommandName = keyof typeof commands;

interface Command {
	usage: string;
	description: string;
	run: (args: string[]) => void | Promise<void>;
}

const state = {
	isStarted: false,
	packageName: undefined as string | undefined,
	refreshInterval: undefined as Timer | undefined,
};

function setTitle(suffix?: string) {
	process.title = suffix ? `${APP_NAME} - ${suffix}` : `${APP_NAME} - Idle`;
}

function printHelp() {
	console.log("Available commands:");
	for (const { usage, description } of Object.values(commands)) {
		console.log(`  ${usage.padEnd(20)} ${description}`);
	}
}

async function handleSet(args: string[]) {
	const packageName = args[0];
	if (!packageName) {
		console.error("No package name provided");
		return;
	}
	console.log(`Setting... ${packageName}`);
	state.packageName = packageName;
}

async function handleStart() {
	if (state.isStarted) {
		console.log("Already started");
		return;
	}
	if (!state.packageName) {
		console.error("No package name set");
		return;
	}
	console.log("Starting...");
	await updatePresence(state.packageName, "START");
	state.isStarted = true;
	startRefreshInterval();
}

async function handleStop() {
	if (!state.isStarted) {
		console.error("Not started");
		return;
	}
	if (!state.packageName) {
		console.error("No package name set");
		return;
	}
	console.log("Stopping...");
	await updatePresence(state.packageName, "STOP");
	state.isStarted = false;
	clearInterval(state.refreshInterval);
	setTitle();
}

async function handleUpdate() {
	if (!state.isStarted) {
		console.error("Not started");
		return;
	}
	if (!state.packageName) {
		console.error("No package name set");
		return;
	}
	console.log("Updating...");
	await updatePresence(state.packageName, "UPDATE");
}

async function handleExit() {
	if (state.isStarted && state.packageName) {
		console.log("Stopping...");
		await updatePresence(state.packageName, "STOP");
	}
	process.exit(0);
}

function startRefreshInterval() {
	if (state.refreshInterval) clearInterval(state.refreshInterval);

	setTitle(`Running - ${state.packageName}`);

	state.refreshInterval = setInterval(async () => {
		if (!state.isStarted || !state.packageName) return;
		console.log("Updating...");
		await updatePresence(state.packageName, "UPDATE");
	}, REFRESH_INTERVAL_MS);
}

async function updatePresence(
	packageName: string,
	update: "START" | "UPDATE" | "STOP",
) {
	try {
		await setPresence(discordToken as string, packageName, update);
		if (update !== "STOP") setTitle(`Running - ${packageName}`);
	} catch (err) {
		console.error(err instanceof Error ? err.message : err);
	}
}

function isCommandName(name: string): name is CommandName {
	return name in commands;
}

setTitle();

myRL.init();
myRL.setCompletion(Object.keys(commands));
myRL.setPrompt("> ");

console.log(`${APP_NAME} ready`);
printHelp();

myRL.on("line", async (line: string) => {
	const [name = "", ...args] = line.trim().split(/\s+/);

	if (!name) return;

	if (!isCommandName(name)) {
		console.log(`Unknown command: ${name}`);
		printHelp();
		return;
	}

	await commands[name].run(args);
});
