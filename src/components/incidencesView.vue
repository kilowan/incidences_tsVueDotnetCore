<template>
  <!-- incidenceView -->
    <div v-if="!incidenceSelected">
      <div v-if="checkMenu('incidences') && checkPermissions(user.permissions, ['6', '7', '8', '9']) && incidencesOwn.length > 0">
        <table>
            <tr>
                <th colspan="10">{{ titleown }}</th>
            </tr>
        </table>
        <table>
          <tr>
            <th>Fecha de creación</th>
            <th>Información</th>
          </tr>
          <tr v-for="(incidence, index) in incidencesOwn" v-bind:key="index">
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
      <div v-if="checkMenu('incidences') && (checkPermissions(user.permissions, ['10', '11', '12']) || checkPermissions(user.permissions, ['3', '4', '5'])) && incidences.length > 0">
        <table>
            <tr>
                <th colspan="10">{{ title }}</th>
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
    <div v-else>
    <incidence-view 
      :user="user" 
      :incidence="incidenceData"
      @reload="reloading()"
      @stepBack="back()"
    />
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import incidenceView from './incidenceView.vue';

export default Vue.extend({
  name: 'incidencesView',
  props: {
    incidencesOwn: {
      type: Object,
      required: false
    },
    incidences: {
      type: Object,
      required: false
    },
    user: {
      type: Object,
      required: true
    },
    titleown: {
      type: String,
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
  components: {
    incidenceView
  },
  data: function() {
    return {
      menu: 'incidences',
      incidenceData: {},
      incidenceSelected: false,
    }
  },
  methods: {
    dateFormat: function(startTimeISOString: string) {
      return new Date(startTimeISOString).toLocaleDateString();
    },
    checkMenu: function(data: string) {
      return this.menu == data ? true : false;
    },
    detail: function(incidence: Incidence) {
      this.incidenceData = incidence;
      this.incidenceSelected = true;
      this.$nextTick(() => {
        this.menu = 'detail';
      });
    },
    back: function() {
      this.incidenceData = {};
      this.incidenceSelected = false;
      this.$nextTick(() => {
        this.menu = 'incidences';
      });
    },
    reloading: function() {
      this.back();
      this.$emit('reload');
    },
    checkPermissions: function(permissions: Array<string>, permissionNumbers: Array<string>) {
      let result = true;
      permissionNumbers.forEach((element: string) => {
        if (!permissions.includes(element)) {
          result = false;
        }
      });

      return result;
    },
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
