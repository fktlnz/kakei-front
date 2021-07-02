<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      pdata: []
    }
  },
  mounted() {
    this.sort()
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
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.pdata,
            // data: [
            //   { value: this.data.you.food, name: '食料' },
            //   { value: this.data.you.residence, name: '住居' },
            //   { value: this.data.you.utility, name: '光熱・水道' },
            //   { value: this.data.you.medical, name: '保険医療' },
            //   { value: this.data.you.communication, name: '交通・通信' },
            //   { value: this.data.you.education, name: '教育' },
            //   { value: this.data.you.entertainment, name: '教養娯楽' }
            // ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    sort() {
      console.log('sort')
      console.log(this.data.you)
      const data_ = [
        { value: this.data.you.food, name: '食料 ' },
        { value: this.data.you.residence, name: '住居' },
        { value: this.data.you.utility, name: '光熱・水道' },
        { value: this.data.you.medical, name: '保険医療' },
        { value: this.data.you.communication, name: '交通・通信' },
        { value: this.data.you.education, name: '教育' },
        { value: this.data.you.entertainment, name: '教養娯楽' }
      ]
      data_.sort((a, b) => {
        if (Number(a.value) > Number(b.value)) return -1
        if (Number(a.value) < Number(b.value)) return 1
        return 0
      })
      this.pdata = data_
      console.log('sorted')
      console.log(this.pdata)
    }
  }
}
</script>
