# Changelog

### V1.1.3 (Unreleased)

### Added:

- Added attribute option to steam-buiilder
- GEFORCE NOW icons to [Followed Games](https://steamcommunity.com/id/changeyourusernamewiththis/followedgames) page (change your user name)
- GEFORCE NOW icons to [Bundle Detail](https://store.steampowered.com/bundle/4995/EVERSPACE__Ultimate_Edition/) page (The sample link will not work after a certain period of time)
- GEFORCE NOW icons to [Search](https://store.steampowered.com/search) page
- "new" badge to popup page random game list (if games are new)
- Options page
- Options link to popup page
- Changelog file created
- Changelog link to popup page
- Fetch game data retry feature added
- Fetching error desktop notification (optional, default true)
- Update desktop notification (optional, default true)
- Open changelog on update desktop notification (optional, default true)

### Changed:

- Readme.md file
- Popup width to 450px
- Game url paramter name "steamUrl" to "url" (normalized in background.js)

### Notes:

- If we get an error while fetching the data, we try again 3 times with an interval of 5 seconds (when it is successful, it stops) If we still have not received the data, we continue with the saved data.

## v1.0.25 (current version on Chrome web store)

### Added:

- "Is New" feature for games
- Random 5 new games (if there is no new games it will show random games) in popup
- "New" filter for games page (in extension)
- Popup page total game count in the badge
- GEFORCE NOW icons to [Curators](https://store.steampowered.com/curators/) page
- GEFORCE NOW icons to [Game detail](https://store.steampowered.com/app/1139900/Ghostrunner/) page Franchise Block module
- GEFORCE NOW icons to [Game detail](https://store.steampowered.com/app/1139900/Ghostrunner/) page Similar Games module
- GEFORCE NOW icons to [Tags](https://store.steampowered.com/tags/en/Competitive) page Recommended Creators module
- GEFORCE NOW icons to [Genre](https://store.steampowered.com/genre/Free%20to%20Play/) page Recommended Special

### Fixed:

- Ownership flags on Broadcasting modules overlapping with icons

### Changed:

- Popup page "Games List" button text to "Game List"
- "Games List" page header to "Game List"

## v1.0.22

### Added:

- [Special Offers](https://store.steampowered.com/specials) (page support)
- [Community Recommendations](https://store.steampowered.com/communityrecommendations/) (page support)
- [Friend Activity](https://store.steampowered.com/recommended/friendactivity/) (page support)

### Fixed:

- Ownership flags overlapping with icons
- Broadcasting flag overlapping with icons

### Changed:

- Icon sizes for different modules

## 1.0.19

- Initial release
