<template>
  <div>
    <table>
      <tr>
        <th>Notas</th>
      </tr>
    </table><br />
    <table>
      <tr>
        <th>Nota</th>
        <th>Fecha</th>
        <th>Hora</th>
      </tr>
      <tr v-for="(note, index) in notesData" v-bind:key="index">
        <td v-if="note.noteStr != ''">{{ note.noteStr }}</td>
        <td v-else> "Sin texto" </td>
        <td>{{ formatDate(note.date) }}</td>
        <td>{{ formatHour(note.date) }}</td>
      </tr>
      <tr></tr>
      <tr v-if="addNote && !added">
        <td colspan="3">
          <input type="text" v-model="note" /> <a href="#" @click="addNotes()">Añadir</a> <a href="#" @click="addNote = false">Cancelar</a>
        </td>
      </tr>
      <tr v-if="!addNote && !added && edit">
        <td colspan="3">
          <a href="#" @click="addOn()">Añadir</a>
        </td>
      </tr>
    </table><br />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'notesModule',
  props: {
    notes: {
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
  data: function() {
    return {
      note: '',
      addNote: false,
      notesData: new Array<Note>(),
      added: false,
    }
  },
  methods: {
    addOn: function() {
      this.addNote = true;
    },
    formatDate: function(date: string) {
      return new Date(date).toLocaleDateString();
    },
    formatHour: function(date: string) {
      return new Date(date).toLocaleTimeString();
    },
    addNotes: function() {
      let date = new Date();
      let note: Note = { noteStr: this.note, date: date.toISOString() };
      this.notesData.push(note);
      this.added = true;
      this.$emit('add', note);
    },
    reset: function() {
      this.addNote = false;
      this.$emit('reset');
    },
  },
  mounted(){
    if (this.notes) {
      this.notesData = this.notes;
    }
  }
})
interface Note {
  date: string,
  noteStr: string
}
</script>
<style></style>
