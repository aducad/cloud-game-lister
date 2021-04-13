<template>
  <div class="container-fluid p-2">
    <div class="row my-2">
      <div class="col-12">
        <button class="btn btn-block btn-info" @click="openPage('list.html')">
          Games List
        </button>
      </div>
      <div class="col-12">
        <ul class="p-0 mt-2 mb-0">
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

export default {
  data() {
    return {
      version: ''
    }
  },
  created() {
    const { version } = browser.runtime.getManifest()
    this.version = version
  },
  methods: {
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
