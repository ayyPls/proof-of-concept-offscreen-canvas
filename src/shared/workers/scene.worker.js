import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import { SceneWorkerActionType } from './const'

self.document = {}

let renderer, scene, camera, mesh

self.onmessage = function ({ data }) {
  const { type, payload } = data
  switch(type) {
    // TODO: pass data from cache/storage to render models on init
    case SceneWorkerActionType.INIT_SCENE: {
      const { offscreenCanvas } = payload
      initScene(offscreenCanvas)
      break
    }
    case SceneWorkerActionType.RESIZE: {
      const { width, height } = payload
      resize(width, height)
      break
    }
    case SceneWorkerActionType.CAMERA_UPDATE: {
      handleCameraUpdateEvent(payload)
      break
    }
    default: throw new Error(`Unknown worker action type: ${type}`)
  }
}

self.onmessageerror = function (event) {
  console.error(event)
}

function handleCameraUpdateEvent(cameraState){
    // console.log('HANDLE ORBIT CONTROLS EVENT CAPTURED', camera, event)
    if (camera instanceof PerspectiveCamera) {
      camera.position.fromArray(cameraState.position)
      camera.quaternion.fromArray(cameraState.quaternion)
      camera.zoom = cameraState.zoom
      camera.updateProjectionMatrix()
      render()
    }
    else console.warn('SceneWorker: camera is not defined')
    // switch(event.type) {
    //   case SceneWorkerOrbitControlsEventType.WHEEL: {
    //     console.log(event, 'WHEEL EVENT CAPTURED')
    //     controls.dispatchEvent(event.payload)
    //     break
    //   }
    //   default: throw new Error(`Unknown OrbitControls event type: ${event.type}`)
    // }
}

function initScene(canvas) {
  renderer = new WebGLRenderer({ canvas, antialias: false })
  renderer.setSize(canvas.width, canvas.height, false)
  scene = new Scene()
  camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
  camera.position.z = 5
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0x00ff00 })
  mesh = new Mesh(geometry, material)
  scene.add(mesh)
  render()
}


function resize(width, height) {
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
  render()
}

function render() {
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}