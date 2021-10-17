<template>
    <div>
      <br />
      <nav v-if="countTypes > 1" :style="style" class="d-flex justify-content-around">
        <b-link v-if="counter.new >0"  @click="changeState(1)">Nuevos</b-link>{{ ' ' }}
        <b-link v-if="counter.attended >0"  @click="changeState(2)">Atendidos</b-link>{{ ' ' }}
        <b-link v-if="counter.closed >0" @click="changeState(3)">Cerrados</b-link>{{ ' ' }}
        <b-link v-if="counter.hidden >0" @click="changeState(4)">Ocultos</b-link>
      </nav><br />
    <!-- incidenceView -->
    <div v-if="!incidenceSelected && checkPermissions(user.permissions, ['6', '7', '8', '9']) && filterState(state, filterType('Employee')).length > 0">
      <table>
          <tr>
              <th colspan="10">{{ getTitle(state, 'Employee') }}</th>
          </tr>
      </table>
      <table>
        <tr>
          <th>Fecha de creación</th>
          <th>Información</th>
        </tr>
        <tr v-for="(incidence, index) in filterState(state, filterType('Employee'))" v-bind:key="index">
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
    <div v-if="!incidenceSelected && (checkPermissions(user.permissions, ['10', '11', '12']) || checkPermissions(user.permissions, ['3', '4', '5'])) && filterState(state, filterType('Technician')).length > 0">
      <table>
          <tr>
              <th colspan="10">{{ getTitle(state, 'Technician') }}</th>
          </tr>
      </table>
      <table>
        <tr>
          <th>Fecha de creación</th>
          <th>Información</th>
        </tr>
        <tr v-for="(incidence, index) in filterState(state, filterType('Technician'))" v-bind:key="index">
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
    <div v-if="incidenceSelected">
      <incidence-view 
        :user="user" 
        :incidence="incidenceData"
        @reload="reloading()"
        @stepBack="back()"
      />
    </div>
  </div>
</template>

<script lang="ts">

import incidenceView from './incidenceView.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'incidences',
  props: {
    user: {
      type: Object,
      required: true
    },
    incidences: {
      type: Object,
      required: true
    },
    admin: {
      type: Boolean,
      required: true
    },
    reload: {
      type: Boolean,
      required: true
    },
  },
  components: {
    incidenceView,
  },
  data:function() {
    return {
      linked: true,
      linkedEmployee: true,
      countTypes: 0,
      state: 1,
      counter: {
        new: 0,
        attended: 0,
        closed: 0,
        hidden: 0,
      },
      style: {
        boxShadow: '5px 5px 10px #999',
        border: '1px solid white',
        background: 'white',
        left: '10%',
        width: '80%',
        position: 'relative',
        borderSpacing: '0px'
      },
      incidenceData: {},
      incidenceSelected: false,
    }
  },
  methods: {
    checkPermissions: function(permissions: Array<string>, permissionNumbers: Array<string>) {
      let result = true;
      permissionNumbers.forEach((element: string) => {
        if (!permissions.includes(element)) {
          result = false;
        }
      });

      return result;
    },
    handle: function() {
      this.getCounters();
      this.counter.new > 0? this.manageIncidences(1) :  this.state = 0;
      this.counter.attended > 0? this.manageIncidences(2): this.state = 0
      this.counter.closed > 0? this.manageIncidences(3): 
      this.counter.hidden > 0? this.manageIncidences(4): this.state = 0;
    },
    filterType: function(type: string) {
      return type === 'Employee'? 
      this.incidences.filter((data: Incidence)  => {
        return data.owner.dni === this.user.dni;
      }): 
      this.incidences.filter((data: Incidence)  => {
        return data.owner.dni !== this.user.dni;
      });
    },
    filterState: function(state: number, incidences: Array<Incidence>) {
      return incidences.filter((data: Incidence) => {
        return data.state == state;
      });
    },
    getTitle: function(state: number, type: string) {
      let title = 'Partes ';
      let titles: any = {1: 'nuevos', 2: 'atendidos', 3: 'cerrados', 4: 'ocultos'};
      title += titles[state];
      if(type === 'Employee') title += ' propios';
      return title;
    },
    getCounters: function() {
      this.counter = {
        new: this.filterState(1, this.filterType('Employee')).length + this.filterState(1, this.filterType('Technician')).length,
        attended: this.filterState(2, this.filterType('Technician')).length + this.filterState(2, this.filterType('Technician')).length,
        closed: this.filterState(3, this.filterType('Employee')).length + this.filterState(3, this.filterType('Technician')).length,
        hidden: this.filterState(4, this.filterType('Employee')).length,
      }

    },
    manageIncidences: function(state: number){
      if(!this.state) this.state = state;
      this.countTypes++;
    },
    changeState: function(state: number){
      this.state = state;
      this.incidenceData = {};
      this.$nextTick(() => {
        this.incidenceSelected = false;
        
      });
    },
    dateFormat: function(startTimeISOString: string) {
      return new Date(startTimeISOString).toLocaleDateString();
    },
    detail: function(incidence: Incidence) {
      this.incidenceData = incidence;
      this.$nextTick(() => {
        this.incidenceSelected = true;
      });
    },
    back: function() {
      this.incidenceData = {};
      this.$nextTick(() => {
        this.incidenceSelected = false;
      });
    },
    reloading: function() {
      this.back();
      this.$emit('reload');
    },
  },
  mounted() {
    this.handle();
  }
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
  interface Note {
    date: string;
    noteStr: string;
    noteType: string;
    incidence: number;
    employee: number;
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
  interface Employee {
    id: number;
    name: string;
    surname1: string;
    surname2: string;
    tipo: string;
    dni: string;
    permissions: Array<string>;
  }
</script>
<style></style>
