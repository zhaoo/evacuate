<template>
  <div class="container">
    <div ref="map" class="map" />
    <div class="tools-bar">
      <Button class="tool-btn" @click="ifCreateExit?ifCreateExit=false:showExit=true">{{ifCreateExit?'取消添加出口':'出口'}}</Button>
      <Button class="tool-btn" @click="showMonitor=true">观测点</Button>
      <Button class="tool-btn" @click="showHelp=true">求救用户</Button>
      <Button class="tool-btn" @click="handleQrcode">二维码</Button>
    </div>
    <Modal v-model="showExit">
      <div class="btn-group">
        <Button color="blue" @click="handleCreateExit">添加</Button>
      </div>
      <Table :datas="exitList">
        <TableItem :width="200" prop="x" title="X轴" align="center"></TableItem>
        <TableItem :width="200" prop="y" title="Y轴" align="center"></TableItem>
        <TableItem :width="200" prop="floor" title="楼层" align="center"></TableItem>
        <TableItem :width="200" prop="key" title="编码" align="center"></TableItem>
        <TableItem :width="200" prop="note" title="备注" align="center"></TableItem>
        <TableItem title="操作" :width="100" align="center">
          <template slot-scope="{data}">
            <button class="h-btn h-btn-s h-btn-blue" @click="handleEditExit(data)"><i class="h-icon-edit"></i></button>
            <Poptip content="确认删除?" @confirm="handleDeleteExit(data)"><button class="h-btn h-btn-s h-btn-red" style="margin-left:5px;"><i class="h-icon-trash"></i></button></Poptip>
          </template>
        </TableItem>
      </Table>
    </Modal>
    <Modal v-model="showHelp">
      <Table :datas="helpList">
        <TableItem :width="100" prop="speed" title="速度" align="center"></TableItem>
        <TableItem :width="200" prop="date" title="时间" align="center"></TableItem>
        <TableItem :width="300" prop="token" title="用户标识" align="center"></TableItem>
        <TableItem :width="200" prop="x" title="X轴" align="center"></TableItem>
        <TableItem :width="200" prop="y" title="Y轴" align="center"></TableItem>
        <TableItem :width="100" prop="floor" title="楼层" align="center"></TableItem>
         <TableItem title="操作" :width="150" align="center">
          <template slot-scope="{data}">
            <button class="h-btn h-btn-s h-btn-blue" @click="handleEvacuate(data)"><i class="h-icon-location"></i></button>
          </template>
        </TableItem>
      </Table>
    </Modal>
    <Modal v-model="showExitEdit">
      <Form ref="exitForm" :labelWidth="110" :model="exit">
        <FormItem label="X轴">
          <input v-model="exit.temperature">
        </FormItem>
        <FormItem label="Y轴">
          <input v-model="exit.x">
        </FormItem>
        <FormItem label="楼层">
          <input v-model="exit.floor">
        </FormItem>
        <FormItem label="编码">
          <input v-model="exit.key">
        </FormItem>
        <FormItem label="备注">
          <input v-model="exit.note">
        </FormItem>
        <FormItem>
          <Button color="primary" @click="doEditExit">提交</Button>
        </FormItem>
      </Form>
    </Modal>
     <Modal v-model="showMonitor">
      <div class="btn-group">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      </div>
      <Table :datas="monitorList">
        <TableItem :width="100" prop="temperature" title="温度" align="center"></TableItem>
        <TableItem :width="200" prop="x" title="X轴" align="center"></TableItem>
        <TableItem :width="200" prop="y" title="Y轴" align="center"></TableItem>
        <TableItem :width="100" prop="floor" title="楼层" align="center"></TableItem>
        <TableItem :width="100" prop="key" title="编码" align="center"></TableItem>
        <TableItem :width="200" prop="note" title="备注" align="center"></TableItem>
        <TableItem title="操作" :width="200" align="center">
          <template slot-scope="{data}">
            <button class="h-btn h-btn-s h-btn-blue" @click="handleShowPicture(data)"><i class="h-icon-search"></i></button>
            <button class="h-btn h-btn-s h-btn-primary" @click="handleBindMonitor(data)"><i class="h-icon-link"></i></button>
            <button class="h-btn h-btn-s h-btn-yellow" @click="handleEditMonitor(data)"><i class="h-icon-edit"></i></button>
            <Poptip content="确认删除?" @confirm="handleDeleteMonitor(data)"><button class="h-btn h-btn-s h-btn-red" style="margin-left:5px;"><i class="h-icon-trash"></i></button></Poptip>
          </template>
        </TableItem>
      </Table>
    </Modal>
    <Modal v-model="showMonitorEdit">
      <Form ref="monitorForm" :labelWidth="110" :model="monitor">
        <FormItem label="温度">
          <input v-model="monitor.x">
        </FormItem>
        <FormItem label="X轴">
          <input v-model="monitor.x">
        </FormItem>
        <FormItem label="Y轴">
          <input v-model="monitor.x">
        </FormItem>
        <FormItem label="楼层">
          <input v-model="monitor.floor">
        </FormItem>
        <FormItem label="编码">
          <input v-model="monitor.key">
        </FormItem>
        <FormItem label="备注">
          <input v-model="monitor.note">
        </FormItem>
        <FormItem label="图片">
          <qiniu :options="options" type="image" data-type="url" v-model="monitor.picture"></qiniu>
        </FormItem>
        <FormItem>
          <Button color="primary" @click="doEditMonitor">提交</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showQrcode">
      <qrcode v-if="qrcodeVal" :value="qrcodeVal" :options="{ size: 200 }" />
    </Modal>
  </div>
</template>

<script>
/* global map esmap */
import { fetchExitList, createExit, deleteExit, editExit } from '@/api/exit'
import { fetchMonitorList, deleteMonitor, editMonitor, uploadMonitor } from '@/api/monitor'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import qiniu from '@/components/qiniu/index.vue'
import QRcode from '@xkeshi/vue-qrcode'
import socketio from 'socket.io-client'
const io = socketio('http://evacuate.izhaoo.com:7001')
export default {
  name: 'home',
  components: { qrcode: QRcode, UploadExcelComponent, qiniu },
  data () {
    return {
      showExit: false,
      showMonitor: false,
      ifCreateExit: false,
      ifBindMonitor: false,
      exitList: [],
      monitorList: [],
      showExitEdit: false,
      showMonitorEdit: false,
      showQrcode: false,
      showHelp: false,
      qrcodeVal: null,
      helpList: [],
      exit: {
        x: '',
        y: '',
        key: '',
        note: ''
      },
      monitor: {
        x: '',
        y: '',
        key: '',
        note: '',
        temperature: '',
        picture: ''
      },
      options: {
        max_file_size: '1mb',
        filters: {
          mime_types: [
            { title: 'Image files', extensions: 'jpg,gif,png' }
          ]
        }
      }
    }
  },
  created () {
    this.getExitList()
    this.getMonitorList()
  },
  mounted () {
    this.initMap()
    this.getHelp()
  },
  methods: {
    handleShowPicture (data) {
      this.$ImagePreview(data.picture)
    },
    handleEvacuate (data) {
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
        x: data.x,
        y: data.y,
        fnum: data.floor,
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
    },
    getHelp () {
      io.on('getHelp', msg => {
        let flag = false
        for (const i of this.helpList) {
          if (msg[0] === i.token) {
            this.helpList.splice(this.helpList.indexOf(i), 1)
            flag = true
          }
        }
        if (flag === false) {
          this.$Notice['warn'](`用户发送求救信息，已在地图上标注。`)
        }
        this.helpList.push({
          token: msg[0],
          x: msg[1].x,
          y: msg[1].y,
          floor: msg[1].floor,
          speed: msg[2],
          date: msg[3]
        })
        this.renderUser()
      })
    },
    renderUser () {
      const layer = new Array(4)
      for (let i = 1; i <= 3; i++) {
        layer[i] = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER)
      }
      this.helpList.map((item, index) => {
        if (item.x && item.y && item.floor) {
          const user = new esmap.ESImageMarker({
            url: 'image/user.png',
            x: item.x,
            y: item.y,
            size: 48,
            spritify: true,
            height: 1,
            showLevel: 20,
            seeThrough: true,
            name: 'user'
          })
          layer[item.floor].addMarker(user)
        }
      })
      for (let i = 1; i <= 3; i++) {
        map.getFloor(i).addLayer(layer[i])
      }
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
        defaultScaleLevel: 10
      })
      map.openMapById('zhaoo')
      map.showCompass = false
      map.showScaler = false
      map.on('loadComplete', () => {
        // eslint-disable-next-line
        const toolControl = new esmap.ESToolControl(map, new esmap.ESControlOptions({
          position: 3,
          offset: {
            x: 0,
            y: 110
          }
        }))
        // eslint-disable-next-line
        const zoomControl = new esmap.ESZoomControl(map, new esmap.ESControlOptions({
          position: 3,
          offset: {
            x: 0,
            y: 0
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
              name: 'exit'
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
                name: 'monitor'
              })
              layer[item.floor].addMarker(monitor)
            } else {
              const monitor = new esmap.ESImageMarker({
                url: 'image/monitor.png',
                x: item.x,
                y: item.y,
                size: 48,
                spritify: true,
                height: 1,
                showLevel: 20,
                seeThrough: true,
                name: 'monitor'
              })
              layer[item.floor].addMarker(monitor)
            }
          }
        })
        for (let i = 1; i <= 3; i++) {
          map.getFloor(i).addLayer(layer[i])
        }
      })
    },
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$Message({
        type: 'warn',
        text: '请上传小于1MB的文件'
      })
      return false
    },
    handleSuccess ({ results, header }) {
      const list = results.pop()
      for (const item in list) {
        this.monitor = { key: item, temperature: list[item] }
        this.monitorList.unshift(this.monitor)
      }
      uploadMonitor(list).then(() => {
        this.$Message({
          type: 'success',
          text: '上传成功'
        })
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
    handleCreateExit () {
      this.ifCreateExit = true
      this.showExit = false
      this.$Message({
        type: 'info',
        text: '选择地图点添加出口，点击左上角取消选点。'
      })
      map.on('mapClickNode', event => {
        if (event.hitCoord && this.ifCreateExit === true) {
          createExit({ x: event.hitCoord.x, y: event.hitCoord.y, floor: event.FloorNum || event.floor }).then(res => {
            this.$Notice['success'](res.message || 'Success')
          })
        }
      })
    },
    handleDeleteExit (data) {
      deleteExit(data._id).then(res => {
        this.exitList.splice(this.exitList.indexOf(data), 1)
        this.$Notice['success'](res.message || 'Success')
      })
    },
    handleDeleteMonitor (data) {
      deleteMonitor(data._id).then(res => {
        this.monitorList.splice(this.monitorList.indexOf(data), 1)
        this.$Notice['success'](res.message || 'Success')
      })
    },
    handleEditExit (data) {
      this.exit = data
      this.showExitEdit = true
    },
    handleEditMonitor (data) {
      this.monitor = data
      this.showMonitorEdit = true
    },
    handleBindMonitor (data) {
      this.showMonitor = false
      this.ifBindMonitor = true
      this.$Message({
        type: 'info',
        text: '选择地图点绑定观测点。'
      })
      map.on('mapClickNode', event => {
        if (event.hitCoord && this.ifBindMonitor === true) {
          editMonitor({ ...data, x: event.hitCoord.x, y: event.hitCoord.y, floor: event.FloorNum || event.floor }).then(res => {
            this.$Notice['success'](res.message || 'Success')
            this.ifBindMonitor = false
          })
        }
      })
    },
    doEditExit () {
      editExit(this.exit).then(res => {
        this.$Notice['success'](res.message || 'Success')
      })
    },
    doEditMonitor () {
      editMonitor(this.monitor).then(res => {
        this.$Notice['success'](res.message || 'Success')
      })
    },
    handleQrcode () {
      this.$Message({
        type: 'info',
        text: '选择地图选点'
      })
      map.on('mapClickNode', event => {
        this.qrcodeVal = JSON.stringify({
          x: event.hitCoord.x, y: event.hitCoord.y, floor: event.FloorNum || event.floor
        })
        this.showQrcode = true
      })
    }
  }
}
</script>

<style lang="less">
.btn-group {
  margin-bottom: 10px;
}
</style>

<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  .map {
    height: 100%;
    width: 100%;
  }
  .tools-bar {
    position: absolute;
    top: 10px;
    left: 10px;
    .tool-btn,
    .tool-btn:hover {
      border: none;
      color: #333;
    }
  }
}
</style>
