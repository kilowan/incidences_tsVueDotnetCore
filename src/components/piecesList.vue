<template>
  <div>
    <!-- piecesList -->
    <div id="piecesList">
      <br /><table>
          <tr>
              <th>Lista de piezas</th>
          </tr>
      </table><br />
      <table>
          <tr>
              <th>Nombre</th>
              <!--<th>Descripción</th>-->
              <th>--</th>
          </tr>
          <tr v-for="(piece, index) in piecesFiltered()" v-bind:key="index">
              <td>{{ piece.name }}</td>
              <!--<td>{{ piece.description }}</td>-->
              <td style="width:10%; height: 2%;">
                <b-link v-if="piece.deleted !== '2'" @click="deletePiece(piece.id)">
                  <img src="./delete.png" alt="Borrar pieza" style="width:12%; height: 12%;"/>
                </b-link>
                <b-link v-if="piece.deleted !== '2'" @click="edit(piece)">
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
    <b-modal id="warning" hide-header hide-footer @hidden="clear()">
      <div class="d-block text-center">
        <h3>¿Seguro que quieres borrar esta pieza?</h3>
      </div>
      <div class="modal-footer">
        <b-button block @click="$bvModal.hide('warning')">Cancel</b-button>
        <b-button block @click="confirmDelete()">Ok</b-button>
      </div>
    </b-modal>
    <b-modal id="new" hide-header hide-footer @hidden="clear()">
      
      <div class="d-block text-center">
        <h1>Hoja de la nueva pieza:</h1><br />
        <input placeholder="Nombre" v-model="pieceName"/><br />
        <!--<b-form-textarea placeholder="Descripción" v-model="pieceDescription"/><br />-->
        <b-form-select v-model="pieceTypeId" :options="pieceTypeOptions" size="sm" class="mt-3"></b-form-select><br />
      </div>
      <div class="modal-footer">
        <b-button block @click="$bvModal.hide('new')">Cancel</b-button>
        <b-button block @click="save()">Guardar</b-button>
      </div>
    </b-modal>
    <!--ok.prevent-->
    <b-modal id="editpiece" hide-header hide-footer @hidden="clear()">
      <div class="d-block text-center" v-if="user">
        <h1>Editar pieza</h1><br />
        <label>Nombre:</label>
        <input v-model="pieceName"/><br />
        <!--<b-form-textarea placeholder="Descripción" v-model="pieceDescription"/><br />-->
        <label>Tipo:</label>
        <b-form-select v-model="pieceTypeId" :options="pieceTypeOptions" size="sm" class="mt-3"></b-form-select>
      </div>
      <div class="modal-footer">
        <b-button block @click="$bvModal.hide('editpiece')">Cancel</b-button>
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
      pieceName: '',
      pieceId: 0,
      //pieceDescription: '',
      pieceTypeId: 0,
      pieceTypeName: '',
      piecesList: new Array<Piece>(),
      pieceTypeOptions: [
        { value: 0, text: 'Tipo', disabled: true },
      ],
    }
  },
  methods: {
    clear: function(){
      this.pieceName = '';
      this.pieceId = 0;
      //this.pieceDescription = '';
      this.pieceTypeId = 0;
      this.pieceTypeName = '';
    },
    deletePiece: function(pieceId: number) {
      this.pieceId = pieceId;
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
    async update() {
      await axios({
        method: 'put',
        url: 'http://localhost:8080/Services/incidence.php',
        data: {
          name: this.pieceName,
          type: this.pieceTypeId,
          pieces: [this.pieceId],
        },
      }).then(() =>{
        this.$bvModal.hide('editpiece');
        this.load();
      });
    },
    async save() {
      await axios({
        method: 'post',
        url: 'http://localhost:8080/Services/incidence.php',
        data: {
          funcion: 'addnewPiece',
          name: this.pieceName,
          type: this.pieceTypeId,
        },
      }).then(() =>{
          this.$bvModal.hide('new');
          this.load();
        }
      );
    },
    edit: function(piece: Piece) {
      this.pieceName = piece.name;
      this.pieceId = piece.id;
      //this.pieceDescription = piece.description;
      this.pieceTypeId = piece.type.id;
      this.pieceTypeName = piece.type.name;
      this.$nextTick(() => {
        this.$bvModal.show('editpiece');
      });
    },
    add:function() {
      this.$nextTick(() => {
        this.$bvModal.show('new');
      });
    },
    async confirmDelete() {
      await axios({
      method: 'delete',
      url: 'http://localhost:8080/Services/piece.php&id=' + this.pieceId,
      })
      .then(()=> {
        this.$bvModal.hide('warning');
        this.load();
      });
    },
    async load() {
      await axios({
      method: 'get',
      url: 'http://localhost:8080/Services/piece.php',
      })
      .then((data: any) => {
        this.piecesList = data.data;
      });
      await axios({
      method: 'get',
      url: 'http://localhost:8080/Services/pieceType.php',
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
