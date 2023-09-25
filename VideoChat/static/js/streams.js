const APP_ID = 'b17124e7876748daa8dc1a6dca8078d1'
const CHANNEL = 'main'
const TOKEN = '007eJxTYAgvO1ZwRifma1Bq558PT0xluqcq3Di09kHGGva5voZG+4sVGJIMzQ2NTFLNLczNzE0sUhITLVKSDRPNUpITLQzMLVIMZd8KpjYEMjI8vnGDiZEBAkF8FobcxMw8BgYAtVUhGw=='
let UID; 

// ADD Documentation!!!__________________________________________________________________________

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {} 

let joinAndDisplayLocalStream = async() => {

   UID = await client.join(APP_ID , CHANNEL ,TOKEN, null)

   localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

   let player =`<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">My Name </span></div>
                    <div class="video-player" id="user-${UID}">
                    </div>
                </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend' , player)

    localTracks[1].play(`user-${UID}`)
    await client.publish([localTracks[0],localTracks[1]])
} 

joinAndDisplayLocalStream()