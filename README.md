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

#

## Features

- All supported Steam games list for "GEFORCE NOW"
- Allows you to see new supported games (in popup and in extension game list page)
- Allows you to see and filter all supported steam games on the extension game list page (link in the popup)
- Allows you to see "GEFORCE NOW" support on the steam pages
  - [Main page](https://store.steampowered.com/)
  - [Search pages](https://store.steampowered.com/search)
  - [Game detail page](https://store.steampowered.com/app/680420/OUTRIDERS/)
  - [Bundle Detail](https://store.steampowered.com/bundle/4995/EVERSPACE__Ultimate_Edition/)
  - [Tags pages](https://store.steampowered.com/tags/en/Competitive)
  - [Genre pages](https://store.steampowered.com/genre/Free%20to%20Play/)
  - [Explore new page](https://store.steampowered.com/explore/new)
  - [Special Offers page](https://store.steampowered.com/specials)
  - [Sale pages](https://store.steampowered.com/sale/[changesalenamewiththis])
  - [VR page](https://store.steampowered.com/vr)
  - [Friend Activity page](https://store.steampowered.com/recommended/friendactivity/)
  - [Followed Games page](https://steamcommunity.com/id/[changeyourusernamewiththis]/followedgames)
  - [User Games page](https://steamcommunity.com/id/[changeyourusernamewiththis]/games/?tab=[tab]) (custom url) (tabs: recent, all, perfect)
  - [User Games page](https://steamcommunity.com/profiles/[changeprofileidwiththis]/games/?tab=[tab]) (profile id) (tabs: recent, all, perfect)
  - [Curators page](https://store.steampowered.com/curators/)
  - [Curator Detail page](https://store.steampowered.com/curator/1370293-Cynical-Brit-Gaming/)
  - [Community Recommendations page](https://store.steampowered.com/communityrecommendations/)
  - [Franchise page](https://store.steampowered.com/franchise/allingames/)
  - [Developer page](https://store.steampowered.com/developer/valve)
- Allows you to see new games in popup page
- Desktop notifications for new game(s) (optional)

#

## Please read this section before start to development.

> First of all you have to install these plugins to your editor (**vscode**), but if you are using an another code editor or IDE install them for your dev environment

- [ESLint Plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- [Prettier - Code formatter for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

If you don't use one of these Code Editor/IDE [please check is your EDITOR/IDE exist or not](https://editorconfig.org/#download) please install Editor Config plugin for your Code Editor/IDE.

#

## Linter / Commit Messages

While developing this library you should take an attention to linter rules, all of your codes and commit messages, because you can't do any development without checking by rules.

<span style="color:red;">**Notice:**</span> Before commit to changes, [HuskyJs](https://github.com/typicode/husky) checking these commit messages / linter rules

If you get a lint's error when you commiting a message, you can check for [eslint](https://eslint.org/docs/user-guide/getting-started) linter rules or if you get an error because of your commit message you can check below commit message types and examples or you can check from [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

#

## **Commit-lint Types**

**Examples:**

```bash
git commit -m "feat: navbar component added"
```

```bash
git commit -m "docs(readme): server link added"
```

- **build:** Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci:** Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **chore:** Updating packages,build project etc. (no production code change)
- **docs:** Documentation only changes
- **feat:** A new feature
- **fix:** A bug fix
- **perf:** A code change that improves performance
- **refactor:** A code change that neither fixes a bug nor adds a feature, when refactoring a production code, eg. renaming a variable.
- **revert:** A commit revert message
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test:** Adding missing tests or correcting existing tests

#

## Contributing

You may contribute to this project by opening an [issue](issues) to file a bug report or feature request. If you would like to contribute code, please open an issue explaining what you're changing and submit a pull request.

#

## Privacy Policy

This extension requires permissions for "storage" and "notifications"

#

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START -->

<table>
   <tr>
      <td align="center">
         <a href="https://emresandikci.com">
         <img src="https://avatars0.githubusercontent.com/u/7765958?v=4" width="100px;" alt=""/><br /><sub><b>Emre Sandikci</b></sub>
         </a><br />
           <a href="https://github.com/aducad/cloud-game-lister/commits?author=emresandikci" title="Code">💻</a>
          <a href="#ideas-aducad-cgl" title="Ideas, Planning, & Feedback">🤔</a>
          <a href="#maintenance-emresandikci" title="Maintenance">🚧</a> <a href="https://github.com/aducad/cloud-game-lister/pulls?q=is%3Apr+reviewed-by%3Aemresandikci" title="Reviewed Pull Requests">👀</a>
      </td>
      <td align="center">
         <a href="https://github.com/demiryasinoruc">
         <img src="https://avatars0.githubusercontent.com/u/937795?v=4" width="100px;" alt=""/><br /><sub><b>Demir Yasin Oruc</b></sub>
         </a><br />
           <a href="https://github.com/aducad/cloud-game-lister/commits?author=demiryasinoruc" title="Code">💻</a>
           <a href="#ideas-aducad-cgl" title="Ideas, Planning, & Feedback">🤔</a>
           <a href="#maintenance-demiryasinoruc" title="Maintenance">🚧</a> <a href="https://github.com/aducad/cloud-game-lister/pulls?q=is%3Apr+reviewed-by%3Ademiryasinoruc" title="Reviewed Pull Requests">👀</a>
      </td>
      <td align="center">
         <a href="https://github.com/wwardaww">
         <img src="https://avatars0.githubusercontent.com/u/12273655?v=4" width="100px;" alt=""/><br /><sub><b>Arda Fidancı</b></sub>
         </a><br />
           <a href="https://github.com/aducad/cloud-game-lister/commits?author=wwardaww" title="Code">💻</a>
          <a href="https://github.com/aducad/cloud-game-lister/commit/c49621396a1ff0ddfb07d8f73f923f0396d26abc" title="Translation">🌍</a>
      </td>
   </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

#

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
