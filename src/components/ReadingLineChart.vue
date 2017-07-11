<template>
  <div class="root">
    <h4>Reading Line Chart</h4>
    <p>
      Mode:
      <input type="radio" id="mode-select-sensor" value="sensor" v-model="mode">
      <label for="mode-select-sensor">Sensor</label>
      <input type="radio" id="mode-select-chem" value="chem" v-model="mode">
      <label for="mode-select-chem">Chemical</label>
    </p>
    <div class="row" id="reading-line-chart">

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "reading-line-chart",
  props: {
    SORTED_SENSOR_DATA: {
      type: Array,
      default: []
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
    },
    TIME_INTERVAL: {
      type: Object
    }
  },
  data() {
    return {
      option: null,
      data: [],
      mode: "chem",
      time_data: []
    }
  },
  watch: {
    selected_sensor: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawLineChart()
    },
    selected_chem: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawLineChart()
    },
    SORTED_SENSOR_DATA: function(newVal, oldVal) {
      if (newVal.length > 0) {
        this.transformData()
        this.drawLineChart()
      }
    },
    mode: function(newVal, oldVal) {
      this.transformData()
      this.drawLineChart()
    }
  },
  mounted() {
    var dom = document.getElementById("reading-line-chart")
    this.linechart = echarts.init(dom)
    this.linechart.showLoading()
    this.getTimeData()
  },
  methods: {
    getTimeData () {
      var months = ["Apr", "Aug", "Dec"]
      this.time_data = []
      months.forEach(month_k => {
        var month_v = this.TIME_INTERVAL[month_k]
        var end = month_v.end
        for (var time = new Date(month_v.start);time < end; time.setTime(time.getTime() + (60*60*1000))) {
          this.time_data.push(new Date(time))
        }
      })
      //console.log(this.time_data);
    },
    getReadingByIndexAndTime(records, time, index) {
      for (var j = 0; (index+j < records.length) && (index-j >= 0); j ++) {
        if (records[index+j].time.getTime() === time.getTime()) {
          return records[index+j].reading
        }
        if (records[index-j].time.getTime() === time.getTime()) {
          return records[index+j].reading
        }
      }
      return 0
    },
    transformData() {
      this.series = []
      this.legend = []

      if (this.mode === "sensor") {
        this.selected_sensor.forEach(sensor_index => {
          var data = []
          var sensor_records = this.SORTED_SENSOR_DATA[sensor_index]

          for (var i = 0; i < this.time_data.length; i ++) {
            var time = this.time_data[i]
            var reading = 0
            this.selected_chem.forEach(chem_k => {
              var records = sensor_records[chem_k]
              reading += this.getReadingByIndexAndTime(records, time, i)
            })
            data.push([echarts.format.formatTime('YY-MM-dd hh:mm:ss', time ), reading])
          }

          this.series.push(data)
          this.legend.push("Sensor " + (sensor_index + 1).toString())
        })
      }else if (this.mode === "chem") {
        this.selected_chem.forEach(chem_k => {
          var data = []

          for (var i = 0; i < this.time_data.length; i ++) {
            var time = this.time_data[i]
            var reading = 0
            this.selected_sensor.forEach(sensor_index => {
              var records = this.SORTED_SENSOR_DATA[sensor_index][chem_k]
              reading += this.getReadingByIndexAndTime(records, time, i)
            })
            data.push([echarts.format.formatTime('YY-MM-dd hh:mm:ss', time ), reading])
          }

          this.series.push(data)
          this.legend.push(this.FULL_CHEM_NAME[chem_k])
        })
      }

      //console.log(this.series, this.legend);
    },
    drawLineChart() {
      var x = this.series[0].map(item => item[0])
      var series = []
      for (var i = 0; i < this.series.length; i ++) {
        var data = this.series[i]
        series.push({
          name: this.legend[i],
          type: 'line',
          data: data.map(item => item[1])
        })
      }

      this.option = {
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              data: data.map(function (item) {
                  return item[0];
              })
          },
          yAxis: {
              splitLine: {
                  show: false
              }
          },
          dataZoom: [{
              startValue: '2016-04-01 00:00:00'
          }, {
              type: 'inside'
          }],
          legend: {
              data: this.legend
          },
          series: series
      }

      if (this.option && typeof this.option === "object") {
          this.linechart.setOption(this.option, true);
          this.linechart.hideLoading()

          this.linechart.on("datazoom", params => {
            //console.log("datazoom");
            //console.log(params);
            //console.log(this.time_data.length * params.batch[0].start / 100);
            //console.log(this.time_data.length * params.batch[0].end / 100);

            if (params.batch) {
              this.$emit("changeDateRange", [
                this.time_data[Math.floor((this.time_data.length-1) * params.batch[0].start / 100.0)],
                this.time_data[Math.floor((this.time_data.length-1) * params.batch[0].end / 100.0)]
              ])
            }else {
              this.$emit("changeDateRange", [
                this.time_data[Math.floor((this.time_data.length-1) * params.start / 100.0)],
                this.time_data[Math.floor((this.time_data.length-1) * params.end / 100.0)]
              ])
            }

          });

          this.linechart.on("mouseover", params => {
            //console.log("mouseover");
            //console.log(params);
            this.$emit("timeHover", this.time_data[params.dataIndex])
          })
      }
    }
  }
}
</script>

<style scoped>
#reading-line-chart {
  height: 300px;
  width: 100%;
  margin: 0;
}

.root {
  width: 100%
}
</style>
