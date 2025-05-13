import { MouseEvent } from "react"
import { SceneWorkerActionType, SceneWorkerOrbitControlsEventType } from "../workers/const"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { Event as ThreeEvent, PerspectiveCamera } from "three"


class ControlsProxy<T extends HTMLElement> {
    protected worker
    protected htmlElement
    protected elementID
    constructor(worker: Worker, htmlElement: T, elementID: string) {
        if (!(worker instanceof Worker)) throw new Error('ControlsProxy: worker is not instance of Worker')

        this.worker = worker
        this.htmlElement = htmlElement
        this.elementID = elementID
        if (htmlElement !== null) {
            if (!(htmlElement instanceof HTMLElement)) {
                throw new Error('ControlsProxy: htmlElement is not instance of HTMLElement')
            } else {
                this.worker.postMessage({
                    type: SceneWorkerActionType.MAKE_ELEMENT,
                    payload: this.elementID
                })
            }
        }
    }
    init(offscreenCanvas: OffscreenCanvas) {
        this.worker.postMessage({
            type: SceneWorkerActionType.INIT_SCENE,
            payload: {
                id: this.elementID,
                offscreenCanvas
            }
        }, [offscreenCanvas])
        this.initEventListeners()
    }
    initEventListeners() {
        // abstract, implement in parent class
    }
    sendEventMessage(event: Event) {
        this.worker.postMessage({
            type: SceneWorkerActionType.CAMERA_UPDATE,
            payload: event
        })
    }
    copyProperties<O extends Record<string, any>, K extends keyof O>(src: O, properties: K[] = []): Pick<O, K> {
        let result = {} as Pick<O, K>
        properties.forEach(key => {
            result[key] = src[key]
        })
        return result
    }
    dispose() {

    }
}

const wheelEventProperties: Array<keyof WheelEvent> = ['type', 'deltaY']
class OrbitControlsProxy<T extends HTMLElement> extends ControlsProxy<T> {

    // constructor(worker: Worker, htmlElement: T, elementID: string) {
    //     super(worker, htmlElement, elementID)
    // }
    handleWheelEvent(event: WheelEvent) {
        event.preventDefault()
        const fictitiousEvent = super.copyProperties(event, wheelEventProperties)
        super.sendEventMessage(fictitiousEvent)
    }
    handleMouseDown(event: MouseEvent) {
        event.preventDefault()
        // send event message to worker
    }
    handleResize() {
        // move resizeobserver in here
    }
    initEventListeners() {
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
        this.htmlElement.addEventListener(
            'wheel',
            this.handleWheelEvent,
            { capture: true, passive: false }
        )
    }
    dispose() {
        // dispose all event listeners of element
    }
}


function pickProperties<O extends Record<string, any>, K extends keyof O>(src: O, properties: K[] = []): Pick<O, K> {
    let result = {} as Pick<O, K>
    properties.forEach(key => {
        result[key] = src[key]
    })
    return result
}
class OffscreenSceneProxy {
    protected worker: Worker
    protected canvas: HTMLCanvasElement
    private controls: OrbitControls
    private serviceCamera: PerspectiveCamera // camera to apply changes from controls and then transfer applied changes in offscreen scene
    constructor(worker: Worker, canvas: HTMLCanvasElement) {
        this.worker = worker
        this.canvas = canvas
        this.serviceCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.controls = new OrbitControls(this.serviceCamera, canvas)
        this.serviceCamera.position.set(0, 0, 5)
        this.controls.update()
    }
    init(offscreenCanvas: OffscreenCanvas) {
        this.worker.postMessage({
            type: SceneWorkerActionType.INIT_SCENE,
            payload: {
                offscreenCanvas,
                initialCamera: {
                    position: this.serviceCamera.position.toArray(),
                    quaternion: this.serviceCamera.quaternion.toArray(),
                    zoom: this.serviceCamera.zoom
                }
            }
        }, [offscreenCanvas])
        this.initEventListeners()
    }
    initEventListeners() {
        console.log('init event listeners')
        this.controls.addEventListener('change', this.handleControlsChangeEvent.bind(this))
    }
    
    // handleControlsChangeEvent(event: ThreeEvent<'change' | 'start' | 'end', OrbitControls>) {
    handleControlsChangeEvent() {
        this.sendMessage(
            SceneWorkerActionType.CAMERA_UPDATE,
            {
                position: this.serviceCamera.position.toArray(),
                quaternion: this.serviceCamera.quaternion.toArray(),
                zoom: this.serviceCamera.zoom
            }
        )
    }
    handleResize(width: number, height: number) {
        this.sendMessage(
            SceneWorkerActionType.RESIZE,
            {
                width,
                height
            }
        )
    }
    sendMessage(type: string, payload: any){
        this.worker.postMessage({
            type,
            payload
        })
    }
    dispose() {
        // remove all event listeners
    }
}



export { OrbitControlsProxy, OffscreenSceneProxy }