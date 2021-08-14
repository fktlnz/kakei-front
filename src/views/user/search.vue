<template>
  <div>
    <div id="p-result-container">
      <h1 class="c-title underline">オススメ動画</h1>
      <transition-group name="fadeup">
        <template>
          <div v-for="item in items" :key="item.id" :item="item" class="p-result-cards">
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
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import $ from 'jquery'

const URL_API = 'http://localhost:80/kakei/kakei-api/public/api'

export default {
  name: 'Finance',
  props: {
    sort: {
      type: String,
      default: 'food'
    }
  },
  data() {
    return {
      items: {}, // 取得結果
      itemsTemp: {},
      playlistId: '',
      nextPageToken: '',
      prevPageToken: '',
      requestOptions: {
        id: 'sM7958Hx4Yg,mi23LJoZHog,fU1Uq8W1Wl4,r21hg1AmXeY,v3fzEOZMIUs', // YouTube動画IDをカンマ区切りで複数指定可
        part: 'id, snippet, player, statistics, status'
      },
      enableType: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // this.start()
    // window.gapi.client.setApiKey('AIzaSyBZxW1R5-q0dXKJIpZdEDUBydS4OEQemNg')
    this.fetchData()
    // window.gapi.load('client', this.start)
  },
  methods: {
    start() {
      // 2. Initialize the JavaScript client library.
      window.gapi.client.init({
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
      }, (reason) => {
        console.log('reason!!')
        console.log(reason.result)
        // console.log('Error: ' + reason.result.error.message)
      })
    },
    fetchData() {
      const url = URL_API + '/movieinfo?enableType=' + this.sort
      console.log('sort')
      console.log(this.sort)
      return axios.get(url)
        .then((res) => {
          if (res.data.res === 'OK') {
            this.$message('got!')
            this.itemsTemp = res.data.rst // 登録Youtube情報をすべて取得
            console.log(this.itemsTemp)
            this.requestOptions.id = res.data.ids.join(',') // 登録Youtubeの動画IDをカンマ区切りで取得
            console.log('ids')
            console.log(this.requestOptions)
            this.getYoutubeInfo()
          } else {
            console.log(res)
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
        console.log('response')
        console.log(response.result)
        this.items = response.result.items
        this.joinArray(this.itemsTemp, this.items)
      }, (reason) => {
        console.log('reason!!')
        console.log(reason.result)
        // console.log('Error: ' + reason.result.error.message)
      })

      window.gapi.load('client', get)
    },
    joinArray(arr1, arr2) {
      var loop = 0
      var arrResult = []
      arr1.forEach((val) => {
        console.log(loop)
        Object.assign(val, arr2[loop])
        arrResult.push(val)
        loop++
      })
      console.log('arrResult')
      console.log(arrResult)
      this.items = arrResult
    },
    onCsvToArr(csv) {
      return csv.split(',')
    },
    hundleAPILoaded() {
      this.requestUserUploadsPlaylistId()
    },
    requestUserUploadsPlaylistId() {
      var request = window.gapi.client.youtube.channels.list({
        mine: true,
        part: 'contentDetails'
      })
      request.execute(function(response) {
        this.playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads
        this.requestVideoPlaylist(this.playlistId)
      })
    },
    requestVideoPlaylist(playlistId, pageToken) {
      $('#video-container').html('')
      var requestOptions = {
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 10
      }
      if (pageToken) {
        requestOptions.pageToken = pageToken
      }
      var request = window.gapi.client.youtube.playlistItems.list(requestOptions)
      request.execute(function(response) {
        // Only show pagination buttons if there is a pagination token for the
        // next or previous page of results.
        this.nextPageToken = response.result.nextPageToken
        var nextVis = this.nextPageToken ? 'visible' : 'hidden'
        $('#next-button').css('visibility', nextVis)
        this.prevPageToken = response.result.prevPageToken
        var prevVis = this.prevPageToken ? 'visible' : 'hidden'
        $('#prev-button').css('visibility', prevVis)

        var playlistItems = response.result.items
        if (playlistItems) {
          $.each(playlistItems, function(index, item) {
            this.displayResult(item.snippet)
          })
        } else {
          $('#video-container').html('Sorry you have no uploaded videos')
        }
      })
    },
    displayResult(videoSnippet) {
      var title = videoSnippet.title
      var videoId = videoSnippet.resourceId.videoId
      $('#video-container').append('<p>' + title + ' - ' + videoId + '</p>')
    },
    nextPage() {
      this.requestVideoPlaylist(this.playlistId, this.nextPageToken)
    },
    previouspage() {
      this.requestVideoPlaylist(this.playlistId, this.prevPageToken)
    }
  }
}
</script>

<style lang="scss" scoped>
#p-result-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px 0;
  > span {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-right: -50px;
  }
}

.p-result-cards {
  width: 400px;
  box-shadow: 0 2px 5px 2px #ddd;
  margin-bottom: 50px;
  margin-right: 50px;
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
