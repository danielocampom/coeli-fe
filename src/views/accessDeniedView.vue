<template>
    <div>
        <HeaderComponent/>
        <br>
        <div class="access-denied mt-5">
          <h1>Acceso denegado</h1>
          <p>{{ message }}</p>
        </div>

    </div>
  </template>
  
  <script>
  import HeaderComponent from '@/components/Header.vue';

  export default {
    props: {
      message: {
        type: String,
        default: "Lo siento, no tienes permiso para acceder a esta página"
      }
    },
    components: {
        HeaderComponent,
    },
  };
  </script>
  
  <style>
  .access-denied {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 16px;
    margin: 16px;
    text-align: center;
  }
  .access-denied h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .access-denied p {
    font-size: 16px;
    margin-top: 0;
  }
  </style>