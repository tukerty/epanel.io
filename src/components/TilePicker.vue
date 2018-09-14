<template>
  <div class="tilepicker" :class="{'edit-mode': editMode}">
    <p class="tilepicker-header">Tiles Palette</p>
    <p class="tilepicker-subheader">Click to add tile</p>
    <div class="tile-item" @click="addTile('link')">
      <div class="tile"></div>
      <p class="tile-name">Link</p>
    </div>
    <div class="tile-item" @click="addTile('ssh-command')">
      <div class="tile"></div>
      <p class="tile-name">SSH command</p>
    </div>
    <div class="tile-item" @click="addTile('ping')">
      <div class="tile"></div>
      <p class="tile-name">Ping time</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TilePicker',
  props: {
    editMode: Boolean
  },
  data () {
    return {

    }
  },
  methods: {
    addTile (data) {
      this.$emit('newTile', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tilepicker{
    display: none;
    height: calc(100vh - 70px);
    width: 160px;
    right: 0;
    top: 50px;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 1;
    position: absolute;
    background: #FFF;
    padding: 0 35px 0 20px;
}
.tilepicker.edit-mode{
    display: block;
}
.tilepicker-header{
  font-size: 1.25em;
  margin-bottom: 0
}
.tilepicker-subheader{
  font-size: 0.75em;
  margin-top: 5px;
}
.tile-item{
  cursor: pointer;
  margin-bottom: 20px;
}
.tile-item .tile{
  border: 1px dashed rgb(90, 90, 90);
  width:160px;
  height:120px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.tile-item .tile-name{
  font-size: 0.75em;
  margin: 10px 0;
}
</style>
