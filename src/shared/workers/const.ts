// TODO: change to enums

const FetchWorkerAbortReasons = {
    STREAM_CANCELED_FROM_MAIN_THREAD: 'STREAM_CANCELED_FROM_MAIN_THREAD'
}

const FetchWorkerActionType = {
    START_STREAM: 'START_STREAM',
    CANCEl_STREAM: 'CANCEl_STREAM'
}

const SceneWorkerActionType = {
    INIT_SCENE: 'INIT_SCENE',
    RESIZE: 'RESIZE',
    CAMERA_UPDATE: "CAMERA_UPDATE",
    MAKE_ELEMENT: 'MAKE_ELEMENT',
}

export {
    FetchWorkerAbortReasons,
    FetchWorkerActionType,
    SceneWorkerActionType
}