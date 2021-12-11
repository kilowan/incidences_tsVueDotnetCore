<template>
  <div>
    <!-- employeeList -->
    <div id="employeList" v-if="mod=='employeeList'">
      <br /><table>
          <tr>
              <th>Lista de empleados</th>
          </tr>
      </table><br />
      <table>
          <tr>
              <th>DNI del empleado</th>
              <th>Nombre</th>
              <th>Primer apellido</th>
              <th>Segundo apellido</th>
              <th>Tipo de empleado</th>
              <th>--</th>
          </tr>
          <tr v-for="(employee, index) in employeesFiltered()" v-bind:key="index">
              <td>{{ employee.dni }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.surname1 }}</td>
              <td>{{ employee.surname2 }}</td>
              <td>{{ employee.type.name }}</td>
              <td style="width:10%; height: 2%;">
                <b-link @click="deleteEmployee(employee.id)">
                  <b-icon icon="person-x-fill" aria-hidden="true"></b-icon>
                </b-link>
                <b-link @click="edit(employee)">
                  <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
                </b-link>
                <b-link @click="panel(employee)">
                  <b-icon icon="search" aria-hidden="true"></b-icon>
                </b-link>
              </td>
          </tr>
          <tr>
            <td colspan="8">
                <b-link @click="$bvModal.show('new')">
                  <b-icon icon="person-plus-fill" aria-hidden="true"></b-icon>
                </b-link>
            </td>
          </tr>
      </table>
    </div>
    <div v-else-if="mod=='panel'" id="panel">
      <user-panel :user="employee"/>
    </div>
    <b-modal id="warning" hide-header hide-footer>
      <div class="d-block text-center">
        <h3>¿Seguro que quieres borrar este empleado?</h3>
      </div>
      <div class="modal-footer">
        <b-button block @click="$bvModal.hide('warning')">Cancel</b-button>
        <b-button block @click="confirmDelete()">Ok</b-button>
      </div>
    </b-modal>
    <b-modal class="nuevoemp" id="new" hide-header hide-footer>
      <!--ok.prevent-->
      <div class="d-block text-center">
        <h1>Hoja del nuevo empleado:</h1><br />
        <input placeholder="DNI" v-model="dni"/><br />
        <input placeholder="Nombre" v-model="name"/><br />
        <input placeholder="Primer Apellido" v-model="surname1"/><br />
        <input placeholder="Segundo Apellido" v-model="surname2"/><br />
        <input placeholder="Username" v-model="username"/><br />
        <input placeholder="Contraseña" v-model="password"/><br />
        <b-form-select v-model="selected" :options="options" size="sm" class="mt-3"></b-form-select><br />
      </div>
      <div class="modal-footer">
        <b-button block @click="cancel('new')">Cancel</b-button>
        <b-button block @click="save()">Guardar</b-button>
      </div>
    </b-modal>
    <b-modal class="editemp" id="editemp" hide-header hide-footer>
      <div class="d-block text-center" v-if="user">
        <h1>Editar empleado</h1><br />
        <label>DNI:</label>
        <input disabled v-model="dni"/><br />
        <label>Nombre:</label>
        <input :disabled="type === 'Admin'" v-model="name"/><br />
        <label>Primer Apellido:</label>
        <input :disabled="type === 'Admin'" v-model="surname1"/><br />
        <label>Segundo Apellido:</label>
        <input :disabled="type === 'Admin'" v-model="surname2"/><br />
        <label>Tipo:</label>
        <b-form-select :disabled="type === 'Admin'" v-model="type" :options="options" size="sm" class="mt-3"></b-form-select>
      </div>
      <div class="modal-footer">
        <b-button block @click="cancel('editemp')">Cancel</b-button>
        <b-button :disabled="type === 'Admin'" block @click="update()">Actualizar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">

import { Employee, EmployeeType } from '../Config/types';
import { employeeDotNet, employeeTypeDotNet } from '../Config/services';
import axios from 'axios';
import UserPanel from './userPanel.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'employeeList',
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  components: {
    UserPanel,
  },
  data: function() {
    return {
      employees: new Array<Employee>(),
      employee: {
        id: new Number,
        name: new String(),
        surname1: new String(),
        surname2: new String(),
        type: new String(),
        dni: new String(),
      },
      employeSelected: {
        id: Number,
        name: new String(),
        surname1: new String(),
        surname2: new String(),
        type: {
          id: new Number(),
          name: new String()
        },
        dni: new String(),
      },
      mod: 'employeeList',
      selectedToDelete: new Number(),
      dni: new String(),
      name: new String(),
      surname1: new String(),
      surname2: new String(),
      username: new String(),
      password: new String(),
      type: new String(),
      selected: 0,
      options: [
        { value: 0, text: 'Tipo', disabled: true},
      ]
    }
  },
  methods: {
    employeesFiltered(){
      let array: any = this.employees;
      return this.employees? array.filter((data: Employee) => {
        return data.type.name !== 'Admin';
      }) : undefined;
    },
    async update() {
        await axios({
          method: 'PUT',
          url: employeeDotNet + this.employeSelected.id,
          data: {
            name: this.pushField(this.name, this.employeSelected.name),
            surname1: this.pushField(this.surname1, this.employeSelected.surname1),
            surname2: this.pushField(this.surname2, this.employeSelected.surname2),
            type: this.pushField(this.type, this.employeSelected.type.id),
          },
        }).then(() =>{
          this.cancel('editemp');
          this.load();
        });
    },
    reset: function() {
      this.name = '';
      this.surname1 = '';
      this.surname2 = '';
      this.type = '';
      this.dni = '';
    },
    checkField(field: string, field2: string) {
      return field && field != field2? true: false
    },
    pushField(data: any, parity: any) {
      if(!this.checkField(data, parity)) {
        return null;
      } else return data;
    },
    cancel: function(name: string) {
      if(name === 'new'){
        this.username = '';
        this.password = '';
      }
      this.type = ''
      this.dni = '';
      this.name = '';
      this.surname1 = '';
      this.surname2 = '';
      this.$bvModal.hide(name);
    },
    async save() {
      await axios({
        method: 'post',
        url: employeeDotNet,
        data: {
          credentials:{
            username: this.username,
            password: this.password,
          },
          dni: this.dni,
          name: this.name,
          surname1: this.surname1,
          surname2: this.surname2,
          typeId: this.selected,
        },
      }).then(() =>{
          this.cancel('new')
          this.load();
        }
      );
    },
    panel: function(employee: any) {
      this.employee = employee;
      this.mod = 'panel';
    },
    edit: function(employee: any) {
      this.employeSelected = employee;
      this.name = employee.name;
      this.surname1 = employee.surname1;
      this.surname2 = employee.surname2;
      this.type = employee.type.id;
      this.dni = employee.dni;
      this.$nextTick(() => {
        this.$bvModal.show('editemp');
      });
    },
    add:function() {
      this.$nextTick(() => {
        this.$bvModal.show('new');
      });
    },
    reload: function() {
      this.load();
      this.mod = 'employeeList';
    },
    deleteEmployee: function(id: number) {
      this.selectedToDelete = id;
        this.$nextTick(() => {
          this.$bvModal.show('warning');
        });
    },
    async confirmDelete() {
      await axios({
        method: 'delete',
        url: employeeDotNet + this.selectedToDelete,
      })
      .then(()=> {
        this.$bvModal.hide('warning');
        this.load();
      });
    },
    load: function() {
      axios({
        method: 'get',
        url: employeeDotNet,
      })
      .then((data: any) =>
        this.employees = data.data
      );
      axios({
        method: 'get',
        url: employeeTypeDotNet,
      })
      .then((data: any) =>
        data.data.map((employeeType: EmployeeType) => {
          this.options.push( { value: employeeType.id, text: employeeType.name, disabled: false })
        })
      );
    },
  },
  mounted() {
    this.load();
  }
})

</script>
<style>
  .nuevoemp
  {
    text-align: center;
    border: 2px solid black;
    background-color: #d7dee3;
    left: 30%;
    width: 40%;
    position: relative;
  }
</style>
