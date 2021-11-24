<template>
  <div>
    <!-- globalstatistics -->
    <br /><div v-if="report.globalStatistics &&this.user.type.id === 3" id="globalStatistics">
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
        <tr v-for="(global, index) in report.globalStatistics" v-bind:key="index">
            <td v-text="global.average"></td>
            <td v-text="global.employeeName"></td>
        </tr>
      </table><br />
    </div>
  <!-- reportedPieces -->
  <div v-if="report.reportedPieces" id="reportedPieces">
    <table>
      <tr>
          <th colspan="2">Piezas reportadas</th>
      </tr>
      <tr>
          <th>Nombre</th>
          <th>Nº de reportes</th>
      </tr>
      <tr v-for="(piece, index) in report.reportedPieces" v-bind:key="index">
          <td v-text="piece.pieceName"></td>
          <td v-text="piece.pieceNumber" ></td>
      </tr>
    </table><br />
    </div>
    <!-- statistics -->
    <div v-if="report.statistics && checkStatistics()" id="statistics">
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
              <td>{{ report.statistics.average }}</td>
              <td>{{ report.statistics.solvedIncidences }}</td>
          </tr>
      </table><br />
    </div>
  </div>
</template>

<script lang="ts">

import { PieceClass } from '../Config/types';
import { reportDotNet } from '../Config/services';
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
      pieces: new Array<PieceClass>(),
      globalStatistics: undefined,
      report: {
        statistics: {
          average: null,
        },
        reportedPieces: {},
        globalStatistics: {}
      },
      statistics: {
        average: '',
        solvedIncidences: undefined,
      },
    }
  },
  methods: {
    checkStatistics: function() {
      return this.report.statistics.average? true: false;
    },
  },
  async mounted() {
    await axios({
      method: 'get',
      url: reportDotNet + this.user.id,
    })
    .then((data: any) =>
      this.report = data.data
    );
  }
})
</script>
<style></style>
