<template>
  <div v-if="user">
    <div class="cabecera" id="nav">
      <p class="mensaje">Bienvenido  <b-link class="link" @click="$bvModal.show('user-info')" >{{ user.name }} {{ user.surname1 }} {{ user.surname2 }}</b-link></p>
      <div class="Logo">
        <router-link @click="logOut()" to="/">
          <img class="cierra" src="../shutdown.png" alt="Cerrar sesión" />
        </router-link>
      </div>
      <nav class="opciones">
        <router-link v-if="user.tipo.level !== 1 && incidencesCount >0" class="link" to="/main/incidences" >Partes</router-link>
        <router-link class="link" to="/main/statistics" v-if="user.tipo.level === 2 || this.user.tipo.level === 3" >Estadísticas</router-link>
        <router-link class="link" to="/main/pieces" v-if="user.tipo.level === 3">Piezas disponibles</router-link>
        <router-link class="link" to="/main/employeeList" v-if="user.tipo.level === 3">Lista empleados</router-link>
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

import { EmployeeType } from '../Config/types';
import { employee, counters, employeeType } from '../Config/services';
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
      pieces: [],
      selectedPieces: new Array<string>(),
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
   cancel: function() {
      this.selectedPieces = [];
      this.$bvModal.hide('make-incidence');
   },
    reset: function() {
      this.selectedPieces = []
    },
    async logedIn(data: any) {
      await axios.get(employee + '?&username='+ data)
      .then((datas: any)  => {
        this.user = datas.data;
        this.username = data;
        this.showIncidences();
      });
    },
    async reloadUser(data: any) {
      await axios.get(employee + '?username='+ data)
      .then((datas: any) => {
        this.user = datas.data;
      });
    },

    async showIncidences() {
      await axios.get(counters + '?type=' + this.user.tipo.name + "&userId=" + this.user.id)
      .then((datas: any)  => {
        this.incidencesCount = datas.data.total;
        if(this.user.tipo.level === 1 || this.incidencesCount >0){
          this.$router.push({
            name: 'incidences', params: {
              //user: this.user
            }
          });
        }
        if(this.user.tipo.level !== 1 && this.incidencesCount === 0) {
          this.$router.push({
            name: 'statistics', params: {
              //user: this.user
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
    async saveData() {
      this.fillData([this.name, this.surname1, this.surname2]);
      if (this.fields.length >0) {
        await axios({
          method: 'put',
          url: employee,
          data: {
            dni: this.user.dni? this.user.dni: this.userData.dni,
            fields: this.fields,
            values: this.values,
          },
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
    async reloadUserData() {
      await axios.get(employee + '?username='+ this.username)
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
  async mounted() {
    if(this.$route.params.username) this.logedIn(this.$route.params.username);
      await axios({
      method: 'get',
      url: employeeType,
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
