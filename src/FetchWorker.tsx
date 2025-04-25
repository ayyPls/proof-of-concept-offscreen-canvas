import { useEffect, useRef } from "react";
import { OrbitControlsProxy } from "./proxy/OrbitControlsProxy";

const CANVAS_ID = 'offscreen-canvas-id'

// make provider from this?
export const FetchWorker = () => {
  console.log("FetchWorker render");
  const orbitControlsProxyRef =
    useRef<OrbitControlsProxy<HTMLElement> | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const sceneWorkerRef = useRef<Worker | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStartLoading = () => {
    if (workerRef.current !== null)
      workerRef.current.postMessage({
        payload:
          "https://example.com/file-stream",
        type: "start stream",
      });
  };

  const handleStopLoading = () => {
    if (workerRef.current !== null)
      workerRef.current.postMessage({ type: "cancel stream" });
  };

  useEffect(() => {
    // canvas worker
    const canvas = canvasRef.current;
    if (canvas !== null && sceneWorkerRef.current === null) {
      sceneWorkerRef.current = new Worker(
        new URL("./workers/offscreen-canvas.worker.js", import.meta.url),
        { type: "module" }
      );
      sceneWorkerRef.current.onmessage = (event) => {
        console.log("Message from worker: ", event.data);
      };
      const offscreenCanvas = canvas.transferControlToOffscreen();
      // const width = canvas.clientWidth;
      // const height = canvas.clientHeight;
      // canvas.addEventListener('wheel', handleWheelEvent)
      orbitControlsProxyRef.current = new OrbitControlsProxy(
        sceneWorkerRef.current,
        document.body,
        CANVAS_ID
      )
      orbitControlsProxyRef.current.init(offscreenCanvas)
      // sceneWorkerRef.current.postMessage(
      //   { type: "init", payload: { offscreenCanvas, width, height } },
      //   [offscreenCanvas]
      // );
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const { width, height } = entries[0].contentRect;
          sceneWorkerRef.current?.postMessage({
            type: "resize",
            payload: {
              width,
              height
            },
          })
        }
      })
      resizeObserver.observe(canvas);
      resizeObserverRef.current = resizeObserver;
    }
    // fetch worker
    if (workerRef.current === null) {
      workerRef.current = new Worker(
        new URL("./workers/fetch.worker.js", import.meta.url)
      );
      workerRef.current.onmessage = console.log;
    }
    return () => {
      // canvas?.removeEventListener('wheel', handleWheelEvent)
      orbitControlsProxyRef.current = null;
      resizeObserverRef.current?.disconnect();
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (sceneWorkerRef.current) {
        sceneWorkerRef.current.terminate();
        sceneWorkerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="FetchWorker">
      <canvas
        ref={canvasRef}
        id={CANVAS_ID}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -100,
        }}
      />
      <button onClick={handleStartLoading}>Начать загрузку</button>
      <br />
      <button onClick={handleStopLoading}>Cancel stream</button>
    </div>
  );
};
