'use strict'

var videoplay = document.querySelector('video#player');

function gotMediaStream(stream){
    videoplay.srcObject = stream;
}
function handleError(err){
    console.log('gotMediaStream  is not supported! \n');
}

if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    console.log('getUserMedia is not supported! \n');
}else{
    var constraints = {
        video : true,
        audio : true
    }
    //获取音视频信息
    navigator.mediaDevices.getUserMedia(constraints)
                          .then(gotMediaStream)
                          .catch(handleError);
    
    

}
