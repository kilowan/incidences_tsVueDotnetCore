<template>
  <div v-if="type !== ''">
    <br />
    <nav v-if="countTypes > 1" :style="style" class="d-flex justify-content-around">
      <b-link v-if="counter.new >0"  @click="getIncidences(1, type)">Nuevos</b-link>{{ ' ' }}
      <b-link v-if="counter.old >0"  @click="getIncidences(2, type)">Atendidos</b-link>{{ ' ' }}
      <b-link v-if="counter.closed >0" @click="getIncidences(3, type)">Cerrados</b-link>{{ ' ' }}
      <b-link v-if="counter.hidden >0" @click="getIncidences(4, type)">Ocultos</b-link>
    </nav><br />
    <!-- incidenceView -->
    <div v-if="!incidenceSelected && checkPermissions(user.permissions, ['6', '7', '8', '9']) && incidences.length > 0">
      <table>
        <tr v-if="checkPermissions(user.permissions, ['10', '11', '12']) || checkPermissions(user.permissions, ['3', '4', '5'])">
            <th colspan="10">{{ getTitle(state, 'Employee') }}</th>
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
    <div v-if="!incidenceSelected && (checkPermissions(user.permissions, ['10', '11', '12']) || checkPermissions(user.permissions, ['3', '4', '5'])) && technicianIncidences.length > 0">
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
        <tr v-for="(incidence, index) in technicianIncidences" v-bind:key="index">
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
import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
  name: 'incidences',
  props: {
    user: {
      type: Object,
      required: true
    },
    /*incidences: {
      type: Object,
      required: true
    },*/
    admin: {
      type: Boolean,
      required: false
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
      incidences: new Array<Incidence>(),
      technicianIncidences: new Array<Incidence>(),
      linked: true,
      linkedEmployee: true,
      countTypes: 0,
      state: 1,
      type: '',
      counter: {
        new: 0,
        old: 0,
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
      if(this.checkPermissions(this.user.permissions, ['10', '11', '12']) || this.checkPermissions(this.user.permissions, ['3', '4', '5'])) {
        //set initial type
        this.type = 'Technician';
        axios.get("http://localhost:8082/newMenu.php?funcion=getIncidencesCounters&type=Technician&userId=" + this.user.id)
        .then((datas: any)  => {
          this.manageData(datas.data);
        });
      } else if(this.checkPermissions(this.user.permissions, ['6', '7', '8', '9'])){
        //set initial type
        this.type = 'Employee';
        axios.get("http://localhost:8082/newMenu.php?funcion=getIncidencesCounters&type=Employee&userId=" + this.user.id)
        .then((datas: any)  => {
          this.manageData(datas.data);
        });
      }
    },
    getIncidences: function(state: number, type: string ) {
      if(type === 'Technician') {
        axios.get("http://localhost:8082/newMenu.php?funcion=getIncidencesByStateType&state=" + state + '&userId=' + this.user.id + '&type=' + type)
        .then((datas: any)  => {
          this.technicianIncidences = datas.data.other;
          this.incidences = datas.data.own;
          this.state = state;
        });
      } else {
        axios.get("http://localhost:8082/newMenu.php?funcion=getIncidencesByStateType&state=" + state + '&userId=' + this.user.id + '&type=' + type)
        .then((datas: any)  => {
          this.incidences = datas.data.own;
          this.state = state;
        });
      }

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
    manageData: function(data: any) {
          this.counter.new = data.new;
          this.counter.old = data.old;
          this.counter.closed = data.closed;
          this.counter.hidden = data.hidden;
          this.getCounters();
          //set initial state
          this.state = this.counter.new >0? 1: this.counter.old > 0? 2: this.counter.closed > 0? 3 : 4;
          //get initial incidences
          this.getIncidences(this.state, this.type);
    },
    getCounters: function() {
      this.counter.new > 0? this.manageIncidences(1) :  this.state = 0;
      this.counter.old > 0? this.manageIncidences(2): this.state = 0
      this.counter.closed > 0? this.manageIncidences(3): 
      this.counter.hidden > 0? this.manageIncidences(4): this.state = 0;

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
       this.handle();
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
