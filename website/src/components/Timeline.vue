<template>
    <div class="timeline">
        <div class="row">
            <div class="col-sm-1">
                <p style="margin:5px">Select Year:</p>
            </div>
            <div class="col-sm-11">
                <b-form-input class="custom-range" type="range" id="timeline" v-model="year"
                            min="2000" max="2019" step="1"
                            v-on:change="signalChange"
                            />
            </div>
        </div>
<p>Selected year: {{year}}</p>
    </div>
</template>

<script>

export default {
  name: 'Timeline',
    data() {
        return {
            value: 0,
            year: 2000,
            yearRange: Array.from({length: 19}, (x, i) => 2000 + i)
        }
    },
    methods: {
        signalChange: function(evt) {
            console.log(evt)
            this.$emit('selection-change',evt);
        }
    },
    mounted() {
    }
}
</script>

<style>
#timeline {
    background: #212121;
    margin: 10px;
}
</style>

