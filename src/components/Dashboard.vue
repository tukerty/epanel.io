<template>
  <div class="dashboard">
    <Sidebar/>
    <Navbar @toggleEdit="editMode = !editMode" :editMode="editMode" @searchInput="data => searchQuery = data" @submitEditing="submitEditing" />
    <Grid :searchQuery="searchQuery" :tiles="tiles" :editMode="editMode" @setPosition="setPosition" @setSize="setSize" @removeTile="removeTile" />
    <tile-picker :editMode="editMode" @newTile="data => newTile(data)" />
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import TilePicker from "./TilePicker";
import Grid from "./Grid";
import shortid from "shortid";

export default {
  name: "Dashboard",
  components: {
    Sidebar,
    Navbar,
    Grid,
    TilePicker
  },
  data() {
    return {
      editMode: false,
      tiles: [],
      searchQuery: ""
    };
  },
  methods: {
    readEnvs() {
      this.axios.get(process.env.ROOT_API + "/envs").then(result => {
        this.tiles = result.data || [];
      });
    },
    readTiles() {
      this.axios.get(process.env.ROOT_API + "/tiles").then(result => {
        this.tiles = result.data || [];
      });
    },
    submitEditing() {
      this.axios
        .post(process.env.ROOT_API + "/tiles", {
          tiles: this.tiles
        })
        .then(result => {
          this.editMode = false;
          this.$socket.emit("tiles_changed");
        });
    },
    setSize(tile, e) {
      if (this.checkOverlaps(tile, e)) {
        if (tile.sizeX + e.x < 1) {
          tile.sizeX = 1;
        } else {
          tile.sizeX += e.x;
        }
        if (tile.sizeY + e.y < 1) {
          tile.sizeY = 1;
        } else {
          tile.sizeY += e.y;
        }
      }
    },
    setPosition(tile, e) {
      if (this.checkOverlaps(tile, e)) {
        tile.positionX += e.x;
        tile.positionY += e.y;
      }
    },
    checkOverlaps(tile, e) {
      let flag = true;
      if (e == null) {
        this.tiles.forEach(t => {
          let a = {
            x1: tile.positionX,
            y1: tile.positionY,
            x2: tile.positionX + tile.sizeX,
            y2: tile.positionY + tile.sizeY
          };
          let b = {
            x1: t.positionX,
            y1: t.positionY,
            x2: t.positionX + t.sizeX,
            y2: t.positionY + t.sizeY
          };
          flag =
            flag &&
            (a.x1 >= b.x2 || a.x2 <= b.x1 || b.y2 <= a.y1 || a.y2 <= b.y1);
        });
      } else if (e.event === "setPosition") {
        if (tile.positionX + e.x < 0 || tile.positionY + e.y < 0) {
          flag = false;
        } else {
          this.tiles.forEach(t => {
            if (t !== tile) {
              let a = {
                x1: tile.positionX + e.x,
                y1: tile.positionY + e.y,
                x2: tile.positionX + e.x + tile.sizeX,
                y2: tile.positionY + e.y + tile.sizeY
              };
              let b = {
                x1: t.positionX,
                y1: t.positionY,
                x2: t.positionX + t.sizeX,
                y2: t.positionY + t.sizeY
              };
              flag =
                flag &&
                (a.x1 >= b.x2 || a.x2 <= b.x1 || b.y2 <= a.y1 || a.y2 <= b.y1);
            }
          });
        }
      } else if (e.event === "setSize") {
        this.tiles.forEach(t => {
          if (t !== tile) {
            let a = {
              x1: tile.positionX,
              y1: tile.positionY,
              x2: tile.positionX + e.x + tile.sizeX,
              y2: tile.positionY + e.y + tile.sizeY
            };
            let b = {
              x1: t.positionX,
              y1: t.positionY,
              x2: t.positionX + t.sizeX,
              y2: t.positionY + t.sizeY
            };
            flag =
              flag &&
              (a.x1 >= b.x2 || a.x2 <= b.x1 || b.y2 <= a.y1 || a.y2 <= b.y1);
          }
        });
      }
      return flag;
    },
    newTile(type) {
      let newTile = {
        id: shortid.generate(),
        positionX: 0,
        positionY: 0,
        isNew: true,
        isHighlighted: true
      };
      switch (type) {
        case "link":
          newTile["sizeX"] = 2;
          newTile["sizeY"] = 1;
          newTile["type"] = "link";
          newTile["data"] = {
            title: "",
            url: "",
            healthcheck: false,
            description: ""
          };
          break;
        case "ssh-command":
          newTile["sizeX"] = 1;
          newTile["sizeY"] = 1;
          newTile["type"] = "ssh-command";
          newTile["data"] = {
            title: "",
            url: "",
            username: "",
            password: "",
            command: "",
            description: ""
          };
          break;
        case "ping":
          newTile["sizeX"] = 3;
          newTile["sizeY"] = 2;
          newTile["type"] = "ping";
          newTile["data"] = {
            title: "",
            url: "",
            timings: []
          };
          break;
        default:
          return false;
          break;
      }
      let inserted = false;
      let i = 0;
      while (!inserted && i < 100) {
        for (let j = i; j >= 0; j--) {
          if (!inserted) {
            console.log(j, i - j);
            if (this.checkOverlaps(newTile)) {
              this.tiles.push(newTile);
              inserted = true;
            } else {
              newTile.positionX = j;
              newTile.positionY = i - j;
            }
          }
        }
        i += 1;
      }
    },
    removeTile(tile) {
      this.tiles = this.tiles.filter(t => {
        return t !== tile;
      });
    }
  },
  mounted() {
    this.readTiles();
    this.$options.sockets.tiles_changed_event = data => {
      this.readTiles();
    };
  },
  computed: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
