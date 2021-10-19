<template>
  <div>
    <!-- userInfo -->
    <user-info :userData="user"/>
    <!-- incidences -->
    <incidences :user="user" :admin="true"/>
    <!-- userInfo -->
    <statistics :user="user"/>
  </div>
</template>

<script lang="ts">

import userInfo from './userInfo.vue';
import statistics from './statistics.vue';
import incidences from './incidences.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'userPanel',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    userInfo,
    statistics,
    incidences,
  },
  data:function() {
    return {}
  },
  methods: {},
  //mounted(){}
})
</script>
<style></style>
