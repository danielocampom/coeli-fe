<template>
    <full-calendar :events="fcEvents" locale="es"></full-calendar>
</template>
  
<script>
export default {
    name:"CalendarComponent",
    data: () => ({
        fcEvents:  [
            {
            title : 'Entrega a BMW',
            start : '2023-01-06',
            end : '2023-01-06'
            }
        ]
    }),
}
</script>
<style>
.events-day{
    height: 3rem;
}
</style>