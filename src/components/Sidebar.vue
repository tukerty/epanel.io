<template>
  <div class="sidebar">
    <div class="logo">
    </div>
    <EnvPicker/>
    <div class="avatar-block">
      <div class="avatar-image"></div>
      <div class="avatar-controls">
        <p>User Name</p>
      </div>

    </div>
    <div class="avatar-buttons">
      <div class="settings-button avatar-button">
        <settings-icon/>
      </div>
      <div class="bug-button avatar-button">
        <bug-icon/>
      </div>
      <div class="exit-button avatar-button">
        <exit-to-app-icon/>
      </div>
    </div>
  </div>
</template>

<script>
import EnvPicker from './EnvPicker'
import BugIcon from 'vue-material-design-icons/Bug.vue'
import SettingsIcon from 'vue-material-design-icons/Settings.vue'
import ExitToAppIcon from 'vue-material-design-icons/ExitToApp.vue'

export default {
  name: 'Sidebar',
  components: {
    EnvPicker,
    BugIcon,
    SettingsIcon,
    ExitToAppIcon
  },
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar {
  box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.15);
  background-color: #343843;
  height: 100vh;
  position: fixed;
  width: 50px;
  transition: all 0.1s;
  z-index: 3;
  overflow: hidden;
}
.sidebar:hover {
  width: 200px;
}
.logo {
  width: 30px;
  height: 30px;
  margin: 10px auto;
  background: #fff;
}
.avatar-block {
  bottom: 55px;
  position: absolute;
  display: flex;
  white-space: nowrap;
  align-items: center;
}
.avatar-image {
  width: 30px;
  height: 30px;
  margin: 10px;
  background: #fff;
  transition: all 0.1s;
}
.sidebar:hover .avatar-image {
  width: 50px;
  height: 50px;
}
.avatar-controls {
  color: #fff;
}
.avatar-buttons {
  bottom: 0;
  position: absolute;
  display: flex;
  white-space: nowrap;
  align-items: center;
}
.avatar-button{
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5em;
  padding:10px;
  padding-bottom: calc(0.125em + 10px);
  transition: all 0.1s;
  cursor: pointer;
}
.avatar-button:hover{
    background-color: rgb(22, 24, 29);
}
.avatar-button:active{
    background-color:rgb(10, 11, 14);
}
.sidebar:hover .avatar-button:not(:last-child){
  border-right: 1px solid #2B2F38;
}
.sidebar:hover .avatar-button {
  width: 45px;
}
</style>
