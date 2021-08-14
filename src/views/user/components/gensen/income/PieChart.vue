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
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
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
          formatter: '{a} <br/>{b}'
        },
        // legend: {
        //   left: 'center',
        //   bottom: '10',
        //   data: ['～100万円', '100～200万円', '200～300万円', '300～400万円', '400～500万円', '500～600万円', '600～700万円', '700～800万円', '800～900万円', '900～1,000万円', '1,000万円～']
        // },
        series: [
          {
            name: '年収分布',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 80],
            center: ['50%', '50%'],
            data: [
              { value: 8.7, name: '～100万円 (8.7%)' },
              { value: 14.2, name: '100～200万円 (14.2%)' },
              { value: 14.9, name: '200～300万円 (14.9%)' },
              { value: 17.0, name: '300～400万円 (17.0%)' },
              { value: 14.6, name: '400～500万円 (14.6%)' },
              { value: 10.1, name: '500～600万円 (10.1%)' },
              { value: 6.5, name: '600～700万円 (6.5%)' },
              { value: 4.4, name: '700～800万円 (4.4%)' },
              { value: 2.9, name: '800～900万円 (2.9%)' },
              { value: 1.9, name: '900～1,000万円 (1.9%)' },
              { value: 4.8, name: '1,000万円～ (4.8%)' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }
        ]
      })
    }
  }
}
</script>
