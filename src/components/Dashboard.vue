<template>
  <div class="dashboard">
    <Sidebar/>
    <Navbar @toggleEdit="editMode = !editMode" :editMode="editMode" @submitEditing="submitEditing" />
    <Grid :tiles="tiles" :editMode="editMode" @setPosition="setPosition" @setSize="setSize" @removeTile="removeTile"/>
    <tile-picker :editMode="editMode" @newTile="newTile"  />
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import TilePicker from './TilePicker'
import Grid from './Grid'

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Navbar,
    Grid,
    TilePicker
  },
  data () {
    return {
      editMode: false,
      tiles: []
    }
  },
  methods: {
    readTiles () {
      this.axios.get('http://127.0.0.1:3000/tiles')
        .then(result => {
          this.tiles = result.data
        })
    },
    submitEditing(){
      this.axios.post('http://127.0.0.1:3000/tiles', {
        tiles: this.tiles
      })
      .then(result => {
          this.editMode = false
        })
    },
    setSize (tile, e) {
      if (this.checkOverlaps(tile, e)) {
        if (tile.sizeX + e.x < 1) {
          tile.sizeX = 1
        } else {
          tile.sizeX += e.x
        }
        if (tile.sizeY + e.y < 1) {
          tile.sizeY = 1
        } else {
          tile.sizeY += e.y
        }
      }
    },
    setPosition (tile, e) {
      if (this.checkOverlaps(tile, e)) {
        tile.positionX += e.x
        tile.positionY += e.y
      }
    },
    checkOverlaps (tile, e) {
      let flag = true
      if (e == null) {
        this.tiles.forEach(t => {
          let a = {
            x1: tile.positionX,
            y1: tile.positionY,
            x2: tile.positionX + tile.sizeX,
            y2: tile.positionY + tile.sizeY
          }
          let b = {
            x1: t.positionX,
            y1: t.positionY,
            x2: t.positionX + t.sizeX,
            y2: t.positionY + t.sizeY
          }
          flag =
                flag &&
                (a.x1 >= b.x2 || a.x2 <= b.x1 || b.y2 <= a.y1 || a.y2 <= b.y1)
          if (flag === true) {
            return flag
          }
        })
      } else if (e.event === 'setPosition') {
        if (tile.positionX + e.x < 0 || tile.positionY + e.y < 0) {
          flag = false
        } else {
          this.tiles.forEach(t => {
            if (t !== tile) {
              let a = {
                x1: tile.positionX + e.x,
                y1: tile.positionY + e.y,
                x2: tile.positionX + e.x + tile.sizeX,
                y2: tile.positionY + e.y + tile.sizeY
              }
              let b = {
                x1: t.positionX,
                y1: t.positionY,
                x2: t.positionX + t.sizeX,
                y2: t.positionY + t.sizeY
              }
              flag =
                flag &&
                (a.x1 >= b.x2 || a.x2 <= b.x1 || b.y2 <= a.y1 || a.y2 <= b.y1)
            }
          })
        }
      } else if (e.event === 'setSize') {
        this.tiles.forEach(t => {
          if (t !== tile) {
            let a = {
              x1: tile.positionX,
              y1: tile.positionY,
              x2: tile.positionX + e.x + tile.sizeX,
              y2: tile.positionY + e.y + tile.sizeY
            }
            let b = {
              x1: t.positionX,
              y1: t.positionY,
              x2: t.positionX + t.sizeX,
              y2: t.positionY + t.sizeY
            }
            flag =
              flag &&
              (a.x1 >= b.x2 || a.x2 <= b.x1 || b.y2 <= a.y1 || a.y2 <= b.y1)
          }
        })
      }
      return flag
    },
    newTile () {
      let newTile = {
        id: 12327,
        positionX: 0,
        positionY: 0,
        sizeX: 2,
        sizeY: 1
      }
      let inserted = false
      while (!inserted) {
        if (this.checkOverlaps(newTile)) {
          this.tiles.push(newTile)
          inserted = true
        } else {
          newTile.positionX += 1
          newTile.positionY += 1
        }
      }
    },
    removeTile (tile) {
      this.axios.delete('http://127.0.0.1:3000/tiles/' + tile.id)
      .then(responce => {
        this.tiles = this.tiles.filter(t => {
          return t !== tile
        })
      })
      .catch(e => {
        console.log('error', e)
      })
    }
  },
  mounted () {
    this.readTiles()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>