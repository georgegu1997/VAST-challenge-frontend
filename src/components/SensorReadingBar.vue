<template>
  <div class="root container">
    <div class="row" id="reading-month-bar">

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name:"sensor-reading-bar",
  props: {
    SORTED_SENSOR_DATA: {
      type: Array,
      default: []
    },
    TIME_INTERVAL: {
      type: Object
    },
    FULL_CHEM_NAME: {
      type: Object
    },
    selected_chem: {
      type: Array,
      default: []
    },
    selected_sensor: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      option: null,
      data: []
    }
  },
  watch: {
    selected_sensor: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawBarChart()
    },
    selected_chem: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawBarChart()
    },
    SORTED_SENSOR_DATA: function(newVal, oldVal) {
      if (newVal.length > 0) {
        this.transformData()
        this.drawBarChart()
      }
    }
  },
  mounted() {
    var dom = document.getElementById("reading-month-bar")
    this.barchart = echarts.init(dom);
  },
  methods: {
    transformData() {
      this.series = []
      var months = ["Apr", "Aug", "Dec"]
      for (var i = 0; i < this.selected_chem.length; i ++) {
        //console.log(this.selected_chem);
        //console.log(chem_k);
        var chem_k = this.selected_chem[i]
        var chem_v = this.FULL_CHEM_NAME[chem_k]
        var series_data = []
        months.forEach(month_k => {
          var month_v = this.TIME_INTERVAL[month_k]
          var start_time = month_v.start
          var end_time = month_v.end
          //console.log(this.TIME_INTERVAL);
          var counter = 0
          this.selected_sensor.forEach(sensor_k => {
            var records = this.SORTED_SENSOR_DATA[sensor_k][chem_k]
            //console.log(sensor_k, chem_k, records);
            records.forEach(record => {
              if (record.time >= start_time && record.time <= end_time) {
                counter += record.reading
              }
            })
          })
          console.log(counter);
          series_data.push(counter)
        })
        this.series.push({
          name: this.FULL_CHEM_NAME[chem_k],
          type: "bar",
          stack: "total",
          data: series_data
        })
      }
      console.log(this.series);
    },
    drawBarChart() {
      var months = ["Apr", "Aug", "Dec"]
      var chems_legend = []
      this.selected_chem.forEach(chem_k => {
        chems_legend.push(this.FULL_CHEM_NAME[chem_k])
      })

      this.option = {
          tooltip : {
              trigger: 'axis',
              position: 'top',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              data: chems_legend
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          yAxis:  {
              type: 'value'
          },
          xAxis: {
              type: 'category',
              data: months
          },
          series: this.series
      }

      if (this.option && typeof this.option === "object") {
          this.barchart.setOption(this.option, true);
      }
    }
  }
}

</script>

<style scoped>
#reading-month-bar {
  height: 300px;
  width: 100%;
  margin: 0;
}
</style>
