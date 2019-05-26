'use strict'

var videoplay = document.querySelector('video#player');
var audioplay = document.querySelector('audio#audioplayer');
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var videoSource = document.querySelector('select#videoSource')
var filtersSelect = document.querySelector('select#filter')
var snapshotButton = document.querySelector('button#snapshot')
var pictureCanvas = document.querySelector('canvas#picture')
var constraints = document.querySelector('div#constraints')

//record
var recVideo = document.querySelector('video#recplayer')
var recordBtn = document.querySelector('button#record')
var playBtn = document.querySelector('button#recplay')
var downloadBtn = document.querySelector('button#download')

//buffer
var buffer;
var mediaRecorder;


pictureCanvas.width = 320
pictureCanvas.height = 240
// 获取设备
function gotDevices(deviceInfos) {
  deviceInfos.forEach(function (deviceInfo) {
    var option = document.createElement('option');
    option.text = deviceInfo.label
    option.value = deviceInfo.deviceId;

    if (deviceInfo.kind === "audioinput") {
      audioSource.appendChild(option)

    } else if (deviceInfo.kind === "audiooutput") {
      audioOutput.appendChild(option)
    } else if (deviceInfo.kind === "videoinput") {
      videoSource.appendChild(option)
    }
  })
}
//获取音视频流
function gotMediaStream(stream) {

  var videoTrack = stream.getVideoTracks()[0];
  var videoConstraints = videoTrack.getSettings();

  constraints.textContent = JSON.stringify(videoConstraints, null, 2);
  //全局变量
  window.stream = stream;

  videoplay.srcObject = stream;

  // audioplay.srcObject =  stream;
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(err) {
  console.log('gotMediaStream  is not supported! \n');
}

function start() {
  //if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    console.log('getUserMedia is not supported! \n');
    return
  } else {
    var deviceId = videoSource.value
    var constraints = {
      video: {
        width: 320,
        height: 240,
        frameRate: 30,
        // width:{
        //     min:640,
        //     max:1080
        // },
        // height:{
        //     min:480,
        //     max:1920
        // },
        // frameRate:{
        //     min:15,
        //     max:60
        // },
        // facingMode:'enviroment', // user // 摄像头前后置 默认前置

        //设置deviceId
        deviceId: deviceId ? deviceId : undefined

      },
      // video : true,
      // audio : true
      audio: {
        noiseSuppression: true, //降噪
        echoCancellation: true, //回音消除
        autoGainControl: true //自动增益
      }
    }
    //获取音视频信息 //
    // navigator.mediaDevices.getUserMedia(constraints)
    navigator.mediaDevices.getDisplayMedia(constraints)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(handleError);
  }
}

//启动
start();

videoSource.onchange = start;
filtersSelect.onchange = function () {
  videoplay.className = filtersSelect.value

}
snapshotButton.onclick = function () {
  pictureCanvas.className = filtersSelect.value
  pictureCanvas.getContext('2d').drawImage(videoplay, 0, 0, pictureCanvas.width, pictureCanvas.height)

}
// 开始录制
function startRecord() {
  //用于存储录制的内容
  buffer = [];

  var options = {
    mimeType: 'video/webm;codecs=vp8'
  }
  //判断浏览器是否支持options.mimeType
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error('${options.mimeType} is not supported!')
    return;
  }
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Failed to create mediaRecorder:', e);
    return;
  }
  //录制的数据是否存储
  mediaRecorder.ondataavailable = handleDataAvailable;
  //启动录制 时间片 每个一个时间片存储一个数据
  mediaRecorder.start(10);


}
// 停止录制
function stopRecord() {
  mediaRecorder.stop();
}
// 存储录制的数据
function handleDataAvailable(e) {
  if (e && e.data && e.data.size > 0) {
    buffer.push(e.data);
  }

}

recordBtn.onclick = function () {
  if (recordBtn.textContent === 'Start Record') {
    startRecord();
    recordBtn.textContent = 'Stop Record';
    playBtn.disabled = true;
    downloadBtn.disabled = true;
  } else {
    stopRecord();
    recordBtn.textContent = 'Start Record';
    playBtn.disabled = false;
    downloadBtn.disabled = false;
  }
}

playBtn.onclick = function () {
  var blob = new Blob(buffer, {
    type: 'video/webm'
  });
  recVideo.src = window.URL.createObjectURL(blob);
  //获取直播流数据的时候 stream 复制给recVideo.srcObject 
  recVideo.srcObject = null;
  recVideo.controls = true;
  recVideo.play();
}

downloadBtn.onclick = function () {
  var blob = new Blob(buffer, {
    type: 'video/webm'
  });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.style.display = 'none';
  a.download = 'text.webm';
  a.click();
}