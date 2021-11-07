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
        <td>Tipo: {{ user.tipo.name }}</td>
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
      fields: new Array<string>(),
      values: new Array<string>(),
    }
  },
  methods: {
    pushField(data: string, parity: string, name: string)
    {
      if(this.checkField(data, parity))
      {
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
    checkField(field: string, field2: string) {
      return field && field != field2? true: false
    },
    fillData(data: Array<string>)
    {
      this.pushField(data[0], this.user.name, "nombre");
      this.pushField(data[1], this.user.surname1, "apellido1");
      this.pushField(data[2], this.user.surname2, "apellido2");
    },
    saveData: function() {
      this.fillData([this.name, this.surname1, this.surname2]);
      if (this.fields.length >0) {
        axios({
          method: 'post',
          url: 'http://localhost:8082/Services/employee.php',
          data: {
            funcion: 'updateWorker',
            dni: this.user.dni? this.user.dni: this.userData.dni,
            fields: this.fields,
            values: this.values,
          },
          headers: [],
        }).then(() =>
          this.$emit('reload')
        );        
      }
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
      this.fields = [];
      this.values = [];
    },
    reloadUser: function() {
      axios.get("http://localhost:8082/Services/employee.php?funcion=getEmployeeByUsername&username="+ this.username)
      .then((datas: any) => {
        this.user = datas.data;
      });
    },
  },
  mounted(){
    if (!this.userData) {
      axios.get("http://localhost:8082/Services/employee.php?funcion=getEmployeeByUsername&username="+ this.username)
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
