import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import FictionalElementManager from '../proxy/FictionalElementManager'
import FictionalWindow from '../proxy/FictionalWindow'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

self.document = {}

self.window = new FictionalWindow()

const elementManager = new FictionalElementManager()

const SceneWorkerActionType = {
  INIT_SCENE: 'init',
  RESIZE: 'resize',
  ORBIT_CONTROLS: 'orbit-controls',
  MAKE_ELEMENT: 'make-element',
}

const OrbitControlsEventType = {
  WHEEL: 'wheel'
}

let renderer, scene, camera, mesh, controls

self.onmessage = function ({ data }) {
  const { type, payload } = data
  switch(type) {
    case SceneWorkerActionType.MAKE_ELEMENT: {
      console.log('make element')
      elementManager.makeElement(payload)
      break
    }
    case SceneWorkerActionType.INIT_SCENE: {
      console.log('init scene', payload)
      const { offscreenCanvas, id } = payload
      initScene(offscreenCanvas, id)
      break
    }
    case SceneWorkerActionType.RESIZE: {
      console.log('resize', payload)
      const { width, height } = payload
      resize(width, height)
      break
    }
    case SceneWorkerActionType.ORBIT_CONTROLS: {
      console.log('orbit controls', payload)
      handleOrbitControlsEvent(payload)
      break
    }
    default: throw new Error(`Unknown worker action type: ${type}`)
  }
}

self.onmessageerror = function (event) {
  console.error(event)
}

function handleOrbitControlsEvent(event){
  switch(event.type) {
    case OrbitControlsEventType.WHEEL: {
      console.log(event)
      break
    }
    default: throw new Error(`Unknown OrbitControls event type: ${event.type}`)
  }
}

function initScene(canvas, id) {
  console.log(canvas)
  const element = elementManager.getElement(id)
  renderer = new WebGLRenderer({ canvas, antialias: false })
  renderer.setSize(canvas.width, canvas.height, false)
  scene = new Scene()
  camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
  controls = new OrbitControls(camera, element)
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0x00ff00 })
  mesh = new Mesh(geometry, material)
  scene.add(mesh)
  camera.position.z = 5
  render()
}


function resize(width, height) {
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

function render() {
  if (renderer && scene && camera) {
    controls.update()
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
}