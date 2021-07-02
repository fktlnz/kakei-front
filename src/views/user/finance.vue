<template>
  <div>
    <div class="l-userfront">
      <div class="c-title-wrap"><h1>家計診断</h1></div>
      <p>家計を診断して、おすすめの教材を提案します</p>
      <div class="p-home__diag-area">
        <ul>
          <li>年収</li><li><input v-model="form.you.income" type="text" class="text-init"></li><li class="u-ml5">万円</li><li><button class="c-btn" @click="onSetAverage">平均の支出を設定</button></li>
        </ul>
        <div class="p-home__diag-input-area">
          <ul>
            <li>食料</li><div><li><input v-model="form.you.food" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
          <ul>
            <li>住居</li><div><li><input v-model="form.you.residence" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
          <ul>
            <li>光熱・水道</li><div><li><input v-model="form.you.utility" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
          <ul>
            <li>保険医療</li><div><li><input v-model="form.you.medical" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
          <ul>
            <li>交通・通信</li><div><li><input v-model="form.you.communication" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
          <ul>
            <li>教育</li><div><li><input v-model="form.you.education" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
          <ul>
            <li>教養娯楽</li><div><li><input v-model="form.you.entertainment" type="text" class="text-init"></li><li class="u-ml5">円</li></div>
          </ul>
        </div>
        <button class="c-btn p-home__btn-finance-result" @click="toFianceDiagPage">家計診断へ</button>
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
      form: {
        you: {
          income: 0,
          food: 0,
          residence: 0,
          utility: 0,
          medical: 0,
          communication: 0,
          education: 0,
          entertainment: 0
        },
        average: {
          food: 0,
          residence: 0,
          utility: 0,
          medical: 0,
          communication: 0,
          education: 0,
          entertainment: 0
        }
      },
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async onSetAverage() {
      const rst = this.checkForm()
      if (!rst) { return }
      this.getAverage(this.form.you.income, true)
    },
    toFianceDiagPage() {
      const rst = this.checkForm(true)
      console.log(rst)
      if (!rst) { return }
      if (this.form.average.income === 0) {
        this.getAverage(this.form.you.income)
      }
      this.$router.push({
        name: 'FinanceDiag',
        params: {
          rdata: this.form
        }
      })
    },
    async getAverage(income, isSetYou = false) {
      await axios.get(URL_API + '/financeinfo?income=' + income)
        .then((res) => {
          if (res.data.res === 'OK') {
            console.log(res)
            this.setAverageData(res.data.rst)
          } else {
            console.log(res)
            const data = {
              food: 0,
              residence: 0,
              utility: 0,
              medical: 0,
              communication: 0,
              education: 0,
              entertainment: 0
            }
            this.setAverageData(data)
          }
        })
        .catch((res) => {
          console.log(res)
        })
      if (isSetYou === true) { this.setYouData(this.form.average) }
      return
    },
    checkForm(all = false) {
      console.log('checkform')
      console.log(this.form.you)
      if (all === false) {
        if (this.form.you.income === 0) {
          this.form.you.food = 0
          this.form.you.residence = 0
          this.form.you.utility = 0
          this.form.you.medical = 0
          this.form.you.communication = 0
          this.form.you.education = 0
          this.form.you.entertainment = 0
          return false
        }
        if (!Number.isInteger(Number(this.form.you.income))) {
          return false
        }
        return true
      } else {
        if (this.form.you.income === 0 || this.form.you.food === 0 || this.form.you.residence === 0 || this.form.you.utility === 0 || this.form.you.medical === 0 || this.form.you.communication === 0 || this.form.you.education === 0 || this.form.you.entertainment === 0) {
          return false
        }
        if (!Number.isInteger(Number(this.form.you.income)) || !Number.isInteger(Number(this.form.you.food)) || !Number.isInteger(Number(this.form.you.residence)) || !Number.isInteger(Number(this.form.you.utility)) || !Number.isInteger(Number(this.form.you.medical)) || !Number.isInteger(Number(this.form.you.communication)) || !Number.isInteger(Number(this.form.you.education)) || !Number.isInteger(Number(this.form.you.entertainment))) {
          return false
        }
        return true
      }
    },
    setYouData(data) {
      console.log('set you')
      this.form.you.food = Number(data.food)
      this.form.you.residence = Number(data.residence)
      this.form.you.utility = Number(data.utility)
      this.form.you.medical = Number(data.medical)
      this.form.you.communication = Number(data.communication)
      this.form.you.education = Number(data.education)
      this.form.you.entertainment = Number(data.entertainment)
    },
    setAverageData(data) {
      console.log('set average')
      this.form.average.food = Number(data.food)
      this.form.average.residence = Number(data.residence)
      this.form.average.utility = Number(data.utility)
      this.form.average.medical = Number(data.medical)
      this.form.average.communication = Number(data.communication)
      this.form.average.education = Number(data.education)
      this.form.average.entertainment = Number(data.entertainment)
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
.p-home__diag-area ul li {
  display: inline-block;
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
  margin: 10px 0;
  padding: 10px 0;
}
.p-home__diag-input-area > ul {
  padding-bottom: 5px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.p-home__diag-input-area > ul > li:first-child {
  width: 200px;
}
.c-btn.p-home__btn-finance-result {
  background-color: rgb(0, 175, 29);
  font-size: 22px;
  // padding: 8px 20px;
  width: 200px;
}
</style>
