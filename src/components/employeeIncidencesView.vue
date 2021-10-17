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

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'employeeIncidencesView',
  props: {
    incidences: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      required: true
    },
  },
  components: {},
  data: function() {
    return {
      menu: 'incidences',
      incidenceData: {},
    }
  },
  methods: {
    dateFormat: function(startTimeISOString: string) {
      return new Date(startTimeISOString).toLocaleDateString();
    },
    check: function() {
      return Object.keys(this.incidences).length >0;
    },
    checkMenu: function(data: string) {
      return this.menu == data ? true : false;
    },
    detail: function(incidence: Incidence) {
      this.menu = 'detail';
      this.incidenceData = incidence;
      this.$emit('linked', incidence);
    }
  },
  //mounted(){}
})
  interface Incidence {
    initDateTime: string;
    finishDate: string;
    finishTime: string;
    issueDesc: string;
    owner: Employee;
    solver: Employee;
    state: number;
    pieces: Array<Piece>;
    id: number;
    notes: Array<Note>;
  }
  interface Employee {
    id: number;
    name: string;
    surname1: string;
    surname2: string;
    tipo: string;
    dni: string;
    permissions: Array<string>;
  }
  interface Piece {
    type: PieceType;
    name: string;
    price: string;
    quantity: number;
    description: number;
    id: number;
  }
  interface PieceType {
    name: string;
    description: number;
  }
  interface Note {
    date: string;
    noteStr: string;
    noteType: string;
    incidence: number;
    employee: number;
  }
</script>
<style></style>
