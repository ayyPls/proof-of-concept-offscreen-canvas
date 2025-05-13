// import { useEffect, useRef } from "react";
// import { OffscreenSceneProxy } from "./proxy/OffscreenSceneProxy";
// // import { SceneWorkerActionType } from "./workers/const";

// const CANVAS_ID = "offscreen-canvas-id";

// export const FetchWorker = () => {
//   console.log("FetchWorker render");
//   const SceneProxyRef = useRef<OffscreenSceneProxy>(null);
//   const workerRef = useRef<Worker>(null);
//   const sceneWorkerRef = useRef<Worker>(null);
//   const resizeObserverRef = useRef<ResizeObserver>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas !== null && sceneWorkerRef.current === null) {
//       sceneWorkerRef.current = new Worker(
//         new URL("./shared/workers/scene.worker.js", import.meta.url),
//         { type: "module" }
//       );
//       sceneWorkerRef.current.onmessage = (event) => {
//         console.log("Message from worker: ", event.data);
//       };
//       const offscreenCanvas = canvas.transferControlToOffscreen();
//       SceneProxyRef.current = new OffscreenSceneProxy(
//         sceneWorkerRef.current,
//         canvas
//       );
//       SceneProxyRef.current.init(offscreenCanvas);
//       const resizeObserver = new ResizeObserver((entries) => {
//         if (entries.length > 0) {
//           const { width, height } = entries[0].contentRect;
//           SceneProxyRef.current?.handleResize(width, height);
//         }
//       });
//       resizeObserver.observe(canvas);
//       resizeObserverRef.current = resizeObserver;
//     }
//     if (workerRef.current === null) {
//       workerRef.current = new Worker(
//         new URL("./shared/workers/fetch.worker.js", import.meta.url),
//         { type: "module" }
//       );
//       workerRef.current.onmessage = console.log;
//     }
//     return () => {
//       SceneProxyRef.current?.dispose();
//       SceneProxyRef.current = null;
//       resizeObserverRef.current?.disconnect();
//       if (workerRef.current) {
//         workerRef.current.terminate();
//         workerRef.current = null;
//       }
//       if (sceneWorkerRef.current) {
//         sceneWorkerRef.current.terminate();
//         sceneWorkerRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="FetchWorker">
//       <canvas
//         tabIndex={0}
//         ref={canvasRef}
//         id={CANVAS_ID}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           zIndex: 1,
//         }}
//       />
//     </div>
//   );
// };
