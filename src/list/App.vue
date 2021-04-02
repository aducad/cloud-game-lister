<template>
  <div class="container-fluid p-3">
    <div class="card">
      <div class="card-header">{{ msg }}</div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in data" :key="index">
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.email }}</td>
                <td>
                  <button class="btn btn-sm btn-info">
                    <i class="fa fa-info"></i>
                  </button>
                  <button class="btn btn-sm btn-warning">
                    <i class="fa fa-minus"></i>
                  </button>
                  <button class="btn btn-sm btn-success">
                    <i class="fa fa-plus"></i>
                  </button>
                  <button class="btn btn-sm btn-danger">
                    <i class="fa fa-remove"></i>
                  </button>
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

export default {
  data() {
    return {
      msg: 'Example List Page!',
      data: [
        { id: 1, name: 'Demir Yasin ORUÇ', email: 'demiryasinoruc@gmail.com' },
        { id: 2, name: 'John DOE', email: 'johndoe@missing.com' },
        { id: 3, name: 'Jane DOE', email: 'jane@missing.com' }
      ]
    }
  }
}
</script>

<style>
@import url('/assets/fonts/font-awesome/css/font-awesome.min.css');
</style>
