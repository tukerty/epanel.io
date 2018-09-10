<template>
  <div class="grid" :class="{'edit-mode': editMode}">
    <div class="layout-frames" v-if="editMode">
      <div class="layout-frame layout-frame-800-600">
      </div>
      <div class="layout-frame layout-frame-1024-768">
      </div>
      <div class="layout-frame layout-frame-1366-768">
      </div>
      <div class="layout-frame layout-frame-1440-900">
      </div>
      <div class="layout-frame layout-frame-1920-1080">
      </div>
      <div class="layout-frame layout-frame-3840-2160">
      </div>
      <div class="layout-frame-grid">
      </div>
    </div>
    <div class="grid-items">
      <grid-tile-link v-if="tile.type=='link'" v-for="tile in tiles" :key="tile.id" :searchQuery="searchQuery" :tile="tile" :editMode="editMode" @setSize="e => setSize(e,tile)" @setPosition="e => setPosition(e,tile)" @removeTile="removeTile" />
      <grid-tile-s-s-h-command v-if="tile.type=='ssh-command'" v-for="tile in tiles" :key="tile.id" :searchQuery="searchQuery" :tile="tile" :editMode="editMode" @setSize="e => setSize(e,tile)" @setPosition="e => setPosition(e,tile)" @removeTile="removeTile" />
    </div>
  </div>
</template>

<script>
import GridTileLink from './GridTileLink'
import GridTileSSHCommand from './GridTileSSHCommand'

export default {
  name: 'Grid',
  components: {
    GridTileLink,
    GridTileSSHCommand
  },
  data () {
    return {}
  },
  props: {
    editMode: Boolean,
    tiles: Array,
    searchQuery: String,
  },
  methods: {
    setSize (e, tile) {
      this.$emit('setSize', tile, e)
    },
    setPosition (e, tile) {
      this.$emit('setPosition', tile, e)
    },
    removeTile (tile) {
      this.$emit('removeTile', tile)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  overflow: auto;
  position: absolute;
  height: calc(100vh - 50px);
  top: 50px;
  left: 50px;
  width: calc(100vw - 50px);
}
.grid.edit-mode {
  width: calc(100vw - 265px);
}
.layout-frame {
  opacity: 0.5;
  position: absolute;
  color: rgb(90, 90, 90);
  border-bottom: 1px dashed rgb(90, 90, 90);
  border-right: 1px dashed rgb(90, 90, 90);
}
.layout-frame:after {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 0.75em;
}
.layout-frame-800-600 {
  height: 480px;
  width: 750px;
}
.layout-frame-800-600:after {
  content: "800x600";
}
.layout-frame-1024-768 {
  border-bottom: none;
  height: 648px;
  width: 974px;
}
.layout-frame-1024-768:after {
  content: "1024x768";
}
.layout-frame-1366-768 {
  height: 648px;
  width: 1316px;
}
.layout-frame-1366-768:after {
  content: "1366x768";
}
.layout-frame-1440-900 {
  height: 780px;
  width: 1390px;
}
.layout-frame-1440-900:after {
  content: "1440x900";
}
.layout-frame-1920-1080 {
  height: 960px;
  width: 1870px;
}
.layout-frame-1920-1080:after {
  content: "1920x1080";
}
.layout-frame-3840-2160 {
  height: 3700px;
  width: 2110px;
}
.layout-frame-3840-2160:after {
  content: "3840x2160";
}
.layout-frame-grid {
  position: absolute;
  background-image: url("../assets/grid_shadow.png");
  opacity: 0.3;
  height: 3790px;
  width: 2110px;
  margin: 50px;
}
.grid-items {
  position: absolute;
  margin: 50px;
}
</style>
