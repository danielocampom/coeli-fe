<template>
    <div class="center">
      <vs-dialog prevent-close blur not-close  v-model="active">
        <template #header>
          <h4 class="not-margin">
            Tu Sesión ha <b>Expirado</b>
          </h4>
        </template>


        <div class="con-form">
          <vs-input v-model="usuario" placeholder="Email">
            <template #icon>
                <box-icon name='user'></box-icon>
            </template>
          </vs-input>
          <vs-input type="password" v-model="password" placeholder="Password">
            <template #icon>
              <box-icon name='lock-alt' ></box-icon>
            </template>
          </vs-input>
        </div>

        <template #footer>
          <div class="footer-dialog">
            <vs-button block @click="reboot()">
              iniciar
            </vs-button>

          </div>
        </template>
      </vs-dialog>
    </div>
</template>
  
<script>
export default {
    name:"loginComponent",
    props: {
        login: Boolean,
    },
    data: () => ({
        active: false,
        usuario: '',
        password: '',
    }),
    mounted(){
        this.active = this.login
    },
    methods:{
        async reboot(){
            let json = {
                "username": this.usuario,
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
                this.$session.start()
                this.$session.set('token', data.datos.token)
                this.$session.set('roles', data.datos.roles)
                this.$session.set('username', data.datos.username)
                this.$router.push("dashboard")
            }else{
                this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        
        },
        openNotification( title, text, color, position = null, icon) {
          this.$vs.notification({
            progress: 'auto',
            icon,
            color,
            position,
            title: title,
            text: text
          })
        }
    }
}
</script>
<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
  .con-form
    width 100%
    .flex
      display flex
      align-items center
      justify-content space-between
      a
        font-size .8rem
        opacity .7
        &:hover
          opacity 1
    .vs-checkbox-label
      font-size .8rem
    .vs-input-content
      margin 10px 0px
      width calc(100%)
      .vs-input
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 20px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
    .vs-button
      margin 0px
  </style>