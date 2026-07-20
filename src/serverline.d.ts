declare module "serverline" {
	interface ServerLine {
		init(): void;
		setCompletion(completions: string[]): void;
		setPrompt(prompt: string): void;
		on(event: "line", listener: (line: string) => void): void;
	}

	const serverline: ServerLine;
	export = serverline;
}
