import FictionalElement from "./FictionalElement"

class FictionalElementManager {
    protected targets: Map<string, FictionalElement>
    constructor() {
        this.targets = new Map()
    }

    makeElement(id: string) {
        const element = new FictionalElement()
        this.targets.set(id, element)
        return element
    }

    getElement(id: string) {
        return this.targets.get(id)
    }

    hasElement(id:string) {
        return this.targets.has(id)
    }

    deleteElement(id: string) {
        return this.targets.delete(id)
    }

    clear() {
        this.targets.clear()
    }
}

export default FictionalElementManager