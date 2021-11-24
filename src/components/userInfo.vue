<template>
  <div v-if="user">
    <!-- userInfo -->
    <br /><table>
      <tr>
        <th>Datos personales</th>
      </tr>
    </table><br />
    <table>
      <tr>
        <td>Id Empleado: {{ user.id }}</td>
      </tr>
      <tr>
        <td>DNI: {{ user.dni }}</td>
      </tr>
      <tr>
        <td v-if="!editName" @click="editname()">Nombre: {{ user.name }}</td>
        <td v-if="editName">
          Nombre: <input type="text" v-model="name"/>
        </td>
      </tr>
      <tr>
        <td v-if="!editSurname1" @click="editsurname1()">Primer apellido: {{ user.surname1 }}</td>
        <td v-if="editSurname1">
          Primer apellido: <input type="text" v-model="surname1"/>
        </td>
      </tr>
      <tr>
        <td  v-if="!editSurname2" @click="editsurname2()">Segundo apellido: {{ user.surname2 }}</td>
        <td v-if="editSurname2">
          Segundo apellido: <input type="text" v-model="surname2"/>
        </td>
      </tr>
      <tr>
        <td>Tipo: {{ user.type.name }}</td>
      </tr>
      <tr v-if="editSurname2 || editSurname1 || editName">
        <td colspan="2"><a href="#" @click="saveData()">Guardar</a> <a href="#" @click="reset()">Reiniciar</a>
      </td>
    </tr>
    </table><br />
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import { employeeDotNet } from '../Config/services';
import Vue from 'vue';

export default Vue.extend({
  name: 'userInfo',
  props: {
    username: {
      type: String,
      required: true
    },
    userData: {
      type: Object,
      required: true
    },
  },
  components: {
  },
  data:function()
  {
    return {
      user: {
        name: '',
        surname1: '',
        surname2: '',
        dni: ''
      },
      edit: false,
      name: '',
      surname1: '',
      surname2: '',
    }
  },
  methods: {
    pushField(data: string, parity: string) {
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
    checkField(field: string, field2: string) {
      return field && field != field2? true: false
    },
    async saveData() {
        await axios({
          method: 'put',
          url: employeeDotNet,
          data: {
            name: this.pushField(this.name, this.user.name),
            surname1: this.pushField(this.surname1, this.user.surname1),
            surname2: this.pushField(this.surname2, this.user.surname2)
          }
        }).then((result) => {
          this.$emit('reload');
        });
      this.$emit('reloadUser', this.user.dni);
      this.reset();
      if (!this.userData) {
        this.reloadUser();
      }
    },
    reset: function() {
      this.edit = false;
      this.name = '';
      this.surname1 = '';
      this.surname2 = '';
    },
    async reloadUser() {
      await axios.get(employeeDotNet + this.username)
      .then((datas: any) => {
        this.user = datas.data;
      });
    },
  },
  async mounted(){
    if (!this.userData) {
      await axios.get(employeeDotNet + this.username)
      .then((datas: any) => {
        this.user = datas.data;
      });
    } else {
      this.user = this.userData;
    }
  }
})
</script>
<style></style>
