<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="動画ID">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="カテゴリ">
        <el-select v-model="form.category" placeholder="カテゴリを選択してください">
          <el-option label="食料" value="food" />
          <el-option label="住居" value="residence" />
          <el-option label="光熱・水道" value="utility" />
          <el-option label="保険医療" value="medical" />
          <el-option label="交通・通信" value="communication" />
          <el-option label="教育" value="education" />
          <el-option label="教養娯楽" value="entertainment" />
        </el-select>
      </el-form-item>
      <el-form-item label="サブカテゴリ">
        <el-input v-model="form.subcategory" />
      </el-form-item>
      <el-form-item label="コメント">
        <el-input v-model="form.comment" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getYoutubeInfo">登録</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>

    <div class="p-search__result-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="動画ID" width="200">
          <template slot-scope="scope">
            <span v-if="!(isEdit && (form.id === scope.row.movie_id))">{{ scope.row.movie_id }}</span>
            <img v-if="!(isEdit && (form.id === scope.row.movie_id))" :src="scope.row.snippet.thumbnails.default.url" alt="サムネイル">
            <el-input v-if="isEdit && (form.id === scope.row.movie_id)" v-model="form.id" :value="scope.row.movie_id" />
          </template>
        </el-table-column>
        <el-table-column label="カテゴリ" width="100">
          <template slot-scope="scope">
            <span v-if="!(isEdit && (form.id === scope.row.movie_id))">{{ scope.row.category }}</span>
            <el-input v-if="isEdit && (form.id === scope.row.movie_id)" v-model="form.category" :value="scope.row.category" />
          </template>
        </el-table-column>
        <el-table-column label="サブカテゴリ" width="300" align="center">
          <template slot-scope="scope">
            <span v-if="!(isEdit && (form.id === scope.row.movie_id))">{{ scope.row.subcategory }}</span>
            <el-input v-if="isEdit && (form.id === scope.row.movie_id)" v-model="form.subcategory" :value="scope.row.subcategory" />
          </template>
        </el-table-column>
        <el-table-column label="コメント" align="center">
          <template slot-scope="scope">
            <span v-if="!(isEdit && (form.id === scope.row.movie_id))">{{ scope.row.comment }}</span>
            <el-input v-if="isEdit && (form.id === scope.row.movie_id)" v-model="form.comment" :value="scope.row.comment" />
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="100">
          <template slot-scope="scope">
            <el-button v-if="isEdit && (form.id === scope.row.movie_id)" type="warning" @click="onUpdate(scope.row)">更新</el-button>
            <el-button v-if="!(isEdit && (form.id === scope.row.movie_id))" type="primary" @click="onEdit(scope.row)">編集</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

const URL_API = 'http://localhost:8888/kakei/kakei-api-1.8.2/public/api'

export default {
  data() {
    return {
      list: null,
      listTemp: null,
      listLoading: true,
      form: {
        id: '',
        category: '',
        subcategory: '',
        comment: ''
      },
      requestOptions: {
        id: '', // YouTube動画IDをカンマ区切りで複数指定
        part: 'id, snippet, player, statistics, status'
      },
      isEdit: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const url = URL_API + '/movieinfo'
      return axios.get(url)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('got!')
            this.listLoading = false
            this.listTemp = res.data.rst // 登録Youtube情報をすべて取得
            console.log(this.listTemp)
            this.requestOptions.id = res.data.ids.join(',') // 登録Youtubeの動画IDをカンマ区切りで取得
            console.log('ids')
            console.log(this.requestOptions)
            this.getYoutubeInfo()
          } else {
            this.$message({
              message: 'Fail!',
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.$message({
            message: 'cancel!',
            type: 'warning'
          })
        })
    },
    onSubmit() {
      const params = new URLSearchParams()
      params.append('isNew', 'true')
      params.append('id', this.form.id)
      params.append('category', this.form.category)
      params.append('subcategory', this.form.subcategory)
      params.append('comment', this.form.comment)

      const url = URL_API + '/movieinfo'
      return axios.post(url, params)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('登録しました!')
            this.form.id = ''
            this.form.category = ''
            this.form.subcategory = ''
            this.form.comment = ''
            this.fetchData()
          } else {
            this.$message({
              message: 'Fail!',
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.$message({
            message: 'cancel!',
            type: 'warning'
          })
        })
    },
    onUpdate(form) {
      console.log('form')
      console.log(form)
      this.listLoading = true
      const params = new URLSearchParams()
      params.append('isNew', 'false')
      params.append('id', this.form.id)
      params.append('category', this.form.category)
      params.append('subcategory', this.form.subcategory)
      params.append('comment', this.form.comment)

      const url = URL_API + '/movieinfo'
      return axios.post(url, params)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('更新しました!')
            this.form.id = ''
            this.form.category = ''
            this.form.subcategory = ''
            this.form.comment = ''
            this.fetchData()
          } else {
            this.$message({
              message: 'Fail!',
              type: 'warning'
            })
            this.listLoading = false
          }
        })
        .catch((res) => {
          this.$message({
            message: 'cancel!',
            type: 'warning'
          })
          this.listLoading = false
        })
    },
    getYoutubeInfo() {
      // 2. Initialize the JavaScript client library.
      const get = window.gapi.client.init({
        'apiKey': 'AIzaSyBZxW1R5-q0dXKJIpZdEDUBydS4OEQemNg'
        // clientId and scope are optional if auth is not required.
        // 'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
        // 'scope': 'profile'
      }).then(() => {
        // 3. Initialize and make the API request.
        return window.gapi.client.request({
          'mine': '',
          'path': '/youtube/v3/videos',
          'params': this.requestOptions
        })
      }).then((response) => {
        console.log('response')
        console.log(response.result)
        this.items = response.result.items
        this.joinArray(this.listTemp, this.items)
      }, (reason) => {
        console.log('reason!!')
        console.log(reason.result)
        // console.log('Error: ' + reason.result.error.message)
      })

      window.gapi.load('client', get)
    },
    onEdit(form) {
      console.log('id!')
      this.form.id = form.movie_id
      this.form.category = form.category
      this.form.subcategory = form.subcategory
      this.form.comment = form.comment
      console.log(this.form)

      this.isEdit = true
    },
    joinArray(arr1, arr2) {
      var loop = 0
      var arrResult = []
      console.log('arr2')
      console.log(arr2)
      arr1.forEach((val) => {
        console.log(loop)
        Object.assign(val, arr2[loop])
        console.log('assigned')
        console.log(val)
        arrResult.push(val)
        loop++
      })
      console.log('arrResult!')
      console.log(arrResult)
      this.list = arrResult
    },
    onCancel() {
      this.form.id = ''
      this.form.category = ''
      this.form.subcategory = ''
      this.form.comment = ''
      this.isEdit = false
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

