<template>
  <div class="root">
    <div class="row" v-if="travel">
      <div class="col">
        <h5>Vehicle ID: </h5>
        <p>
          {{travel.car_id}}
        </p>
        <h5>Vehicle Type:</h5>
        <p v-bind:style="{color: car_type_color_set[travel.car_type]}">
          {{car_type_full_name[travel.car_type]}}
        </p>
        <h5>Vehicle Logs:</h5>
        <p v-for="record in travel.records">
          {{formateDate(record.time)}}
          {{record.gate_name}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: 'travel-detail',
  props: {
    travel: {
      type: Object,
      default: undefined
    },
    car_type_full_name: {
      type: Object
    },
    car_type_color_set: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    formateDate(date) {
      return echarts.format.formatTime('yy-MM-dd hh:mm', date)
    }
  }
}
</script>

<style scoped>
.root {
  width: 100%;
  height: 300px;
  text-align: left;
}

.root .row {
  width: 100%;
  height: 100%;
  overflow-y: auto
}
</style>
