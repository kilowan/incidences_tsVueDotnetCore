<template>
  <div>
    <!-- incidenceView -->
    <table>
      <tr>
        <th>Datos del parte</th>
      </tr>
    </table><br />
    <!-- Datos del parte -->
    <table>
        <tr v-if="incidence.owner != ''">
          <td>Nombre del empleado</td>
          <td >{{ incidence.owner }}</td>
        </tr>
        <tr>

          <td>Información</td>
          <td v-if="incidence.state == 1 && [1,3].includes(this.user.tipo.level) && edit"><input type="text" name="issueDesc" v-model="issueDesc" required /></td>
          <td v-else>{{ incidence.issueDesc }}</td>
        </tr>
        <tr v-if="incidence.solver != ''">
          <td >Tecnico a cargo</td>
          <td>{{ incidence.solver }}</td>
        </tr>
        <tr>
          <td>Fecha de creación</td>
          <td>{{ dateFormat(incidence.initDateTime, 1) }}</td>
        </tr>
        <tr>
          <td>Hora de creación</td>
          <td>{{ dateFormat(incidence.initDateTime, 2) }}</td>
        </tr>
        <tr v-if="incidence.finishDate !== null">
          <td>Fecha de resolución</td>
          <td>{{ dateFormat(incidence.finishDate, 1) }}</td>
        </tr>
        <tr v-if="incidence.finishTime !== null">
          <td>Hora de resolución</td>
          <td>{{ dateFormat(getDateTime(incidence.finishDate, incidence.finishTime), 2) }}</td>
        </tr>
        <tr v-if="incidence.state != 1">
          <td>Piezas afectadas</td>
          <td style="width: 400px">
            <ejs-multiselect v-if="availablePieces.length >0"
              id='multiselect'
              :readonly="!edit"
              v-model="selectedPiecesNames" 
              :dataSource="getPieces()"
              placeholoder="Añade nuevas piezas"
              hideSelectedItem="true"
              :showDropDownIcon="edit"
            />
          </td>
        </tr>
        <tr v-if="incidence.state == 1 && [1,3].includes(this.user.tipo.level)">
          <td v-if="!edit" style="width:10%; height: 2%;">
            <a @click="deleteIncidence()" href="#">
              <img class="cierra" src="./delete.png" alt="Borrar incidencia" style="width:4%; height: 4%;"/>
            </a>
          </td>
          <td v-if="!edit" style="width:10%; height: 2%;">
            <a  @click="edit=true" href="#">
              <img class="cierra" src="./edit.png" alt="Editar incidencia" style="width:4%; height: 4%;"/>
            </a>
          </td>
        </tr>
        <tr v-else-if="incidence.state == 1 && [2,3].includes(this.user.tipo.level)">
          <td colspan="2" v-if="!edit">
              <a href="#" @click="edit=true">Atender</a>
          </td>
        </tr>
        <tr v-else-if="incidence.state == 2 && [2,3].includes(this.user.tipo.level) && incidence.solverId === user.id">
          <td colspan="2" v-if="!edit">
              <b-link @click="edit=true">Modificar</b-link>
          </td>
          <td colspan="2" v-if="edit">
              <b-link @click="edit=false">Cancelar</b-link>
          </td>
        </tr>
        <tr v-else-if="incidence.state == 3 && incidence.ownerId === user.id">
          <td colspan="2">
              <a href="#" @click="hide()">Ocultar</a>
          </td>
        </tr>
        <tr v-else-if="incidence.state == 4 && [1,3].includes(this.user.tipo.level)">
          <td colspan="2">
              <a href="#" @click="show()">Mostrar</a>
          </td>
        </tr>
    </table><br />
    <div v-if="incidence.state != 1">
      <notes-module v-if="incidence.notes || edit" :edit="edit" :notes="incidence.notes" @add="note = $event"/>
    </div>
    <div v-if="edit">
      <table v-if="edit && ((incidence.state == 1 && [1,3].includes(this.user.tipo.level) || (incidence.state == 2 && [2,3].includes(this.user.tipo.level) && incidence.solverId === user.id)))">
        <tr>
          <th>Funciones</th>
        </tr>
      </table>
      <table v-if="incidence.state == 1 && [1,3].includes(this.user.tipo.level)">
        <tr>
          <td colspan="2" v-if="issueDesc && edit"><a href="#" @click="editIncidence()">Guardar</a></td>
        </tr>
      </table>
      <!-- attendIncidence -->
      <table v-else-if="incidence.state == 1 && [2,3].includes(user.tipo.level) && incidence.solverId === user.id">
        <tr>
            <td>
                <a href="#" @click="modifyIncidence()">Guardar</a>
            </td>
        </tr>
      </table>
    <!-- modifyIncidence -->
    <table v-else-if="incidence.state == 2 && [2,3].includes(this.user.tipo.level) && incidence.solverId === user.id">
        <tr>
          <td>Función</td>
          <td>
            <select v-model="selected">
              <option value="insertparte">Actualizar parte</option>
              <option value="cierraparte">Cerrar parte</option>
            </select>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <a href="#" @click="modifyIncidence()">Guardar</a>
          </td>
        </tr>
    </table><br />
    </div>
    <br /><b-link @click="back()" class="link" center>Atrás</b-link>
    <b-modal id="warning" hide-header hide-footer>
      <div class="d-block text-center">
        <h3>¿Seguro que quieres borrar este parte?</h3>
      </div>
      <div class="modal-footer">
        <b-button block @click="$bvModal.hide('warning')">Cancel</b-button>
        <b-button block @click="confirmDelete()">Ok</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import notesModule from './notesModule.vue';
import Vue from 'vue';
export default Vue.extend({
  name: 'incidencesView',
  props: {
    user: {
      type: Object,
      required: true
    },
    incidence: {
      type: Object,
      required: true
    },
  },
  components: {
    notesModule,
  },
  data: function() {
    return {
      menu: 'main',
      issueDesc: undefined,
      selected: undefined,
      note: undefined,
      edit: false,
      pieceIdsSelected: new Array<number>(),
      availablePieces: new Array<Piece>(),
      selectedPiecesNames: new Array<string>(),
      preselected: new Array<string>(),
      close: false,
    }
  },
  methods: {
    getSelectedPieces: function(pieces: Array<Piece>) {
      return pieces.map((piece: Piece) => {
        return piece.name
      });
    },
    getPieces: function() {
      return this.availablePieces.map((piece: Piece) => {
        return { value: piece.id, text: piece.name }
      });
    },
    fillPieceIds: function(names: Array<string>) {
      let newNames = names.filter((name: string) => {
        return !this.preselected.includes(name);
      });
      if(newNames.length >0) {
        newNames.forEach((element: string) => {
          let pieces: Array<Piece> = this.availablePieces.filter((data: Piece) =>{
            return data.name === element;
          });
          let piece = {
            id: 0,
          };
          if(pieces.length >0) piece = pieces[0];
          if(piece) this.pieceIdsSelected.push(piece.id);
        });
      }
    },
    dateFormat: function(startTimeISOString: string, format: number) {
      return format == 1? new Date(startTimeISOString).toLocaleDateString(): new Date(startTimeISOString).toLocaleTimeString();
    },
    back: function() {
      this.$emit('stepBack');
    },
    getDateTime: function(date: string, time: string) {
      let data = [date, time];
      let joined = data.join(' ');
      return joined;
    },
    stepBack: function() {
      this.load();
      this.back();
    },
    load: function() {
      axios({
        method: 'get',
        url: 'http://localhost:8082/newMenu.php?funcion=getIncidenceById&id_part=' + this.incidence.id,
      }).then((data: any) => {
        this.issueDesc = data.data.issueDesc;
      });
    },
    hide: function() {
      axios({
        method: 'get',
        url: 'http://localhost:8082/newMenu.php?funcion=hideIncidence&incidenceId=' + this.incidence.id + '&userId=' + this.user.id,
      }).then(data => {
        this.$emit('reload', data);
      });
    },
    show: function() {
      axios({
        method: 'get',
        url: 'http://localhost:8082/newMenu.php?funcion=showIncidence&incidenceId=' + this.incidence.id + '&userId=' + this.user.id,
      }).then((data: any) => {
        this.$emit('reload', data);
      });
    },
    deleteIncidence: function() {
      this.$bvModal.show('warning');
    },
    confirmDelete: function() {
      axios({
          method: 'get',
          url: 'http://localhost:8082/newMenu.php?funcion=deleteIncidence&incidenceId=' + this.incidence.id + '&userId=' + this.user.id,
        }).then(() =>
          this.$emit('reload')
        );
    },
    reload: function() {
      this.menu = 'main';
      this.$emit('reload');
    },
    reloadoff:function() {
      this.menu = 'main';
    },
    editIncidence: function() {
      if(this.incidence.issueDesc != this.issueDesc) {
        axios({
          method: 'post',
          url: 'http://localhost:8082/newMenu.php',
          data: {
            funcion: 'updateNotes',
            incidenceId: this.incidence.id,
            incidenceDesc: this.issueDesc,
            employeeId: this.user.id,
          },
          headers: []
        })
        .then(() => this.$emit('reload'));
      } else this.$emit('reloadoff');
    },
    modifyIncidence: function() {
      if (this.selected == 'cierraparte') {
        this.close = true;
      }
      if(this.selectedPiecesNames.length >0) {
        this.fillPieceIds(this.selectedPiecesNames);
        axios({
          method: 'post',
          url: 'http://localhost:8082/newMenu.php',
          data: {
            funcion: 'updateIncidence',
            incidenceId: this.incidence.id,
            userId: this.user.id,
            note: this.note,
            pieces: this.pieceIdsSelected,
            close: this.close,
          },
          headers: [],
        }).then(() => this.$emit('reload'));
      };
    },
  },
  mounted() {
    this.load();
    axios.get("http://localhost:8082/newMenu.php?funcion=getPiecesList")
    .then((data: any) => {
      this.availablePieces = data.data;
      this.incidence.pieces.forEach((piece: Piece) => {
        this.selectedPiecesNames.push(piece.name);
        this.preselected.push(piece.name);
      });
    });
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
<style>
@import url(https://cdn.syncfusion.com/ej2/material.css);
td {
	font-size: 100%;
	text-align: center;
	border: 1px dashed gray;
	color: black;
}
</style>
