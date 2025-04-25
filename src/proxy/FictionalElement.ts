import { EventDispatcher } from "three"

const noOperate = () => { }

class FictionalElement extends EventDispatcher {
    protected ownerDocument: EventDispatcher
    protected top: number
    protected left: number
    protected width: number
    protected height: number
    protected style: Record<string, any>
    constructor() {
        super()
        this.ownerDocument = this
        this.top = 0
        this.left = 0
        this.width = 0
        this.height = 0
        this.style = {}
        this.style.touchAction = 'auto'
    }

    get clientWidth() {
        return Math.round(this.width)
    }

    get clientHeight() {
        return Math.round(this.height)
    }

    getRootNode() {
        return new FictionalElement()
    }

    getBoundingClientRect() {
        return {
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height,
            right: this.left + this.width,
            bottom: this.top + this.height
        }
    }

    focus() {
        //no operate
    }

    dispatchEvent(event: Event) {
        if (event.type === 'resize') {
            console.log('resize event')
        }

        event.preventDefault = noOperate
        event.stopPropagation = noOperate

        // TODO: types
        super.dispatchEvent(event as never)
    }

}

export default FictionalElement