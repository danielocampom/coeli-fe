<template>
  <div class="hidden">
    <vs-navbar shadow square center-collapsed v-model="active">
      <template #left>
        <vs-button @click="activeSidebar = !activeSidebar" flat icon>
          <box-icon name='menu'></box-icon>
        </vs-button>
      </template>
      <vs-navbar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ALMACENENTRADA'].includes(role))" :active="active == 'llegada'" id="llegada">
        <router-link to="/llegada" class="nav-link">
            <box-icon name='grid-alt'></box-icon> Llegada
        </router-link>
      </vs-navbar-item>
      <vs-navbar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'USUARIOS'].includes(role))" :active="active == 'procesoPrendas'" id="procesoPrendas">
        <router-link to="/procesoPrendas" class="nav-link">
            <box-icon name='briefcase'></box-icon>Proceso Prendas
        </router-link>
      </vs-navbar-item>
      <vs-navbar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ALMACENENTREGA'].includes(role))" :active="active == 'entregas'" id="entregas">
        <router-link to="/entregas" class="nav-link">
            <box-icon name='shopping-bag'></box-icon> Entregas
        </router-link>
      </vs-navbar-item>

      <template #right>

        <vs-navbar-item :active="active == 'exit'" id="exit" @click="logoutModal=!logoutModal">
            <box-icon name='exit' ></box-icon>
        </vs-navbar-item>
      </template>
    </vs-navbar>
    <vs-sidebar
      absolute
      v-model="active"
      :open.sync="activeSidebar"
      >
      <template #logo>
        <!-- ...img logo -->
          <img src="@/assets/logo_coeli.png" alt="urvina-coeli">
      </template>
      <vs-sidebar-item  id="home">
        <template #icon>
          <box-icon name='home-alt-2' ></box-icon>
        </template>
        <router-link to="/dashboard" class="nav-link">
          Home
        </router-link>
      </vs-sidebar-item>
      
      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'USUARIOS'].includes(role))" id="usuario">
        <template #icon>
          <box-icon name='user'></box-icon>
        </template>
        <router-link to="/usuarios" class="nav-link">
          usuarios
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CLIENTES'].includes(role))" id="cliente">
        <template #icon>
          <box-icon type='solid' name='user-badge'></box-icon>
        </template>
        <router-link to="/clientes" class="nav-link">
          Clientes
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'LAVADORA'].includes(role))" id="tipoLavados">
        <template #icon>
          <box-icon name='water'></box-icon>
        </template>
        <router-link to="/tipoLavados" class="nav-link">
          Tipo Lavados
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'LAVADORA'].includes(role))" id="lavadora">
        <template #icon>
          <box-icon type='solid' name='washer'></box-icon>
        </template>
        <router-link to="/lavadoras" class="nav-link">
          Lavadoras
        </router-link>
      </vs-sidebar-item>
      
      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'PRENDA'].includes(role))" id="prendas">
        <template #icon>
          <box-icon name='body'></box-icon>
        </template>
        <router-link to="/prendas" class="nav-link">
          Prendas
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'PROCESOLAVADO'].includes(role))" id="registroLavado">
        <template #icon>
          <box-icon type='solid' name='file-plus'></box-icon>
        </template>
        <router-link to="/registroLavado" class="nav-link">
          Registrar Proceso de Lavado
        </router-link>
      </vs-sidebar-item>
        
      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ALMACENENTRADA'].includes(role))" id="histOrdenes">
        <template #icon>
          <box-icon name='folder-open'></box-icon>
        </template>
        <router-link to="/ordenes" class="nav-link">
          Historial ordenes
        </router-link>
      </vs-sidebar-item>

      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'CANCELACION'].includes(role))" id="canOrdenes">
        <template #icon>
          <box-icon name='folder-minus'></box-icon>
        </template>
        <router-link to="/canceladas" class="nav-link">
            Ordenes canceladas
        </router-link>
      </vs-sidebar-item>


      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'ROLES'].includes(role))" id="rolesUsr" >
        <template #icon>
          <box-icon name='toggle-right' ></box-icon>
        </template>
        <router-link to="/roles" class="nav-link">
            Roles de usuario
        </router-link>
      </vs-sidebar-item>
      
      <vs-sidebar-item v-if="this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'RASTREO'].includes(role))" id="rastOrdenes" >
        <template #icon>
          <box-icon name='map-pin'></box-icon>
        </template>
        <router-link to="/rastreo" class="nav-link">
            Rastreo de Ordenes
        </router-link>
      </vs-sidebar-item>


      <vs-sidebar-item  :active="activeModal == 'cambioNip'" id="cambioNip" >
        <template #icon>
          <box-icon name='dialpad-alt' @click="activeModal=!activeModal"></box-icon>
        </template>
        Cambio de NIP
      </vs-sidebar-item>

      <vs-dialog prevent-close v-model="activeModal">
        <template #header>
          <h4 class="not-margin">
            ¿Seguro que deseas Cabiar tu<b> Contraseña?</b>
          </h4>
        </template>
          <template>
              <div class="con-form">
                <b-row>
                  <b-col lg="12" md="12" sm="12">
                    <vs-input p class="mb-3" primary type="password" v-model="passNueva" label-placeholder="Contraseña Nueva">
                      <template #icon>
                        <box-icon type='solid' name='lock-open'></box-icon>
                      </template>
                    </vs-input>
                  </b-col>
                  <b-col lg="12" md="12" sm="12">
                    <vs-input  class="mb-3" primary type="password" v-model="passConf" label-placeholder="Confirmar Contraseña">
                      <template #icon>
                        <box-icon type='solid' name='lock-open'></box-icon>
                      </template>
                    </vs-input>
                  </b-col>
                  <b-col lg="12" md="12" sm="12">
                    <vs-input class="mb-3" primary type="password" v-model="passAct" label-placeholder="Contraseña Actual">
                      <template #icon>
                        <box-icon type='solid' name='lock'></box-icon>
                      </template>
                    </vs-input>
                  </b-col>
                </b-row>
              </div>
          </template>

          <template #footer>
            <div class="footer-dialog">
              <vs-button primary block @click="actualizarPassword()">
                  <box-icon name='save' color="#fff"></box-icon> Actualizar
              </vs-button>
            </div>
          </template>
      </vs-dialog>
      
      
    </vs-sidebar>

    <vs-dialog prevent-close v-model="logoutModal">
      <template #header>
        <h4 class="not-margin">
          ¿Seguro que deseas <b>cerrar sesión?</b>
        </h4>
      </template>
      <template #footer>
        <div class="footer-dialog">
          <div class="d-flex flex-row bd-highlight">
              <div class="p-1 bd-highlight">
                <vs-button size="xl" block  @click="logout()"> Si, Salir </vs-button>
              </div>
              <div class="p-1 bd-highlight">
                <vs-button size="xl" danger block  @click="logoutModal=!logoutModal">No, Cancelar</vs-button>
              </div>
          </div>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data:() => ({
    logoutModal: false,
    activeModal: false,
    passNueva: '',
    passConf: '',
    passAct: '',
    active: 'home',
    activeSidebar: false,
    activeNotify: false,

    formProceso: false,
    url: process.env.VUE_APP_SERVICE_URL_API
  }),
  mounted(){
  },
  methods:{
    ejemplo(){
      
      const encontrado = this.$session.get('roles').some(role => ['SISTEMAS', 'ADMIN', 'USUARIOS'].includes(role));

      if (encontrado) {
        console.log('El arreglo fue encontrado');
      } else {
        console.log('El arreglo no fue encontrado');
      }
    },
    async actualizarPassword(){
      let token = this.$session.get('token')

      let json = {
          "idUsuario": this.$session.get('idUsuario'),
          "password": this.passNueva,
          "confirmPassword": this.passConf,
          "actualPassword": this.passAct
      };
      let res = await fetch(this.url+"usuario/changePassword",{
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': "*",
              'Authorization': token
          },
          body: JSON.stringify(json)
      })
      let data = await res.json()

      if(data.status == 200){
          this.activeModal = false
          this.openNotification(`Exito: ${data.mensaje}`, `Se ha Actualizado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
      }else{
          this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
      }
    },
    logout(){
      this.$session.destroy();
      location.reload();
      // this.$router.push('/login');
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
