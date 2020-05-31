<template>
  <div class="home">
    <header>
      <van-nav-bar title="疏散与救援系统" />
    </header>
    <main class="main">
      <div id="bcid" v-show="!show"></div>
      <div ref="map" class="map"></div>
    </main>
    <footer>
      <van-tabbar active-color="#7d7e80">
        <van-tabbar-item icon="scan" @click="startScan()">扫码</van-tabbar-item>
        <van-tabbar-item icon="flag-o" @click="handleEvacuate()">疏散</van-tabbar-item>
        <van-tabbar-item icon="phone-o" @click="handleHelp()">求救</van-tabbar-item>
      </van-tabbar>
    </footer>
  </div>
</template>

<script>
/* global map esmap scan plus */
import { fetchExitList } from '@/api/exit'
import { fetchMonitorList } from '@/api/monitor'
import { Tabbar, TabbarItem, NavBar, Button, Notify, Dialog, Toast } from 'vant'
import socketio from 'socket.io-client'
import { mapGetters } from 'vuex'
const io = socketio('http://evacuate.izhaoo.com:7001')
export default {
  name: 'home',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast
  },
  data () {
    return {
      exitList: [],
      monitorList: [],
      pos: {
        // x: 12683472.584141199,
        // y: 2557882.1506295786,
        // floor: 2
        x: null,
        y: null,
        floor: null
      },
      show: true,
      isScan: false,
      watch: {
        lng: '',
        lat: '',
        speed: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted () {
    this.initMap()
    this.getMonitorList()
    this.getExitList()
  },
  methods: {
    initScan () {
      if (!window.plus) return
      window.scan = new plus.barcode.Barcode('bcid')
      scan.onmarked = (type, result, file) => {
        switch (type) {
          case plus.barcode.QR:
            type = 'QR'
            break
          case plus.barcode.EAN13:
            type = 'EAN13'
            break
          case plus.barcode.EAN8:
            type = 'EAN8'
            break
          default:
            type = '其它' + type
            break
        }
        result = JSON.parse(result)
        this.pos = {
          x: result.x,
          y: result.y,
          floor: result.floor
        }
        const layer = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER)
        const user = new esmap.ESImageMarker({
          x: result.x,
          y: result.y,
          url: 'image/user.png',
          size: 64,
          spritify: true,
          height: 0,
          showLevel: 20,
          seeThrough: true,
          name: 'user'
        })
        layer.remove(user)
        layer.addMarker(user)
        map.getFloor(result.floor).addLayer(layer)
        Notify({ type: 'success', message: '用户定位成功' })
        scan.cancel()
        scan.close()
        this.show = true
      }
    },
    startScan () {
      if (!window.plus) return
      this.initScan()
      this.show = false
      this.isScan = true
      scan.start()
    },
    stopScan () {
      this.isScan = false
      this.show = false
      scan.cancel()
      scan.close()
    },
    handleHelp () {
      Dialog.confirm({
        title: '求救',
        message: '是否发起求救？'
      }).then(() => {
        if (!(this.pos.x && this.pos.y && this.pos.floor)) {
          Notify({ type: 'danger', message: '请先扫码定位后再进行求救' })
        }
        if (!window.plus) return
        let lastPos = {
          lat: '',
          lng: ''
        }
        setInterval(() => {
          plus.geolocation.getCurrentPosition((p) => {
            this.watch.lat = p.coords.latitude
            this.watch.lng = p.coords.longitude
            // eslint-disable-next-line
            this.watch.speed = (AMap.GeometryUtil.distance([lastPos.lng, lastPos.lat], [this.watch.lng, this.watch.lat]) / 5).toFixed(3)
            lastPos.lng = this.watch.lng
            lastPos.lat = this.watch.lat
          })
          io.emit('postHelp', this.token, this.pos, this.watch.speed, new Date())
        }, 2000)
        Toast.success('求助成功')
      }).catch(() => {
        Toast.fail('取消求助')
      })
    },
    handleEvacuate () {
      if (!(this.pos.x && this.pos.y && this.pos.floor)) {
        Notify({ type: 'danger', message: '请先扫码定位后再进行疏散' })
        return
      }
      const navi = new esmap.ESNavigation({
        map: map,
        locationMarkerUrl: 'image/pointer.png',
        locationMarkerSize: 150,
        speed: 5,
        followAngle: true,
        followPosition: true,
        followGap: 3,
        tiltAngle: 30,
        audioPlay: true,
        offsetHeight: 1,
        ladderType: 1,
        lineStyle: {
          color: '#33cc61',
          lineType: esmap.ESLineType.ESARROW,
          lineWidth: 6,
          offsetHeight: 0.5,
          smooth: true,
          seeThrough: false,
          noAnimate: false
        }
      })
      navi.setStartPoint({
        x: this.pos.x,
        y: this.pos.y,
        fnum: this.pos.floor,
        url: 'image/start.png',
        size: 64
      })
      let min = {
        len: Infinity,
        exit: null
      }
      this.exitList.map((item, index) => {
        navi.setEndPoint({
          x: item.x,
          y: item.y,
          fnum: item.floor,
          url: 'image/end.png',
          size: 64
        })
        let len = 0
        navi.outcome.result.map(i => {
          len = len + i.length
        })
        if (len < min.len) {
          min.len = len
          min.exit = item
        }
      })
      navi.setEndPoint({
        x: min.exit.x,
        y: min.exit.y,
        fnum: min.exit.floor,
        url: 'image/end.png',
        size: 64
      })
      navi.drawNaviLine()
      let message = ''
      for (let i of navi.naviDescriptions) {
        message += ('\n' + i)
      }
      Dialog.alert({
        title: '提示',
        message: message
      }).then(() => {
      })
    },
    getExitList () {
      fetchExitList().then(res => {
        this.exitList = res.data
      })
    },
    getMonitorList () {
      fetchMonitorList().then(res => {
        this.monitorList = res.data
      })
    },
    initMap () {
      window.map = new esmap.ESMap({
        container: this.$refs.map,
        mapDataSrc: './data',
        mapThemeSrc: './data/theme',
        visibleFloors: [1, 2, 3],
        token: 'escope',
        viewModeAnimateMode: true,
        moveToAnimateMode: true,
        defaultScaleLevel: 12
      })
      map.openMapById('zhaoo')
      map.showCompass = true
      map.showScaler = false
      map.on('loadComplete', () => {
      // eslint-disable-next-line
      const toolControl = new esmap.ESToolControl(map, new esmap.ESControlOptions({
          position: 3,
          offset: {
            x: 0,
            y: 0
          }
        }))
        // eslint-disable-next-line
        const zoomControl = new esmap.ESZoomControl(map, new esmap.ESControlOptions({
          position: 3,
          offset: {
            x: 0,
            y: 400
          }
        }))
        const layer = new Array(4)
        for (let i = 1; i <= 3; i++) {
          layer[i] = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER)
        }
        this.exitList.map((item, index) => {
          if (item.x && item.y && item.floor) {
            const exit = new esmap.ESImageMarker({
              url: 'image/exit.png',
              x: item.x,
              y: item.y,
              size: 48,
              spritify: true,
              height: 1,
              showLevel: 20,
              seeThrough: true,
              id: 2017,
              name: 'marker'
            })
            layer[item.floor].addMarker(exit)
          }
        })
        this.monitorList.map((item, index) => {
          if (item.x && item.y && item.floor) {
            if (item.temperature > 250) {
              const monitor = new esmap.ESImageMarker({
                url: 'image/fire.png',
                x: item.x,
                y: item.y,
                size: 48,
                spritify: true,
                height: 1,
                showLevel: 20,
                seeThrough: true,
                id: 2017,
                name: 'marker'
              })
              layer[item.floor].addMarker(monitor)
            }
          }
        })
        for (let i = 1; i <= 3; i++) {
          map.getFloor(i).addLayer(layer[i])
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.home {
  width: 100vw;
  height: 100vh;
  .main {
    width: 100%;
    height: calc(100vh - 46px - 50px);
    position: relative;
    overflow: hidden;
    #bcid {
      width: 100%;
      height: calc(100vh - 50px);
    }
    .map {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
