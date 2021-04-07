<template>
  <div class="container-fluid p-3">
    <div class="card">
      <div class="card-header">Games List</div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th style="min-width: 155px">Fully Optimized?</th>
                <th>Publisher</th>
                <th>Genre(s)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data" :key="row.id">
                <td>
                  <a :href="row.steamUrl" target="_blank">
                    {{ row.title }}
                  </a>
                </td>
                <td>{{ row.status }}</td>
                <td>{{ row.isFullyOptimized ? 'Yes' : 'No' }}</td>
                <td>{{ row.publisher }}</td>
                <td>
                  <a
                    v-for="genre in row.genres"
                    :key="genre"
                    :href="`https://store.steampowered.com/tags/en/${genre}`"
                    target="_blank"
                  >
                    {{ genre }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'
import KEYS from '../common/keys'

export default {
  data() {
    return {
      data: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { appList } = await browser.runtime.sendMessage({
        type: KEYS.GET_APPS
      })
      this.data = appList
    }
  }
}
</script>

<style>
</style>
