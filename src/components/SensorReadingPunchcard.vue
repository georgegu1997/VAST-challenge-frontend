<template>
  <div class="root container">
    <h5 style="text-align: center">Average Reading Punchcard
      <span v-if="!all_time_interval">({{selected_month}})</span>
    <span class="h6">
      <input type="checkbox" id="all-time-select" value="true"
      v-model="all_time_interval">
      <label for="all-time-select">
        All time
      </label>
    </span></h5>
    <div class="row" id="reading-punchcard">

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "sensor-reading-punchcard",
  props: {
    SORTED_SENSOR_DATA: {
      type: Array,
      default: []
    },
    selected_chem: {
      type: Array,
      default: []
    },
    selected_sensor: {
      type: Array,
      default: []
    },
    selected_month: {
      type: String,
      default: "All"
    },
    TIME_INTERVAL: {
      type: Object
    }
  },
  data() {
    return {
      option: null,
      max: 0,
      data: [],
      hours: ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'],
      days : ['Sun', 'Mon', 'Tue','Wed', 'Thurs',
        'Fri', 'Sat'],
      mode: "reading",
      all_time_interval: true
    }
  },
  watch: {
    selected_sensor: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawPunchcard()
    },
    selected_chem: function(newVal, oldVal) {
      //console.log(newVal);
      this.transformData()
      this.drawPunchcard()
    },
    SORTED_SENSOR_DATA: function(newVal, oldVal) {
      if (newVal.length > 0) {
        this.transformData()
        this.drawPunchcard()
      }
    },
    selected_month: function(newVal, oldVal) {
      if (this.SORTED_SENSOR_DATA.length > 0) {
        this.transformData()
        this.drawPunchcard()
      }
    },
    all_time_interval: function(newVal, oldVal) {
      console.log(newVal);
      if (this.SORTED_SENSOR_DATA.length > 0) {
        this.transformData()
        this.drawPunchcard()
      }
    }
  },
  mounted() {
    var dom = document.getElementById("reading-punchcard")
    this.punchcard = echarts.init(dom);

    for (var d = 0; d < 7; d ++) {
      for (var h = 0; h < 24; h ++) {
        this.data.push([d, h, 0])
      }
    }
  },
  methods: {
    transformData() {
      var raw_data = new Array();
      var raw_counter = new Array();
      if (this.all_time_interval) {
        var start = -Infinity
        var end = Infinity
      }else {
        var start = this.TIME_INTERVAL[this.selected_month].start
        var end = this.TIME_INTERVAL[this.selected_month].end
      }

      for(var i=0; i<7; i++)
      {
          raw_data[i]=new Array();
          raw_counter[i]=new Array()
          for(var j=0; j<24; j ++)
          {
              raw_data[i][j]=0
              raw_counter[i][j]=0
          }
      }

      this.selected_sensor.forEach(sensor_k => {
        this.selected_chem.forEach(chem_k => {
          var records = this.SORTED_SENSOR_DATA[sensor_k][chem_k]
          records.forEach(record => {
            if (record.time >= start && record.time < end) {
              var day = record.time.getDay()
              var hour = record.time.getHours()
              if (this.mode === "reading") {
                raw_data[day][hour] += record.reading;
                raw_counter[day][hour] += 1;
              }else {
                console.error("mode error");
              }
            }
          })
        })
      })

      this.data = []
      for (var d = 0; d < 7; d ++) {
        for (var h = 0; h < 24; h ++) {
          //console.log(raw_data[d]);
          this.data.push([h, d, raw_data[d][h] / (raw_counter[d][h] === 0? 1: raw_counter[d][h])])
        }
      }

      this.max = echarts.util.reduce(this.data, function (max, item) {
          return Math.max(max, item[2]);
      }, -Infinity);
    },
    drawPunchcard() {
      //console.log(this.max);
      this.option = {
          tooltip: {
              position: 'top'
          },
          animation: false,
          grid: {
              height: '70%',
              y: '0'
          },
          yAxis: {
              type: 'category',
              data: this.days,
              splitArea: {
                  show: true
              }
          },
          xAxis: {
              type: 'category',
              data: this.hours,
              splitArea: {
                  show: true
              }
          },
          visualMap: {
              min: 0,
              max: this.max,
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              bottom: '0%',
              precision: 3,
              inRange: {
                color: ['#ccffcc', '#eac736', '#d94e5d']
              }
          },
          series: [{
              name: 'Punch Card',
              type: 'heatmap',
              data: this.data,
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }],
          tooltip: {
            formatter: d => {
              return this.days[d.data[1]] + " " + this.hours[d.data[0]] + ": " + d.data[2]
            }
          },
      };

      if (this.option && typeof this.option === "object") {
          this.punchcard.setOption(this.option, true);
      }
    }
  }
}

</script>

<style scoped>
#reading-punchcard {
  height: 250px;
  width: 100%;
  margin: 0;
}
</style>
