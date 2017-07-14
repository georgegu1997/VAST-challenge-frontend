<template>
  <div class="root container">
    <div class="row" v-if="travel">
      <div class="md-col-6">
        <h5>Vehicle ID: </h5>
        <p>
          {{travel.car_id}}
        </p>
        <h5>Vehicle Type:</h5>
        <p>
          <span class="badge" v-bind:style="{backgroundColor: car_type_color_set[travel.car_type]}">
            {{car_type_full_name[travel.car_type]}}
          </span>
        </p>
        <h5>Vehicle Logs:</h5>
        <p v-for="record in travel.records">
          {{formateDate(record.time)}}
          {{record.gate_name}}
        </p>
      </div>
      <div class="md-col-6">
        <route-drawer-small
        :records="travel.records.map(r => r.gate_name)"
        :color="car_type_color_set[travel.car_type]"
        ></route-drawer-small>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"
import RouteDrawerSmall from "./RouteDrawerSmall"

export default {
  name: 'travel-detail',
  components: {
    RouteDrawerSmall
  },
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
      return echarts.format.formatTime('yy-MM-dd hh:mm:ss', date)
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
