<template>
  <div class="flex-grow-1 d-flex flex-column h-100">
    <div class="container">
      <div class="row justify-content-md-center mt-2 pt-2">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h3>Options</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-check-label" for="notifyOnFetchError">
                  Show desktop notification for fetching data error
                </label>
                <div class="float-right">
                  <label class="switch">
                    <input
                      id="notifyOnFetchError"
                      v-model="settings.notifyOnFetchError"
                      type="checkbox"
                    />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-check-label" for="notifyOnUpdate">
                  Show desktop notification when extension is updated
                </label>
                <div class="float-right">
                  <label class="switch">
                    <input
                      id="notifyOnUpdate"
                      v-model="settings.notifyOnUpdate"
                      type="checkbox"
                    />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-check-label" for="openChangelogOnUpdate">
                  Open changelog page when extension is updated
                </label>
                <div class="float-right">
                  <label class="switch">
                    <input
                      id="openChangelogOnUpdate"
                      v-model="settings.openChangelogOnUpdate"
                      type="checkbox"
                    />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col" for="gameUpdateInterval">
                  Update your game list every
                  {{ settings.gameUpdateInterval }} hour{{
                    settings.gameUpdateInterval > 1 ? 's' : ''
                  }}
                </label>
                <input
                  id="gameUpdateInterval"
                  v-model="settings.gameUpdateInterval"
                  class="form-control col-2 float-right"
                  type="number"
                  min="1"
                  step="1"
                />
                <div class="col-12">
                  <small class="form-text text-muted">
                    Will be effective after the first fetch
                  </small>
                </div>
              </div>
              <div v-show="message" class="alert alert-info">
                {{ message }}
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
      settings: {
        notifyOnFetchError: true,
        notifyOnUpdate: true,
        openChangelogOnUpdate: true,
        gameUpdateInterval: -1
      },
      message: '',
      interval: -1
    }
  },
  mounted() {
    this.init()
    this.$watch(
      'settings',
      (_, oldData) => {
        if (oldData.gameUpdateInterval !== -1) {
          this.save()
        }
      },
      {
        deep: true
      }
    )
  },
  methods: {
    async init() {
      const settings = await browser.storage.local.get({
        notifyOnFetchError: true,
        notifyOnUpdate: true,
        openChangelogOnUpdate: true,
        gameUpdateInterval: 2
      })
      this.settings = settings
    },
    async save() {
      clearInterval(this.interval)
      const { settings } = this
      settings.gameUpdateInterval = parseInt(settings.gameUpdateInterval)
      if (isNaN(settings.gameUpdateInterval) || settings.gameUpdateInterval < 1) {
        settings.gameUpdateInterval = 1
      }
      await browser.storage.local.set(settings)

      this.message = 'Options saved!'
      this.interval = setTimeout(() => {
        this.message = ''
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
body,
html {
  height: 100%;
}

.form-group {
  margin-bottom: 2rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 20;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}
</style>
