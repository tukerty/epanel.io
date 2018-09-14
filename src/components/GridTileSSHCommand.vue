<template>
  <div class="grid-item" :style="position" :class="{'edit-mode': editMode, 'customizing': customizing, 'is-dark':!isHighlighted && !editMode}" @mousedown="startMove">
    <div v-if="!customizing" class="trash control-icon" @click="removeTile">
      <delete-icon/>
    </div>
    <div v-if="!customizing" class="customize control-icon" @click="customizeTile">
      <pencil-icon/>
    </div>
    <div v-if="customizing" class="check control-icon" @click="saveTile">
      <check-icon/>
    </div>
    <div class="holder" @mousedown="startResize" v-if="!customizing">
      <span class="holder-icon"></span>
    </div>

    <div class="tile-content link">
      <div v-if="!customizing">
        <p class="tile-text-big">{{tile.data.title}}</p>
        <p class="tile-text-small tile-text-type">{{tile.type}}</p>
        <div v-if="tile.sizeY + drag.offsetY > 1 ">
          <p class="tile-text tile-text-big-description">{{tile.data.description}}</p>
        </div>
        <div class="tile-text-small tile-text-url"><p>{{tile.data.command}}</p><span v-if="tile.sizeX + drag.offsetX > 1 && tile.data.healthcheck"> | <p>200</p><div class="health-circle"></div></span></div>
      </div>
      <div class="customization" v-else>
        <p class="text-input-label">Title</p>
        <input class="text-input" placeholder="" v-model="tile.data.title" />
        <p class="text-input-label">URL</p>
        <input class="text-input" placeholder="" v-model="tile.data.url" />
        <p class="text-input-label">Username</p>
        <input class="text-input" placeholder="" v-model="tile.data.username" />
        <p class="text-input-label">Password</p>
        <input class="text-input" placeholder="" v-model="tile.data.password" type="password" />
        <p class="text-input-label">Command</p>
        <div class="flex">$&nbsp;<input class="text-input" placeholder="" v-model="tile.data.command" /></div>
        <p class="text-input-label">Description</p>
        <textarea class="text-input" maxlength="50" placeholder="" v-model="tile.data.description" />
      </div>
    </div>
  </div>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'

export default {
  name: 'GridTileClock',
  components: {
    DeleteIcon,
    PencilIcon,
    CheckIcon
  },
  data () {
    return {
      customizing: false,
      titleInput: null,
      resize: false,
      move: false,
      dragging: false,
      tempSizeX: null,
      tempSizeY: null,
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
    tile: Object,
    searchQuery: String
  },
  watch: {
    editMode () {
      if (this.tile.isNew && this.editMode === true) {
        this.customizeTile()
      }
      this.customizing = false
      this.tempSizeX = null
      this.tempSizeY = null
    }
  },
  created () {
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('dragend', this.endDrag)
    window.addEventListener('mousemove', this.doDrag)
    if (this.tile.isNew && this.editMode) {
      this.customizeTile()
    }
  },
  destroyed () {
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('dragend', this.endDrag)
    window.removeEventListener('mousemove', this.doDrag)
  },
  methods: {
    startResize (e) {
      if (this.editMode && e.button === 0 && !this.customizing) {
        this.dragging = true
        this.resize = true
        this.move = false
        this.drag.startX = e.clientX
        this.drag.startY = e.clientY
      } else if (!this.customizing && e.button === 0) {
        this.goToLink()
      }
    },
    startMove (e) {
      if (this.editMode && e.button === 0 && !this.customizing) {
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
      } else if (!this.customizing && e.button === 0) {
        this.goToLink()
      }
    },
    goToLink () {
      window.open(this.tile.data.url, '_blank')
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
    },
    customizeTile () {
      this.customizing = true
      if (this.tile.sizeX < 3) {
        this.tempSizeX = 3
      }
      if (this.tile.sizeY < 4) {
        this.tempSizeY = 4
      }
    },
    saveTile () {
      this.customizing = false
      this.tempSizeX = null
      this.tempSizeY = null
      this.tile.isNew = false
    }
  },
  computed: {
    isHighlighted () {
      return this.tile.data.title
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    },
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
          (this.tempSizeX || this.tile.sizeX) * 90 +
          ((this.tempSizeX || this.tile.sizeX) - 2) * 5 +
          this.drag.offsetX * 95 * this.resize +
          'px',
        height:
          (this.tempSizeY || this.tile.sizeY) * 90 +
          ((this.tempSizeY || this.tile.sizeY) - 2) * 5 +
          this.drag.offsetY * 95 * this.resize +
          'px'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.customizing {
  z-index: 1;
  cursor: default !important;
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.15);
}

.flex{
  display: flex
}

.grid-item {
  cursor: pointer;
  transition: all 0.1s;
  user-select: none;
  position: absolute;
  background-color: #fff;
}
.grid-item.is-dark {
  opacity: 0.25;
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
.grid-item .control-icon {
  position: absolute;
  padding: 3px 4px;
  padding-bottom: 6px;
  cursor: pointer;
  display: none;
  top: 0;
  right: 0;
}
.grid-item .customize {
  right: 25px;
}
.grid-item .customize:hover {
  background-color: #2196f3;
}
.grid-item .trash:hover {
  background-color: #e64a19;
}
.grid-item .check.control-icon {
  background-color: #4caf50;
}

.grid-item .check.control-icon .material-design-icon {
  color: #fff;
}

.grid-item .check:hover {
  background-color: #009688;
}
.grid-item .control-icon:hover .material-design-icon {
  color: #fff;
}
.grid-item.edit-mode .holder,
.grid-item.edit-mode .control-icon {
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.tile-type {
  outline: none;
  margin: 3px 10px;
  font-size: 0.65em;
  color: rgba(90, 90, 90, 0.5);
}
.tile-name-input {
  outline: none;
  margin: 10px 0 0 10px;
  font-size: 0.8em;
  width: calc(100% - 45px);
  border: none;
  border-bottom: 1px solid black;
}

input:active,
input:focus {
  outline: none;
}
.tile-content {
  padding: 10px;
  height: calc(100% - 30px);
    overflow: hidden;
}
.tile-content .tile-text-big {
  margin: 10px 0 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1.2em;
}
.tile-content .tile-text {
  margin: 0;
  text-overflow: ellipsis;
  font-size: 0.9em;
}
.tile-content .tile-text-big:first-child {
  margin: 0;
}

.tile-content .tile-text-small {
  outline: none;
  margin: 0;
  font-size: 0.65em;
  color: rgba(90, 90, 90, 0.5);
}

.tile-content .tile-text-small.tile-text-type{
  margin: 2px 0 8px 0;
}
.tile-content .tile-text-small.tile-text-url{
  position: absolute;
    bottom: 10px;
    left: 10px;
    width: calc(100% - 20px);
    background-color: #fff;

     text-overflow: ellipsis;
    overflow: hidden;
}

.tile-content .tile-text-big-description{
  word-wrap: break-word;
}

.tile-content input{
  margin-bottom: 15px;
}
.tile-content .text-input {
  outline: none;
  width: 100%;
  border: none;
  font-size: 1em;
  border-bottom: 1px solid black;
}
.tile-content .text-input-label {
  outline: none;
  margin: 0;
  font-size: 0.65em;
  color: rgba(90, 90, 90, 0.5);
}
.tile-content .checkbox-input {
  height: 16px;
  margin-left:1px;
}

.tile-content textarea{
     max-width: 100%;
     min-width: 100%;
}

.tile-content .tile-text-small.tile-text-url p{
  display: inline-block;
  margin:0;
}
.tile-content .health-circle{
    background-color: #4caf50;
    font-size: 16px;
    display: inline-block;
    margin: 0;
    margin-left: 5px;
    height: 8px;
    width: 8px;
    border-radius: 4px;
}

</style>
