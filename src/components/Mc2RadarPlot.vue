<template>
  <div class="root container-fluid">
    <div class="row main">
      <div class="col-md-2 left-panel">
        <div class="card">
          <div class="card-header">
            Chemical Selection
          </div>
          <div class="card-block">
            <div class="chem_select">
              <div v-for="chem_v, chem_k in FULL_CHEM_NAME">
                <h5>
                  <input type="checkbox" :id="'checkbox-chem-'+chem_k" :value="chem_k"
                  v-model="selected_chem">
                  <label :for="'checkbox-chem-'+chem_k">
                    {{chem_v}}
                  </label>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-10">
        <div class="card">
          <div class="card-header">
            Radar Plot
          </div>
          <div class="card-block">
            <div class="polar-plot">

            </div>
            <hr />
            <div class="date-slider">
              <vue-slider v-bind:data="date_selection_data"
              :value.sync="date_range_str"></vue-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'
import vueSlider from 'vue-slider-component'

export default {
  name: "mc2-base",
  components: {
    vueSlider
  },
  data() {
    return {
      SENSOR_DATA: [],
      sorted_sensor_data: {},
      WIND_DATA:[],
      FULL_CHEM_NAME: {
          "A": "Appluimonia",
          "C": "Chlorodinine",
          "M": "Methylosmolene",
          "G": "AGOC-3A"
      },
      COMPANY_LOCATION: [
        {
          "name":"Roadrunner Fitness Electronics",
          "location": [89, 27]
        },
        {
          "name":"Kasioc Office Furniture",
          "location": [90, 21]
        },
        {
          "name":"Radiance ColourTek",
          "location": [109, 26]
        },
        {
          "name":"Indigo Sol Boards",
          "location": [120, 22]
        }
      ],
      SENSOR_LOCATION: [
          [62, 21],//note that the number of the sensors starts from 1
          [66, 35],
          [76, 41],
          [88, 45],
          [103, 43],
          [102, 22],
          [89, 3],
          [74, 7],
          [119, 42]
      ],
      TIME_INTERVAL: {
          "Apr": {
              "start": new Date(2016, 3, 1),
              "end": new Date(2016, 4, 1)
          },
          "Aug": {
              "start": new Date(2016, 7, 1),
              "end": new Date(2016, 8, 1)
          },
          "Dec": {
              "start": new Date(2016, 11, 1),
              "end": new Date(2017, 0, 1)
          },
          "All":{
              "start": new Date(2016, 3, 1),
              "end": new Date(2017, 0, 1)
          }
      },
      selected_chem: [],
      date_selection_data:[],
      date_range_str: []
    }
  },
  mounted() {
    this.read_data()
    this.genDateSelectionData()
    this.calculateConstant()
    this.drawStatic()
    //console.log(this.TIME_INTERVAL);
  },
  methods: {
    read_data() {
      var that = this;

      d3.queue()
        .defer(d3.json, "static/data/sensor_data.json")
        .defer(d3.json, "static/data/wind_data.json")
        .await(load_data)

      function load_data(error, sensor_data, wind_data) {
        if (error) {
          console.error(error);
        }

        sensor_data.forEach(record => {
          record.time = new Date(record.time)
        })

        wind_data.forEach(record => {
          record.time = new Date(record.time)
        })
        //console.log(sensor_data, wind_data);
        that.SENSOR_DATA = sensor_data
        that.WIND_DATA = wind_data
        //console.log(sensor_data, wind_data);
        that.sortSensorData()
      }
    },
    sortSensorData() {
      var sorted = []
      this.SENSOR_LOCATION.forEach((location, index) => {
        sorted.push(new Object())
        for (var key in this.FULL_CHEM_NAME) {
          sorted[index][key] = []
        }
      })
      console.log(sorted);
      console.log(this.SENSOR_DATA);
      this.SENSOR_DATA.forEach(record => {
        sorted[record.sensor_index][record.chemical].push(record)
      })
      console.log(sorted);
    },
    get_date_range() {
      var value = []
      console.log(this.date_range_str);
      this.date_range_str.forEach(str => {
        if (str) {
          var date_splits = str.split("-")
          value.push(new Date(date_splits[0], date_splits[1], date_splits[2]))
        }
      })
      return value;
    },
    genDateSelectionData() {
      var date_selection_data = []
      var months = ["Apr", "Aug", "Dec"]
      months.forEach(key => {
        var range = this.TIME_INTERVAL[key]
        var start = range["start"]
        var end = range["end"]
        //console.log(start, end);

        for (var date = start; date < end; date.setDate(date.getDate() + 1)) {
          date_selection_data.push(echarts.format.formatTime('YY-MM-dd', date))
        }
      })
      this.date_selection_data = date_selection_data
      this.date_range_str = ["16-04-01", "16-12-31"]
      //console.log(date_selection_data);
    },
    calculateConstant() {
      this.WINDOW_MARGIN = 10
      this.WINDOW_LEFT_MAP_X = 62 - this.WINDOW_MARGIN
      this.WINDOW_RIGHT_MAP_X = 120 + this.WINDOW_MARGIN
      this.WINDOW_TOP_MAP_Y = 45 + this.WINDOW_MARGIN
      this.WINDOW_BOTTOM_MAP_Y = 3 - this.WINDOW_MARGIN

    },
    drawStatic() {
      var height_in_coor = this.WINDOW_TOP_MAP_Y - this.WINDOW_BOTTOM_MAP_Y
      var width_in_coor = this.WINDOW_RIGHT_MAP_X - this.WINDOW_LEFT_MAP_X
      var coor_pixel_scale = 13
      var height = height_in_coor * coor_pixel_scale
      var width = width_in_coor * coor_pixel_scale

      this.svg = d3.select(".polar-plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

      this.x_scale = d3.scaleLinear()
        .domain([this.WINDOW_LEFT_MAP_X, this.WINDOW_RIGHT_MAP_X])
        .range([0, width])

      this.y_scale = d3.scaleLinear()
        .domain([this.WINDOW_TOP_MAP_Y, this.WINDOW_BOTTOM_MAP_Y])
        .range([0, height])

      this.companys = this.svg
        .append("g")
        .attr("class", "companys")
        .selectAll(".company")
        .data(this.COMPANY_LOCATION)
        .enter()
        .append("circle")
        .attr("cx", d => {
          return this.x_scale(d.location[0])
        })
        .attr("cy", d => {
          return this.y_scale(d.location[1])
        })
        .attr("r", 5)
        .attr("fill", "red")
    },
    transformData() {
      var records_by_sensor = []
      var date_range = this.get_date_range()
      
    }
  }
}
</script>

<style scoped>
.main, .card {
  height: 100%;
}

.card-block {
  text-align: left;
}

.polar-plot {
  height: 800px;
  text-align: center;
}
</style>
