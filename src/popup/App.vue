<template>
  <div class="container-fluid p-0">
    <div class="card border-info">
      <div class="card-header">
        <button class="btn btn-block btn-info" @click="openPage('list.html')">
          {{ $t('message.gameList') }} <span class="badge badge-danger">{{ appsCount }}</span>
        </button>
        <button v-if="appsCount <= 0" class="btn btn-block btn-warning" @click="fetchGames">
          {{ $t('message.fetchGames') }}
        </button>
      </div>
      <div class="card-body p-0">
        <ul v-if="gameList" class="list-group">
          <li v-for="game in gameList" :key="game.id" class="list-group-item">
            <a :href="game.url" target="_blank">
              {{ game.title }}
            </a>
            <span v-show="anyNewGame" class="badge badge-danger float-right">
              {{ $t('message.newBadge') }}
            </span>
          </li>
        </ul>
      </div>
      <div class="card-footer">
        <ul class="p-0 mb-0">
          <li v-show="version" class="d-inline-block">
            {{ $t('message.version') }} <strong>{{ version }}</strong>
          </li>
          <li class="d-inline-block float-right">
            <a target="_blank" href="https://twitter.com/steamextensions">
              {{ $t('message.twitter') }}
            </a>
          </li>
          <li class="d-inline-block float-right mr-2">
            <a target="_blank" :href="changelogUrl"> {{ $t('message.changelog') }} </a>
          </li>
          <li class="d-inline-block float-right mr-2">
            <a target="_blank" href="options.html"> {{ $t('message.options') }} </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'
import { GET_APPS_COUNT, GET_NEW_APPS, FETCH_GAMES } from '../common/keys'
import { CHANGELOG_URL } from '../common/config'

export default {
  data() {
    return {
      version: '',
      appsCount: -1,
      games: [],
      anyNewGame: false,
      changelogUrl: CHANGELOG_URL
    }
  },
  computed: {
    gameList() {
      return this.games
    }
  },
  created() {
    browser.storage.onChanged.addListener(this.onStorageChangedHandler)
    browser.browserAction.setBadgeText({ text: '' })
    browser.browserAction.setTitle({ title: '' })
    this.init()
  },
  methods: {
    async init() {
      const { version } = browser.runtime.getManifest()
      this.version = version
      const { appsCount } = await browser.runtime.sendMessage({
        type: GET_APPS_COUNT
      })
      this.appsCount = appsCount

      const { games, anyNewGame } = await browser.runtime.sendMessage({
        type: GET_NEW_APPS
      })
      this.games = games
      this.anyNewGame = anyNewGame
    },
    async openPage(url) {
      await browser.tabs.create({ url })
    },
    async fetchGames() {
      await browser.runtime.sendMessage({ type: FETCH_GAMES })
    },
    async onStorageChangedHandler(changes) {
      const { lastRead } = changes
      if (lastRead) {
        this.init()
      }
    }
  }
}
</script>

<style>
body {
  min-width: 450px;
}
</style>
