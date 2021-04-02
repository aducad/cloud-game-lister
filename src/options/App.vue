<template>
  <div class="flex-grow-1 d-flex flex-column h-100">
    <div class="container">
      <div class="row justify-content-md-center mt-2 pt-2">
        <div class="col-lg-10">
          <div class="card">
            <div class="card-header">
              <h3>Ayarlar</h3>
            </div>
            <div class="card-body">
              <h4 class="card-title">General Settings</h4>
              <div class="form-group">
                <label for="testTextArea">Test Textarea</label>
                <textarea
                  id="testTextArea"
                  v-model="testTextArea"
                  class="form-control"
                  rows="3"
                ></textarea>
                <div>
                  <small class="text-muted">Example sub text</small>
                </div>
              </div>
              <div class="form-group">
                <label for="testSelectlist">Test Selectlist</label>
                <select
                  id="testSelectlist"
                  v-model="selectedValue"
                  class="form-control"
                >
                  <option
                    v-for="value in selectValues"
                    :key="value"
                    :value="value"
                  >
                    {{ value }}
                  </option>
                </select>
              </div>
              <h4 class="card-title">Advanced Settings</h4>
              <div class="form-group">
                <label for="testTextbox">Test Textbox</label>
                <input
                  id="testTextbox"
                  v-model="testTextbox"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <button class="btn btn-block btn-info" @click="save">
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'

export default {
  data() {
    return {
      testTextbox: 'Example text',
      testTextArea: 'Example Value',
      selectedValue: 'Example Selected',
      selectValues: ['Example Selected', 'Example Unselected']
    }
  },
  created() {
    document.querySelector('title').text = 'Ayarlar'
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { settings } = await browser.storage.local.get({ settings: {} })
      console.log({ settings })
    },
    async save() {
      await browser.storage.local.set({ settings: {} })
    }
  }
}
</script>

<style lang="scss">
body,
html {
  height: 100%;
}
</style>
