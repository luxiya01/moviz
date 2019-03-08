<template>
  <div class="datatype">
    <b-form-group label="">
      <b-form-radio-group
        buttons
        v-model="selected"
        v-on:change="signalChange"
        :options="options"
      />
    </b-form-group>
  </div>
</template>

<script>

export default {
  name: 'Button',
  props: ['options'],
    data() {
        return {
            selected: '',
            count: 0
        }
    },
    methods: {
        signalChange: function(evt) {
            this.$emit('selection-change',evt);
        }
    }
}
</script>

<style>

/*:focus {
  transform: scale(0.95);

}*/

</style>

