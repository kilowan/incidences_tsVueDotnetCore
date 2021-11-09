<template>
    <!-- Login -->
    <div class="home">
      <div class="cabecera">
        <div class="nombre">
          <p class="brand">J&J.SA </p>
        </div>
        <div class="mensaje">
          <p class="welcome">Bienvenidos</p>
        </div>
          <div class="login">
            <input class="input" name="username" type="text" id="username" v-model="form.username" placeholder="username" required />
            <input class="input" name="password" type="password" id="password" v-model="form.pass" placeholder="password" required/>
            <button class="btn btn-primary" @click="onSubmit()" v-if="form.username && form.pass" type="submit" variant="primary">LOGIN</button>

          </div>
      </div>
      <div class="cuerpo">
      </div>
      <div class="Pie">
        <p>Trabajo realizado por Jose Javier Valero Fuentes y Juan Francisco Navarro Ramiro para el curso de ASIR 2º X migrado a Vue.js</p>
      </div>
    </div>
</template>

<script lang="ts">
import { /*Component, */Vue } from "vue-property-decorator";
import axios from 'axios';
//import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

/*@Component({
  components: {
    //HelloWorld,
  },
})*/

export default Vue.extend({
  name: 'Home',
  components: {/*home*/},
  data: function() {
    return {
      form: {
        username: undefined,
        pass: undefined,
      },
      user: undefined,
      incidences: undefined,
    }
  },
  methods: {
    onSubmit: function() {
      axios({
        method: 'post',
        url: 'http://localhost:8082/Services/credentials.php',
        data: {
          username: this.form.username,
          pass: this.form.pass,
        },
      headers: []
      })
      .then((data: any) => {
        this.$router.push({
          name: 'main', params: {
            username: data.data.username
          }
				});
      });
    },
  },
  //mounted(){}
})
</script>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  body
  {
    background:url("../fondo.gif");
    font-size: 100%;
    font-family: sans-serif;
  }
  .mensaje
  {
    text-align: center;
    font-size: 1.4em;
    font-weight: bold;
    color: white;
    top: 5%;
    width: 40%;
    left: 30%;
    position: relative;
  }
  .Logo
  {
    text-align: right;
    right: 5%;
    top: 10%;
    position: absolute;
  }
  img.cierra
  {
    width: 40px; height: 40px;
  }
  .login
  {
    font-size: 0.9em;
    right: 1%;
    top: 9%;
    position: fixed;
  }
  .opciones
  {
    text-align: center;
    font-size: 0.9em;
    bottom: 0;
    width: 60%;
    left: 20%;
    position: absolute;
  }
  .link
  {
    color: white;
    padding-right: 6px;
  }
  .brand
  {
    color: white;
    text-align: left;
  }
  .input
  {
    margin-right: 6px;
  }
  .welcome
  {
    top: 2%;
    left: 40%;
    position: fixed;
  }
  .cuerpo
  {
    top: 12%;
    left: 0%;
    width: 100%;
    bottom: 10%;
    position: fixed;
    overflow: auto;
  }
  table
  {
    box-shadow: 5px 5px 10px #999;
    border: 1px solid white;
      background: white;
    left: 10%;
    width: 80%;
    position: relative;
    border-spacing: 0px;
  }
  .table
  {
    box-shadow: 5px 5px 10px #999;
    border: 1px solid white;
      background: white;
    left: 10%;
    width: 80%;
    position: relative;
    border-spacing: 0px;
  }
  th
  {
    border: 1px solid white;
      color: black;
    background: #d7dee3 url("../tabla.gif") repeat-x top left;
  }
  .th
  {
    border: 1px solid white;
      color: black;
    background: #d7dee3 url("../tabla.gif") repeat-x top left;
  }
  td
  {
    font-size: 100%;
    text-align: center;
    border: 1px dashed gray;
    color: black;
  }
  .Pie
  {
    bottom: 0;
    left: 0;
    right: 0;
    height: 10%;
    position: fixed;
    background-color: #333;
    color: white;
    text-align: center;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
  .cabecera
  {
    border: 2px solid black;
    background-color: #333;
    width: 100%;
    height: 12%;
    left: 0;
    top: 0;
    position: fixed;
    color: white;
    overflow: hidden;
  }
</style>
