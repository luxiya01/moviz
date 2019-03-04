<template>
  <div class="hello">
    <div class="row">
      <div class="col-sm-8">
        <div class="row">
            <div class="col-sm-8">
                <Button 
                    v-bind:options="[
                        {text: 'Revenue', value: 'revenue'},
                        {text: 'Temp', value: 'temp'},
                        {text: 'Average IMDB Rating', value: 'imbd-rating'}]"
                    v-on:selection-change="datatype=$event"/>
            </div>
            <div class="col-sm-4">
                <Button 
                    v-bind:options="[
                        {text: 'Total', value: 'total'},
                        {text: 'Per Capita', value: 'per-capita'}]"
                    v-on:selection-change="scale=$event"/>
            </div>
        </div>
        <Map v-bind:movieJSON="movieJSON" v-bind:movieid="movieid"/>
      </div>
      <div class="col-sm-4">
        <Searchbar v-bind:movieList="movieList"
        v-on:movie-selection="movieid=$event"/>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import Map from '@/components/Map.vue'
import Searchbar from '@/components/Searchbar.vue'
import movieJSON from '../../../database/merged_readable.json';
import * as d3 from 'd3';

export default {
  name: 'HelloWorld',
    components: {
    Button, Map, Searchbar
  },
  props: {
    msg: String
  },
  data() {
      return {
          datatype: 'revenue',
          scale: 'total',
          movieid: '',
          movieJSON: movieJSON,
          movieList: Object.values(movieJSON)
      }
  },
  computed: {
      filename() {
          return this.datatype + ' ' + this.scale;
      }
  },
  methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  color: #42b983;
}
</style>
