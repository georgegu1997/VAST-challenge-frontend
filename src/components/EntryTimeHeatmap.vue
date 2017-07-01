<template>
  <div class="root" id="heatmap">
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: 'entry-time-heatmap',
  props: {
    routes: {
      type: Array,
      default: []
    },
    types: {
      type: Array
    }
  },
  data() {
    return {
      option: null,
      max: 0,
      data: {
        "2015":[],
        "2016":[]
      }
    }
  },
  watch: {
    routes: function(newVal, oldVal) {
      this.transformData()
      this.drawHeatmap()
    },
    types: function(newVal, oldVal) {
      this.transformData()
      this.drawHeatmap()
    }
  },
  mounted() {
    var dom = document.getElementById("heatmap")
    this.heatmap = echarts.init(dom)
    this.transformData()
    this.drawHeatmap()
  },
  methods: {
    transformData() {
      var routes = this.routes
      var max = this.max = 0
      var total = 0

      var dayTime = 3600 * 24 * 1000;
      var start_date = +echarts.number.parseDate('2015-05-01')
      var end_date = +echarts.number.parseDate('2016.05.31')

      var years = ["2015", "2016"]
      years.forEach(year => {
        var data = []
        var date = +echarts.number.parseDate(year + '-01-01');
        var end = +echarts.number.parseDate((+year + 1) + '-01-01');
        for (var time = date; time < end; time += dayTime) {
          if (time < start_date || time > end_date) {
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                0
            ]);
          }else {
            var counter = 0
            routes.forEach(route => {
              route.travels.forEach(travel => {
                if (this.types.indexOf(travel.car_type) >= 0) {
                  var entry_time = travel.records[0].timestamp
                  if (entry_time >= time && entry_time < time + dayTime) {
                    counter ++
                  }
                }
              })
            })
            if (counter > max) {
              max = counter
            }
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                counter
            ]);
            total += counter
          }
        }
        this.data[year] = data
      })

      //console.log(data);
      //console.log(max);
      //console.log(total);
      //console.log(this.data);
      this.max = max;
    },
    drawHeatmap() {
      this.option = {
          tooltip: {
              position: 'top',
              formatter: function (p) {
                  var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
                  return format + ': ' + p.data[1];
              }
          },
          visualMap: {
              min: 0,
              max: this.max,
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              top: 'top'
          },

          calendar: [
          {
              range: '2015',
              cellSize: ['auto', 12]
          },
          {
              top: 170,
              range: '2016',
              cellSize: ['auto', 12]
          }],

          series: [{
              type: 'heatmap',
              coordinateSystem: 'calendar',
              calendarIndex: 0,
              data: this.data["2015"]
          }, {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              calendarIndex: 1,
              data: this.data["2016"]
          }],

      };

      if (this.option && typeof this.option === "object") {
        this.heatmap.setOption(this.option, true);
      }
    }
  }
}
</script>

<style scoped>
.root {
  height: 300px;
  width: 100%;
  padding-right: 30px;
  margin-bottom: 20px
}
</style>
