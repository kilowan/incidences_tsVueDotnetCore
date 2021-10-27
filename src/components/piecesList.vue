<template>
  <div>
    <!-- piecesList -->
    <div id="piecesList" v-if="mod=='piecesList'">
      <br /><table>
          <tr>
              <th>Lista de piezas</th>
          </tr>
      </table><br />
      <table>
          <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>--</th>
          </tr>
          <tr v-for="(piece, index) in piecesFiltered()" v-bind:key="index">
              <td>{{ piece.name }}</td>
              <td>{{ piece.description }}</td>
              <td style="width:10%; height: 2%;">
                <b-link @click="deletePiece(piece.id)">
                  <img src="./delete.png" alt="Borrar pieza" style="width:12%; height: 12%;"/>
                </b-link>
                <b-link @click="edit(piece)">
                  <img src="./edit.png" alt="Editar pieza" style="width:12%; height: 12%;"/>
                </b-link>
              </td>
          </tr>
          <tr>
            <td colspan="8">
                <b-link @click="$bvModal.show('new')">Agregar nueva</b-link>
            </td>
          </tr>
      </table>
    </div>
    <b-modal id="warning" hide-header hide-footer>
      <div class="d-block text-center">
        <h3>¿Seguro que quieres borrar esta pieza?</h3>
      </div>
      <div class="modal-footer">
        <b-button block @click="$bvModal.hide('warning')">Cancel</b-button>
        <b-button block @click="confirmDelete()">Ok</b-button>
      </div>
    </b-modal>
    <b-modal id="new" hide-header hide-footer>
      
      <div class="d-block text-center">
        <h1>Hoja de la nueva pieza:</h1><br />
        <input placeholder="Nombre" v-model="name"/><br />
        <b-form-textarea placeholder="Descripción" v-model="description"/><br />
        <b-form-select v-model="type" :options="pieceTypeOptions" size="sm" class="mt-3"></b-form-select><br />
      </div>
      <div class="modal-footer">
        <b-button block @click="cancel('new')">Cancel</b-button>
        <b-button block @click="save()">Guardar</b-button>
      </div>
    </b-modal>
    <!--ok.prevent-->
    <b-modal id="editpiece" hide-header hide-footer>
      <div class="d-block text-center" v-if="user">
        <h1>Editar pieza</h1><br />
        <label>Nombre:</label>
        <input v-model="name"/><br />
        <b-form-textarea placeholder="Descripción" v-model="description"/><br />
        <label>Tipo:</label>
        <b-form-select v-model="type" :options="pieceTypeOptions" size="sm" class="mt-3"></b-form-select>
      </div>
      <div class="modal-footer">
        <b-button block @click="cancel('editpiece')">Cancel</b-button>
        <b-button block @click="update()">Actualizar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">

import { Piece, PieceType } from '../Config/types';
import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
  name: 'employeeList',
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  components: {},
  data: function() {
    return {
      piecesList: new Array<Piece>(),
      mod: 'piecesList',
      selected: null,
      name: '',
      type: 0,
      description: '',
      pieceSelected: {},
      selectedToDelete: 0,
      pieceTypeOptions: [
        { value: 0, text: 'Tipo', disabled: true },
      ],
    }
  },
  methods: {
    deletePiece: function(piece: number) {
      this.selectedToDelete = piece;
      this.$nextTick(() => {
        this.$bvModal.show('warning');
      });
    },
    piecesFiltered: function(){
      let array: any = this.piecesList;
      return this.piecesList? array.filter((data: Piece) => {
        return data.name !== 'no sé';
      }) : undefined;
    },
    update: function() {
      //let fields: any = this.fields;
      //this.fillData([this.name, this.surname1, this.surname2, this.tipo]);
      //if (fields.length >0) {
        axios({
          method: 'post',
          url: 'http://localhost:8082/newMenu.php',
          data: {
            funcion: 'updatePiece',
            id: this.pieceSelected.id,
            name: this.name,
            description: this.description,
            type: this.type
          },
          headers: []
        }).then(() =>{
          this.cancel('editpiece');
          this.load();
        });
      //}
    },
    /*reset: function() {
      this.name = '';
      this.surname1 = '';
      this.surname2 = '';
      this.tipo = '';
      this.dni = '';
      this.fields = new Array<string>();
      this.values = new Array<string>();
    },
    checkField(field: string, field2: string) {
      return field && field != field2? true: false
    },
    pushField(data: any, parity: any, name: any) {
      if(this.checkField(data, parity)) {
        this.values.push(data);
        this.fields.push(name);
      }
    },
    fillData(data: Array<any>) {
      this.pushField(data[0], this.employeSelected.name, 'nombre');
      this.pushField(data[1], this.employeSelected.surname1, "apellido1");
      this.pushField(data[2], this.employeSelected.surname2, "apellido2");
      this.pushField(data[3], this.employeSelected.tipo, "tipo");
    },*/
    cancel: function(name: string) {
      this.type = 0;
      this.selected = null;
      this.name = '';
      this.description = '';
      this.$bvModal.hide(name);
    },
    save() {
      axios({
        method: 'post',
        url: 'http://localhost:8082/newMenu.php',
        data: {
          funcion: 'addPiece',
          name: this.name,
          description: this.description,
          type: this.type,
        },
        headers: []
      }).then(() =>{
          this.cancel('new')
          this.load();
        }
      );
    },
    edit: function(piece: Piece) {
      this.pieceSelected = piece;
      this.name = piece.name;
      this.description = piece.description;
      this.type = piece.type.id;
      this.$nextTick(() => {
        this.$bvModal.show('editpiece');
      });
    },
    add:function() {
      this.$nextTick(() => {
        this.$bvModal.show('new');
      });
    },
    reload: function() {
      this.load();
      this.mod = 'piecesList';
    },
    confirmDelete: function() {
      axios({
      method: 'get',
      url: 'http://localhost:8082/newMenu.php?funcion=deletePiece&id=' + this.selectedToDelete,
      })
      .then(()=> {
        this.$bvModal.hide('warning');
        this.load();
      });
    },
    load: function() {
      axios({
      method: 'get',
      url: 'http://localhost:8082/newMenu.php?funcion=getPiecesList',
      })
      .then((data: any) =>
        this.piecesList = data.data
      );
      axios({
      method: 'get',
      url: 'http://localhost:8082/newMenu.php?funcion=getPieceTypeList',
      })
      .then((data: any) => {
        data.data.map((pieceType: PieceType) => {
          return this.pieceTypeOptions.push({ value: pieceType.id, text: pieceType.name, disabled: false });
        })
        }
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
