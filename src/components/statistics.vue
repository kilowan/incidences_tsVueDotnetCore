<template>
  <div>
    <!-- globalstatistics -->
    <br /><div v-if="globalStatistics &&this.user.tipo.level === 3" id="globalStatistics">
      <table>
          <tr>
              <th colspan="2">Estadisticas globales</th>
          </tr>
      </table><br />
      <table>
        <tr>
            <th>Tiempo medio</th>
            <th>Nombre de empleado</th>
        </tr>
        <tr v-for="(global, index) in globalStatistics" v-bind:key="index">
            <td v-text="global.average"></td>
            <td v-text="global.employeeName"></td>
        </tr>
      </table><br />
    </div>
  <!-- reportedPieces -->
  <div v-if="pieces" id="reportedPieces">
    <table>
      <tr>
          <th colspan="2">Piezas reportadas</th>
      </tr>
      <tr>
          <th>Nombre</th>
          <th>Nº de reportes</th>
      </tr>
      <tr v-for="(piece, index) in pieces" v-bind:key="index">
          <td v-text="piece.pieceName"></td>
          <td v-text="piece.pieceNumber" ></td>
      </tr>
    </table><br />
    </div>
    <!-- statistics -->
    <div v-if="statistics && checkStatistics()" id="statistics">
      <table>
        <tr>
            <th colspan="2">Estadisticas</th>
        </tr>
      </table><br />
      <table>
          <tr>
              <th>Tiempo medio</th>
              <th>Partes resueltos</th>
          </tr>
          <tr>
              <td>{{ statistics.average }}</td>
              <td>{{ statistics.solvedIncidences }}</td>
          </tr>
      </table><br />
    </div>
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
  name: 'statistics',
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  components: {},
  data: function() {
    return {
      pieces: new Array<Piece>(),
      globalStatistics: undefined,
      statistics: {
        average: '',
        solvedIncidences: undefined,
      },
    }
  },
  methods: {
    checkStatistics: function() {
      return this.statistics.average? true: false;
    },
  },
  mounted() {
    if((this.user.tipo.level === 2 || this.user.tipo.level === 3)) {
      axios({
        method: 'get',
        url: 'http://localhost:8082/newMenu.php?funcion=getStatistics&id='+ this.user.id,
      })
      .then((data: any) =>
        this.statistics = data.data
      );
      axios({
        method: 'get',
        url: 'http://localhost:8082/newMenu.php?funcion=getReportedPieces',
      })
      .then((data: any) =>
        this.pieces = data.data
      );
      axios({
        method: 'get',
        url: 'http://localhost:8082/newMenu.php?funcion=getGlobalStatistics',
      })
      .then((data: any) =>
        this.globalStatistics = data.data
      );
    }
  }
})
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
<style></style>
