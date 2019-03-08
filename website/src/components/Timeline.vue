<template>
    <div class="timeline">
        <h4>Selected year: {{yearString}}</h4>
        <div class="row">
            <div class="col-sm-1">
                <p style="margin: .5em; font-weight:bold"> Release Year:</p>
            </div>
            <div class="col-sm-9">
                <b-form-input class="custom-range" type="range" id="timeline" v-model="year"
                            min="2000" max="2020" step="1"
                            v-on:input="signalChange"
                            />
            </div>
            <div class="col-sm-1">
                <b-button v-on:click="deselectYear" style="margin-right:2px">Deselect Year</b-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Timeline',
    data() {
        return {
            value: 0,
            year: '',
            yearStringDefault: '2000 - 2019',
            yearString: '',
            yearRange: Array.from({length: 19}, (x, i) => 2000 + i)
        }
    },
    methods: {
        signalChange: function(evt) {
            this.yearString = this.year;
            this.$emit('selection-change',this.yearString);
        },
        deselectYear: function(evt) {
            this.$emit('deselect-year');
            this.year = '2020';
            this.yearString = this.yearStringDefault;
        }
    },
    mounted() {
        this.yearString = this.yearStringDefault;
    }
}
</script>

<style>
#timeline {
    background: #212121;
    margin: 1em;
}
</style>

