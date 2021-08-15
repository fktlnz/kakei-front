<template>
  <div>
    <div class="l-userfront">
      <div class="l-container">
        <div class="c-title-wrap u-mb50"><h1 class="c-title border">家計診断結果</h1></div>
        <el-row class="u-mb50" :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper" style="padding-bottom:50px;">
              <raddar-chart :data="rdata" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper" style="padding-bottom:50px;">
              <pie-chart :data="rdata" />
            </div>
          </el-col>
        </el-row>
        <div class="p-pf-result-container">
          <div class="p-fr__comment-wrap u-mb50">
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
          <div class="p-fr-recommend-container u-mb50">
            <h2 class="c-title underline">オススメ動画</h2>
            <transition-group name="fadeup">
              <template>
                <div v-for="item in getFirstObj(items)" :key="item.id" :item="item" class="p-result-cards">
                  <div class="result-card">
                    <div class="result-card-header">
                      <p class="c-comment"><img src="@/assets/img/img_m.jpg" alt=""><span>{{ item.comment }}</span></p>
                      <span>{{ item.snippet.channelTitle }}</span>
                    </div>
                    <div class="result-card-thumbnail"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank"><img :src="item.snippet.thumbnails.standard.url" alt="アイキャッチ"></a></div>
                    <div class="result-card-body">
                      <div class="result-card-body__tags"><span v-for="tag in onCsvToArr(item.subcategory)" :key="tag.id" :tag="tag">{{ tag }}</span></div>
                      <div class="result-card-body__title"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank">{{ item.snippet.title }}</a></div>
                      <div class="result-card-body__additional"><img src="@/assets/img/icon_eye.png" alt=""><span>{{ item.statistics.viewCount }}回</span><img src="@/assets/img/icon_heart.png" alt=""><span>{{ item.statistics.likeCount }}回</span></div>
                    </div>
                  </div>
                </div>
              </template>
            </transition-group>
          </div>
        </div>
        <div class="p-fr-other-recommend-container">
          <h2 class="c-title underline">関連動画</h2>
          <transition-group name="fadeup">
            <template>
              <div v-for="item in getObjNotFirst(items)" :key="item.id" :item="item" class="p-result-cards">
                <div class="result-card">
                  <div class="result-card-header">
                    <p class="c-comment"><img src="@/assets/img/img_m.jpg" alt=""><span>{{ item.comment }}</span></p>
                    <span>{{ item.snippet.channelTitle }}</span>
                  </div>
                  <div class="result-card-thumbnail"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank"><img :src="item.snippet.thumbnails.standard.url" alt="アイキャッチ"></a></div>
                  <div class="result-card-body">
                    <div class="result-card-body__tags"><span v-for="tag in onCsvToArr(item.subcategory)" :key="tag.id" :tag="tag">{{ tag }}</span></div>
                    <div class="result-card-body__title"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank">{{ item.snippet.title }}</a></div>
                    <div class="result-card-body__additional"><img src="@/assets/img/icon_eye.png" alt=""><span>{{ item.statistics.viewCount }}回</span><img src="@/assets/img/icon_heart.png" alt=""><span>{{ item.statistics.likeCount }}回</span></div>
                  </div>
                </div>
              </div>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'


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
      },
      requestOptions: {
        id: 'sM7958Hx4Yg,mi23LJoZHog,fU1Uq8W1Wl4,r21hg1AmXeY,v3fzEOZMIUs', // YouTube動画IDをカンマ区切りで複数指定可
        part: 'id, snippet, player, statistics, status'
      },
      excessItems: '', // カンマ区切り
      items: {},
      itemsTemp: {},
      enableType: [],
      URL_API: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    if (this.rdata.average === undefined || this.rdata.you === undefined) {
      this.$router.push({ name: 'Finance' })
    }
    this.setResult()
    this.setExcessItems()
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
      const url = this.URL_API + '/movieinfo?enableType=' + this.excessItems
      return axios.get(url)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('got!')
            this.itemsTemp = res.data.rst // 登録Youtube情報をすべて取得
            this.requestOptions.id = res.data.ids.join(',') // 登録Youtubeの動画IDをカンマ区切りで取得
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
        this.items = response.result.items
        this.joinArray(this.itemsTemp, this.items)
      }, (reason) => {
        // console.log('Error: ' + reason.result.error.message)
      })

      window.gapi.load('client', get)
    },
    joinArray(arr1, arr2) {
      var loop = 0
      var arrResult = []
      arr1.forEach((val) => {
        Object.assign(val, arr2[loop])
        arrResult.push(val)
        loop++
      })
      this.items = arrResult
    },
    onCsvToArr(csv) {
      return csv.split(',')
    },
    setResult() {
      console.log('setResult')
      console.log(this.rdata)
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
      } else if (this.rdata.you.utility < this.rdata.average.utility * 0.9) {
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
    setExcessItems() {
      for (var key in this.result) {
        if (this.result[key] === 1) {
          this.excessItems += key
          this.excessItems += ','
        }
      }
    },
    onEdit() {
      return axios.get(this.URL_API + '/financeinfo?income=' + this.rdata.income)
        .then((res) => {
          if (res.data.res === 'OK') {
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
    },
    onMoveToSearchPage() {
      this.$router.push({
        name: 'SearchUser',
        params: {
          sort: 'food,residence'
        }
      })
    },
    getFirstObj(obj) {
      console.log('obj')
      console.log(obj)
      if (Object.keys(obj).length < 1) return
      return {
        0: Object.entries(obj)[0][1]
      }
    },
    getObjNotFirst(obj) {
      var rst = {}
      for (var key in obj) {
        if (key === '0') continue
        rst[key] = obj[key]
      }
      return rst
    }
  }
}
</script>

<style lang="scss" scoped>
.p-pf-result-container {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  flex-wrap: wrap;
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
        width: calc(100% - 68px);
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
  .p-fr__comment-wrap {
    width: 50%;
    margin-right: 50px;
    @media (max-width: 767px) {
      width: 100%;
      margin-right: 0;;
    }
  }
  .p-fr-recommend-container {
    width: calc(50% - 50px);
    @media (max-width: 767px) {
      width: 100%;
    }
  }
}
.p-fr-other-recommend-container {
  width: 100%;
  > span {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-right: -50px;
  }
  .p-result-cards {
    width: 300px;
    margin-right: 50px;
  }
}
.p-result-cards {
  box-shadow: 0 2px 5px 2px #ddd;
  .result-card {

    .result-card-header {
      padding: 10px 10px 5px;
      > span {
        background-color: #ff7b5b;
        display: inline-block;
        padding: 5px 15px;
        color: #fff;
        border-radius: 20px;
        font-size: 12px;
        width: 100%;
        text-align: center;
      }
    }

    .result-card-thumbnail {
      width: 100%;
      > a {
        &:hover {
          opacity: .8;
        }
        img {
          width: 100%;
        }
      }
    }

    .result-card-body {
      padding: 5px 10px 10px;
      &__tags {
        margin-bottom: 10px;
        > span {
          display: inline-block;
          background-color: #003099;
          padding: 5px 15px;
          color: #fff;
          border-radius: 20px;
          font-size: 12px;
          &:not(:last-child) {
            margin-right: 5px;
          }
        }
      }
      &__title {
        color: #2e70ff;
        margin-bottom: 5px;
        > a {
          display: inline-block;
          text-decoration: underline;
          &:hover {
            text-decoration: none;
          }
        }
      }
      &__additional {
        > span {
          margin: 0 30px 0 5px;
        }

        > span, img {
          vertical-align: middle;
        }
      }
    }

  }
}
</style>
