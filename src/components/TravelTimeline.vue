<template>
  <div class="root" id="timeline">

  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "travel-timeline",
  props: {
    routes:{
      type: Array,
      default:[]
    },
    car_type_color_set: {
      type: Object
    },
    car_type_concerned: {
      type: Array
    },
    hover_route: {
      type: Object,
      default: null
    },
    staying_time_range: {
      type: Array
    }
  },
  data() {
    return {
      option: null,
      start_time: new Date(2015,5,1),
      end_tiem: new Date(2016,6,1),
      data: [],
      travels: [],
      categories: [],
    }
  },
  watch: {
    routes: function(newVal, oldVal) {
      //console.log(this.car_type_concerned);
      //console.log(newVal);
      if (this.routes.length > 0){
        this.initData()
        this.transformData()
        this.drawTimeline()
      }else {
        this.timeline.clear()
      }
    },
    car_type_concerned: function(newVal, oldVal) {
      //console.log(this.car_type_concerned);
      if (this.car_type_concerned.length > 0){
        this.initData()
        this.transformData()
        this.drawTimeline()
      }else {
        this.timeline.clear()
      }
    },
    hover_route: function(newVal, oldVal) {
      if (newVal) {
        this.initData()
        this.transformData()
        this.drawTimeline()
      }else if (this.car_type_concerned.length > 0) {
        this.initData()
        this.transformData()
        this.drawTimeline()
      }else {
        this.timeline.clear()
      }
    },
    staying_time_range: function(newVal, oldVal) {
      if (newVal) {
        this.initData()
        this.transformData()
        this.drawTimeline()
      }else if (this.car_type_concerned.length > 0) {
        this.initData()
        this.transformData()
        this.drawTimeline()
      }else {
        this.timeline.clear()
      }
    }
  },
  mounted() {
    var dom = document.getElementById("timeline");
    this.timeline = echarts.init(dom);

  },
  methods: {
    initData() {
      this.travels = [];
      this.categories = [];
      this.data = [];
    },
    transformData() {
      if (this.hover_route) {
        var routes = [this.hover_route]
      }else {
        var routes = this.routes
      }

      routes.forEach(route => {
        route.travels.forEach(travel => {
          if (this.car_type_concerned.indexOf(travel.car_type) >= 0){
            var entry_time = travel.records[0].time.getTime()
            var exit_time = travel.records[travel.records.length - 2].time.getTime()
            var minutes = (exit_time - entry_time) / 1000.0 / 60
            if (minutes >= this.staying_time_range[0] && minutes <= this.staying_time_range[1]) {
              this.travels.push(travel);
            }
          }
        })
      })
      if (this.travels.length <= 0) {
        return
      }
      //console.log(this.travels);
      this.travels.sort(function(a, b) {
        return a.records[0].time - b.records[0].time
      })

      //console.log(this.travels);

      this.travels.forEach(travel => {
        if (this.categories.length <= 0) {
          this.categories.push({
            "travels": [],
            "last_exit": this.start_time
          })
        }

        var inserted = false
        this.categories.forEach(category => {
          if (category.last_exit < travel.records[0].time && inserted === false) {
            category.travels.push(travel)
            category.last_exit = travel.records[travel.records.length - 1].time
            inserted = true
          }
        })

        if (inserted === false) {
          this.categories.push({
            "travels": [travel],
            "last_exit": travel.records[travel.records.length - 1].time
          })
        }
      })

      //console.log(this.categories);

      this.categories.forEach((category, index) => {
        //console.log(category,index);
        category.travels.forEach(travel => {
          var entry_time = travel.records[0].time;
          var exit_time = travel.records[travel.records.length - 1].time;
          this.data.push({
            name: travel.car_id,
            value: [
              index,
              entry_time,
              exit_time,
              exit_time - entry_time
            ],
            itemStyle: {
                normal: {
                    color: this.car_type_color_set[travel.car_type]
                }
            }
          })
        })
      })

      //console.log(this.data);
    },
    renderItem(params, api) {
      var categoryIndex = api.value(0);
      var start = api.coord([api.value(1), categoryIndex]);
      var end = api.coord([api.value(2), categoryIndex]);
      var height = api.size([0, 1])[1] * 0.6;

      return {
          type: 'rect',
          shape: echarts.graphic.clipRectByRect({
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
          }, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
          }),
          style: api.style()
      };
    },
    drawTimeline() {
      if (this.travels.length <= 0) {
        this.timeline.clear()
        return
      }
      this.option = {
          tooltip: {
              formatter: function (params) {
                  return params.marker + params.name + "<br />"
                    + "enter at:" + echarts.format.formatTime('yy-MM-dd hh:mm', params.value[1]) + "<br />"
                    + "exit at:" + echarts.format.formatTime('yy-MM-dd hh:mm', params.value[2])
              }
          },
          dataZoom: [{
              type: 'slider',
              filterMode: 'weakFilter',
              showDataShadow: false,
              top: 400,
              height: 10,
              borderColor: 'transparent',
              backgroundColor: '#e2e2e2',
              handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
              handleSize: 20,
              handleStyle: {
                  shadowBlur: 6,
                  shadowOffsetX: 1,
                  shadowOffsetY: 2,
                  shadowColor: '#aaa'
              },
              labelFormatter: ''
          }, {
              type: 'inside',
              filterMode: 'weakFilter'
          }],
          grid: {
              height:300
          },
          xAxis: {
              scale: true,
              axisLabel: {
                  formatter: function (val) {
                      return echarts.format.formatTime('yy-MM-dd', val) + "\n" + echarts.format.formatTime('hh:mm', val);
                  }
              }
          },
          yAxis: {
              //data: new Array(this.categories.length),
              /*
              axisLabel: {
                formatter: val => {
                  return ""
                }
              }
              */
          },
          series: [{
              type: 'custom',
              renderItem: this.renderItem,
              itemStyle: {
                  normal: {
                      opacity: 0.8
                  }
              },
              encode: {
                  x: [1, 2],
                  y: 0
              },
              data: this.data
          }]
      };

      if (this.option && typeof this.option === "object") {
        this.timeline.setOption(this.option, true);
      }

      this.timeline.on("click", params => {
        //console.log(params)
        this.$emit('setTravel', params.name)
      })
    }
  }
}
</script>

<style scoped>
.root {
  height: 450px;
  width: 100%;
  margin: 0;
}
</style>
