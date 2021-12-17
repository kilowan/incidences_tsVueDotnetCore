<template>
	<div style="text-align: center; margin: 0 auto; width:380px;">
		<div class="m-2" style="text-align: center; box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%); border-radius: 8px; background-color: #FFF">
			<h2 class="m-2">Recupera tu cuenta</h2>
			<hr>
			<div class="m-2">
				<p v-if="error">No hay resultados de búsqueda</p>
				<b-label v-if="state == 0" class="m-2">Introduce tu usuario para buscar tu cuenta.</b-label><br/>
				<input v-if="state == 0" v-model="username" style="width: 80%" class="m-2" type="text" placeholder="Nombre de usuario"/>
				<b-label v-if="state == 1" class="m-2">¿Quieres que te enviemos un código de seguridad al email registrado {{username}}?</b-label><br/>
				<b-label v-if="state == 2" class="m-2">Introduce el código que te hemos enviado</b-label><br/>
				<input v-if="state == 2" v-model="securityCode" style="width: 80%" class="m-2" type="text" placeholder="Código de seguridad"/>
				<b-label v-if="state == 3" class="m-2">Introduce el nuevo password</b-label><br/>
				<input v-if="state == 3" v-model="password" style="width: 80%" class="m-2" type="text" placeholder="Nuevo password"/>
				<b-label v-if="state == 4" class="m-2">PasswordCambiado satisfactoriamente</b-label><br/>
			</div>
			<hr>
			<div class="m-2">
				<b-button class="m-2" to="/">Atrás</b-button>
				<b-button v-if="state == 0" class="m-2" @click="checkCredentials">Buscar</b-button>
				<b-button v-if="state == 1" class="m-2" @click="sendCode">Enviar código</b-button>
				<b-button v-if="state == 2" class="m-2" @click="checkCode">Comprobar código</b-button>
				<b-button v-if="state == 3" class="m-2" @click="saveChanges">Guardar</b-button>
			</div>
		</div>
	</div>
</template>


<script lang="ts">

import axios from 'axios';

export default {
  name: 'PasswordRecovery',
  data() {
		return {
			selected: undefined,
			name: '',
			error: false,
			username: '',
			state: 0,
			code: false,
			password:'',
			securityCode: '',
		}
	},
  methods: {
	async checkCredentials() {
			await axios({
				method: 'get',
				url: `http://localhost:8080/api/Credentials/${this.username}`,
			}).then((data: any) =>{
				//this.error = !data.data;
				this.state = 1;
			}).catch((data: any)=> {
				//this.error = true;
			});
	},
	async sendCode() {
			await axios({
				method: 'get',
				url: `http://localhost:8080/api/PasswordRecovery/${this.username}`,
			}).then((data: any) =>{
				this.code = data.data;
				data.data? this.state = 2 : this.state = 1;
			}).catch((data: any)=> {
				this.state = 1;
			});
	},
	async checkCode() {
			await axios({
				method: 'get',
				url: `http://localhost:8080/api/PasswordRecovery/${this.securityCode}/${this.username}`,
			}).then((data: any) =>{
				this.code = data.data;
				data.data? this.state = 3 : this.state = 2;
			}).catch((data: any)=> {
				this.state = 2;
			});
	},
	async saveChanges() {
		await axios({
			method: 'put',
			url: `http://localhost:8080/api/Credentials/${this.code}`,
			data: {
				username: this.username,
				password: this.password
			}
		}).then((data: any) =>{
			this.state = 4;
		});
	},
  }
}
</script>

