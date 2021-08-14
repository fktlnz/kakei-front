<template>
  <div>
    <div class="app-container">
      <h1>ユーザ管理</h1>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="ユーザ名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="パスワード">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="パスワード再入力">
          <el-input v-model="form.rePassword" />
        </el-form-item>
        <el-form-item label="メールアドレス">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddUsers">登録</el-button>
          <el-button @click="onCancel">Cancel</el-button>
          <!-- <el-button @click="ontest">test</el-button> -->
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
          <el-table-column align="center" label="id" width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.id }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="ユーザ名">
            <template slot-scope="scope">
              <p>{{ scope.row.username }}</p>
            </template>
          </el-table-column>
          <el-table-column label="メールアドレス" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="登録日" align="center">
            <template slot-scope="scope">
              <span>{{ getDateString(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

const URL_API = 'http://localhost:80/kakei/kakei-api/public/api'

export default {
  name: 'Finance',
  data() {
    return {
      list: null,
      listLoading: true,
      form: {
        id: '',
        username: '',
        password: '',
        rePassword: '',
        email: ''
      },
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      return axios.get(URL_API + '/users')
        .then((res) => {
          if (res.data.res === 'OK') {
            console.log(res)
            // this.list = this.sort(res.data.rst)
            this.list = res.data.rst
            this.$message('get')
            this.listLoading = false
          } else {
            console.log(res)
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
    onAddUsers() {
      const params = new URLSearchParams()
      params.append('username', this.form.username)
      params.append('password', this.form.password)
      params.append('re_pass', this.form.rePassword)
      params.append('email', this.form.email)

      const url = URL_API + '/signup'
      return axios.post(url, params)
        .then((res) => {
          console.log(res)
          if (res.data.res === 'OK') {
            this.$message(res.data.message)
            this.onResetField()
            this.fetchData()
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        })
    },
    onEdit2(form) {
      console.log('id!')
      this.form.id = form.id
      this.form.username = form.username
      this.form.password = form.password
      console.log(this.form)
    },
    onUpdate(form) {
      console.log('form')
      console.log(form)
      this.listLoading = true
      const params = new URLSearchParams()
      params.append('username', this.form.username)
      params.append('password', this.form.password)
      params.append('re_password', this.form.rePassword)
      params.append('email', this.form.email)

      const url = URL_API + '/users'
      return axios.post(url, params)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('更新しました!')
            this.form.username = ''
            this.form.password = ''
            this.form.rePassword = ''
            this.form.email = ''
            // this.fetchData()
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
    onDelete() {
      const url = URL_API + '/deleteusers?id=' + this.form.id
      return axios.get(url)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('deleted!')
            this.fetchData()
            this.listLoading = false
          } else {
            console.log(res)
            this.$message({
              message: 'Fail Delete!',
              type: 'warning'
            })
            this.listLoading = false
          }
        })
        .catch((res) => {
          this.$message({
            message: 'Fail Delete!',
            type: 'warning'
          })
          this.listLoading = false
        })
    },
    getDateString(unix) {
      const date = new Date(Number(unix)*1000)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const min = date.getMinutes()
      const sec = date.getSeconds()
      return date.getFullYear() + '/' + this.getZeroPadding(month) + '/' + this.getZeroPadding(day) + ' ' + this.getZeroPadding(hour) + ':' + this.getZeroPadding(min) + ':' + this.getZeroPadding(sec)
    },
    getZeroPadding(str) {
      return ('00' + str).slice(-2)
    },
    sort(list) {
      list.sort((a, b) => {
        if (Number(a.income) > Number(b.income)) return 1
        if (Number(a.income) < Number(b.income)) return -1
        return 0
      })
      return list
    },
    onResetField() {
      this.form.username = ''
      this.form.password = ''
      this.form.rePassword = ''
      this.form.email = ''
    },
    onCancel() {
      this.form.username = ''
      this.form.password = ''
      this.form.rePassword = ''
      this.form.email = ''
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.finance {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.p-home__input {
  width: 300px;
}
.p-home__diag-area ul li {
  display: inline-block;
  vertical-align: middle;
}
.p-home__diag-area input.text-init {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  background-image: none;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 30px;
  padding: 0.3em 1em;
  width: 100px;
}
.p-home__diag-input-area {
  background-color: #eff5ff;
  margin: 10px 0;
  padding: 20px 50px 0;
}
.c-btn.p-home__btn-finance-result {
  background-color: rgb(0, 175, 29);
  font-size: 22px;
  // padding: 8px 20px;
  width: 200px;
}
</style>
