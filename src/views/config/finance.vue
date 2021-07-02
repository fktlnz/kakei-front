<template>
  <div>
    <div class="app-container">
      <transition name="fadein-msg" mode="out-in">
        <div v-if="showMsg" :class="{'error':isError}" class="p-message-area"><p>{{ message }}</p></div>
      </transition>
      <h1>設定 - 家計診断</h1>
      <div class="p-home__diag-area">
        <el-form ref="form" :model="form" label-width="120px">
          <ul><li class="p-home__input"><el-form-item label="年収"><el-input v-model="form.income" /></el-form-item></li><span class="u-ml5">万円</span></ul>
          <el-button type="primary" class="c-btn__arrow-b" :class="{'active':isEditLoading}" @click="onEdit">編集する</el-button>
          <div class="p-home__diag-input-area" :class="{'u-disable':!isEnable}">
            <ul><li class="p-home__input"><el-form-item label="食料"><el-input v-model="form.food" /></el-form-item></li><span class="u-ml5">円</span></ul>
            <ul><li class="p-home__input"><el-form-item label="住居"><el-input v-model="form.residence" /></el-form-item></li><span class="u-ml5">円</span></ul>
            <ul><li class="p-home__input"><el-form-item label="光熱・水道"><el-input v-model="form.utility" /></el-form-item></li><span class="u-ml5">円</span></ul>
            <ul><li class="p-home__input"><el-form-item label="保険医療"><el-input v-model="form.medical" /></el-form-item></li><span class="u-ml5">円</span></ul>
            <ul><li class="p-home__input"><el-form-item label="交通・通信"><el-input v-model="form.communication" /></el-form-item></li><span class="u-ml5">円</span></ul>
            <ul><li class="p-home__input"><el-form-item label="教育"><el-input v-model="form.education" /></el-form-item></li><span class="u-ml5">円</span></ul>
            <ul><li class="p-home__input"><el-form-item label="教養娯楽"><el-input v-model="form.entertainment" /></el-form-item></li><span class="u-ml5">円</span></ul>
          </div>
          <el-button type="primary" class="c-btn__arrow-b" :class="{'active':isSubmitLoading, 'disable':!isEnable}" @click="onSubmit"><span v-if="isNew">登録する</span><span v-else>更新する</span></el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

const URL_API = 'http://localhost:8888/kakei/kakei-api-1.8.2/public/api'

export default {
  name: 'Finance',
  data() {
    return {
      form: {
        income: '',
        food: '',
        residence: '',
        utility: '',
        medical: '',
        communication: '',
        education: '',
        entertainment: ''
      },
      message: '',
      isError: false,
      isNew: false, // 新規登録か
      isEnable: false, // 編集中 or 新規登録
      isEditLoading: false,
      isSubmitLoading: false,
      showMsg: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
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
        this.showMessage('年収が未入力です', true)
        this.isEnable = false
        this.isEditLoading = false
        return
      }
      if (!Number.isInteger(Number(this.form.income))) {
        this.isEnable = false
        this.isEditLoading = false
        this.showMessage('整数を入力してください', true)
        return
      }

      return axios.get(URL_API + '/financeinfo?income=' + this.form.income)
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
            this.showMessage('平均支出額を取得しました', false)
            this.isEditLoading = false
            this.isNew = false
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
            this.showMessage('平均支出額を登録してください。', false)
            this.isEditLoading = false
            this.isNew = true
          }
        })
        .catch((res) => {
          this.isEditLoading = false
          this.isEnable = false
          this.showMessage('取得に失敗しました', true)
          console.log(res)
        })
    },
    onSubmit() {
      this.isSubmitLoading = true
      if (!Number.isInteger(Number(this.form.income))) {
        this.isEnable = false
        this.isEditLoading = false
        this.showMessage('整数を入力してください', true)
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

      const url = URL_API + '/financeinfo'
      return axios.post(url, params)
        .then((res) => {
          console.log(res)
          if (res.data.res === 'OK') {
            this.showMessage(res.data.message, false)
          } else {
            this.showMessage(res.data.message, true)
          }
          this.isSubmitLoading = false
        })
        .catch((res) => {
          this.showMessage(res.data.message, true)
          this.isSubmitLoading = false
        })
    },
    showMessage(message, error) {
      this.showMsg = true
      this.message = message
      this.isError = error
      this.closeMessage()
    },
    closeMessage() {
      // メッセージフェードアウト
      setTimeout(() => {
        this.showMsg = false
        this.isError = false
      }, 3000)
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
