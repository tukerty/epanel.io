<template>
  <div class="env-picker">
      <div class="env" v-for="(env, index) in envs" :key="index">
          <div class="env-name">{{env.name.slice(0,1)}}</div>
      </div>
      <div class="env plus">
          <div class="env-name">+</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'EnvPicker',
  data () {
    return {
      envs: [{
        color: '#b71c1c',
        name: 'Production'
      }, {
        color: '#01579B',
        name: 'Development'
      }, {
        color: '#F57F17',
        name: 'Pre-production'
      }, {
        color: '#1B5E20',
        name: 'Local'
      }]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.env-picker{
    border-top: 1px solid #2B2F38;
    color:#FFF;
}
.env{
    border-bottom: 1px solid #2B2F38;
    padding: 15px;
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    font-weight: bold;
}
.env:hover{
    background-color: rgb(22, 24, 29);
}
.env:active{
    background-color:rgb(10, 11, 14);
}
.active{
    background-color: #2B2F38;
}
.active:hover{
    background-color: rgb(22, 24, 29);
}
.active:active{
    background-color: rgb(10, 11, 14);
}
.env-name{
    display: inline;
    word-wrap: none;
}
.env-name::after{
    height: 2px;
    border-radius: 1px;
    width: 15px;
    display: block;
    content: '';
    background-color: rgb(36, 153, 65);
    margin: auto;
}

</style>
