<template>
  <div v-if="user">
    <div class="cabecera" id="nav">
      <p class="mensaje">Bienvenido  <b-link class="link" @click="$bvModal.show('user-info')" >{{ user.name }} {{ user.surname1 }} {{ user.surname2 }}</b-link></p>
      <div class="Logo">
        <router-link @click="logOut()" to="/">
          <b-icon class="h1" icon="power" aria-hidden="true"></b-icon>
        </router-link>
      </div>
      <nav class="opciones">
        <router-link v-if="user.type.id !== 1 && incidencesCount >0" class="link" :to="{ name: 'incidences', params: { token: token } }" >Partes</router-link>
        <router-link class="link" :to="{ name: 'statistics', params: { token: token } }" v-if="[2,3].includes(user.type.id)" >Estadísticas</router-link>
        <router-link class="link" :to="{ name: 'pieces', params: { token: token } }" v-if="user.type.id === 3">Piezas disponibles</router-link>
        <router-link class="link" :to="{ name: 'employeeList', params: { token: token } }" v-if="user.type.id === 3">Lista empleados</router-link>
      </nav>
    </div>
    <div class="cuerpo">
      <router-view :user="user" :reload="reload" @linked="reload=false"/>
    </div>
    <div class="Pie">
      <p>Trabajo realizado por Jose Javier Valero Fuentes y Juan Francisco Navarro Ramiro para el curso de ASIR 2º X migrado a Vue.js</p>
    </div>
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
              <b-form-select :disabled="true" v-model="user.type.id" :options="options" size="sm" class="mt-3"></b-form-select>
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

import { EmployeeType } from '../Config/types';
import { employeeDotNet, incidenceDotNet, employeeTypeDotNet } from '../Config/services';
import axios from 'axios';
import Vue from 'vue'

export default Vue.extend({
  name: 'main',
  props: {},
  components: {},
  data: function() {
    return {
      token: '',
      user: {
        id: new Number(),
        fullName: '',
        name: '',
        surname1: '',
        surname2: '',
        type: {
          id: new Number(),
          name: '',
        },
        dni: '',
      },
      userData: {
        id: new Number(),
        name: '',
        surname1: '',
        surname2: '',
        type: {
          id: new Number(),
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
      username: '',
      pieces: [],
      selectedPieces: new Array<string>(),
      edit: false,
      name: '',
      surname1: '',
      surname2: '',
      options: [
        { value: 0, text: 'Tipo', disabled: true },
      ]
    }
  },
 methods: {
   cancel: function() {
      this.selectedPieces = [];
      this.$bvModal.hide('make-incidence');
   },
    reset: function() {
      this.selectedPieces = []
    },
    async logedIn(username: string) {
      debugger;
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${this.token}` },
        url: `${employeeDotNet}${username}`
      })
      .then((datas: any)  => {
        this.user = datas.data;
        this.username = username;
        this.showIncidences();
      });
    },
    async reloadUser(data: any) {
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${this.token}` },
        url: `${employeeDotNet}${data}`,
      })
      .then((datas: any) => {
        this.user = datas.data;
      });
    },

    async showIncidences() {
      debugger;
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${this.token}` },
        url: `${incidenceDotNet}${this.user.id}/${this.user.type.name}`
      })
      .then((datas: any)  => {
        this.incidencesCount = datas.data.total;
        if(this.user.type.id === 1 || this.incidencesCount >0){
          this.$router.push({
            name: 'incidences', 
            params: {
              token: this.token
            }
          });
        }
        if(this.user.type.id !== 1 && this.incidencesCount === 0) {
          this.$router.push({
            name: 'statistics', params: {
              token: this.token
            }
          });
        }
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
        fullName: '',
        surname1: '',
        surname2: '',
        type: {
          id: new Number(),
          name: ''
        },
        dni: '',
      };
      this.incidencesCount = 0;
    },
    pushField(data: any, parity: any) {
      if(!this.checkField(data, parity)) {
        return null;
      } else return data;
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
    async saveData() {
        await axios({
          method: 'put',
          headers: { Authorization: `Bearer ${this.token}` },
          url: employeeDotNet + this.userData.id,
          data: {
            name: this.pushField(this.name, this.user.name),
            surname1: this.pushField(this.surname1, this.user.surname1),
            surname2: this.pushField(this.surname2, this.user.surname2),
          },
        }).then(() => 
            this.cancel()
        );      
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
    },
    async reloadUserData() {
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${this.token}` },
        url: `${employeeDotNet}${this.username}`,
      })
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
    },
  },
  async mounted() {
    if(this.$route.params.username) {
        debugger;
        this.token = this.$route.params.token;
        this.logedIn(this.$route.params.username);
      }
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${this.token}` },
        url: employeeTypeDotNet,
      })
      .then((data: any) =>
        data.data.map((employeeType: EmployeeType) => {
          this.options.push( { value: employeeType.id, text: employeeType.name, disabled: false })
        })
      );
  }
})
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
