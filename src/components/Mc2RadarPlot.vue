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
          <div class="card-header">
            Sensor Selection
          </div>
          <div class="card-block">
            <div class="sensor_select">
              <div class="row">
                <div v-for="location, index in SENSOR_LOCATION" class="col-md-6">
                  <h5>
                    <input type="checkbox" :id="'checkbox-sensor-'+index" :value="index"
                    v-model="selected_sensor">
                    <label :for="'checkbox-sensor-'+index">
                      Sensor {{index + 1}}
                    </label>
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div class="card-header">
            Divide by Month
          </div>
          <div class="card-block">
            <sensor-reading-bar
            :SORTED_SENSOR_DATA="SORTED_SENSOR_DATA"
            :selected_chem="selected_chem"
            :selected_sensor="selected_sensor"
            :TIME_INTERVAL="TIME_INTERVAL"
            :FULL_CHEM_NAME="FULL_CHEM_NAME">
            </sensor-reading-bar>
          </div>
        </div>
      </div>
      <div class="col-md-8 middle-panel">
        <div class="card">
          <div class="card-header">
            Radar Plot
          </div>
          <div class="card-block">
            <div class="line-chart row">
              <reading-line-chart
              :SORTED_SENSOR_DATA="SORTED_SENSOR_DATA"
              :selected_chem="selected_chem"
              :selected_sensor="selected_sensor"
              :TIME_INTERVAL="TIME_INTERVAL"
              :FULL_CHEM_NAME="FULL_CHEM_NAME"
              v-on:changeDateRange="changeDateRange"
              v-on:timeHover="hoverOnTime">
              ></reading-line-chart>
            </div>
            <h4>Average Reading Along Different Wind Direction</h4>
            <div class="row">
              <div class="polar-plot">

              </div>
              <div class="visual-map" id="visual-map">

              </div>
            </div>
            <!--
            <hr />
            <div class="date-slider">
              <vue-slider v-bind:data="date_selection_data"
              :value="date_range_str" :lazy="true"
              @callback="updateDateRange"></vue-slider>
            </div>
            -->
          </div>
        </div>
      </div>
      <div class="col-md-2 right-panel">
        <div class="card">
          <div class="card-header">
            Reading Plot
          </div>
          <div class="card-block">
            <sensor-reading-punchcard
            :SORTED_SENSOR_DATA="SORTED_SENSOR_DATA"
            :selected_chem="selected_chem"
            :selected_sensor="selected_sensor">
            </sensor-reading-punchcard>
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
import SensorReadingPunchcard from "./SensorReadingPunchcard"
import SensorReadingBar from "./SensorReadingBar"
import ReadingLineChart from "./ReadingLineChart"

export default {
  name: "mc2-base",
  components: {
    vueSlider,
    SensorReadingPunchcard,
    SensorReadingBar,
    ReadingLineChart
  },
  data() {
    return {
      SENSOR_DATA: [],
      SORTED_SENSOR_DATA: [],
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
      NUMBER_OF_SECTOR: 40,
      POLAR_RADIUS: 80,
      selected_chem: ["A"],
      selected_sensor: [0,1,2,3,4,5,6,7,8],
      //date_selection_data:[],
      //date_range_str: [],
      date_range: [new Date(2016,3,1), new Date(2017,0,1)]
    }
  },
  mounted() {
    this.read_data()
    //this.genDateSelectionData()
    this.calculateConstant()
    this.drawStatic()
    //console.log(this.TIME_INTERVAL)
    //this.refreshSlider()
    //console.log(this.date_selection_data);;
  },
  watch: {
    selected_chem: function(newVal, oldVal) {
      this.transformData()
      this.drawPolarPlots()
    },
    selected_sensor: function(newVal, oldVal) {
      this.changeSensorSelection()
    },
    /*
    date_range_str: function(newVal, oldVal) {
      //console.log(newVal);
      if (this.SENSOR_DATA && this.WIND_DATA && this.SENSOR_DATA.length > 0 && this.WIND_DATA.length > 0) {
        this.transformData()
        this.drawPolarPlots()
      }
    },
    */
    date_range: function(newVal, oldVal) {
      if (this.SENSOR_DATA && this.WIND_DATA && this.SENSOR_DATA.length > 0 && this.WIND_DATA.length > 0) {
        this.transformData()
        this.drawPolarPlots()
      }
    }
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
        //console.log(sensor_data);

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
        that.transformData()
        that.drawPolarPlots()
        //console.log(that.SORTED_SENSOR_DATA);
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
      //console.log(sorted);
      //console.log(this.SENSOR_DATA);
      this.SENSOR_DATA.forEach(record => {
        sorted[record.sensor_index][record.chemical].push(record)
      })
      //console.log(sorted);
      this.SORTED_SENSOR_DATA = sorted
    },
    changeDateRange(range) {
      //console.log(range);
      this.date_range = range
    },
    hoverOnTime(time) {
      console.log(time);
      var wind_record = this.WIND_DATA.find(record => record.time.getTime() === time.getTime())
      console.log(wind_record);
      var angle = 360.0 / this.NUMBER_OF_SECTOR
      var path_i = Math.floor(wind_record.direction / angle)
      /*
      this.sensor_m.each(function(datum, i, j) {
        var elem = d3.select(this)
        var segment = elem.selectAll("path")
          .attr("transform", (d, i) => {
            if (path_i === i) {
              return "scale(5)"
            }
          })
          .attr("opacity", (d,i) => {
            if (path_i !== i) {
              return "0.3"
            }
          })
          .transition()
          .duration(800)
          .attr("transform", "scale(1)")
          .attr("opacity", "1")
      })
      */
    },
    calculateConstant() {
      this.WINDOW_MARGIN = 15
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

      this.company = this.svg
        .append("g")
        .attr("class", "companys")
        .selectAll(".company")
        .data(this.COMPANY_LOCATION)
        .enter()
        .append("g")
        .attr("class", "company")
        .attr("transform", d => {
          return "translate(" + this.x_scale(d.location[0])  + "," + this.y_scale(d.location[1])  + ")";
        })

      this.company.append("circle")
        .attr("r", 5)
        .attr("fill", "red")

      this.company.append('text')
        .attr("text-anchor", "middle")
        .attr("dy", "-0.75em")
        .style("font-size", 20)
        .text(function(d) { return d.name; });

      var dom = document.getElementById("visual-map")
      this.visual_map = echarts.init(dom)
    },
    transformData() {
      var records_by_sensor = []
      var date_range = this.date_range
      var angle = 360.0 / this.NUMBER_OF_SECTOR
      var radius_arr = []
      //console.log(this.WIND_DATA, this.SENSOR_DATA);
      //console.log(this.WIND_DATA[0].time, this.SENSOR_DATA[0].time);
      //console.log(this.WIND_DATA[0].time.getTime() == this.SENSOR_DATA[0].time.getTime());

      this.SORTED_SENSOR_DATA.forEach((sensor_records, index) => {
        var reading_counter = []
        var number_counter = []

        for (var chem_k in sensor_records) {
          if (this.selected_chem.indexOf(chem_k) < 0) {
            continue
          }
          //console.log(date_range);
          var sensor_chem_records = sensor_records[chem_k].filter(record => {
            return record.time <= date_range[1] && record.time >= date_range[0]
          })
          //console.log(sensor_chem_records);

          sensor_chem_records.forEach(record => {

            //console.log(wind_record);
            if (record.wind_index >= 0) {
              var wind_record = this.WIND_DATA[record.wind_index]
              var sector_index = Math.floor(wind_record.direction / angle)

              if (!reading_counter[sector_index]) {
                reading_counter[sector_index] = 0
              }
              reading_counter[sector_index] += record.reading


              if (!number_counter[sector_index]) {
                number_counter[sector_index] = 0
              }
              number_counter[sector_index] += 1
            }
          })
        }
        var ave_reading_arr = []
        //console.log(number_counter, reading_counter);
        for (var i = 0; i < this.NUMBER_OF_SECTOR; i ++) {
          if(!number_counter[i]) {number_counter[i] = 1}
          if(!reading_counter[i]) {reading_counter[i] = 0}
          ave_reading_arr.push(reading_counter[i] / number_counter[i])
        }

        radius_arr.push(ave_reading_arr)

      })

      this.RADIUS_DATA = radius_arr
    },
    drawPolarPlots() {
      var data = []
      var that = this;
      var max_reading = 0
      //console.log(this.RADIUS_DATA);
      for (var i = 0; i < this.SENSOR_LOCATION.length; i ++) {
        var location = this.SENSOR_LOCATION[i]
        var radius = this.RADIUS_DATA[i]

        data.push({
          "location": location,
          "radius": radius
        })

        var local_max = d3.max(radius)
        if (local_max > max_reading) {
          max_reading = local_max
        }
      }

      this.visual_map.setOption({
        visualMap: {
            min: 0,
            max: max_reading,
            text:['High','Low'],
            realtime: false,
            calculable: true,
            top: 'center',
            left: '0%',
            precision: 3,
            inRange: {
                color: ['#ccffcc','#eac736', '#d94e5d']
            }
        },
        series: []
      })

      //console.log(max_reading);

      var color = d3.scaleLinear()
        .domain([0, max_reading/2.0, max_reading])
        //.range([ d3.rgb('#FFF500'), d3.rgb("#007AFF")])
        .range([d3.rgb('#ccffcc'), d3.rgb('#eac736'), d3.rgb('#d94e5d')])

      //console.log(data);

      var sensors = this.svg.selectAll(".sensors")
        .data([data])
      sensors.exit().remove()
      var sensors_m = sensors.enter().append("g")
        .merge(sensors).attr("class", "sensors")

      var sensor = sensors_m.selectAll(".sensor")
        .data(d => d)
      sensor.exit().remove()
      var sensor_m = sensor.enter().append("g")
        .merge(sensor).attr("class", "sensor")
        .attr("transform", d => {
          return "translate(" + this.x_scale(d.location[0])  + "," + this.y_scale(d.location[1])  + ")";
        })

      sensor_m.selectAll(".sensor-text").remove()

      sensor_m.selectAll(".sensor-text")
        .data((d, i) => [i])
        .enter().append("text")
        .text(d => "sensor " + (d + 1))
        .attr("class", "sensor-text")
        .attr("dy", this.POLAR_RADIUS + 10)
        .attr("text-anchor", "middle")

      sensor_m.on("mouseover", function(d,i) {
        //console.log("mouseover this");
        d3.select(this)
          .transition()
          .duration(500)
          .attr("transform", "translate(" + that.x_scale(d.location[0])  + "," + that.y_scale(d.location[1])  + ")" + "scale(2)")
      })

      sensor_m.on("mouseout", function(d,i) {
        //console.log("mouseover this");
        d3.select(this)
          .transition()
          .duration(500)
          .attr("transform", "translate(" + that.x_scale(d.location[0])  + "," + that.y_scale(d.location[1])  + ")" + "scale(1)")
      })

      this.sensor_m = sensor_m
      var circle_scale = d3.scaleLinear()
        .domain([0, max_reading])
        .range([0, this.POLAR_RADIUS*1.5])

      sensor_m.each(function(datum, i, j) {
        //console.log(this);
        //console.log(d);
        var elem = d3.select(this)
        var extent = d3.extent(datum.radius, d => d)
        var range = [0, extent[1]]
        var formatNumber = d3.format(".2");
        var r = circle_scale(extent[1])
        //console.log(elem);

        var x = d3.scaleLinear()
          .domain(range)
          .range([0, -that.POLAR_RADIUS])
          //.range([0, -r])

        var bar_scale = d3.scaleLinear()
          .domain(range)
          .range([0, that.POLAR_RADIUS])
          //.range([0, r])

        var xAxis = d3.axisLeft(x)
          .tickFormat(formatNumber)
          .ticks(2);

        var circle = elem.selectAll(".circle")
            .data(x.ticks(3))
        circle.exit().remove()
        var circle_m = circle.enter()
          .append("circle")
            .attr("class", "circle")
            .attr("r", function(d) {return bar_scale(d);})
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-dasharray", "2,2")
            .style("stroke-width",".5px");

        var arc = d3.arc()
          .startAngle((d,i) => {
            return (i * 2 * Math.PI) / that.NUMBER_OF_SECTOR
          })
          .endAngle((d,i) => {
            return ((i + 1) * 2 * Math.PI) / that.NUMBER_OF_SECTOR
          })
          .innerRadius(0)

        var old_data = elem.selectAll("path").data()

        var segment = elem.selectAll("path")
          .data(datum.radius.map((d, i, j) => {
            //console.log(j);
            return {
              "outerRadius": old_data[i]? old_data[i].outerRadius: 0,
              "value": d
            }
          }))

        segment.exit().remove()
        var segment_m = segment.enter().append("path")
          .merge(segment)
          .style("fill", d => color(d.value))
          .attr("d", arc)

        segment_m.transition().duration(1000)
          .attrTween("d", function(d,index) {
            var i = d3.interpolate(d.outerRadius, bar_scale(+d.value));
            return function(t) { d.outerRadius = i(t); return arc(d,index); };
          });

        elem.selectAll(".outer-frame").remove()
        elem.append("circle")
          .attr("r", that.POLAR_RADIUS)
          //.attr("r", r)
          .classed("outer", true)
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-width","1.5px")
          .attr("class", "outer-frame")

        elem.selectAll('.x-axis').remove()
        elem.append("g")
          .attr("class", "x-axis")
          .call(xAxis);
      })
    },
    changeSensorSelection() {
      var sensor = this.svg.select(".sensors").selectAll(".sensor")
      sensor.attr("opacity", (d,i) => {
        return this.selected_sensor.indexOf(i) >= 0 ? 1: 0.3
      })
      //console.log(sensor);
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

.visual-map {
  height: 936px;
  width: 100px;
}

.polar-plot {
  height: 936px;
  text-align: center;
}

.middle-panel .mini {
  transform: scale(0.5) translateX(-50%) translateY(-50%);;
}

.middle-panel .card .card-block {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
