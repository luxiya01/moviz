<template>
  <div class="test">
    <h1>This is sidebar!</h1>
    <p> {{msg}} </p>
  </div>
</template>

<script>

export default {
  name: 'Test',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
