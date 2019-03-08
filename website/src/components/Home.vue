<template>
  <div class="home">
    <div class="row">
      <div class="col-sm-8">
        <div class="row">
            <div class="col-sm-8">
                <Button 
                    v-bind:options="[
                        {text: 'Revenue', value: 'revenue'},
                        {text: 'Average IMDB Rating', value: 'imdb-rating'}]"
                    v-on:selection-change="mode=$event"/>
            </div>
            <div class="col-sm-4">
                <Button v-if="mode=='revenue'"
                    v-bind:options="[
                        {text: 'Total', value: 'total'},
                        {text: 'Per Capita', value: 'per-capita'}]"
                    v-on:selection-change="scale=$event"/>
            </div>
        </div>
        <Map v-bind:movieJSON="movieJSON" v-bind:movieid="movieid"
            v-bind:mode="mode" v-bind:scale="scale" v-bind:year="year"/>
        <Timeline id="timeline"  v-on:selection-change="year=$event"
                        v-on:deselect-year="year='2000 - 2019'"
        />
      </div>
      <div class="col-sm-4">
        <Searchbar v-bind:movieList="movieList" v-if="mode=='revenue'"
        v-on:movie-selection="movieid=$event"
        v-on:reset="movieid=''"/>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import Map from '@/components/Map.vue'
import Searchbar from '@/components/Searchbar.vue'
import Timeline from '@/components/Timeline.vue'
import movieJSON from '../../../database/merged_data_readable.json';
import * as d3 from 'd3';

export default {
  name: 'Home',
    components: {
    Button, Map, Searchbar, Timeline
  },
  props: {
    msg: String
  },
  data() {
      return {
          mode: 'revenue',
          scale: 'total',
          movieid: '',
          year: '2000 - 2019',
          movieJSON: movieJSON,
          movieList: Object.values(movieJSON),
      }
  },
  watch: {
      year: function() {
          var tmp = this.year;

          if (tmp == '2000 - 2019') {
              this.movieList = Object.values(movieJSON);
          } else {
              this.movieList = Object.values(movieJSON).filter(function (el) {
                  return el.release_year == tmp;
              })
          }
      }
  },
  computed: {
      filename() {
          return this.mode + ' ' + this.scale;
      }
  },
  methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#timeline {
  margin-top: 1em;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #b82929;
}
</style>
