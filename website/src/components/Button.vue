<template>
  <div class="datatype">
    <b-form-group label="">
      <b-form-radio-group
        id="btnradios1"
        buttons
        v-model="selected"
        v-on:change="do_something"
        :options="options"
      />
    </b-form-group>
    <p>{{selected}}</p>
    <p>{{count}}</p>
  </div>
</template>

<script>

export default {
  name: 'Button',
    data() {
        return {
            selected: 'revenue',
            options: [
                {text: 'Revenue', value: 'revenue'},
                {text: 'Average IMDB Rating', value: 'imbd-rating'}
            ],
            count: 0
        }
    },
    methods: {
        do_something:function(){
            this.count++;
        }
    }
}
</script>
