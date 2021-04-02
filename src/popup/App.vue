<template>
  <div class="container-fluid p-2">
    <button class="btn btn-block btn-primary" @click="openPage('list.html')">
      Open List Page
    </button>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'

export default {
  data() {
    return {}
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
  min-width: 250px;
}
</style>
