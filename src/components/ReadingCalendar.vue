<template>
  <div class="root container">
    <h5>
      Total reaing Each Day ({{month_k}})
    </h5>
    <div class="row" id="reading-calendar">

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "reading-calendar",
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
    },
    month_k: {
      type: String
    }
  },
  data() {
    return {
      option: null,
      max: 0,
      data: [],
      cell_size: [60,60],
      max_radius: 25,
      max_day_total: 0,
      MONTH: {
        "Apr": "2016-04",
        "Aug": "2016-08",
        "Dec": "2016-12"
      }
    }
  },
  mounted() {
    var dom = document.getElementById("reading-calendar")
    this.calendar = echarts.init(dom)
  },
  watch: {
    selected_sensor: function(newVal, oldVal) {
      //console.log(newVal);
      this.drawCalendar()
    },
    selected_chem: function(newVal, oldVal) {
      //console.log(newVal);
      this.drawCalendar()
    },
    month_k: function(newVal, oldVal) {
      this.drawCalendar()
    },
    SORTED_SENSOR_DATA: function(newVal, oldVal) {
      if (newVal.length > 0) {
        this.drawCalendar()
      }
    }
  },
  methods: {
    transformData() {
      var date = new Date(this.TIME_INTERVAL[this.month_k].start)
      var end = new Date(this.TIME_INTERVAL[this.month_k].end)
      var data = [];
      this.max_day_total = 0

      for (var time = date; time < end; time = next_day) {
        //console.log(time);
        var day_data = []
        var next_day = new Date(time)
        var day_total = 0
        next_day.setDate(next_day.getDate()+1)

        this.selected_chem.forEach(chem_k => {
          var chem_v = this.FULL_CHEM_NAME[chem_k]
          //console.log(time, chem_v);
          var total = 0
          var counter = 0
          this.selected_sensor.forEach(sensor_index => {
            //console.log("sensor: ", sensor_index + 1);
            var records = this.SORTED_SENSOR_DATA[sensor_index][chem_k]
            //console.log(records);
            records.forEach(record => {
              if (record.time >= time && record.time < next_day) {
                //console.log(record.time, record.reading);
                total += record.reading
                counter ++
              }
            })
          })

          day_data.push({
            name : chem_v,
            value: total
          })
          day_total += total
          this.max_day_total = Math.max(day_total, this.max_day_total)
        })
        data.push({
          data: day_data,
          day_total: day_total,
          day: echarts.format.formatTime('yyyy-MM-dd', time)
        })
      }
      //console.log("pie: ", data);
      return data
    },
    getLegend() {
      var legend = []
      this.selected_chem.forEach(chem_k => {
        legend.push(this.FULL_CHEM_NAME[chem_k])
      })
      return legend
    },
    getVirtulData() {
      var date = new Date(this.TIME_INTERVAL[this.month_k].start)
      var end = new Date(this.TIME_INTERVAL[this.month_k].end)
      var data = [];
      for (var time = date; time < end; time.setDate(time.getDate()+1)) {
          data.push([
              echarts.format.formatTime('yyyy-MM-dd', time),
              Math.floor(Math.random() * 10000)
          ]);
      }
      console.log("virtual: ", data);
      return data;
    },
    getPieSeries(scatterData, chart) {
      var that = this
      return echarts.util.map(scatterData, function (item, index) {
          var center = chart.convertToPixel('calendar', item);

          return {
              id: index + 'pie',
              type: 'pie',
              center: center,
              label: {
                  normal: {
                      formatter: function(params) {
                        return params.value.toFixed(0)
                      },
                      position: 'inside'
                  }
              },
              radius: that.max_radius * that.data[index].day_total / that.max_day_total,
              data: that.data[index].data
          };
      });
    },
    drawCalendar() {
      var that = this
      var scatterData = this.getVirtulData();
      this.data = this.transformData()
      this.legend = this.getLegend()

      this.option = {
        tooltip : {},
        legend: {
            data: this.legend,
            bottom: 20
        },
        calendar: {
            top: 'middle',
            left: 'center',
            orient: 'vertical',
            cellSize: this.cell_size,
            yearLabel: {
                show: false,
                textStyle: {
                    fontSize: 30
                }
            },
            dayLabel: {
                margin: 20,
                firstDay: 1,
                nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
            },
            monthLabel: {
                show: false
            },
            range: this.MONTH[this.month_k]
        },
        series: [{
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 1,
            label: {
                normal: {
                    show: true,
                    formatter: function (params) {
                        return echarts.format.formatTime('dd', params.value[0]);
                    },
                    offset: [-this.cell_size[0] / 2 + 10, -this.cell_size[1] / 2 + 10],
                    textStyle: {
                        color: '#000',
                        fontSize: 14
                    }
                }
            },
            data: scatterData
        }]
      };

      var pieInitialized;
      setTimeout(function () {
          pieInitialized = true;
          that.calendar.setOption({
              series: that.getPieSeries(scatterData, that.calendar)
          });
      }, 10);

      if (this.option && typeof this.option === "object") {
          this.calendar.setOption(this.option, true);
          this.calendar.on("click", params => {
            //console.log(params);
            this.$emit("SetDate", params.seriesIndex)
          })
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 0
}
#reading-calendar {
  height: 400px;
  width: 100%;
  margin: 0;
}
</style>
