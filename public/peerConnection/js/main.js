'use strict'
// 视频
var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');
//按钮
var startBtn = document.querySelector('button#start');
var callBtn = document.querySelector('button#call');
var hangupBtn = document.querySelector('button#hangup');
//显示信息
var offerSdpTextarea = document.querySelector('textarea#offer');
var answerSdpTextarea = document.querySelector('textarea#answer');

//全局变量
var localStream;
var pc1;
var pc2;

// 设置本地视频流播放
function getMediaStream(stream) {
  localVideo.srcObject = stream;
  localStream = stream;
}

function handleError(err) {
  console.error('Failed to get Media stream!', err);
}

// 获取浏览器流信息，输入到localVideo
function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('GetuserMedia is not supported in this browser! ');
    return;
  } else {
    var constraints = {
      video: true,
      audio: false
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(getMediaStream)
      .catch(handleError);

    startBtn.disabled = true;
    callBtn.disabled = false;
    hangupBtn.disabled = false;
  }
}

//pc2响应ontrack事件
function getRemoteStream(e) {
  remoteVideo.srcObject = e.streams[0];
}

// create Answer后 设置setLocalDescription
function getAnswer(desc) {
  //pc2 setLocalDescription
  pc2.setLocalDescription(desc);
  //显示sdp
  answerSdpTextarea.value = desc.sdp;

  //send desc to signal

  //receive desc from signal

  pc1.setRemoteDescription(desc);

}

function handleAnswerError(err) {
  console.error('Failed to create answer:', err);
}

//create Offer事件后把信息设置到本地LocalDescription 
function getOffer(desc) {

  pc1.setLocalDescription(desc);

  //显示sdp 信息
  offerSdpTextarea.value = desc.sdp;

  //send desc to signal

  //receive desc from signal

  //pc2 setRemoteDescription
  pc2.setRemoteDescription(desc);

  //pc3 create answer
  pc2.createAnswer().then(getAnswer).catch(handleAnswerError);

}

function handleOfferError(err) {
  console.error('Failed to create offer:', err);
}
//创建peerConnection
function call() {
  pc1 = new RTCPeerConnection();
  pc2 = new RTCPeerConnection();

  // pc1 pc2 监听到 onicecandidate 事件添加候选者信息
  pc1.onicecandidate = function (e) {
    //添加到连接通路 的候选者列表中
    pc2.addIceCandidate(e.candidate);
  }
  pc2.onicecandidate = function (e) {
    pc1.addIceCandidate(e.candidate);
  }

  //pc1 添加本地流的 track
  localStream.getTracks().forEach((track) => {
    pc1.addTrack(track, localStream);
  });

  //pc1 create offer
  var offerOptions = {
    offerToRecieveAudio: 0,
    offerToRecieveVideo: 1
  }
  pc1.createOffer(offerOptions).then(getOffer).catch(handleOfferError);


  // pc2 onTrack 信息监听处理
  pc2.ontrack = getRemoteStream;

  callBtn.disabled = true;
  hangupBtn.disabled = false;
}

function hangup() {
  pc1.close();
  pc2.close();
  // pc1 = null;
  // pc2 = null;

  callBtn.disabled = false;
  hangup.disabled = true;
}

//按钮事件响应
startBtn.onclick = start;
callBtn.onclick = call;
hangupBtn.onclick = hangup;