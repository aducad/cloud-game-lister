<template>
  <div class="container-fluid p-3">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col">Game List</div>
          <div class="col-auto">
            <a v-show="onlyNew" class="btn btn-info" href="list.html">All Games</a>
            <a v-show="!onlyNew" class="btn btn-info" href="list.html?only-new=true">
              Recently Added Games
            </a>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <div class="row mb-3">
              <div class="col-auto">
                <select v-model="pageSize" class="form-control float-left">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div class="col">
                <nav class="float-right">
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button
                        class="page-link"
                        :disabled="currentPage === 1"
                        @click="currentPage = 1"
                      >
                        first
                      </button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button
                        class="page-link"
                        :disabled="currentPage === 1"
                        @click="--currentPage"
                      >
                        prev
                      </button>
                    </li>
                    <li
                      v-for="page in pager"
                      :key="page"
                      class="page-item"
                      :class="{ active: page === currentPage }"
                    >
                      <button class="page-link" @click="currentPage = page">
                        {{ page }}
                      </button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage >= totalPage }">
                      <button
                        class="page-link"
                        :disabled="currentPage >= totalPage"
                        @click="++currentPage"
                      >
                        next
                      </button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage >= totalPage }">
                      <button
                        class="page-link"
                        :disabled="currentPage >= totalPage"
                        @click="currentPage = totalPage"
                      >
                        last
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-bordered table-hover table-striped">
                <thead>
                  <tr>
                    <th>
                      <input
                        v-model="filters.title"
                        type="text"
                        class="form-control"
                        placeholder="Search games"
                      />
                    </th>
                    <th>
                      <select v-model="filters.status" class="form-control">
                        <option value="">All</option>
                        <option v-for="status in statuses" :key="status" :value="status">
                          {{ status }}
                        </option>
                      </select>
                    </th>
                    <th>
                      <select v-model="filters.optimization" class="form-control">
                        <option :value="null">All</option>
                        <option
                          v-for="optimization in optimizations"
                          :key="optimization.title"
                          :value="optimization.value"
                        >
                          {{ optimization.title }}
                        </option>
                      </select>
                    </th>
                    <th>
                      <select v-model="filters.isNew" class="form-control">
                        <option :value="null">All</option>
                        <option
                          v-for="isNewOption in isNewOptions"
                          :key="isNewOption.title"
                          :value="isNewOption.value"
                        >
                          {{ isNewOption.title }}
                        </option>
                      </select>
                    </th>
                    <th>
                      <select v-model="filters.publisher" class="form-control">
                        <option value="">All</option>
                        <option
                          v-for="publisher in publishers"
                          :key="publisher"
                          :value="publisher"
                        >
                          {{ publisher }}
                        </option>
                      </select>
                    </th>
                    <th>
                      <select v-model="filters.genre" class="form-control">
                        <option value="">All</option>
                        <option v-for="genre in genres" :key="genre" :value="genre">
                          {{ genre }}
                        </option>
                      </select>
                    </th>
                  </tr>
                </thead>
                <thead>
                  <tr>
                    <th
                      class="sortable"
                      :class="getSortingClass('title')"
                      @click="changeSortKey('title')"
                    >
                      Title
                    </th>
                    <th
                      class="sortable"
                      :class="getSortingClass('status')"
                      @click="changeSortKey('status')"
                    >
                      Status
                    </th>
                    <th
                      class="sortable"
                      style="min-width: 155px"
                      :class="getSortingClass('isFullyOptimized')"
                      @click="changeSortKey('isFullyOptimized')"
                    >
                      Fully Optimized
                    </th>
                    <th
                      class="sortable"
                      :class="getSortingClass('isNew')"
                      @click="changeSortKey('isNew')"
                    >
                      New
                    </th>
                    <th
                      class="sortable"
                      :class="getSortingClass('publish')"
                      @click="changeSortKey('publish')"
                    >
                      Publisher
                    </th>
                    <th>Genre(s)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in pagedRows" :key="row.id">
                    <td>
                      <a :href="row.url" target="_blank">
                        {{ row.title }}
                      </a>
                    </td>
                    <td class="text-center">
                      <span
                        class="badge"
                        :class="row.status === 'AVAILABLE' ? 'badge-info' : 'badge-warning'"
                      >
                        {{ row.status }}
                      </span>
                    </td>
                    <td>{{ row.isFullyOptimized ? 'Yes' : 'No' }}</td>
                    <td>{{ row.isNew ? 'Yes' : 'No' }}</td>
                    <td>{{ row.publisher }}</td>
                    <td>
                      <a
                        v-for="(genre, index) in row.genres"
                        :key="genre"
                        :href="`https://store.steampowered.com/tags/en/${genre}`"
                        target="_blank"
                        :class="{ 'text-warning': genre === filters.genre }"
                      >
                        {{ getNameWithComma(genre, index, row.genres.length) }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
      onlyNew: true,
      pageSize: 10,
      currentPage: 1,
      currentSort: 'title',
      currentSortHeader: 'title',
      currentSortDir: 'asc',
      data: [],
      optimizations: [
        { title: 'Yes', value: true },
        { title: 'No', value: false }
      ],
      isNewOptions: [
        { title: 'Yes', value: true },
        { title: 'No', value: false }
      ],
      filters: {
        status: '',
        optimization: null,
        genre: '',
        publisher: '',
        title: '',
        isNew: null
      }
    }
  },
  computed: {
    statuses() {
      const statuses = this.data.map((row) => row.status)
      return [...new Set(statuses)]
    },
    publishers() {
      const publishers = this.data.map((row) => row.publisher)
      publishers.sort()
      return [...new Set(publishers)]
    },
    genres() {
      let genres = []
      this.data.forEach((row) => {
        genres = [...genres, ...row.genres]
      })
      return [...new Set(genres)]
    },
    pagedRows() {
      const pagedRows = this.sortedRows.slice(this.start, this.end)
      return pagedRows
    },
    sortedRows() {
      const sorted = [...this.filteredRows]
      sorted.sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') {
          modifier = -1
        }
        if (a[this.currentSort] < b[this.currentSort]) {
          return -1 * modifier
        }
        return 1 * modifier
      })
      return sorted
    },
    filteredRows() {
      let filtered = this.data
      const { status, optimization, genre, publisher, title, isNew } = this.filters
      if (status) {
        filtered = filtered.filter((i) => i.status === status)
      }
      if (optimization !== null) {
        filtered = filtered.filter((i) => i.isFullyOptimized === optimization)
      }
      if (isNew !== null) {
        filtered = filtered.filter((i) => i.isNew === isNew)
      }
      if (genre) {
        filtered = filtered.filter((i) => i.genres && i.genres.includes(genre))
      }

      if (publisher) {
        filtered = filtered.filter((i) => i.publisher === publisher)
      }
      if (title) {
        const titleFilterValue = title
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9 ]/gi, '')
          .split(' ')
          .filter((i) => i)
          .join(' ')
        filtered = filtered.filter(
          (i) =>
            i.title
              .toLocaleLowerCase()
              .replace(/[^a-z0-9 ]/, '')
              .indexOf(titleFilterValue) !== -1
        )
      }
      return filtered
    },
    pager() {
      const pages = []
      const beforeAfterPageCount = 3
      for (let i = this.currentPage - 1; i > 0 && pages.length < beforeAfterPageCount; i--) {
        pages.push(i)
      }
      pages.reverse()
      pages.push(this.currentPage)
      const addedPages = pages.length
      for (
        let i = this.currentPage + 1;
        i <= this.totalPage && pages.length < addedPages + beforeAfterPageCount;
        i++
      ) {
        pages.push(i)
      }
      return pages
    },
    start() {
      return this.pageSize * (this.currentPage - 1)
    },
    end() {
      return this.pageSize * (this.currentPage - 1) + parseInt(this.pageSize)
    },
    totalPage() {
      const { length } = this.filteredRows
      let pageCount = length / this.pageSize
      if (length % this.pageSize === 0) {
        pageCount--
      } else {
        pageCount++
      }
      return parseInt(pageCount)
    }
  },
  watch: {
    pageSize() {
      this.currentPage = 1
    }
  },
  created() {
    this.onlyNew = new URL(window.location.href).searchParams.get('only-new') === 'true'
    this.init()
  },
  mounted() {
    this.$watch(
      'filters',
      () => {
        this.currentPage = 1
      },
      {
        deep: true
      }
    )
  },
  methods: {
    async init() {
      const { appList } = await browser.runtime.sendMessage({
        type: KEYS.GET_APPS,
        onlyNew: this.onlyNew
      })
      this.data = appList
    },

    getSortingClass(currentSortHeader) {
      const classList = []
      if (this.currentSortHeader === currentSortHeader) {
        classList.push('current-sorting')
        if (this.currentSortDir === 'asc') {
          classList.push('sorting-asc')
        } else {
          classList.push('sorting-desc')
        }
      }
      return classList
    },
    changeSortKey(key, header) {
      this.currentPage = 1
      this.currentSortHeader = header || key
      if (key === this.currentSort) {
        if (this.currentSortDir === 'desc') {
          this.currentSortDir = 'asc'
        } else {
          this.currentSortDir = 'desc'
        }
      } else {
        this.currentSortDir = 'asc'
      }
      this.currentSort = key
    },
    getNameWithComma(genre, index, totalLength) {
      if (index + 1 < totalLength) {
        return `${genre},`
      }
      return genre
    }
  }
}
</script>

<style>
.sortable {
  cursor: pointer;
  position: relative;
}

.sortable:before,
.sortable::after {
  content: ' ';
  display: block;
  position: absolute;
  right: 10px;
  width: 0;
  height: 0;
}

/* Ascending */
.sortable:before {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgb(197, 193, 193);
  margin-top: 5px;
}

/* Descending */
.sortable::after {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgb(197, 193, 193);
  margin-top: -5px;
}

.sorting-asc.sortable:after {
  border-top: none;
}

.sorting-asc.sortable::before {
  margin-top: 10px;
}

.sorting-desc.sortable:before {
  border-bottom: none;
}

.sorting-desc.sortable:after {
  margin-top: -10px;
}
</style>
