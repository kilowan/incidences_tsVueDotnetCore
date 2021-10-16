<template>
  <div>
    <!-- userInfo -->
    <user-info :userData="user"/>
    <!-- incidences -->
    <incidences :user="user" :incidences="incidences" :admin="true"/>
    <!-- userInfo -->
    <statistics :user="user"/>
  </div>
</template>

<script>

import userInfo from './userInfo.vue';
import statistics from './statistics.vue';
import incidences from './incidences.vue';

export default {
  name: 'userPanel',
  props: ['user', 'incidences'],
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
}
</script>
<style></style>
