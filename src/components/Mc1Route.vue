<template>
  <div class="root container-fluid">
    <div class="row main">
      <div class="col-md-2 left-panel">
        <div class="card route-card">
          <div class="card-header">
            <h6>Route Selection <button class="btn btn-secondary" type="button"
            @click="clearSeletcedRoutes">Clear</button></h6>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search by gate name"
              v-model="search_text">
              <span class="input-group-btn">
                <button class="btn btn-secondary" type="button"
                @click="searchRouteByGate">Go</button>
              </span>
            </div>
          </div>
          <div class="route-selection card-block">
            <div v-for="pattern in PATTERNS" class="pattern" v-if="!search_result || search_result.length === 0">
              <p>
              <b-btn v-b-toggle="'collapse-pattern-'+pattern.name" class="pattern-toggle-button">
                {{pattern.name}} ({{pattern.count}})</b-btn>
              </p>
              <b-collapse :id="'collapse-pattern-'+pattern.name">
                <b-card>
                  <div class="pattern-select-all">
                    <button class="btn btn-primary"
                    v-on:click="selectAll(pattern.routes)"
                    >Select All</button>
                  </div>
                  <hr />
                  <div v-for="route in pattern.routes" class="route"
                  v-on:click="toggleRoute(route)"
                  v-bind:style="{color: route.selected_color}">
                    <h6 :title="route.description">
                      ({{route.travels.length}}){{route.description}}
                    </h6>
                  </div>
                </b-card>
              </b-collapse>
            </div>
            <div v-if="search_result && search_result.length > 0">
              <h5>Total Routes: {{search_result.length}}</h5>
              <h5>Total Entries: {{search_result_length}}</h5>
              <div v-for="route in search_result" class="route"
              v-on:click="toggleRoute(route)"
              v-bind:style="{color: route.selected_color}">
                <h6 :title="route.description">
                  ({{route.travels.length}}){{route.description}}
                </h6>
              </div>
            </div>
          </div>
          <div class="card-header">
            Car Type Selection
          </div>
          <div class="card-block">
            <div class="car-type-select">
              <div class="row">
                <input type="checkbox" id="checkbox-1" value="1"
                v-model="car_type_concerned">
                <label for="checkbox-1"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['1']}">
                  1. 2axles car (or motorcycle)
                </span></label>
              </div>
              <div class="row">
                <input type="checkbox" id="checkbox-2" value="2"
                v-model="car_type_concerned">
                <label for="checkbox-2"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['2']}">
                  2. 2 axles truck
                </span></label>
              </div>
              <div class="row">
                <input type="checkbox" id="checkbox-3" value="3"
                v-model="car_type_concerned">
                <label for="checkbox-3"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['3']}">
                  3. 3 axles truck
                </span></label>
              </div>
              <div class="row">
                <input type="checkbox" id="checkbox-4" value="4"
                v-model="car_type_concerned">
                <label for="checkbox-4"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['4']}">
                  4. 4 axles (or more) truck
                </span></label>
              </div>
              <div class="row">
                <input type="checkbox" id="checkbox-5" value="5"
                v-model="car_type_concerned">
                <label for="checkbox-5"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['5']}">
                  5. 2 axles bus
                </span></label>
              </div>
              <div class="row">
                <input type="checkbox" id="checkbox-6" value="6"
                v-model="car_type_concerned">
                <label for="checkbox-6"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['6']}">
                  6. 3 axles bus
                </span></label>
              </div>
              <div class="row">
                <input type="checkbox" id="checkbox-2P" value="2P"
                v-model="car_type_concerned">
                <label for="checkbox-2P"><span class="badge" v-bind:style="{backgroundColor: car_type_color_set['2P']}">
                  2P. 2 axles truck (with permission)
                </span></label>
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
                  v-on:hoverRoute="setHoverRoute"
                  ></route-drawer>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <h6>Staying Time Distribution</h6>
                    <duration-histogram
                    v-bind:routes="selected_routes"
                    v-bind:hover_route="hover_route"
                    v-bind:types="car_type_concerned"
                    v-on:StayingTimeSelected="setStayingTimeRange"
                    ></duration-histogram>
                  </div>
                  <div class="col-md-4">
                    <h6>Car Type Distribution</h6>
                    <car-type-bar
                    v-bind:routes="selected_routes"
                    v-bind:types="car_type_concerned"
                    v-bind:car_type_color_set="car_type_color_set"
                    v-bind:car_type_concerned="car_type_concerned"
                    v-bind:staying_time_range="staying_time_range"
                    v-bind:hover_route="hover_route"
                    ></car-type-bar>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <h5>Entry Time Distribution</h5>
                <div class="row">
                  <entry-time-heatmap
                  v-bind:routes="selected_routes"
                  v-bind:hover_route="hover_route"
                  v-bind:staying_time_range="staying_time_range"
                  v-bind:types="car_type_concerned"
                  ></entry-time-heatmap>
                </div>
                <div class="row">
                  <entry-time-punchcard
                  v-bind:routes="selected_routes"
                  v-bind:hover_route="hover_route"
                  v-bind:staying_time_range="staying_time_range"
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
      <div class="col-md-4 right-panel">
        <div class="card">
          <div class="card-header">
            Travels Timeline
          </div>
          <div class="card-block">
            <travel-timeline
            v-bind:routes="selected_routes"
            v-bind:car_type_concerned="car_type_concerned"
            v-bind:car_type_color_set="car_type_color_set"
            v-bind:hover_route="hover_route"
            v-bind:staying_time_range="staying_time_range"
            v-on:setTravel="setDetailedTravel"
            ></travel-timeline>
          </div>
          <div class="card-header">
            Travel Detail
          </div>
          <div class="card-block">
            <travel-detail
            v-bind:travel="selected_travel"
            v-bind:car_type_full_name="car_type_full_name"
            v-bind:car_type_color_set="car_type_color_set"
            ></travel-detail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as _ from "lodash"
import RouteDrawer from './RouteDrawer'
import CarTypeBar from './CarTypeBar'
import EntryTimeHeatmap from './EntryTimeHeatmap'
import EntryTimePunchcard from "./EntryTimePunchcard"
import TravelTimeline from "./TravelTimeline"
import TravelDetail from "./TravelDetail"
import DurationHistogram from "./DurationHistogram"

export default {
  name: 'mc-1-route',
  components: {
    RouteDrawer,
    CarTypeBar,
    EntryTimeHeatmap,
    EntryTimePunchcard,
    TravelTimeline,
    TravelDetail,
    DurationHistogram
  },
  data() {
    return {
      PATTERNS: [],
      selected_routes: [],
      car_type_concerned: ['1','2','3','4','5','6','2P'],
      test: true,
      car_type_color_set: {
        "1": "#009933",
        "2": "#ff00ff",
        "3": "#ff0066",
        "4": "#990000",
        "5": "#3399ff",
        "6": "#0000ff",
        "2P": "#999999"
      },
      selected_travel: undefined,
      hover_route: null,
      car_type_full_name: {
        "1": "2 axles car (or motorcycle)",
        "2": "2 axles truck",
        "3": "3 axles truck",
        "4": "4 axles (or more) truck",
        "5": "2 axles bus",
        "6": "3 axles bus",
        "2P": "2 axles truck (with permission)"
      },
      search_text: "",
      search_result: [],
      search_result_length: 0,
      staying_time_range: [0, Infinity]
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
        pattern.count = 0
        pattern.routes.forEach(route => {
          pattern.count += route.travels.length
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
  watch: {
    selected_routes: function(newVal, oldVal) {
      this.staying_time_range = [0, Infinity]
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
    },
    selectAll(routes) {
      //console.log("selectAll");
      var routes_to_push = []
      routes.forEach(route => {
        var index = this.selected_routes.indexOf(route)
        if(index < 0) {
          routes_to_push.push(route)
        }
      })
      this.selected_routes = this.selected_routes.concat(routes_to_push)
      this.selected_routes.forEach((r, i) => {
        r.selected_color = this.color(i)
      })
    },
    clearSeletcedRoutes() {
      this.selected_routes.forEach(route => {
        route.selected_color = "#000000"
      })
      this.selected_routes = []
      this.selected_travel = undefined
    },
    searchTravel(car_id) {
      //console.log(this.PATTERNS);
      for (var n = 0; n < this.PATTERNS.length; n ++) {
        var pattern = this.PATTERNS[n]
        //console.log(routes);
        for (var i = 0; i < pattern.routes.length; i ++) {
          var route = pattern.routes[i]
          for (var j = 0; j < route.travels.length; j ++) {
            var travel = route.travels[j]
            //console.log(travel.car_id);
            if (travel.car_id === car_id) {
              return travel
            }
          }
        }
      }

      console.error("Travel not found!");
    },
    setDetailedTravel(car_id) {
      //console.log(car_id);
      this.selected_travel = this.searchTravel(car_id)
    },
    setHoverRoute(route) {
      this.hover_route = route
      //console.log(route);
    },
    setStayingTimeRange: _.debounce(function (range) {
      console.log("call!", range);
      this.staying_time_range = range
    }, 100),
    searchRouteByGate() {
      this.search_result = []
      this.search_result_length = 0
      if (!this.search_text || this.search_text.length === 0) {
        return
      }
      var search_text_array = this.search_text.split(" ")
      //console.log(search_text_array);

      this.PATTERNS.forEach(pattern => {
        pattern.routes.forEach(route => {
          var found = []
          for (var k = 0; k < search_text_array.length; k++) {
            found.push(false)
          }

          for(var i = 0; i < route.records.length; i++) {
            var record = route.records[i]
            var outer_break = false

            for (var j = 0; j < search_text_array.length; j++) {
              var text = search_text_array[j]
              if (record.indexOf(text) >= 0) {
                found[j] = true
                if (found.indexOf(false) < 0) {
                  outer_break = true
                  this.search_result.push(route)
                  break
                }
              }
            }
            if (outer_break) {
              break
            }
          }
        })
      })

      this.search_result.forEach(route => {
        this.search_result_length += route.travels.length
      })
      //console.log(this.search_result);
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
  overflow-y: auto;
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

.pattern-toggle-button {
  width: 100%
}
</style>
