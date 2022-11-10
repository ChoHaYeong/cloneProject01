//dom
const recordButton = document.querySelector(".record-button")
const stopButton = document.querySelector(".stop-button")
const playButton = document.querySelector(".play-button")
const downloadButton = document.querySelector(".download-button")
const previewPlayer = document.querySelector("#preview")
const recordingPlayer = document.querySelector("#recording")

let recorder;
let recordedChunks = [];

// functions
function videoStart() {
    // 지금 여기서 에러나는데 이게 카메라랑 마이크가 없어서 그런것일수도 있기 때문에 일단 넘어가...
    // 허용 잘 하면 console.log를 통해 로그가 출력된다.
    // navigator.mediaDevices.getUserMedia({video:true, audio:true})
    //     .then(stream => console.log(stream))

    //이게 제대로 실행되면 미리보기에 얼굴이 떠야함
    //그리고 startRecording 함수 실행함
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then(stream => {
            previewPlayer.srcObject = stream;
            startRecording(previewPlayer.captureStream())  
        })
}

function startRecording(stream) {
    recordedChunks = []; // 녹화 시작할 때마다 초기화시켜주는듯! 
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {recordedChunks.push(e.data)}
    recorder.start()
}
function stopRecording() {
    //console.log(previewPlayer.srcObject.getTracks())
    // -> Cannot read properties of null (reading 'getTracks') 에러발생
    //previewPlayer가 null인가봄..
    //device가 없어서 previewPlayer에 null값이 들어가는걸까 ?
    previewPlayer.srcObject.getTracks().forEach(track => track.stop());
    recorder.stop()
    console.log(recordedChunks)
}
function playRecording() {
    const recorderedBlob = new Blob(recordedChunks, {type: "video/webm"}); // 나 blob처음봐..
    recordingPlayer.src = URL.createObjectURL(recorderedBlob);
    recordingPlayer.play();
    downloadButton.href = recordingPlayer.src;
    downloadButton.download = `recording_${new Date()}.webm`;
    console.log(recordingPlayer.src)
}

// event
recordButton.addEventListener("click", videoStart )
stopButton.addEventListener("click", stopRecording) // -> stopRecording 함수 실행
playButton.addEventListener("click", playRecording);