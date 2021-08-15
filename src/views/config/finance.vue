<template>
  <div>
    <div class="app-container">
      <h1>設定 - 家計診断</h1>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="年収">
          <el-input v-model="form.income" />
        </el-form-item>
        <el-form-item label="世帯">
          <el-radio-group v-model="form.household">
            <el-radio label="単身" />
            <el-radio label="2人以上" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="食料">
          <el-input v-model="form.food" />
        </el-form-item>
        <el-form-item label="住居">
          <el-input v-model="form.residence" />
        </el-form-item>
        <el-form-item label="光熱・水道">
          <el-input v-model="form.utility" />
        </el-form-item>
        <el-form-item label="保険医療">
          <el-input v-model="form.medical" />
        </el-form-item>
        <el-form-item label="交通・通信">
          <el-input v-model="form.communication" />
        </el-form-item>
        <el-form-item label="教育">
          <el-input v-model="form.education" />
        </el-form-item>
        <el-form-item label="教養娯楽">
          <el-input v-model="form.entertainment" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit2">登録</el-button>
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
          <el-table-column align="center" label="年収" width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.income }}</p>
              <!-- <el-input v-if="isEdit && (beforeForm.id === scope.row.movie_id)" v-model="form.id" :value="scope.row.movie_id" disabled="disabled" /> -->
            </template>
          </el-table-column>
          <el-table-column label="世帯">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ (scope.row.household === '0') ? '単身' : '二世帯以上' }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.household" :value="scope.row.household" />
            </template>
          </el-table-column>
          <el-table-column label="食料" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.food }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.food" :value="scope.row.food" />
            </template>
          </el-table-column>
          <el-table-column label="住居" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.residence }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.residence" :value="scope.row.residence" />
            </template>
          </el-table-column>
          <el-table-column label="光熱・水道" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.utility }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.utility" :value="scope.row.utility" />
            </template>
          </el-table-column>
          <el-table-column label="保険医療" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.medical }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.medical" :value="scope.row.medical" />
            </template>
          </el-table-column>
          <el-table-column label="交通・通信" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.communication }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.communication" :value="scope.row.communication" />
            </template>
          </el-table-column>
          <el-table-column label="教育" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.education }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.education" :value="scope.row.education" />
            </template>
          </el-table-column>
          <el-table-column label="教養娯楽" align="center">
            <template slot-scope="scope">
              <span v-if="!(isEdit && (form.id === scope.row.id))">{{ scope.row.entertainment }}</span>
              <el-input v-if="isEdit && (form.id === scope.row.id)" v-model="form.entertainment" :value="scope.row.entertainment" />
            </template>
          </el-table-column>
          <el-table-column label="" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="!(isEdit && (form.id === scope.row.id))" type="primary" @click="onEdit2(scope.row)">編集</el-button>
              <el-button v-if="isEdit && (form.id === scope.row.id)" class="u-mb5" type="warning" @click="onUpdate(scope.row)">更新</el-button>
              <el-button v-if="isEdit && (form.id === scope.row.id)" class="u-ml0 u-mb5" type="danger" @click="onDelete(scope.row)">削除</el-button>
              <el-button v-if="isEdit && (form.id === scope.row.id)" type="error" @click="onCancel()">キャンセル</el-button>
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


export default {
  name: 'Finance',
  data() {
    return {
      list: null,
      listLoading: true,
      form: {
        id: '',
        income: '',
        household: '',
        food: '',
        residence: '',
        utility: '',
        medical: '',
        communication: '',
        education: '',
        entertainment: ''
      },
      message: '',
      isNew: false, // 新規登録か
      isEnable: false, // 編集中 or 新規登録
      isEditLoading: false,
      isSubmitLoading: false,
      showMsg: false,
      isEdit: false,
      URL_API: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.$store.dispatch('user/apiurl').then((r) => {
      this.URL_API = r.data
      this.fetchData()
    }).catch((err) => {
      this.$message({
        message: 'get Error!',
        type: 'warning'
      })
    })
    
  },
  methods: {
    fetchData() {
      return axios.get(this.URL_API + '/financeinfo')
        .then((res) => {
          if (res.data.res === 'OK') {
            console.log(res)
            this.list = this.sort(res.data.rst)
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
    onSubmit2() {
      if (!Number.isInteger(Number(this.form.income))) {
        this.isEnable = false
        this.isEditLoading = false
        this.$message({
          message: '整数を入力してください',
          type: 'warning'
        })
        return
      }
      const household = (this.form.household === '単身') ? '0' : '1'
      const params = new URLSearchParams()
      params.append('isNew', true)
      params.append('household', household)
      params.append('income', this.form.income)
      params.append('food', this.form.food)
      params.append('residence', this.form.residence)
      params.append('utility', this.form.utility)
      params.append('medical', this.form.medical)
      params.append('communication', this.form.communication)
      params.append('education', this.form.education)
      params.append('entertainment', this.form.entertainment)

      const url = this.URL_API + '/financeinfo'
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
            this.isSubmitLoading = false
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
          this.isSubmitLoading = false
        })
    },
    onEdit2(form) {
      console.log('id!')
      this.form.id = form.id
      this.form.income = form.income
      this.form.household = form.household
      this.form.food = form.food
      this.form.residence = form.residence
      this.form.utility = form.utility
      this.form.medical = form.medical
      this.form.communication = form.communication
      this.form.education = form.education
      this.form.entertainment = form.entertainment
      console.log(this.form)

      this.isEdit = true
    },
    onUpdate(form) {
      console.log('form')
      console.log(form)
      this.listLoading = true
      const params = new URLSearchParams()
      params.append('household', this.form.household)
      params.append('income', this.form.income)
      params.append('food', this.form.food)
      params.append('residence', this.form.residence)
      params.append('utility', this.form.utility)
      params.append('medical', this.form.medical)
      params.append('communication', this.form.communication)
      params.append('education', this.form.education)
      params.append('entertainment', this.form.entertainment)

      const url = this.URL_API + '/financeinfo'
      return axios.post(url, params)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('更新しました!')
            this.form.income = ''
            this.form.household = ''
            this.form.food = ''
            this.form.residence = ''
            this.form.utility = ''
            this.form.medical = ''
            this.form.communication = ''
            this.form.education = ''
            this.form.entertainment = ''
            this.isEdit = false
            this.fetchData()
          } else {
            this.$message({
              message: 'Fail!',
              type: 'warning'
            })
            this.isEdit = false
            this.listLoading = false
          }
        })
        .catch((res) => {
          this.$message({
            message: 'cancel!',
            type: 'warning'
          })
          this.isEdit = false
          this.listLoading = false
        })
    },
    onDelete() {
      const url = this.URL_API + '/deletefinanceinfo?id=' + this.form.id
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
    onEdit() {
      this.isEditLoading = true
      if (this.form.income === '') {
        this.form.food = ''
        this.form.residence = ''
        this.form.utility = ''
        this.form.medical = ''
        this.form.communication = ''
        this.form.education = ''
        this.form.entertainment = ''
        this.isEnable = false
        this.isEditLoading = false
        this.$message({
          message: '年収を入力してください',
          type: 'warning'
        })
        return
      }
      if (!Number.isInteger(Number(this.form.income))) {
        this.isEnable = false
        this.isEditLoading = false
        this.$message({
          message: '整数を入力してください',
          type: 'warning'
        })
        return
      }

      return axios.get(this.URL_API + '/financeinfo?income=' + this.form.income)
        .then((res) => {
          this.isEditLoading = false
          if (res.data.res === 'OK') {
            this.isEnable = true
            console.log(res)
            this.form.food = res.data.rst.food
            this.form.residence = res.data.rst.residence
            this.form.utility = res.data.rst.utility
            this.form.medical = res.data.rst.medical
            this.form.communication = res.data.rst.communication
            this.form.education = res.data.rst.education
            this.form.entertainment = res.data.rst.entertainment
            this.isEditLoading = false
            this.isNew = false
            this.$message('平均支出額を取得しました')
          } else {
            this.isEnable = true
            console.log(res)
            this.form.food = ''
            this.form.residence = ''
            this.form.utility = ''
            this.form.medical = ''
            this.form.communication = ''
            this.form.education = ''
            this.form.entertainment = ''
            this.isEditLoading = false
            this.isNew = true
            this.$message('平均支出額を登録してください。')
          }
        })
        .catch((res) => {
          this.isEditLoading = false
          this.isEnable = false
          this.$message({
            message: '取得に失敗しました',
            type: 'warning'
          })
          console.log(res)
        })
    },
    onSubmit() {
      this.isSubmitLoading = true
      if (!Number.isInteger(Number(this.form.income))) {
        this.isEnable = false
        this.isEditLoading = false
        this.$message({
          message: '整数を入力してください',
          type: 'warning'
        })
        return
      }
      const params = new URLSearchParams()
      params.append('isNew', this.isNew)
      params.append('income', this.form.income)
      params.append('food', this.form.food)
      params.append('residence', this.form.residence)
      params.append('utility', this.form.utility)
      params.append('medical', this.form.medical)
      params.append('communication', this.form.communication)
      params.append('education', this.form.education)
      params.append('entertainment', this.form.entertainment)

      const url = this.URL_API + '/financeinfo'
      return axios.post(url, params)
        .then((res) => {
          console.log(res)
          if (res.data.res === 'OK') {
            this.$message(res.data.message)
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
          this.isSubmitLoading = false
        })
        .catch((res) => {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
          this.isSubmitLoading = false
        })
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
      this.form.income = ''
      this.form.household = ''
      this.form.food = ''
      this.form.residence = ''
      this.form.utility = ''
      this.form.medical = ''
      this.form.communication = ''
      this.form.education = ''
      this.form.entertainment = ''
    },
    onCancel() {
      this.form.income = ''
      this.form.household = ''
      this.form.food = ''
      this.form.residence = ''
      this.form.utility = ''
      this.form.medical = ''
      this.form.communication = ''
      this.form.education = ''
      this.form.entertainment = ''
      this.isEdit = false
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
