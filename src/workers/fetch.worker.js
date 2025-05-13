import { FetchWorkerAbortReasons, FetchWorkerActionType } from './const'
// TODO LIST:
// [x] fetch
// [x] worker state: loading / ready
// [x] cancel fetch if busy
// [x] abort stream
// [] stop in case network error (cors, ...)
// [] parse
// [] send/share data in offscreen worker
// [] share memory with main thread?
// [] offscreen canvas

// [] load models on tab reload/restore from localstorage

// make it work in browsers that doesn't support web workers/offscreen canvas


class FetchWorker {
  /**
     * Indicates whether the worker is currently busy.
     * @type {boolean}
     * @private
     * @default false
  */
  _isBusy = false
   /**
     * The AbortController instance used to manage fetch requests.
     * @type {AbortController | null}
     * @private
   */
  _controller = null
  constructor() {
    this._controller = new AbortController()
    this._isBusy = false
  }

  async startStream(url = "") {
    if (this._isBusy) {
      console.warn("Worker is busy, cannot start new stream.")
      return
    }
    this._isBusy = true
    this._controller = new AbortController()
    let chunks = []
    const stream = await fetch(url, { signal: this._controller.signal })
    const reader = stream.body.getReader()
    const decoder = new TextDecoder()
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done === true) break
        else if (value !== undefined) {
          const chunk = decoder.decode(value, { stream: true })
          chunks.push(chunk)
          // You might want to post messages with chunks back to the main thread here
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted')
      } else {
        console.error('Error reading stream:', error)
      }
    } finally {
      reader.releaseLock()
      this._isBusy = false
      this._controller = null
      console.log(chunks)
      // self.postMessage({ type: 'stream-complete', payload: chunks })
    }
  }

  cancelStream(reason) {
    if (this._isBusy && this._controller) {
      this._controller.abort(reason)
      this._isBusy = false
      this._controller = null
    } else {
      console.warn("No active stream to cancel.")
    }
  }
}

const worker = new FetchWorker()

self.onmessage = async function ({ data }) {
  // console.log('fetch worker');
  switch(data.type) {
    case FetchWorkerActionType.START_STREAM: {
      worker.startStream(data.payload)
      break
    }
    case FetchWorkerActionType.CANCEl_STREAM: {
      worker.cancelStream(FetchWorkerAbortReasons.STREAM_CANCELED_FROM_MAIN_THREAD)
      break
    }
    default: throw new Error(`Unknown worker action type: ${data.type}`)
  }
}

self.onmessageerror = function (event) {
  console.error(event)
}

