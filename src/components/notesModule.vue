<template>
  <div>
    <table>
      <tr>
        <th colspan="2">Notas</th>
      </tr>
      <tr v-for="(note, index) in notesData" v-bind:key="index">
        <td v-if="note.noteStr != ''">{{ note.noteStr }}</td>
        <td v-else> "Sin texto" </td>
      </tr>
      <tr v-if="addNote && !added">
        <td>
          <input type="text" v-model="note" /> <a href="#" @click="addNotes()">Añadir</a>
        </td>
      </tr>
      <tr v-if="!addNote && !added && edit">
        <a href="#" @click="addOn()">Añadir</a>
      </tr>
    </table><br />
  </div>
</template>

<script>

export default {
  name: 'notesModule',
  props: ['notes', 'edit'],
  components: {
  },
  data:function()
  {
    return {
      note: undefined,
      addNote: false,
      notesData: [],
      added: false,
    }
  },
  methods: {
    addOn: function()
    {
      this.addNote = true;
    },
    addNotes: function()
    {
      let date = new Date();
      let note = { noteStr: this.note, date: date.toISOString() };
      this.notesData.push(note);
      this.added = true;
      this.$emit('add', note);
    },
    reset: function()
    {
      this.addNote = false;
      this.$emit('reset');
    },
  },
  mounted(){
    if (this.notes) {
      this.notesData = this.notes;
    }
  }
}
</script>
<style></style>
