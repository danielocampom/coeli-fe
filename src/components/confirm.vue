<template>
    <div>
        <div class="con-content">
            <vs-input type="password" pattern="[0-9]*" inputmode="numeric" v-model="password" label-placeholder="Escribe tu contraseña para confirmar">
                <template #icon>
                    <box-icon name='dialpad-alt' ></box-icon>
                </template>
            </vs-input>
        </div>
        <div class="con-footer">
            <vs-button @click="consultMyUser()" success flat>
                Confirmar
            </vs-button>
        </div>
    </div>
    
</template>
<script>

export default {
    name: 'ConfirmComponent',
    data:() => ({
        password: '',
        activarReboot: false
    }),
    async mounted (){

    },
    methods: {
        async consultMyUser(){
           
            let json = {
                "username": this.$session.get('username'),
                "password": this.password
            };
            let url = process.env.VUE_APP_SERVICE_URL_API
            

            let res = await fetch(url+"auth/login",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()

            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.$session.set('token', data.datos.token)
                this.$emit('confirm', '200')
            }else{
                this.openNotification( `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        openNotification( text, color, position = null, icon) {
          this.$vs.notification({
            progress: 'auto',
            icon,
            color,
            position,
            title: "Error:",
            text: text
          })
        }
    }
}
</script>
