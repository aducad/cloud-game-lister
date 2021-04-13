<template>
  <div class="container-fluid p-0">
    <div class="card border-info">
      <div class="card-header">
        <button class="btn btn-block btn-info" @click="openPage('list.html')">
          Game List <span class="badge badge-danger">{{ appsCount }}</span>
        </button>
      </div>
      <div class="card-body p-0">
        <ul v-if="gameList" class="list-group">
          <li v-for="game in gameList" :key="game.id" class="list-group-item">
            <a :href="game.steamUrl" target="_blank">
              {{ game.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="card-footer">
        <ul class="p-0 mb-0">
          <li v-show="version" class="d-inline-block">
            Version: <strong>{{ version }}</strong>
          </li>
          <li class="d-inline-block float-right mr-2">
            <a target="_blank" href="https://twitter.com/steamextensions">
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'
import { GET_APPS_COUNT, GET_NEW_APPS } from '../common/keys'

export default {
  data() {
    return {
      version: '',
      appsCount: 0,
      games: []
    }
  },
  computed: {
    gameList() {
      return this.games
    }
  },
  created() {
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
    }
  }
}
</script>

<style>
body {
  min-width: 400px;
}
</style>
