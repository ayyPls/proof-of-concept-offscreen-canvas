import { MouseEvent } from "react"


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
                    type: 'make-element',
                    payload: this.elementID
                })
            }
        }
    }
    init(offscreenCanvas: OffscreenCanvas) {
        this.worker.postMessage({
            type: 'init',
            payload: {
                id: this.elementID,
                offscreenCanvas
            }
        }, [offscreenCanvas])
        this.initEventListeners()
    }
    initEventListeners() {
        // abstract
    }
    sendEventMessage(event: Event) {
        console.log('send event', event, this.worker)
        // TODO: this.worker is undefined
        this.worker.postMessage({
            type: 'orbit-controls',
            payload: event
        })
    }
    copyProperties<O extends Record<string, any>, K extends keyof O>(src: O, properties: K[] = []):Pick<O, K> {
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

class OrbitControlsProxy<T extends HTMLElement> extends ControlsProxy<T>{

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
    initEventListeners(){
        console.log('init event listeners')
        this.htmlElement.addEventListener(
            'wheel',
            this.handleWheelEvent,
            {capture: true, passive: false}
        )
    }
    dispose() {
    }
}

export { OrbitControlsProxy }