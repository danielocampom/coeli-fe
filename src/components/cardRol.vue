<template>
    <div>
        <b-card type="3">
                <p class="fw-bolder">{{dataRol.nombre}}</p>
                <p class="fw-light"> {{dataRol.descripcion}} </p>
                <vs-button v-if="dataRol.personaliza" block danger @click="active2=!active2">
                    <box-icon name='trash' color="#fff"></box-icon> Eliminar
                </vs-button>
        </b-card>
        
        
        <vs-dialog blur v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Eliminarlo?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="desactivarRoll"/>
        </vs-dialog>

    </div>
    
</template>
<script>

import ConfirmComponent from '@/components/confirm.vue'


export default {
    name: 'CardRolComponent',
    props: {
        dataRol: Object,
    },
    data:() => ({
        active2: false,
        nombre: '',
        descripcion: '',
        btnElimina: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        ConfirmComponent,
    },
    async mounted(){
        this.nombre = this.dataRol.nombre
        this.descripcion = this.dataRol.descripcion
    },
    methods: {
        async desactivarRoll(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`rol/delete/${this.dataRol.id}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                })
                const data = await res.json();
                if(data.status == 200){
                    this.active2 = false
                    this.active = false
                    this.$emit('updatePage', '200')
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)

                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
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
<style>
.card{
    border-radius: 1rem;
}
</style>
<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .con-footer
    display flex
    align-items center
    justify-content flex-end
    .vs-button
      margin 0px
      .vs-button__content
        padding 10px 30px
      ~ .vs-button
        margin-left 10px
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
    padding-bottom 0px
  .con-content
    width 100%
    p
      font-size .8rem
      padding 0px 10px
    .vs-checkbox-label
      font-size .8rem
    .vs-input-parent
      width 100%
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
