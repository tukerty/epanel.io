<template>
  <div class="searchbar">
    <input type="text" class="searchbar-input">
    <magnify-icon />
  </div>
</template>

<script>
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'

export default {
  name: 'Searchbar',
  components: {
    MagnifyIcon
  },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .searchbar{
    flex-grow: 1;
    padding: 10px;
    height:30px;
    display: flex;
    align-items: center;
  }
  .searchbar-input{
    flex-grow: 1;
    height:30px;
    padding: 0;
    margin: 0;
    background: transparent;
    font-size: 1.5em;
    border: none;
    border-bottom: 1px solid #BDBDBD;
  color: rgb(90, 90, 90);
  }
  .searchbar-input:focus{
    background: transparent;
    border: none;
    border-bottom: 1px solid #BDBDBD;
    outline: none;
  }
  .material-design-icon{
    font-size: 1.5em;
    color: #BDBDBD;
  }
</style>
