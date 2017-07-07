<template>
  <div class="root" id="punchcard">

  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: 'entry-time-punchcard',
  props: {
    routes: {
      type: Array,
      default: []
    },
    types: {
      type: Array,
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
      data: [],
      hours: ['12p', '11a', '10a', '9a', '8a', '7a', '6a',
                '5a', '4a', '3a', '2a', '1a',
                '12a', '11p', '10p', '9p', '8p', '7p','6p',
                '5p','4p', '3p', '2p', '1p'],
      days : ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday',
            'Friday', 'Saturday']
    }
  },
  watch: {
    routes: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawPunchcard()
    },
    types: function(newVal, oldVal) {
      this.transformData()
      this.drawPunchcard()
    },
    hover_route: function(newVal, oldVal) {
      this.transformData()
      this.drawPunchcard()
    }
  },
  mounted() {
    var dom = document.getElementById("punchcard");
    this.punchcard = echarts.init(dom);

    for (var d = 0; d < 7; d ++) {
      for (var h = 0; h < 24; h ++) {
        this.data.push([d, h, 0])
      }
    }

    this.transformData()
    this.drawPunchcard()
  },
  methods: {
    transformData() {
      var raw_data = new Array();

      for(var i=0; i<7; i++)
      {
          raw_data[i]=new Array();
          for(var j=0; j<24; j ++)
          {
              raw_data[i][j]=0
          }
      }

      if (this.hover_route) {
        var routes = [this.hover_route]
      }else {
        var routes = this.routes
      }
      //console.log(raw_data);
      routes.forEach(route => {
        route.travels.forEach(travel => {
          if (this.types.indexOf(travel.car_type) >= 0) {
            var entry_time = travel.records[0].time;
            var day = entry_time.getUTCDay();
            var hour = entry_time.getUTCHours();
            //console.log(day, hour);
            raw_data[day][hour  ] ++;
          }
        })
      })

      this.data = [];
      for (var d = 0; d < 7; d ++) {
        for (var h = 0; h < 24; h ++) {
          //console.log(raw_data[d]);
          this.data.push([d, h, raw_data[d][h]])
        }
      }
      //console.log(this.data);

      this.max = echarts.util.reduce(this.data, function (max, item) {
          return Math.max(max, item[2]);
      }, -Infinity);
    },

    drawPunchcard() {
      this.option = {
          polar: {},
          tooltip: {
            formatter: d => {
              return this.days[d.data[0]] + " " + this.hours[d.data[0]] + ": " + d.data[2]
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
          angleAxis: {
              type: 'category',
              data: this.hours,
              boundaryGap: false,
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: '#ddd',
                      type: 'dashed'
                  }
              },
              axisLine: {
                  show: false
              }
          },
          radiusAxis: {
              type: 'category',
              data: this.days,
              z: 100
          },
          series: [{
              name: 'Punch Card',
              type: 'custom',
              coordinateSystem: 'polar',
              itemStyle: {
                  normal: {
                      color: '#d14a61'
                  }
              },
              renderItem: this.renderItem,
              data: this.data
          }]
      };

      if (this.option && typeof this.option === "object") {
          this.punchcard.setOption(this.option, true);
      }
    },

    renderItem(params, api) {
        var values = [api.value(0), api.value(1)];
        var coord = api.coord(values);
        var size = api.size([1, 1], values);
        return {
            type: 'sector',
            shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r0: coord[2] - size[0] / 2,
                r: coord[2] + size[0] / 2,
                startAngle: coord[3] - size[1] / 2,
                endAngle: coord[3] + size[1] / 2
            },
            style: api.style({
                fill: api.visual('color')
            })
        };
    }
  }
}
</script>

<style scoped>
.root {
  height: 380px;
  width: 100%;
  margin: 0;
}
</style>
