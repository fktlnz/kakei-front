<template>
  <div>
    <div class="l-userfront">
      <div class="c-title-wrap u-mb50"><h1 class="c-title border">家計診断結果</h1></div>
      <el-row class="u-mb50" :gutter="32">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <raddar-chart :data="rdata" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <pie-chart :data="rdata" />
          </div>
        </el-col>
      </el-row>
      <div class="p-fr__comment-wrap">
        <h2 class="c-title underline">診断コメント</h2>
        <ul class="p-fr__comment-area">
          <li v-if="result.food==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.food==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.food==-1" class="p-fr__comment">食糧費は平均以下です</li>
          <li v-else-if="result.food==0" class="p-fr__comment">食糧費は平均です</li>
          <li v-else class="p-fr__comment">食糧費は平均以上です</li>
        </ul>
        <ul class="p-fr__comment-area">
          <li v-if="result.residence==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.residence==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.residence==-1" class="p-fr__comment">住居費は平均以下です</li>
          <li v-else-if="result.residence==0" class="p-fr__comment">住居費は平均です</li>
          <li v-else class="p-fr__comment">住居費は平均以上です</li>
        </ul>
        <ul class="p-fr__comment-area">
          <li v-if="result.utility==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.utility==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.utility==-1" class="p-fr__comment">光熱・水道費は平均以下です</li>
          <li v-else-if="result.utility==0" class="p-fr__comment">光熱・水道費は平均です</li>
          <li v-else class="p-fr__comment">光熱・水道費は平均以上です</li>
        </ul>
        <ul class="p-fr__comment-area">
          <li v-if="result.medical==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.medical==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.medical==-1" class="p-fr__comment">保険医療費は平均以下です</li>
          <li v-else-if="result.medical==0" class="p-fr__comment">保険医療費は平均です</li>
          <li v-else class="p-fr__comment">保険医療費は平均以上です</li>
        </ul>
        <ul class="p-fr__comment-area">
          <li v-if="result.communication==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.communication==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.communication==-1" class="p-fr__comment">交通・通信費は平均以下です</li>
          <li v-else-if="result.communication==0" class="p-fr__comment">交通・通信費は平均です</li>
          <li v-else class="p-fr__comment">交通・通信費は平均以上です</li>
        </ul>
        <ul class="p-fr__comment-area">
          <li v-if="result.education==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.education==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.education==-1" class="p-fr__comment">教育費は平均以下です</li>
          <li v-else-if="result.education==0" class="p-fr__comment">教育費は平均です</li>
          <li v-else class="p-fr__comment">教育費は平均以上です</li>
        </ul>
        <ul class="p-fr__comment-area">
          <li v-if="result.entertainment==-1" class="p-fr__comment-img"><img src="@/assets/img/icon_smile.png" alt="笑顔"></li>
          <li v-else-if="result.entertainment==0" class="p-fr__comment-img"><img src="@/assets/img/icon_normal.png" alt="普通"></li>
          <li v-else class="p-fr__comment-img"><img src="@/assets/img/icon_sad.png" alt="泣き"></li>
          <li v-if="result.entertainment==-1" class="p-fr__comment">娯楽費は平均以下です</li>
          <li v-else-if="result.entertainment==0" class="p-fr__comment">娯楽費は平均です</li>
          <li v-else class="p-fr__comment">娯楽費は平均以上です</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'

const URL_API = 'http://localhost:80/kakei/kakei-api/public/api'

export default {
  name: 'Finance',
  components: {
    RaddarChart,
    PieChart
  },
  props: {
    rdata: {
      type: Object,
      default: () => ({
        average: {
          income: 0,
          food: 0,
          residence: 0,
          utility: 0,
          medical: 0,
          communication: 0,
          education: 0,
          entertainment: 0
        },
        you: {
          income: 0,
          food: 0,
          residence: 0,
          utility: 0,
          medical: 0,
          communication: 0,
          education: 0,
          entertainment: 0
        }
      })
    }
  },
  data() {
    return {
      result: { // -1: 平均以下 0: 平均 1: 平均以上
        food: 0,
        residence: 0,
        utility: 0,
        medical: 0,
        communication: 0,
        education: 0,
        entertainment: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    if (this.rdata.average === undefined || this.rdata.you === undefined) {
      console.log('rdata')
      console.log(this.rdata.average)
      this.$router.push({ name: 'Finance' })
    }
    this.setResult()
  },
  methods: {
    setResult() {
      if (this.rdata.you.food > this.rdata.average.food * 1.1) {
        this.result.food = 1
      } else if (this.rdata.you.food < this.rdata.average.food * 0.9) {
        this.result.food = -1
      } else {
        this.result.food = 0
      }
      if (this.rdata.you.residence > this.rdata.average.residence * 1.1) {
        this.result.residence = 1
      } else if (this.rdata.you.residence < this.rdata.average.residence * 0.9) {
        this.result.residence = -1
      } else {
        this.result.residence = 0
      }
      if (this.rdata.you.utility > this.rdata.average.utility * 1.1) {
        this.result.utility = 1
      } else if (this.rdata.you.food < this.rdata.average.utility * 0.9) {
        this.result.utility = -1
      } else {
        this.result.utility = 0
      }
      if (this.rdata.you.medical > this.rdata.average.medical * 1.1) {
        this.result.medical = 1
      } else if (this.rdata.you.medical < this.rdata.average.medical * 0.9) {
        this.result.medical = -1
      } else {
        this.result.medical = 0
      }
      if (this.rdata.you.communication > this.rdata.average.communication * 1.1) {
        this.result.communication = 1
      } else if (this.rdata.you.communication < this.rdata.average.communication * 0.9) {
        this.result.communication = -1
      } else {
        this.result.communication = 0
      }
      if (this.rdata.you.education > this.rdata.average.education * 1.1) {
        this.result.education = 1
      } else if (this.rdata.you.education < this.rdata.average.education * 0.9) {
        this.result.education = -1
      } else {
        this.result.education = 0
      }
      if (this.rdata.you.entertainment > this.rdata.average.entertainment * 1.1) {
        this.result.entertainment = 1
      } else if (this.rdata.you.entertainment < this.rdata.average.entertainment * 0.9) {
        this.result.entertainment = -1
      } else {
        this.result.entertainment = 0
      }
    },
    onEdit() {
      return axios.get(URL_API + '/financeinfo?income=' + this.rdata.income)
        .then((res) => {
          if (res.data.res === 'OK') {
            console.log(res)
            this.rdata.average.food = res.data.rst.food
            this.rdata.average.residence = res.data.rst.residence
            this.rdata.average.utility = res.data.rst.utility
            this.rdata.average.medical = res.data.rst.medical
            this.rdata.average.communication = res.data.rst.communication
            this.rdata.average.education = res.data.rst.education
            this.rdata.average.entertainment = res.data.rst.entertainment
            this.rdata.you.food = 10000
            this.rdata.you.residence = 20000
            this.rdata.you.utility = 30000
            this.rdata.you.medical = 40000
            this.rdata.you.communication = 50000
            this.rdata.you.education = 60000
            this.rdata.you.entertainment = 70000
          } else {
            console.log(res)
            this.rdata.average.food = ''
            this.rdata.average.residence = ''
            this.rdata.average.utility = ''
            this.rdata.average.medical = ''
            this.rdata.average.communication = ''
            this.rdata.average.education = ''
            this.rdata.average.entertainment = ''
          }
        })
        .catch((res) => {
          console.log(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.p-fr__comment-area {
  padding: 5px 0;
  > li {
    display: inline-block;
    &:first-child {
      margin-right: 20px;
    }
    &:nth-child(2) {
      padding: 10px;
      background-color: #ddd;
      border-radius: 5px;
      position: relative;
      width: 300px;
      &::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        border-top: 10px solid transparent;
        border-right: 10px solid #ddd;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
      }
    }
  }
}
</style>
