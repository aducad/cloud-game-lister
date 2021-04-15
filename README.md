# Cloud Game Lister

[![GitHub license](https://img.shields.io/badge/license-APACHE-blue.svg)](https://github.com/aducad/cloud-game-lister/blob/master/LICENSE)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/cpmaennmoijiboghaekpledlgbojhdml.svg)](https://chrome.google.com/webstore/detail/cloud-gaming-lister/cpmaennmoijiboghaekpledlgbojhdml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/cpmaennmoijiboghaekpledlgbojhdml.svg)](https://chrome.google.com/webstore/detail/cloud-gaming-lister/cpmaennmoijiboghaekpledlgbojhdml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating-count/cpmaennmoijiboghaekpledlgbojhdml.svg)](https://chrome.google.com/webstore/detail/cloud-gaming-lister/cpmaennmoijiboghaekpledlgbojhdml)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/price/cpmaennmoijiboghaekpledlgbojhdml.svg)](https://chrome.google.com/webstore/detail/cloud-gaming-lister/cpmaennmoijiboghaekpledlgbojhdml)
[![Twitter Follow](https://img.shields.io/twitter/follow/steamextensions)](https://twitter.com/steamextensions)

<a href="https://www.producthunt.com/posts/cloud-gaming-lister?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-cloud-gaming-lister" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=292030&theme=dark" alt="Cloud Gaming Lister - steam,game,cloud gaming,uplay,video game,epic,xcloud | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Cloud Gaming Lister is a Chrome extension used for GEFORCE NOW support for [Steam](https://store.steampowered.com/) games.

## Setup

Before the run this project, install it locally using npm:

```
$ npm install
```

## Development

To run this project on development mode:

```
$ npm run dev
```

## Build

To build this project on production mode:

```
$ npm run build
```

## Installation

To use this extension, please install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/cloud-gaming-lister/cpmaennmoijiboghaekpledlgbojhdml).

## Features

- All supported Steam games list for "GEFORCE NOW"
- Allows you to see new supported games (in popup and in extension game list page)
- Allows you to see and filter all supported steam games on the extension game list page (link in the popup)
- Allows you to see "GEFORCE NOW" support on the steam pages
  - [Main page](https://store.steampowered.com/)
  - [Search](https://store.steampowered.com/search)
  - [Game detail pages](https://store.steampowered.com/app/680420/OUTRIDERS/)
  - [Bundle Detail](https://store.steampowered.com/bundle/4995/EVERSPACE__Ultimate_Edition/)
  - [Tags pages](https://store.steampowered.com/tags/en/Competitive)
  - [Genre pages](https://store.steampowered.com/genre/Free%20to%20Play/)
  - [Explore new page](https://store.steampowered.com/explore/new)
  - [Special Offers](https://store.steampowered.com/specials)
  - [Friend Activity](https://store.steampowered.com/recommended/friendactivity/)
  - [Followed Games](https://steamcommunity.com/id/[changeyourusernamewiththis]/followedgames)
  - [Curators](https://store.steampowered.com/curators/)
  - [Community Recommendations](https://store.steampowered.com/communityrecommendations/)

## Contributing

You may contribute to this project by opening an [issue](issues) to file a bug report or feature request. If you would like to contribute code, please open an issue explaining what you're changing and submit a pull request.

## Privacy Policy

This extension requires permissions to <https://store.steampowered.com/>

## Known Issues

- The icon does not appear when pagination changes in the tab section (such as New and Popular) of the [Tags pages](https://store.steampowered.com/tags/en/Competitive)
- The icon does not appear when pagination changes in the tab section (such as New and Popular) of the [Genre pages](https://store.steampowered.com/genre/Free%20to%20Play/)
- The icon does not appear when pagination changes in the tab section (such as New and Popular) of the [Special Offers](https://store.steampowered.com/specials)
- The icon does not appear if keep scroll after footer of the [Main page](https://store.steampowered.com/)

## Changelog

#### V1.0.25 (under review in the Chrome web store)

Added:

- "Is New" feature for games
- Random 5 new games (if there is no new games it will show random games) in popup
- "New" filter for games page (in extension)
- Popup page total game count in the badge
- GEFORCE NOW icons to [Curators](https://store.steampowered.com/curators/) page
- GEFORCE NOW icons to [Game detail](https://store.steampowered.com/app/1139900/Ghostrunner/) page Franchise Block module
- GEFORCE NOW icons to [Game detail](https://store.steampowered.com/app/1139900/Ghostrunner/) page Similar Games module
- GEFORCE NOW icons to [Tags](https://store.steampowered.com/tags/en/Competitive) page Recommended Creators module
- GEFORCE NOW icons to [Genre](https://store.steampowered.com/genre/Free%20to%20Play/) page Recommended Special

Fixed:

- Ownership flags on Broadcasting modules overlapping with icons

Updated:
Offers

- Popup page "Games List" button text to "Game List"
- "Games List" page header to "Game List"

#### v1.0.22 (current version on Chrome web store)

Added:

- [Special Offers](https://store.steampowered.com/specials) (page support)
- [Community Recommendations](https://store.steampowered.com/communityrecommendations/) (page support)
- [Friend Activity](https://store.steampowered.com/recommended/friendactivity/) (page support)

Fixed:

- Ownership flags overlapping with icons
- Broadcasting flag overlapping with icons

Updated:

- Icon sizes for different modules

#### v1.0.19

- Initial release
