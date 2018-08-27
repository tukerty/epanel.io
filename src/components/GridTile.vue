<template>
  <div class="grid-item" :style="position" :class="{'edit-mode': editMode}" @mousedown="startMove">
    <div class="trash" @click="removeTile">
      <delete-icon/>
    </div>
    <div class="holder" @mousedown="startResize">
      <span class="holder-icon"></span>
    </div>
    <p class="tile-name">Tile Name</p>
    <p class="tile-type">Link</p>
    <div class="tile-content">
    </div>
  </div>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete.vue'

export default {
  name: 'GridTile',
  components: {
    DeleteIcon
  },
  data () {
    return {
      resize: false,
      move: false,
      dragging: false,
      drag: {
        offsetX: null,
        offsetY: null,
        startX: null,
        startY: null
      }
    }
  },
  props: {
    editMode: Boolean,
    tile: Object
  },
  created () {
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('dragend', this.endDrag)
    window.addEventListener('mousemove', this.doDrag)
  },
  destroyed () {
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('dragend', this.endDrag)
    window.removeEventListener('mousemove', this.doDrag)
  },
  methods: {
    startResize (e) {
      if (this.editMode && e.button === 0) {
        this.dragging = true
        this.resize = true
        this.move = false
        this.drag.startX = e.clientX
        this.drag.startY = e.clientY
      }
    },
    startMove (e) {
      if (this.editMode && e.button === 0) {
        if (
          e.target.className !== 'holder' &&
          e.target.className !== 'holder-icon'
        ) {
          this.dragging = true
          this.resize = false
          this.move = true
          this.drag.startX = e.clientX
          this.drag.startY = e.clientY
        }
      }
    },
    doDrag (e) {
      if (this.editMode && this.dragging) {
        this.drag.offsetX = Math.round((e.clientX - this.drag.startX) / 95)
        this.drag.offsetY = Math.round((e.clientY - this.drag.startY) / 95)
      }
    },
    endDrag (e) {
      if (this.editMode && this.dragging) {
        if (this.resize) {
          this.$emit('setSize', {
            event: 'setSize',
            x: this.drag.offsetX,
            y: this.drag.offsetY
          })
        } else if (this.move) {
          this.$emit('setPosition', {
            event: 'setPosition',
            x: this.drag.offsetX,
            y: this.drag.offsetY
          })
        }
        this.drag.offsetX = null
        this.drag.offsetY = null
        this.drag.startX = null
        this.drag.startY = null
        this.dragging = false
        this.resize = false
        this.move = false
      }
    },
    removeTile () {
      this.$emit('removeTile', this.tile)
    }
  },
  computed: {
    position () {
      return {
        left:
          this.tile.positionX * 90 +
          this.tile.positionX * 5 +
          this.drag.offsetX * 95 * !this.resize +
          'px',
        top:
          this.tile.positionY * 90 +
          this.tile.positionY * 5 +
          this.drag.offsetY * 95 * !this.resize +
          'px',
        width:
          this.tile.sizeX * 90 +
          (this.tile.sizeX - 2) * 5 +
          this.drag.offsetX * 95 * this.resize +
          'px',
        height:
          this.tile.sizeY * 90 +
          (this.tile.sizeY - 2) * 5 +
          this.drag.offsetY * 95 * this.resize +
          'px'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid-item {
  transition: all 0.1s;
  user-select: none;
  position: absolute;
  background-color: #fff;
}
.grid-item .holder {
  position: absolute;
  display: none;
  cursor: se-resize;
  height: 30px;
  width: 30px;
  bottom: 0;
  right: 0;
}
.grid-item .trash {
  position: absolute;
  margin: 3px;
  cursor: pointer;
  display: none;
  top: 0;
  right: 0;
}
.grid-item .trash:hover {
  background-color: #e64a19;
}
.grid-item .trash:hover .material-design-icon {
  color: #fff;
}
.grid-item.edit-mode .holder,
.grid-item.edit-mode .trash {
  display: block;
}
.holder-icon {
  margin: 10px;
  height: 10px;
  width: 10px;
  position: absolute;
  border-right: 2px solid rgb(90, 90, 90);
  border-left: 2px solid transparent;
  border-bottom: 2px solid rgb(90, 90, 90);
}
.material-design-icon {
  font-size: 1em;
  float: right;
  color: rgb(90, 90, 90);
}

.tile-name {
  margin: 10px 0 0 10px;
  font-size: 0.8em;
}
.tile-type {
  margin: 0 10px;
  font-size: 0.65em;
  color: rgba(90, 90, 90, 0.5);
}
</style>
