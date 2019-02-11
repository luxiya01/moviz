<template>
  <div class="hello">
    <div class="row">
      <div class="col-sm-8" style="background-color: beige">
        <h1>{{ msg }}</h1>
        <p>
          lorem ipsum
        </p>
      </div>
      <div class="col-sm-4" style="background-color:grey">
        <Test msg="this sends to test.vue"/>
      </div>
    </div>
  </div>
</template>

<script>
import Test from '@/components/Test.vue'

export default {
  name: 'HelloWorld',
    components: {
    Test
  },
  props: {
    msg: String
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
