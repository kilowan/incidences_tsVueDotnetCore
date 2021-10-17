<template>
  <div>
    <!-- own incidences -->
    <br /><div v-if="!incidence">
      <nav v-if="countTypes > 1" :style="style" class="d-flex justify-content-around">
        <b-link v-if="counter.new >0"  @click="state = 1">Nuevos</b-link>{{ ' ' }}
        <b-link v-if="counter.attended >0"  @click="state = 2">Atendidos</b-link>{{ ' ' }}
        <b-link v-if="counter.closed >0" @click="state = 3">Cerrados</b-link>{{ ' ' }}
        <b-link v-if="counter.hidden >0" @click="state = 4">Ocultos</b-link>
      </nav><br />
      <div v-if="checkPermissions(user.permissions, ['6', '7', '8', '9'])">
        <employee-incidences-view
        :incidences="filterState(state, filterType('Employee'))"
        :user="user"
        :admin="admin"
        :title="getTitle(state, 'Employee')"
        @linked="linked($event)"/>
      </div>
      <!-- other incidences -->
      <div v-if="checkPermissions(user.permissions, ['10', '11', '12']) || checkPermissions(user.permissions, ['3', '4', '5'])">
        <!-- new -->
       <incidences-view
        :incidences="filterState(state, filterType('Technician'))"
        :user="user"
        :admin="admin"
        :title="getTitle(state, 'Technician')"
        @linked="linked($event)"
        @reload="reloading()"/>
      </div>
    </div>
    <div v-else>
      <incidence-view 
        v-if="incidence && checkreload()"
        :user="user" 
        :incidence="incidence"
        @reload="reloading()"
        @stepBack="back()"
        />
    </div>
  </div>
</template>

<script lang="ts">

import incidencesView from './incidencesView.vue';
import incidenceView from './incidenceView.vue';
import employeeIncidencesView from './employeeIncidencesView.vue';
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
    incidencesView,
    incidenceView,
    employeeIncidencesView,
  },
  data:function() {
    return {
      countTypes: 0,
      incidence: undefined,
      state: 0,
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
      }
    }
  },
  methods: {
    linked: function(incidence: any) {
      this.incidence = incidence;
      this.$emit('linked');
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
    reloading: function() {
      this.incidence = undefined;
      this.state = 1;
      this.$emit('reload');
    },
    checkreload: function() {
      if (!this.reload) {

        return true
      } else {
        this.incidence = undefined;

        return false;
      }
    },
    back: function() {
      this.incidence = undefined;
    },
    handle: function() {
      this.incidence = undefined;
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
