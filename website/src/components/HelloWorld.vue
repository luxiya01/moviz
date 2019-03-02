<template>
  <div class="hello">
    <div class="row">
      <div class="col-sm-8" style="background-color: beige">
        <h1>{{ msg }}</h1>
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
        <Map v-bind:filename="filename"/>
      </div>
      <div class="col-sm-4" style="background-color:grey">
        <Test msg="this sends to test.vue"/>
      </div>
    </div>
  </div>
</template>

<script>
import Test from '@/components/Test.vue'
import Button from '@/components/Button.vue'
import Map from '@/components/Map.vue'
import * as d3 from 'd3';

export default {
  name: 'HelloWorld',
    components: {
    Test, Button, Map
  },
  props: {
    msg: String
  },
  data() {
      return {
          datatype: 'revenue',
          scale: 'total'
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
