'use strict'

var videoplay = document.querySelector('video#player');
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var videoSource = document.querySelector('select#videoSource')
var filtersSelect = document.querySelector('select#filter')

// 获取设备
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
            0
           }
    })
}
//获取音视频流
function gotMediaStream(stream)
{
    videoplay.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}
function handleError(err)
{
    console.log('gotMediaStream  is not supported! \n');
}

function start()
{

    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        console.log('getUserMedia is not supported! \n');
        return
    }else{
        var deviceId = videoSource.value
        var constraints = {
            video : {
                width:640,
                height:480,
                frameRate:30,
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
            audio : {
                noiseSuppression:true,//降噪
                echoCancellation:true,//回音消除
                autoGainControl:true  //自动增益
            }
        }
        //获取音视频信息
        navigator.mediaDevices.getUserMedia(constraints)
                              .then(gotMediaStream)
                              .then(gotDevices)
                              .catch(handleError);
        
    }
}

//启动
start();

videoSource.onchange  = start;
filtersSelect.onchange = function()
{
    videoplay.className = filtersSelect.value

}