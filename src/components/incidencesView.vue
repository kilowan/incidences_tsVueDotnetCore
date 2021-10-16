<template>
  <!-- incidenceView -->
  <div v-if="check()">
    <div v-if="checkMenu('incidences')">
    <table>
        <tr>
            <th colspan="10">{{title}}</th>
        </tr>
    </table>
    <table>
      <tr>
        <th>Fecha de creación</th>
        <th>Información</th>
      </tr>
      <tr v-for="(incidence, index) in incidences" v-bind:key="index">
        <td @click="!admin? detail(incidence): null">
          <div v-if="incidence.initDateTime">{{ dateFormat(incidence.initDateTime) }}</div>
          <div v-else>--</div>
        </td>
        <td @click="!admin? detail(incidence): null">
          <div v-if="incidence.issueDesc">{{incidence.issueDesc}}</div>
          <div v-else>--</div>
        </td>
      </tr>
    </table><br />
    </div>
  </div>
</template>

<script>

export default {
  name: 'incidencesView',
  props: ['incidences', 'user', 'title', 'admin'],
  components: {
  },
  data:function()
  {
    return {
      menu: 'incidences',
      incidenceData: undefined,
    }
  },
  methods: {
    dateFormat: function(startTimeISOString)
    {
      return new Date(startTimeISOString).toLocaleDateString();
    },
    check: function()
    {
      return Object.keys(this.incidences).length >0;
    },
    checkMenu: function(data)
    {
      return this.menu == data ? true : false;
    },
    detail: function(incidence)
    {
      this.menu = 'detail';
      this.incidenceData = incidence;
      this.$emit('linked', incidence);
    }
  },
  //mounted(){}
}
</script>
<style></style>
