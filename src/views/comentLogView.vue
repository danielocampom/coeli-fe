<template>
    <div class="home">
      <div class="wrapper fadeInDown">
        <div id="formContent">
  
          <div class="fadeIn first">
            <img src="@/assets/logo.png" height="200px" id="icon" alt="User Icon" />
          </div>
  
          <form v-on:submit.prevent="login()">
            <input type="text" id="usuario" class="fadeIn second" name="usuario"  autocomplete="off" placeholder="usuario" v-model="usuario">
            <input type="password" id="password" class="fadeIn third" name="login" placeholder="Contraseña" v-model="password">
            <!-- <input type="password" pattern="[0-9]*" inputmode="numeric" id="password" class="fadeIn third" name="login" placeholder="Contraseña" v-model="password"> -->
            <input type="submit" class="fadeIn fourth btnLog">
          </form>
  
        </div>
      </div> 
      <div class="waves">
        <div class="wave circulo a"></div>
        <div class="wave circulo b"></div>
        <div class="wave circulo c"></div>
      </div>
    </div>
  
  
  </template>
  
  <script>
  
  export default {
    name: 'comentLogView',
    components: {
    },
    data: () => {
      return {
        usuario: "",
        password: "",
        error: false,
        error_msg: ""
      }
    },
    methods:{
      async login(){
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
        if(data.status == 200){
          this.$session.start()
          this.$session.set('token', data.datos.token)
          this.$session.set('roles', data.datos.roles)
          this.$session.set('username', data.datos.username)
          this.$router.push("dashboard")
        }else{
          this.toastTopEnd("error", data.mensaje)
        }
        
      },
  
      toastTopEnd(icon, title) {
        this.$swal({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          icon: icon,
          title: title,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', this.$swal.stopTimer)
            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
          }
        });
      },
  
    }
    
  }
  
  </script>
  
  <style>
  
  body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: rgb(12,126,54);
    background: linear-gradient(90deg, rgba(12,126,54,0.87718837535014) 0%, rgba(12,123,54,0.8743872549019608) 35%, rgba(24,28,53,0.8827906162464986) 75%, rgba(8,7,7,0.8799894957983193) 100%);
      /* background: rgb(63,180,251)!important;
    background: linear-gradient(90deg, rgba(63,180,251,1) 41%, rgba(70,83,252,1) 100%) !important; */
  }
  .zindex{
    z-index: 9 !important;	
  }
  .waves {
    position: absolute;
    bottom: -54px;
    height: 270px;
    width: 100%;
    overflow: hidden;
  }
  .wave {
    position: absolute;
    left: -180px;
    bottom: 0;
    width: 150%;
    height: 270px;
    background: url(https://static.platzi.com/media/files/waves_c8551f5d-ecf6-4a81-ae1d-f3a0ad55ba10.png) center bottom no-repeat;
    animation: 5s wave ease-in-out infinite alternate;
  }
  .wave.a {
    background-position: 0 -854px;
  }
  .wave.b {
    background-position: 0 -427px;
    animation-delay: .6s;
  }
  .wave.c {
    background-position: 0 0;
    animation-delay: 1.2s;
  }
  @keyframes wave {
    0% {
      transform: translate(0 , 0);
    }
    50% {
      transform: translate(-80px, 30px);
    }
    100% {
      transform: translate(160px, -60px);
    }
  }
  
  
  a {
    color: #92badd;
    display:inline-block;
    text-decoration: none;
    font-weight: 400;
  }
  
  h2 {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    display:inline-block;
    margin: 40px 8px 10px 8px; 
    color: #cccccc;
  }
  
  
  
  /* STRUCTURE */
  
  .wrapper {
    display: flex;
    align-items: center;
    flex-direction: column; 
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 20px;
  }
  
  #formContent {
    -webkit-border-radius: 10px 10px 10px 10px;
    border-radius: 10px 10px 10px 10px;
    background: #fff;
    padding: 30px;
    width: 90%;
    max-width: 450px;
    position: relative;
    padding: 0px;
    -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
    box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
    text-align: center;
  }
  
  #formFooter {
    background-color: #f6f6f6;
    border-top: 1px solid #dce8f1;
    padding: 25px;
    text-align: center;
    -webkit-border-radius: 0 0 10px 10px;
    border-radius: 0 0 10px 10px;
  }
  
  
  
  /* TABS */
  
  h2.inactive {
    color: #cccccc;
  }
  
  h2.active {
    color: #0d0d0d;
    border-bottom: 2px solid #5fbae9;
  }
  
  
  
  /* FORM TYPOGRAPHY*/
  
  input[type=button], input[type=submit], input[type=reset]  {
    background-color: #0c7e36;
    border: none;
    color: white;
    padding: 15px 80px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    text-transform: uppercase;
    font-size: 13px;
    -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
    box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
    margin: 5px 20px 40px 20px;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  
  input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover  {
    background-color: #0c7e36;
  }
  
  input[type=button]:active, input[type=submit]:active, input[type=reset]:active  {
    -moz-transform: scale(0.95);
    -webkit-transform: scale(0.95);
    -o-transform: scale(0.95);
    -ms-transform: scale(0.95);
    transform: scale(0.95);
  }
  
  input[type=text] {
    background-color: #f6f6f6;
    border: none;
    color: #0d0d0d;
    padding: 15px 32px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 5px;
    width: 85%;
    border: 2px solid #f6f6f6;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
  }
  
  input[type=password] {
    background-color: #f6f6f6;
    border: none;
    color: #0d0d0d;
    padding: 15px 32px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 5px;
    width: 85%;
    border: 2px solid #f6f6f6;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
  }
  
  input[type=text]:focus {
    background-color: #fff;
    border-bottom: 2px solid #0c7e36;
  }
  
  input[type=text]:placeholder {
    color: #cccccc;
  }
  
  input[type=password]:focus {
    background-color: #fff;
    border-bottom: 2px solid #0c7e36;
  }
  
  input[type=password]:placeholder {
    color: #cccccc;
  }
  
  
  
  /* ANIMATIONS */
  
  /* Simple CSS3 Fade-in-down Animation */
  .fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  
  @-webkit-keyframes fadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  
  /* Simple CSS3 Fade-in Animation */
  @-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  
  .fadeIn {
    opacity:0;
    -webkit-animation:fadeIn ease-in 1;
    -moz-animation:fadeIn ease-in 1;
    animation:fadeIn ease-in 1;
  
    -webkit-animation-fill-mode:forwards;
    -moz-animation-fill-mode:forwards;
    animation-fill-mode:forwards;
  
    -webkit-animation-duration:1s;
    -moz-animation-duration:1s;
    animation-duration:1s;
  }
  
  .fadeIn.first {
    -webkit-animation-delay: 0.4s;
    -moz-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  
  .fadeIn.second {
    -webkit-animation-delay: 0.6s;
    -moz-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  
  .fadeIn.third {
    -webkit-animation-delay: 0.8s;
    -moz-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }
  
  .fadeIn.fourth {
    -webkit-animation-delay: 1s;
    -moz-animation-delay: 1s;
    animation-delay: 1s;
  }
  
  /* Simple CSS3 Fade-in Animation */
  .underlineHover:after {
    display: block;
    left: 0;
    bottom: -10px;
    width: 0;
    height: 2px;
    background-color: #56baed;
    content: "";
    transition: width 0.2s;
  }
  
  .underlineHover:hover {
    color: #0d0d0d;
  }
  
  .underlineHover:hover:after{
    width: 100%;
  }
  
  
  
  /* OTHERS */
  
  *:focus {
      outline: none;
  } 
  
  #icon {
    width:60%;
  }
  
  
  
  </style>