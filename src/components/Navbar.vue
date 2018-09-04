<template>
  <div class="navbar">
    <div class="breadcrumps">
      <a href="">
        <strong>Company Name</strong>
      </a> /
      <a href="">Environment</a>
    </div>
    <searchbar @searchInput="data => $emit('searchInput', data)"/>
    <a @click="toggleEdit">
      <pencil-icon/>
    </a>
    <div v-if="editMode" class="editBar">
      <p>Add, drag, move and resize tiles &nbsp;</p>
      <button @click="submitEditing">Done editing</button>
    </div>
  </div>
</template>

<script>
import Searchbar from './Searchbar'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'

export default {
  name: 'Navbar',
  components: {
    Searchbar,
    PencilIcon
  },
  props: {
    editMode: Boolean,
    searchQuery: String
  },
  data () {
    return {
    }
  },
  methods: {
    toggleEdit () {
      this.$emit('toggleEdit')
    },
    submitEditing() {
      this.$emit('submitEditing')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumps {
  padding: 10px;
  color: rgb(90, 90, 90);
}
.breadcrumps a {
  color: rgb(90, 90, 90);
  text-decoration: none;
}
.navbar {
  box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.15);
  background-color: #f8f9fd;
  position: fixed;
  display: flex;
  align-items: center;
  margin-left: 50px;
  width: calc(100vw - 50px);
  height: 50px;
    z-index: 2;
}
.material-design-icon {
  bottom: 0 !important;
  cursor: pointer;
}
.material-design-icon {
  font-size: 1.25em;
  color: #bdbdbd;
  margin-right: 20px;
}
.material-design-icon:hover {
  color: rgb(90, 90, 90);
}
.editBar{
  background-color: #37474F;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  color:#FFF;
}
.editBar button{
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, 0.15);
  background: #FF5722;
  color:#FFF;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  margin: 10px;
  cursor: pointer;
}
.editBar button:hover{
  background: #FF7043;
}
.editBar button:active{
  background: #F4511E;
  box-shadow: none;
  outline: none;
}
.editBar p {
  margin-top: 18px;
}
</style>
