<template>
  <div class="root">
    <div id="histogram">

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"
import * as ecStat from "echarts-stat"
import * as math from 'mathjs'

export default {
  name: "image-band-histogram",
  props: {
    selected_band: {
      type: Number
    },
    image_arr: {
      type: Object
    }
  },
  data() {
    return {
      option: null,
    }
  },
  mounted() {
    var dom = document.getElementById("histogram")
    this.histogram = echarts.init(dom)
    this.drawHistogram()
  },
  methods: {
    drawHistogram() {
      //console.log(this.image_arr, this.selected_band);
      var data = this.image_arr.subset(math.index([0,650], [0,650], this.selected_band))
      //console.log(data);
      data = data.resize([651*651])
      console.log(data);

      var bins = ecStat.histogram(data._data);
      console.log(bins);

      var interval;
      var min = 0;
      var max = 255;

      data = echarts.util.map(bins.data, function (item, index) {
          var x0 = bins.bins[index].x0;
          var x1 = bins.bins[index].x1;
          interval = x1 - x0;
          return [x0, x1, item[1]];
      });

      function renderItem(params, api) {
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
      }

      this.option = {
          color: ['rgb(25, 183, 207)'],
          xAxis: [{
              type: 'value',
              min: min,
              max: max,
              scale: true
          }],
          yAxis: [{
              type: 'value',
          }],
          series: [{
              name: 'height',
              type: 'custom',
              renderItem: renderItem,
              encode: {
                  x: [0, 1],
                  y: 2,
                  tooltip: 2,
                  label: 2
              },
              data: data
          }]
      };

      if (this.option && typeof this.option === "object") {
          this.histogram.setOption(this.option, true);
      }
    }
  }
}
</script>

<style scoped>
.root, #histogram {
  height: 400px;
  width: 100%;
  margin: 0;
}
</style>
