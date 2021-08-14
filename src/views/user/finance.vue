<template>
  <div>
    <div class="l-userfront">
      <div class="c-title-wrap"><h1 class="c-title underline">家計診断</h1></div>
      <p style="text-align:center;">家計を診断して、おすすめの教材を提案します</p>
      <el-form ref="form" :model="form" label-width="110px">
        <div class="p-finance__diag--top">
          <el-form-item label="年収">
            <el-input v-model="fields.income" />
          </el-form-item>
          <el-form-item label="世帯">
            <el-radio-group v-model="fields.household" @change="onSwitchComField(fields.household)">
              <el-radio label="0">単身</el-radio>
              <el-radio label="1">2人以上の世帯</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary" @click="onSetAverage">平均の支出を設定</el-button>
        </div>
        <div class="p-finance__diag--bottom">
          <div class="p-finance__diag--bottom-in">
            <el-form-item label="食料">
              <el-input v-model="fields.food" />
            </el-form-item>
            <el-form-item label="住居">
              <el-input v-model="fields.residence" />
            </el-form-item>
            <el-form-item label="光熱・水道">
              <el-input v-model="fields.utility" />
            </el-form-item>
            <el-form-item label="保険医療">
              <el-input v-model="fields.medical" />
            </el-form-item>
            <el-form-item label="交通・通信">
              <el-input v-model="fields.communication" />
            </el-form-item>
            <el-form-item label="教育" :class="{'c-hide':IsCommunicationShow}">
              <el-input v-model="fields.education" />
            </el-form-item>
            <el-form-item label="教養娯楽" style="margin-bottom:0;">
              <el-input v-model="fields.entertainment" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="p-finance__diag--btn-wrap">
        <el-button class="c-btn p-home__btn-finance-result" type="primary" @click="toFianceDiagPage">家計診断へ</el-button>
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
      fields: {
        income: 0,
        household: '0',
        food: 0,
        residence: 0,
        utility: 0,
        medical: 0,
        communication: 0,
        education: 0,
        entertainment: 0
      },
      form: {
        you: {
          income: 0,
          household: '0',
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
      message: '',
      IsCommunicationShow: true
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    'fields.food': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.food = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'fields.residence': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.residence = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'fields.utility': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.utility = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'fields.medical': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.medical = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'fields.communication': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.communication = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'fields.education': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.education = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'fields.entertainment': function(val) {
      val = String(val).replace(/,/g, '')
      this.fields.entertainment = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  methods: {
    async onSetAverage() {
      const rst = this.checkForm()
      if (!rst) { return }
      this.getAverage(this.fields.income, this.fields.household, true)
    },
    async toFianceDiagPage() {
      this.copyFieldsToYou()
      const rst = this.checkForm(true)
      console.log(rst)
      if (!rst) { return }
      if (this.form.average.food === 0) {
        await this.getAverage(this.fields.income, this.fields.household)
      }
      this.$router.push({
        name: 'FinanceDiag',
        params: {
          rdata: this.form
        }
      })
    },
    async getAverage(income, household, isSetYou = false) {
      console.log('koko')
      await axios.get(URL_API + '/financeinfo?income=' + income + '&household=' + household)
        .then((res) => {
          if (res.data.res === 'OK') {
            console.log(res)
            this.setAverageData(res.data.rst[0])
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
      console.log(this.fields)
      if (all === false) {
        if (this.fields.income === 0) {
          this.fields.food = 0
          this.fields.residence = 0
          this.fields.utility = 0
          this.fields.medical = 0
          this.fields.communication = 0
          this.fields.education = 0
          this.fields.entertainment = 0
          return false
        }
        if (!Number.isInteger(Number(this.fields.income))) {
          return false
        }
        return true
      } else {
        console.log(this.form.average)
        console.log(this.form.you)
        if (this.form.you.income === 0 || this.form.you.food === 0 || this.form.you.residence === 0 || this.form.you.utility === 0 || this.form.you.medical === 0 || this.form.you.communication === 0 || this.form.you.entertainment === 0) {
          return false
        }
        console.log(Number(this.form.you.food))
        if (!Number.isInteger(Number(this.form.you.income)) || !Number.isInteger(Number(this.form.you.food)) || !Number.isInteger(Number(this.form.you.residence)) || !Number.isInteger(Number(this.form.you.utility)) || !Number.isInteger(Number(this.form.you.medical)) || !Number.isInteger(Number(this.form.you.communication)) || !Number.isInteger(Number(this.form.you.entertainment))) {
          return false
        }
        return true
      }
    },
    setYouData(data) {
      console.log('set you')
      this.form.you.food = Number(this.removeComma(data.food))
      this.form.you.residence = Number(this.removeComma(data.residence))
      this.form.you.utility = Number(this.removeComma(data.utility))
      this.form.you.medical = Number(this.removeComma(data.medical))
      this.form.you.communication = Number(this.removeComma(data.communication))
      this.form.you.education = Number(this.removeComma(data.education))
      this.form.you.entertainment = Number(this.removeComma(data.entertainment))
    },
    copyFieldsToYou() {
      this.form.you.income = Number(this.removeComma(this.fields.income))
      this.form.you.food = Number(this.removeComma(this.fields.food))
      this.form.you.residence = Number(this.removeComma(this.fields.residence))
      this.form.you.utility = Number(this.removeComma(this.fields.utility))
      this.form.you.medical = Number(this.removeComma(this.fields.medical))
      this.form.you.communication = Number(this.removeComma(this.fields.communication))
      this.form.you.education = Number(this.removeComma(this.fields.education))
      this.form.you.entertainment = Number(this.removeComma(this.fields.entertainment))
    },
    setAverageData(data) {
      console.log('set average')
      console.log(data)
      this.form.average.food = Number(data.food)
      this.form.average.residence = Number(data.residence)
      this.form.average.utility = Number(data.utility)
      this.form.average.medical = Number(data.medical)
      this.form.average.communication = Number(data.communication)
      this.form.average.education = Number(data.education)
      this.form.average.entertainment = Number(data.entertainment)

      this.fields.food = Number(data.food)
      this.fields.residence = Number(data.residence)
      this.fields.utility = Number(data.utility)
      this.fields.medical = Number(data.medical)
      this.fields.communication = Number(data.communication)
      this.fields.education = Number(data.education)
      this.fields.entertainment = Number(data.entertainment)
    },
    onSwitchComField(label) {
      if (label === '0') {
        this.IsCommunicationShow = true
      } else {
        this.IsCommunicationShow = false
      }
      this.form.you.food = 0
      this.form.you.residence = 0
      this.form.you.utility = 0
      this.form.you.medical = 0
      this.form.you.communication = 0
      this.form.you.education = 0
      this.form.you.entertainment = 0
    },
    removeComma(val) {
      return String(val).replace(/,/g, '')
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
.p-finance__diag--top, .p-finance__diag--bottom {
  .el-form {
    width: 500px;
    margin: 0 auto;
    .el-form-item {
      .el-form-item__label {
        text-align: left;
      }
    }
  }
}
.p-finance__diag--top {
  width: 500px;
  margin: 0 auto;
  padding-bottom: 45px;
  max-width: 100%;
  .el-form-item {
    &:nth-child(2) {
      margin-bottom: 0;
    }
  }
  .el-button {
    padding: 10px 10px;
    float: right;
  }
}
.p-finance__diag--bottom {
  background-color: #eef6ff;
  padding: 30px;
  margin-left: -50px;
  margin-right: -50px;
  margin-bottom: 30px;
  &-in {
    width: 500px;
    margin: 0 auto;
    max-width: 100%;
  }
}
.p-finance__diag--btn-wrap {
  text-align: center;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.c-btn.p-home__btn-finance-result {
  background-color: rgb(0, 175, 29);
  font-size: 22px;
  // padding: 8px 20px;
  width: 200px;
}
</style>
