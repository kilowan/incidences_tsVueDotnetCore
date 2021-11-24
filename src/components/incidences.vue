<template>
  <div v-if="type !== ''">
    <br />
    <nav v-if="countTypes > 1" :style="style" class="d-flex justify-content-around">
      <b-link v-if="counter.new >0"  @click="getIncidences(1, user.type.name)">Nuevos</b-link>{{ ' ' }}
      <b-link v-if="counter.old >0"  @click="getIncidences(2, user.type.name)">Atendidos</b-link>{{ ' ' }}
      <b-link v-if="counter.closed >0" @click="getIncidences(3, user.type.name)">Cerrados</b-link>{{ ' ' }}
      <b-link v-if="counter.hidden >0" @click="getIncidences(4, user.type.name)">Ocultos</b-link>
    </nav><br />
    <!-- incidenceView -->
    <div v-if="!incidenceSelected && [1, 3].includes(user.type.id) && incidences.length > 0">
      <table>
        <tr v-if="user.type.id === 3">
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
    <div v-if="!incidenceSelected && [2, 3].includes(user.type.id) && technicianIncidences.length > 0">
      <table>
          <tr v-if="user.type.id === 3">
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
    <div v-if="!incidenceSelected">
      <b-link class="link" @click="insertIncidence()" v-if="this.user.type.id === 1 || this.user.type.id === 3">Nuevo parte</b-link>
    </div>
    <b-modal id="make-incidence" hide-header hide-footer>
      <div class="d-block text-center">
        <!-- MakeIncidence -->
        <h3>Crear parte</h3>
        <div v-if="pieces">
          <label>¿Que pieza/s crees que falla/n?:</label> <br />
          <div style="margin-left: 30%; margin-right: 30%;">
            <br>
            <ejs-multiselect 
              v-model="selectedPieces" 
              :dataSource="getPieces()"
            />
          </div>
        </div>
        <b-form-textarea placeholder="Descripción del problema" v-model="description"/><br />
      </div>
      <div class="modal-footer">
        <b-button block @click="cancel()">Cancel</b-button>
        <b-button :disabled="selectedPieces.length < 1 || !description" block @click="addIncidence()">Enviar</b-button>
      </div>
    </b-modal>
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

import { Incidence, PieceClass } from '../Config/types';
import { incidenceDotNet, pieceDotNet } from '../Config/services';
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
      selectedPiece: 'other',
      pieces: new Array<PieceClass>(),
      PieceIdsSelected: new Array<number>(),
      selectedPieces: new Array<string>(),
      description: '',
      incidences: new Array<Incidence>(),
      technicianIncidences: new Array<Incidence>(),
      linked: true,
      linkedEmployee: true,
      countTypes: 0,
      state: 1,
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
    getPieces: function() {
      return this.pieces.map((piece: PieceClass) => {
        return { value: piece.id, text: piece.name }
      });
    },
    fillPieceIds: function(names: Array<string>) {
      names.forEach((element: string) => {
        let pieces: Array<PieceClass> = this.pieces.filter((data: PieceClass) =>{
          return data.name === element;
        });
        let piece = {
          id: 0,
        };
        if(pieces.length >0) piece = pieces[0];
        if(piece && piece.id)
        this.PieceIdsSelected.push(piece.id);
      });
    },
    async addIncidence() {
      if(this.selectedPieces.length >0) {
        this.fillPieceIds(this.selectedPieces);
        await axios({
          method: 'post',
          url: incidenceDotNet,
          data: {
            ownerId: this.user.id,
            note: this.description,
            piecesAdded: this.PieceIdsSelected,
          },
        })
        .then(() => {
            this.cancel();
            this.getIncidences(this.state, this.user.type.name);
          }
        );
      }
    },
   cancel: function() {
      this.description = '';
      this.selectedPiece = 'other';
      this.selectedPieces = new Array<string>();
      this.PieceIdsSelected = new Array<number>();
      this.$bvModal.hide('make-incidence');
   },
   async insertIncidence() {
    await axios.get(pieceDotNet)
      .then((data: any) => {
        this.pieces = data.data;
        this.$bvModal.show('make-incidence');
    });
   },
    async handle() {
      //set initial type
      await axios.get(incidenceDotNet + this.user.id + '/' + this.user.type.name)
      .then((datas: any)  => {
        this.manageData(datas.data);
      });
    },
    async getIncidences(state: number, type: string ) {
      if(['Technician', 'Admin'].includes(type)) {
        await axios.get(incidenceDotNet + state + '/' + this.user.id + '/Technician')
        .then((datas: any)  => {
          this.technicianIncidences = datas.data.other;
          this.incidences = datas.data.own;
          this.state = state;
        });
      } else {
        await axios.get(incidenceDotNet + state + '/' + this.user.id + '/Employee')
        .then((datas: any)  => {
          this.incidences = datas.data.own;
          this.state = state;
        });
      }

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
          this.getIncidences(this.state, this.user.type.name);
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
    dateFormat: function(startTimeISOString: string) {
      return new Date(startTimeISOString).toLocaleDateString();
    },
    detail: function(incidence: Incidence) {
      debugger;
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
</script>
<style>
@import url(https://cdn.syncfusion.com/ej2/material.css);
</style>
