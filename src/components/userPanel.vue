<template>
  <div>
    <!-- userInfo -->
    <user-info :userData="user" :token="token"/>
    <!-- incidences -->
    <incidences :user="user" :admin="true" :tokenProp="token"/>
    <!-- userInfo -->
    <statistics :user="user" :tokenProp="token"/>
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
    token: {
      type: String,
      required: true
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
