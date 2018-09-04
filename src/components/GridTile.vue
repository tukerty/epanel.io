<template>
  <div class="grid-item" :style="position" :class="{'edit-mode': editMode, 'customizing': customizing, 'link-tile':tile.data.type == 'Link', 'is-dark':!isHighlighted && !editMode}" @mousedown="startMove">
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
    <p class="tile-name" v-if="!customizing">{{tile.data.title}}</p>
    <input class="tile-name-input" placeholder="Title" v-model="titleInput" v-else />
    <p class="tile-type">{{tile.data.type}}</p>
    <div class="tile-content link">
      <p class="link-text" v-if="!customizing">{{tile.data.url}}</p>
      <div v-else>
      <input class="link-text-input" placeholder="Url" v-model="tile.data.url" />
      </div>
    </div>
  </div>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'

export default {
  name: 'GridTile',
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
      tempSizeX:null,
      tempSizeY:null,
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
    editMode (){
      if (this.tile.isNew && this.editMode == true){
      this.customizeTile ()
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
    if (this.tile.isNew && this.editMode){
      this.customizeTile ()
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
      }
      else if (!this.customizing && e.button === 0){
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
      }
      else if (!this.customizing && e.button === 0){
       this.goToLink()
      }
    },
    goToLink(){
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
      this.titleInput = this.tile.data.title
      this.typeInput = this.tile.data.type
      if (this.tile.sizeX < 3){
        this.tempSizeX = 3
      }
      if (this.tile.sizeY < 2){
        this.tempSizeY = 3
      }
    },
    saveTile() {
      this.customizing = false
      this.tile.data.title = this.titleInput
      this.tile.data.type = this.typeInput
      this.tempSizeX = null
      this.tempSizeY = null
      this.tile.isNew = false
    } 
    
  },
  computed: {
    isHighlighted() {
      return this.tile.data.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    },
    position () {
      return {
        left: this.tile.positionX * 90 +
          this.tile.positionX * 5 +
          this.drag.offsetX * 95 * !this.resize +
          'px',
        top:
          this.tile.positionY * 90 +
          this.tile.positionY * 5 +
          this.drag.offsetY * 95 * !this.resize +
          'px',
        width: (this.tempSizeX ||
          this.tile.sizeX) * 90 +
          ((this.tempSizeX || this.tile.sizeX) - 2) * 5 +
          this.drag.offsetX   * 95 * this.resize +
          'px',
        height: (this.tempSizeY ||
          this.tile.sizeY) * 90 +
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
.customizing{
  z-index: 1;
  cursor:default!important;
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.15)
}

.link-tile{
  cursor:pointer;
}
.grid-item {
  transition: all 0.1s;
  user-select: none;
  position: absolute;
  background-color: #fff;
}
.grid-item.is-dark{
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
.grid-item .customize{
  right: 25px;
}
.grid-item .customize:hover {
  background-color: #2196F3;
}
.grid-item .trash:hover {
  background-color: #e64a19;
}
.grid-item  .check.control-icon {
  background-color: #4CAF50;
}

.grid-item  .check.control-icon  .material-design-icon{
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
}
.tile-type {
  outline: none;
  margin: 3px 10px;
  font-size: 0.65em;
  color: rgba(90, 90, 90, 0.5);
}
.tile-name-input{
outline: none;
  margin: 10px 0 0 10px;
  font-size: 0.8em;
  width: calc(100% - 45px);
  border: none;
  border-bottom: 1px solid black;
}

input:active, input:focus{
outline: none;
}
.tile-content{
  padding: 10px;    
}
.tile-content.link .link-text{
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.tile-content.link .link-text-input{
  outline: none;
  width: 100%;
  border: none;
  font-size: 1em;
  border-bottom: 1px solid black;
}
</style>
