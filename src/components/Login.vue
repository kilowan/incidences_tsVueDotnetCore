<template>
<div>
  <!-- Login -->
  <div class="body">
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
					<b-button class="btn btn-primary" @click="onSubmit" v-if="form.username && form.pass" type="submit" variant="primary">LOGIN</b-button>
				</div>
		</div>
		<div class="cuerpo">
		</div>
		<div class="Pie">
			<p>{{ message }}</p>
		</div>
  </div>
</div>
</template>

<script lang="ts">

import axios from 'axios';
import { credentialsDotNet } from '../Config/services';
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',
  props: {
    message: {
      type: String,
      required: false
    },
  },
  components: {},
  data() {
    return {
      form: {
        username: String.prototype,
        pass: String.prototype,
      },
      user: String.prototype,
      incidences: String.prototype,
      response: String.prototype,
      token: String.prototype,
    }
  },
  methods: {
    async onSubmit() {
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${this.token}` },
        url: `${credentialsDotNet}${this.form.username}/${this.form.pass}`
      })
      .then((data: any) => {
        if (data.data != 'false') {
          this.token = data.data;
          this.getLoginData(data.data);
        }
      });
    },
    async getLoginData(token: string){
      await axios({
        method: 'get',
        headers: { Authorization: `Bearer ${token}` },
        url: `${credentialsDotNet}${this.form.username}`
      })
      .then((data: any) => {
        this.response = data.data;
        this.$emit('logedIn', data.data)
      });
    }
  },
  //mounted(){}
})
</script>
<style>
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
