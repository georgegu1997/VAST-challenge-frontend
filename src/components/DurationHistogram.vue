<template>
  <div class="root" id="histogram">

  </div>
</template>

<script>
import * as echarts from "echarts"
import * as ecStat from "echarts-stat"

// All time will be in minutes
export default {
  name: "duration-histogram",
  props: {
    routes: {
      type: Array,
      default:[]
    },
    types: {
      type: Array
    },
    hover_route: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      option: null,
      max: 0,
      data: []
    }
  },
  watch: {
    routes: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawHistogram()
    },
    types: function(newVal, oldVal) {
      this.transformData()
      this.drawHistogram()
    },
    hover_route: function(newVal, oldVal) {
      this.transformData()
      this.drawHistogram()
    }
  },
  mounted() {
    var dom = document.getElementById("histogram")
    this.histogram = echarts.init(dom)

    this.transformData()
    this.drawHistogram()
  },
  methods: {
    transformData() {
      this.max = 0

      var routes;

      if (this.hover_route) {
        routes = [this.hover_route]
      }else if (this.types.length > 0 && this.routes.length > 0) {
        routes = this.routes
      }else {
        this.histogram.clear()
        return
      }

      var durations = []

      routes.forEach(route => {
        route.travels.forEach(travel => {
          var entry_time = travel.records[0].time.getTime()
          var exit_time = travel.records[travel.records.length - 2].time.getTime()
          var minutes = (exit_time - entry_time) / 1000.0 / 60
          durations.push(minutes)
        })
      })

      this.data = durations
      this.max = Math.max(this.data)
      //console.log(this.data);
    },
    renderItem(params, api) {
        var yValue = api.value(2);
        var start = api.coord([api.value(0), yValue]);
        var size = api.size([api.value(1) - api.value(0), yValue]);
        var style = api.style();

        return {
            type: 'rect',
            shape: {
                x: start[0] + 1,
                y: start[1],
                width: size[0] - 2,
                height: size[1]
            },
            style: style
        };
    },
    drawHistogram() {
      if (this.data.length === 0) {
        console.log("No Data for histogram");
        return
      }
      var bins = ecStat.histogram(this.data);
      //console.log(bins)

      var interval;
      var min = Infinity;
      var max = -Infinity;

      var data = echarts.util.map(bins.data, function (item, index) {
          var x0 = bins.bins[index].x0;
          var x1 = bins.bins[index].x1;
          interval = x1 - x0;
          min = Math.min(min, x0);
          max = Math.max(max, x1);
          return [x0, x1, item[1]];
      });

      this.option = {
          color: ['rgb(25, 183, 207)'],
          xAxis: {
              type: 'value',
              min: min,
              max: max,
              scale: true,
              axisLabel: {
                formatter: function(val) {
                  if (val === 0) {
                    return "0"
                  }else if (val < 60) {
                    return val.toString() + " min"
                  }else if (val < 24 * 60) {
                    return (Math.round(val/60)).toString() + " hour"
                  }else if (val < 30*24*60) {
                    return (Math.round(val/60/24)).toString() + " day"
                  }else {
                    return (Math.round(val/60/24/30)).toString() + " month"
                  }
                }
              }
          },
          yAxis: {
              type: 'value',
          },
          series: [{
              name: 'height',
              type: 'custom',
              renderItem: this.renderItem,
              encode: {
                  x: [0, 1],
                  y: 2,
                  tooltip: 2,
                  label: 2
              },
              data: data
          }],
          brush: {
              toolbox: ['lineX'],
              xAxisIndex: 0
          },
      };

      this.histogram.on('brushSelected', this.onBrushed);

      if (this.option && typeof this.option === "object") {
          this.histogram.setOption(this.option, true);
      }
    },
    onBrushed(params) {
      if (params.batch[0].areas[0] && params.batch[0].areas[0].coordRange) {
        //console.log(params.batch[0].areas[0].coordRange);
        this.$emit("StayingTimeSelected", params.batch[0].areas[0].coordRange)
      }
    }
  }
}
</script>

<style scoped>
.root {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
