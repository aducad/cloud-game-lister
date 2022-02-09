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
            <span v-show="game.isNew" class="badge badge-danger float-right">
              {{ $t('message.newBadge') }}
            </span>
          </li>
        </ul>
      </div>
      <div class="card-footer">
        <div class="row">
          <div class="col-4">
            <span class="version">
              {{ $t('message.version') }} <strong>{{ version }}</strong>
            </span>
          </div>
          <div class="col-8 text-right">
            <a
              :title="$t('message.changelog')"
              class="btn btn-outline-primary"
              target="_blank"
              @click="openPage(changelogUrl)"
            >
              <i class="fa fa-history"></i>
            </a>
            <a
              class="btn btn-outline-info"
              target="_blank"
              href="https://twitter.com/steamextensions"
            >
              <i class="fa fa-twitter"></i>
            </a>
            <span class="mx-2">|</span>
            <button
              class="btn btn-outline-primary"
              :title="$t('message.gameList')"
              @click="openPage('list.html')"
            >
              <i class="fa fa-list"></i>
            </button>
            <button
              class="btn btn-outline-info"
              :title="$t('message.options')"
              @click="openPage('options.html')"
            >
              <i class="fa fa-cog"></i>
            </button>
          </div>
        </div>
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

      const { games } = await browser.runtime.sendMessage({
        type: GET_NEW_APPS
      })
      this.games = games
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
@import url('/assets/fonts/font-awesome/css/font-awesome.min.css');
body {
  min-width: 450px;
}
.version {
  line-height: 38px;
}
</style>
