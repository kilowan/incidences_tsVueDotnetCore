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
        <td>Tipo: {{ user.tipo }}</td>
      </tr>
      <tr v-if="editSurname2 || editSurname1 || editName">
        <td colspan="2"><a href="#" @click="saveData()">Guardar</a> <a href="#" @click="reset()">Reiniciar</a>
      </td>
    </tr>
    </table><br />
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'userInfo',
  props: ['username', 'userData'],
  components: {
  },
  data:function()
  {
    return {
      user: undefined,
      edit: false,
      name: undefined,
      surname1: undefined,
      surname2: undefined,
      fields: [],
      values: [],
      style: {
        //boxShadow: '5px 5px 10px #999',
        border: '1px dotted black',
        background: 'white',
        //left: '10%',
        width: '80%',
        position: 'relative',
        //borderSpacing: '0px'
      }
    }
  },
  methods: {
    pushField(data, parity, name)
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
    checkField(field, field2)
    {
      return field && field != field2? true: false
    },
    fillData(data)
    {
      this.pushField(data[0], this.user.name, "nombre");
      this.pushField(data[1], this.user.surname1, "apellido1");
      this.pushField(data[2], this.user.surname2, "apellido2");
    },
    saveData: function()
    {
      this.fillData([this.name, this.surname1, this.surname2]);
      if (this.fields.length >0) 
      {
        axios({
          method: 'post',
          url: 'http://localhost:8082/newMenu.php',
          data: {
            funcion: 'updateWorker',
            dni: this.user.dni? this.user.dni: this.userData.dni,
            fields: this.fields,
            values: this.values,
          },
          headers:[],
        }).then(
          this.$emit('reload')
        );        
      }
      this.$emit('reloadUser', this.user.dni);
      this.reset();
      if (!this.userData) {
        this.reloadUser();
      }
    },
    reset: function()
    {
      this.edit = false;
      this.name = undefined;
      this.surname1 = undefined;
      this.surname2 = undefined;
      this.fields = [];
      this.values = [];
    },
    reloadUser: function()
    {
      axios.get("http://localhost:8082/newMenu.php?funcion=getEmployeeByUsername&username="+ this.username)
      .then( datas => {
        this.user = datas.data;
      });
    },
  },
  mounted(){
    if (!this.userData) {
      axios.get("http://localhost:8082/newMenu.php?funcion=getEmployeeByUsername&username="+ this.username)
      .then( datas => {
        this.user = datas.data;
      });
    } else {
      this.user = this.userData;
    }
  }
}
</script>
<style></style>
