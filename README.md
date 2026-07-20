# 🏠 Discord-Mobile-Playing-CLI

> [!WARNING]
> **Deprecated. This repository will be archived.**
> Samsung ended its Discord integration in Gaming Hub on January 31, 2024 (Discord partnership terminated), and Discord has since removed the `/api/v6/presences` endpoint this project relies on (it now returns `404 Not Found`). There is no known replacement endpoint, so this tool no longer works and will not be updated further.

Discord currently only supports game activity on a mobile platform using Samsung Game Launcher, which is only available on Samsung devices.

Discord-Mobile-Playing-CLI is only a PoC that game activities can be implemented on another platform like jailbroken iOS ([iOS-Discord-Presence](https://github.com/YuzuZensai/iOS-Discord-Presence)), or another kind of android distros by using the Discord API. Well, you can't do anything about the "Playing on Samsung Galaxy" for now.

![Discord Preview](https://user-images.githubusercontent.com/84713269/166914540-d2a4edac-1f33-43ed-a860-4bded04029b5.png)

## Prerequisites

- [Bun](https://bun.sh/)

## Installation

1. Clone this repository
2. Install dependencies with ``bun install``
3. Copy ``.env.example`` to ``.env`` and fill in your token
4. Run the script ``bun run dev``

## Development

- ``bun run check`` Typecheck, lint, and format-check the project
- ``bun run lint`` / ``bun run lint:fix`` Lint (and autofix) with Biome
- ``bun run format`` / ``bun run format:fix`` Check (and autofix) formatting with Biome

## Environment Variables

- ``TOKEN`` Your Discord account token

## Commands

- ``set [BUNDLE_ID]`` Set application bundle id
- ``start`` Start showing the presence
- ``stop`` Stop showing the presence
- ``update`` Update the current presences with new bundle id
- ``exit`` Exit the application

## API used

You do not need to authorize the Samsung Game Launcher OAuth to use this API

### POST /api/v6/presences

#### Headers

- ``Authorization`` Your discord account token

#### Body (JSON)

- ``package_name`` Application bundle id on Google Play store
- ``update`` **(START, UPDATE, STOP)** Status for the presences 

```json
{
    "package_name": "com.YostarJP.BlueArchive",
    "update": "START"
}
```

## License
[MIT](./LICENSE)

## Disclaimer

> [!CAUTION]
> Discord-Mobile-Playing-CLI utilizes API that is outside OAuth2/bot API scope.
>
> ``/api/v6/presences``
>
> Automating normal user accounts (generally called "self-bots") outside of the OAuth2/bot API is a **violation** of Discord [Terms Of service](https://discord.com/terms) & [Community Guidelines](https://discord.com/guidelines), and can result in account termination if found. **I do not take any responsibility, liability, or anything that happened on your Discord Account.**
