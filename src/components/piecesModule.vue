<template>
  <div>
    <table>
      <tr>
          <th colspan="2">Piezas afectadas:</th>
      </tr>
    </table>
    <table>
      <tr v-for="(piece, index) in piecesData" v-bind:key="index">
        <td v-text="piece.name"></td>
      </tr>
    </table>
    <table v-if="edit">
        <tr>
          <td>
              <select v-model="selectedPiece" name="pieza">
                <option value="Selecciona una pieza">Selecciona una pieza</option>
                <option v-for="(piece, index) in piecesList" v-bind:key="index">{{ piece.name }}</option>
              </select> <button @click="addPiece()">Añadir</button>
          </td>
        </tr>
    </table><br />
  </div>
</template>

<script lang="ts">

import { Piece } from '../Config/types';
import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
  name: 'piecesModule',
  props: {
    pieces: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    },
  },
  components: {
  },
  data:function() {
    return {
      selectedPiece: '',
      piecesData: new Array<Piece>(),
      piecesList: new Array<Piece>(),
      addNote: false,
    }
  },
  mounted: function() {
    this.piecesData = this.pieces;
    axios.get("http://localhost:8082/Services/incidence.php?funcion=getPiecesList")
    .then((data: any) => {
      this.piecesList = data.data;
    });
  },
  methods: {
    back: function() {
      this.$emit('stepBack');
    },
    addOn: function() {
      this.addNote = true;
    },
    addPiece: function() {
      let piece: Piece = this.piecesList.filter((data: Piece) =>{
        return data.name == this.selectedPiece;
      })[0];
      
      let boolean = false;
      this.piecesData.forEach((element: Piece) => {
        if (element.id == piece.id) {
          boolean = true;
        }
      });
      if (!boolean) {
        this.piecesData.push(piece);
        this.$emit('add', piece.id);
      }
    },
  },
})
</script>
<style></style>
