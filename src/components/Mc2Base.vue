<template>
  <div class="root container-fluid">
    Radar Plot
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'

export default {
  name: "mc2-base",
  data() {
    return {
      SENSOR_DATA: [],
      WIND_DATA:[],
      FULL_CHEM_NAME: {
          "A": "Appluimonia",
          "C": "Chlorodinine",
          "M": "Methylosmolene",
          "G": "AGOC-3A"
      },
      COMPANY_LOCATION: {
          "Roadrunner Fitness Electronics": [89, 27],
          "Kasioc Office Furniture": [90, 21],
          "Radiance ColourTek": [109, 26],
          "Indigo Sol Boards": [120, 22]
      },
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
    }
  },
  mounted() {
    this.read_data()
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
      }
    }
  }
}
</script>
