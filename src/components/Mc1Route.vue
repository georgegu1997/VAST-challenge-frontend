<template>
  <div class="root container-fluid">
    <div class="row main">
      <div class="col-md-2 left-panel">
        <div class="card route-card">
          <div class="card-header">
            Route Selection
          </div>
          <div class="route-selection card-block">
            <div v-for="pattern in PATTERNS" class="pattern">
              <h5>
                {{pattern.name}}
              </h5>
              <div v-for="route in pattern.routes" class="route"
                 v-on:click="toggleRoute(route)"
                 v-bind:style="{color: route.selected_color}">
                <p :title="route.description">
                  ({{route.travels.length}}){{route.description}}
                </p>
              </div>
            </div>
          </div>
          <div class="card-header">
            Car Type Selection
          </div>
          <div class="card-block">
            <div class="car-type-select row">
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-1" value="1" v-model="car_type_concerned">
                <label for="checkbox-1">1</label>
              </div>
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-2" value="2" v-model="car_type_concerned">
                <label for="checkbox-2">2</label>
              </div>
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-3" value="3" v-model="car_type_concerned">
                <label for="checkbox-3">3</label>
              </div>
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-4" value="4" v-model="car_type_concerned">
                <label for="checkbox-4">4</label>
              </div>
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-5" value="5" v-model="car_type_concerned">
                <label for="checkbox-5">5</label>
              </div>
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-6" value="6" v-model="car_type_concerned">
                <label for="checkbox-6">6</label>
              </div>
              <div class="col-md-1">
                <input type="checkbox" id="checkbox-2P" value="2P" v-model="car_type_concerned">
                <label for="checkbox-2P">2P</label>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="col-md-6 middle-panel">
        <div class="card">
          <div class="card-header">
            Route View
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-md-8">
                <div class="row">
                  <route-drawer
                  v-bind:routes="selected_routes"
                  ></route-drawer>
                </div>
                <div class="row">
                  <car-type-bar
                  v-bind:routes="selected_routes"
                  v-bind:types="car_type_concerned"
                  ></car-type-bar>

                </div>
              </div>
              <div class="col-md-4">
                <h5>Entry Time Distribution</h5>
                <div class="row">
                  <entry-time-heatmap
                  v-bind:routes="selected_routes"
                  v-bind:types="car_type_concerned"
                  ></entry-time-heatmap>
                </div>
                <div class="row">
                  <entry-time-punchcard
                  v-bind:routes="selected_routes"
                  v-bind:types="car_type_concerned"
                  ></entry-time-punchcard>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--

        <div class="row">
          <h5>Var Type Distribution</h5>
        </div>
        <div class="row">
          <div class="col-md-8">
            <car-type-bar
            v-bind:routes="selected_routes"
            v-bind:types="car_type_concerned"
            ></car-type-bar>
          </div>
          <div class="col-md-4">

          </div>
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import RouteDrawer from './RouteDrawer'
import CarTypeBar from './CarTypeBar'
import EntryTimeHeatmap from './EntryTimeHeatmap'
import EntryTimePunchcard from "./EntryTimePunchcard"

export default {
  name: 'mc-1-route',
  components: {
    RouteDrawer,
    CarTypeBar,
    EntryTimeHeatmap,
    EntryTimePunchcard
  },
  data() {
    return {
      PATTERNS: [],
      selected_routes: [],
      car_type_concerned: ['1','2','3','4','5','6','2P'],
      test: true
    }
  },
  watch: {
    car_type_concerned: function(newVal, oldVal) {
      console.log(newVal);
    }
  },
  mounted() {

    var that = this;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.queue()
      .defer(d3.json, "static/data/patterns.json")
      .await(load_data)

    function load_data(error, patterns){
      if (error) {console.error(error);}

      // construct the Date() object for every record
      patterns.forEach(pattern => {
        pattern.routes.forEach(route => {
          route.travels.forEach(travel => {
            travel.records.forEach(record => {
              record.time = new Date(record.timestamp)
            })
          })
        })
      })

      that.PATTERNS = patterns
      //console.log(that.PATTERNS);
    }
  },
  methods: {
    toggleRoute(route) {
      var index = this.selected_routes.indexOf(route)
      if (index >= 0) {
        this.selected_routes.splice(index, 1)
        route.selected_color = "#000000"
      }else {
        this.selected_routes.push(route)
        //route.selected_color = this.color(this.selected_routes.indexOf(route))
      }
      this.selected_routes.forEach((r, i) => {
        r.selected_color = this.color(i)
      })
    }
  }
}
</script>

<style scoped>
.main {
  height: 100%
}

.card {
  height: 100%
}

.route-selection {
  text-align: left;
  height: 100%;
  overflow-y: scroll;
}

.route-selection .pattern .route p {
  margin-bottom: 0;
  font-size: 12px;
  max-height: 15px;
  overflow-y: hidden;
}

.route-selection .pattern .selected p {
  color: red;
}
</style>
