'use strict'

var videoplay = document.querySelector('video#player');
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var videoSource = document.querySelector('select#videoSource')


function gotDevices(deviceInfos)
{
    deviceInfos.forEach(function(deviceInfo){
          var option = document.createElement('option');
          option.text = deviceInfo.label
          option.value = deviceInfo.deviceId;

           if (deviceInfo.kind === "audioinput"){
            audioSource.appendChild(option)

           }else if(deviceInfo.kind === "audiooutput"){
            audioOutput.appendChild(option)
           }else if(deviceInfo.kind === "videoinput"){
            videoSource.appendChild(option)
           }
    })
}

function gotMediaStream(stream)
{
    videoplay.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}
function handleError(err)
{
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
                          .then(gotDevices)
                          .catch(handleError);
    
}
