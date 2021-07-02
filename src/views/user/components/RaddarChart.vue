<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    data: {
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
      chart: null,
      maxValue: {
        food: 0,
        residence: 0,
        utility: 0,
        medical: 0,
        communication: 0,
        education: 0,
        entertainment: 0
      },
      axis: ['food', 'residence', 'utility', 'medical', 'communication', 'education', 'entertainment']
    }
  },
  mounted() {
    this.calcMax()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //   }
        // },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.1)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '食料', max: this.maxValue.food },
            { name: '住居', max: this.maxValue.residence },
            { name: '光熱・水道', max: this.maxValue.utility },
            { name: '保険医療', max: this.maxValue.medical },
            { name: '交通・通信', max: this.maxValue.communication },
            { name: '教育', max: this.maxValue.education },
            { name: '娯楽', max: this.maxValue.entertainment }
          ]
        },
        legend: {
          orient: 'vertical',
          left: 'center',
          bottom: '0',
          data: ['年収' + this.data.you.income + '万円の平均支出額', 'あなた支出額']
        },
        series: [{
          type: 'radar',
          symbolSize: 10,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1,
              color: ['rgba(0,0,0,0)']
            }
          },
          data: [
            {
              value: [this.data.you.food, this.data.you.residence, this.data.you.utility, this.data.you.medical, this.data.you.communication, this.data.you.education, this.data.you.entertainment],
              name: 'あなた支出額'
            },
            {
              value: [this.data.average.food, this.data.average.residence, this.data.average.utility, this.data.average.medical, this.data.average.communication, this.data.average.education, this.data.average.entertainment],
              name: '年収' + this.data.you.income + '万円の平均支出額'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    },
    calcMax() {
      const that = this
      const arr_rate = []
      const arr_ave = []
      let hasMoreOne = false
      that.axis.forEach((elem, index) => {
        const rate = that.data.you[elem] / that.data.average[elem]
        const ave = that.data.average[elem]
        if (rate > 1.0) { hasMoreOne = true }
        arr_rate.push(rate)
        arr_ave.push(ave)
      })
      const max_rate = Math.max.apply(null, arr_rate)
      const max_ave = Math.max.apply(null, arr_ave)

      if (hasMoreOne === true) {
        this.maxValue.food = this.data.average.food * max_rate
        this.maxValue.residence = this.data.average.residence * max_rate
        this.maxValue.utility = this.data.average.utility * max_rate
        this.maxValue.medical = this.data.average.medical * max_rate
        this.maxValue.communication = this.data.average.communication * max_rate
        this.maxValue.education = this.data.average.education * max_rate
        this.maxValue.entertainment = this.data.average.entertainment * max_rate
      } else {
        this.maxValue.food = max_ave
        this.maxValue.residence = max_ave
        this.maxValue.utility = max_ave
        this.maxValue.medical = max_ave
        this.maxValue.communication = max_ave
        this.maxValue.education = max_ave
        this.maxValue.entertainment = max_ave
      }
    }
  }
}
</script>
