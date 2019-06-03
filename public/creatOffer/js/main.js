'use strict'

var start = document.querySelector('button#start')
var restart = document.querySelector('button#restart')

var pc1 = new RTCPeerConnection();

function handleError(err) {
  console.log('failed to create pc1 offer', err);
}

function getPc1Answer(desc) {
  console.log('getPc1Answer', desc.sdp);

  pc2.setLocalDescription(desc);

  pc1.setRemoteDescription(desc);

}

function getPc1Offer(desc) {
  console.log('getPc1Offer', desc.sdp);

  pc1.setLocalDescription(desc);

  pc2.setRemoteDescription(desc);
  pc2.createAnswer().then(getPc1Answer).catch(handleError);


}



function getMediaStream(stream) {
  stream.getTracks().forEach((track) => {
    pc1.addTrack(track, stream);
  });
  var offerConstraints = {
    offerToReceiveAudio: 1,
    offerToRecieveVideo: 1,
    iceRestart: true
  }

  pc1.createOffer(offerConstraints)
    .then(getPc1Offer)
    .catch(handleError);


}



function startICE() {
  var constraints = {
    audio: true,
    video: true
  }
  navigator.mediaDevices.getUserMedia(constraints).then(getMediaStream).catch(handleError)

}

restart.onclick = startICE;