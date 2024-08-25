'use client';


import { Suspense, useEffect, useState } from 'react';

import { io } from 'socket.io-client';

function Page() {

    // const [push,setpush] = useState(false)
    var push = false
    const openRoom = ()=> {

    }
    const joinRoom = ()=> {

    }


    useEffect(()=>{
        let socket = io("http://172.70.101.255:3000", {
            transports: ['websocket'],
            upgrade: false
        });
        socket.on('connect', () => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
              .then((stream) => {
                  console.log(stream)
                  var madiaRecorder = new MediaRecorder(stream);
                  var audioChunks = [];
          
                  madiaRecorder.addEventListener("dataavailable", function (event) {
                    if(push){
                      console.log(push);
                      audioChunks.push(event.data);
                    }
                      
                  });
          
                  madiaRecorder.addEventListener("stop", function () {
                      var audioBlob = new Blob(audioChunks);
                      audioChunks = [];
                      var fileReader = new FileReader();
                      fileReader.readAsDataURL(audioBlob);
                      fileReader.onloadend = function () {
                          var base64String = fileReader.result;
                          socket.emit("audioStream", base64String);
                      };
          
                      madiaRecorder.start();
                      setTimeout(function () {
                          madiaRecorder.stop();
                      }, 1000);
                  });
          
                  madiaRecorder.start();
                  setTimeout(function () {
                      madiaRecorder.stop();
                  }, 1000);
              })
              .catch((error) => {
                  console.error('Error capturing audio.', error);
              });
          });

          socket.on('audioStream', (audioData) => {
            var newData = audioData.split(";");
            console.log(newData);
            newData[0] = "data:audio/ogg;";
            newData = newData[0] + newData[1];
        
            var audio = new Audio(newData);
            console.log(audio);
            if (!audio || document.hidden || audio.src == "data:audio/ogg;base64," ){
                return;
            }

            audio.play();
        });
    },[])

  return (

    <> 
   
    {/* <input type="text" id="room-id" value="abcdef" /> */}
    <button  onClick={openRoom} id="open-room">Open Room</button>
    <button onClick={joinRoom} id="join-room">Join Room</button>
    <button id="open-or-join-room">Auto Open Or Join Room</button>

    <div id="room-urls" ></div>

    <div id="audios-container"></div>
    <button onClick={()=>{
      console.log("clicked" , push);
      push = !push
    }}> ads;fjak;ldjfk;lasdfkasfads';</button>
  </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}