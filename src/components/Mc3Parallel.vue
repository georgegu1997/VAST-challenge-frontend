<template>
  <div class="root container-fluid">
    <div class="row main">
      <div class="col-md-2 left-panel">
        <div class="card">
          <div class="card-header">
            Image Selection
          </div>
          <div class="card-block">
            <div v-for="(image, index) in IMAGE_FILE_LIST">
              <input type="checkbox" :id="'checkbox-image-'+index.toString()"
              :value="image" v-model="image_selected">
              <label :for="'checkbox-image-'+index.toString()">{{image}}</label>
            </div>
          </div>
          <div class="card-header">
            Band Selection
          </div>
          <div class="card-block">
            <div>
              <div v-for="band in BAND_LIST">
                <input type="radio" :id="'radio-band-'+band" :value="band" v-model="band_selected">
                <label :for="'radio-band-'+band">{{band}}</label>
                <br>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-10 right-panel">
        <div class="card">
          <div class="card-header">
            Image View
          </div>
          <div class="card-block">
            <div class="image-view row">
              <div v-for="image_file in image_true_file_list"
                v-bind:class="{
                  'col-md-12': image_true_file_list.length <=1,
                  'col-md-6': image_true_file_list.length === 2,
                  'col-md-4': image_true_file_list.length === 3,
                  'col-md-3': image_true_file_list.length >= 4,
                }">
                <img :src="image_file" class="img-fluid"/>
              </div>
            </div>
            <div class="image-parallel row">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'mc-3-parallel',
  data() {
    return {
      IMAGE_FILE_LIST: [
          'image01_2014_03_17',
          'image02_2014_08_24',
          'image03_2014_11_28',
          'image04_2014_12_30',
          'image05_2015_02_15',
          'image06_2015_06_24',
          'image07_2015_09_12',
          'image08_2015_11_15',
          'image09_2016_03_06',
          'image10_2016_06_26',
          'image11_2016_09_06',
          'image12_2016_12_19'
      ],
      image_selected: [],
      BAND_LIST: [
        'B1',
        'B2',
        'B3',
        'B4',
        'B5',
        'B6',
        'NDVI',
      ],
      band_selected: 'B1'
    }
  },
  watch: {
    image_selected: function(newVal, oldVal) {
      //console.log(this.image_selected);
    },
    band_selected: function(newVal, oldVal) {
      console.log(this.band_selected);
    }
  },
  computed: {
    image_true_file_list: function() {
      var list = []
      this.image_selected.forEach(image_name => {
        list.push("static/image/"+image_name+"_true.png")
      })
      //console.log(list);
      return list
    }
  },
}
</script>

<style scoped>
.main, .card {
  height: 100%;
}

.card-block {
  text-align: left;
}

.image-view, .image-parallel {
  height: 430px;
}

.image-view {
  text-align: center;
}

.img-fluid {
  max-height: 100%;
}

</style>
