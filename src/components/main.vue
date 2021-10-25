<template>
  <div v-if="user">
    <div class="cabecera" id="nav">
      <p class="mensaje">Bienvenido {{ user.name }} {{ user.surname1 }} {{ user.surname2 }}</p>
      <div class="Logo">
        <router-link @click="logOut()" to="/">
          <img class="cierra" src="../shutdown.png" alt="Cerrar sesión" />
        </router-link>
      </div>
      <nav class="opciones">
        <b-link class="link" @click="insertIncidence()" v-if="this.user.tipo.level === 1 || this.user.tipo.level === 3">Crear parte</b-link>
        <router-link class="link" to="/main/incidences" v-if="incidencesCount >0">Ver partes</router-link>
        <router-link class="link" to="/main/statistics" v-if="this.user.tipo.level === 2 || this.user.tipo.level === 3" >Estadísticas</router-link>
        <router-link class="link" to="/main/pieces" v-if="this.user.tipo.level === 3">Piezas disponibles</router-link>
        <router-link class="link" to="/main/employeeList" v-if="this.user.tipo.level === 3">Lista empleados</router-link>
        <b-link class="link" @click="$bvModal.show('user-info')" >Datos personales</b-link>
      </nav>
    </div>
    <div class="cuerpo">
      <router-view :user="user" :reload="reload" @linked="reload=false"/>
    </div>
    <div class="Pie">
      <p>Trabajo realizado por Jose Javier Valero Fuentes y Juan Francisco Navarro Ramiro para el curso de ASIR 2º X migrado a Vue.js</p>
    </div>
    <b-modal id="make-incidence" hide-header hide-footer>
      <div class="d-block text-center">
        <!-- MakeIncidence -->
        <h3>Crear parte</h3>
        <div v-if="pieces">
          <label>¿Que pieza/s crees que falla/n?:</label> <br /> 
          <b-form-select v-model="selectedPiece" name="pieza">
            <b-form-select-option :value="'other'">Selecciona las piezas que fallan</b-form-select-option>
            <b-form-select-option :value="piece.name" v-for="(piece) in pieces" :key="piece.id">{{ piece.name }}</b-form-select-option>
          </b-form-select>
          <b-button v-if="selectedPiece !== 'other'" @click="addPiece()">Añadir</b-button>
          <b-button v-if="selectedPieces.length>0" @click="reset()">Reiniciar</b-button><br />
        </div>
        <b-form-textarea placeholder="Descripción del problema" v-model="description"/><br />
        <div v-if="selectedPieces.length>0">
          <label>Piezas seleccionas:</label>
          <p>{{ concatPieces() }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <b-button block @click="cancel()">Cancel</b-button>
        <b-button :disabled="selectedPieces.length < 1 || !description" block @click="addIncidence()">Enviar</b-button>
      </div>
    </b-modal>
    <b-modal id="user-info" hide-header hide-footer @hidden="closeEvent()">
      <div class="d-block text-center">
        <h3>Datos personales</h3>
        <!-- userInfo -->
        <b-container>
          <b-row>
            <b-col><label>DNI: </label></b-col>
            <b-col><input :disabled="true" type="text" v-model="user.dni"/></b-col>
          </b-row>
          <b-row>
            <b-col><label>Nombre: </label></b-col>
            <b-col><input :disabled="!edit" type="text" v-model="user.name"/></b-col>
          </b-row>
          <b-row>
            <b-col><label >Primer apellido:</label></b-col>
            <b-col><input :disabled="!edit" type="text" v-model="user.surname1"/></b-col>
          </b-row>
          <b-row>
            <b-col><label>Segundo apellido: </label></b-col>
            <b-col><input :disabled="!edit" type="text" v-model="user.surname2"/></b-col>
          </b-row><br />
          <b-row>
            <b-col><label>Tipo: </label></b-col>
            <b-col>
              <b-form-select :disabled="true" v-model="user.tipo.id" :options="options" size="sm" class="mt-3"></b-form-select>
            </b-col>
          </b-row>
          <b-row colspan="2">
            <b-col><a v-if="!edit" href="#" @click="editData()">Editar</a> <a v-if="edit" href="#" @click="resetUser()">Reiniciar</a></b-col>
          </b-row>
      </b-container>
      </div>
      <div class="modal-footer">
        <b-button block @click="close()">Cancel</b-button>
        <b-button :disabled="!user.name || !user.surname1" block @click="saveData()">Enviar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import Vue from 'vue'

export default Vue.extend({
  name: 'main',
  props: {},
  components: {},
  data: function() {
    return {
      user: {
        id: new Number(),
        name: '',
        surname1: '',
        surname2: '',
        tipo: {
          id: new Number(),
          level: new Number(),
          name: '',
        },
        dni: '',
      },
      userData: {
        id: new Number(),
        name: '',
        surname1: '',
        surname2: '',
        tipo: {
          id: new Number(),
          level: new Number(),
          name: '',
        },
        dni: '',
      },
      form: {
        username: undefined,
        pass: undefined,
      },
      incidencesCount: 0,
      reload: false,
      username: undefined,
      selected: undefined,
      pieces: [],
      checked: false,
      choosen: '--',
      description: undefined,
      selectedPiece: 'other',
      selectedPieces: new Array<string>(),
      PieceIdsSelected: new Array<number>(),
      edit: false,
      name: '',
      surname1: '',
      surname2: '',
      fields: new Array<string>(),
      values:new Array<string>(),
      options: [
        { value: 0, text: 'Tipo', disabled: true },
      ]
    }
  },
 methods: {
   insertIncidence: function() {
    axios.get("http://localhost:8082/newMenu.php?funcion=getPiecesList")
      .then((data: any) => {
        this.pieces = data.data;
        this.$bvModal.show('make-incidence');
    });
   },
   cancel: function() {
      this.selected = undefined;
      this.checked = false;
      this.choosen = '--';
      this.description = undefined;
      this.selectedPiece = 'other';
      this.selectedPieces = [];
      this.PieceIdsSelected = [];
      this.$bvModal.hide('make-incidence');
   },
    addPiece: function() {
      if (!this.selectedPieces.includes(this.selectedPiece)) {
        if (this.selectedPieces.includes('no sé') || this.selectedPiece == 'no sé') {
          this.reset();
        }
        this.selectedPieces.push(this.selectedPiece);
        let piece: Piece = this.pieces.filter((data: any) =>{
          return data.name == this.selectedPiece;
        })[0];
        this.PieceIdsSelected.push(piece.id);
      }
    },
    reset: function() {
      this.selectedPieces = []
    },
    addIncidence: function() {
      axios({
        method: 'post',
        url: 'http://localhost:8082/newMenu.php',
        data: {
          funcion: 'addIncidence',
          ownerId: this.user.id,
          issueDesc: this.description,
          pieces: this.PieceIdsSelected,
        },
      headers: []
      })
      .then(() =>
        this.cancel()
      );
    },
    checkForm: function() {
      return this.selected && this.description? true:false;
    },
    getPiece: function() {
      return this.pieces.filter((piece: Piece) => {
        return piece.name == this.selected;
      })[0];
    },
    concatPieces: function() {
      return this.selectedPieces.join(', ');
    },
    logedIn: function(data: any) {
      axios.get("http://localhost:8082/employee.php?funcion=getEmployeeByUsername&username="+ data)
      .then((datas: any)  => {
        this.user = datas.data;
        this.username = data;
        this.showIncidences();
      });
    },
    reloadUser: function(data: any) {
      axios.get("http://localhost:8082/employee.php?funcion=getEmployeeByUsername&username="+ data)
      .then((datas: any) => {
        this.user = datas.data;
      });
    },

    showIncidences: function() {
      axios.get("http://localhost:8082/newMenu.php?funcion=getIncidencesCounters&type=" + this.user.tipo.name + "Employee'&userId=" + this.user.id)
      .then((datas: any)  => {
        this.incidencesCount = datas.data.total;
      });
    },
    logOut: function() {
      this.form = {
        username: undefined,
        pass: undefined,
      };
      this.user = {
        id: new Number(),
        name: '',
        surname1: '',
        surname2: '',
        tipo: {
          id: new Number(),
          level: new Number(),
          name: '',
        },
        dni: '',
      };
      this.incidencesCount = 0;
    },
    pushField(data: any, parity: any, name: any) {
      if(this.checkField(data, parity)) {
        this.values.push(data);
        this.fields.push(name);
      }
    },
    editData: function() {
      this.edit = true;
      this.name = this.user.name;
      this.surname1 = this.user.surname1;
      this.surname2 = this.user.surname2;
    },
    checkField(field: any, field2: any) {
      return field && field != field2? true: false
    },
    fillData(data: any) {
      this.pushField(data[0], this.user.name, "nombre");
      this.pushField(data[1], this.user.surname1, "apellido1");
      this.pushField(data[2], this.user.surname2, "apellido2");
    },
    saveData: function() {
      this.fillData([this.name, this.surname1, this.surname2]);
      if (this.fields.length >0) {
        axios({
          method: 'post',
          url: 'http://localhost:8082/newMenu.php',
          data: {
            funcion: 'updateWorker',
            dni: this.user.dni? this.user.dni: this.userData.dni,
            fields: this.fields,
            values: this.values,
          },
          headers: [],
        }).then(() => 
            this.cancel()
        );      
      }
      this.$emit('reloadUser', this.user.dni);
      this.reset();
      if (!this.userData) {
        this.reloadUserData();
      }
    },
    resetUser: function() {
      this.edit = false;
      this.name = '';
      this.surname1 = '';
      this.surname2 = '';
      this.fields = [];
      this.values = [];
    },
    reloadUserData: function() {
      axios.get("http://localhost:8082/newMenu.php?funcion=getEmployeeByUsername&username="+ this.username)
      .then((datas: any) => {
        this.user = datas.data;
      });
    },
    close: function() {
      this.$bvModal.hide('user-info');
      this.closeEvent();
    },
    closeEvent: function() {
      this.edit = false;
      this.name = '';
      this.surname1 = '';
      this.surname2 = '';
      this.fields = [];
      this.values = [];
    },
  },
  mounted() {
    if(this.$route.params.username) this.logedIn(this.$route.params.username);
      axios({
      method: 'get',
      url: 'http://localhost:8082/newMenu.php?funcion=getEmployeeTypeList',
      })
      .then((data: any) =>
        data.data.map((employeeType: EmployeeType) => {
          this.options.push( { value: employeeType.id, text: employeeType.name, disabled: false })
        })
      );
  }
})
  interface EmployeeType {
    id: number;
    level: number;
    name: string;
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
</script>
<style>
  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: white;
    padding-right: 6px;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
  .cabecera {
    border: 2px solid black;
    background-color: #333;
    width: 100%;
    height: 12%;
    left: 0;
    top: 0;
    position: fixed;
    color: white;
    overflow: hidden;
  }
  .crearP {
    text-align: center;
    border: 2px solid black;
    background-color: #d7dee3;
    left: 30%;
    width: 40%;
    position: absolute;
  }
</style>
