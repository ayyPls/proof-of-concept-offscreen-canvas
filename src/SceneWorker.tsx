import { useEffect, useRef } from "react"

export const SceneWorker = () => {
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas !== null && workerRef.current === null) {
      workerRef.current = new Worker(
        new URL("./workers/offscreen-canvas.worker.js", import.meta.url)
      )
      workerRef.current.onmessage = (event) => {
        console.log("Message from worker: ", event.data)
      }
      const offscreenCanvas = canvas.transferControlToOffscreen()
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      workerRef.current.postMessage(
        { type: "init", payload: offscreenCanvas, width, height },
        [offscreenCanvas]
      )
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const { width, height } = entries[0].contentRect
          workerRef.current?.postMessage({ type: "resize", width, height })
        }
      })
      resizeObserver.observe(canvas)
      resizeObserverRef.current = resizeObserver
    }
    return () => {
      resizeObserverRef.current?.disconnect()
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  return <canvas ref={canvasRef} id="offscreen-canvas" />
}
