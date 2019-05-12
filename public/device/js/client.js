'use strict'

if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) 
{
    console.log('enumerateDevices is not supported! \n');
}else{
    navigator.mediaDevices.enumerateDevices()
                          .then(gotDevices)
                          .catch(handleError);                         
}

function gotDevices(deviceInfos)
{
    deviceInfos.forEach(function(deviceInfo){
        console.log(deviceInfo.kind + " ; \n label = "
                    + deviceInfo.label + " ; \n id = "
                    + deviceInfo.deviceId + "  ; \n groupId ="
                    + deviceInfo.groupId);
    });
}

function handleError(err)
{
    console.log(err.name + " : " + err.message);

}