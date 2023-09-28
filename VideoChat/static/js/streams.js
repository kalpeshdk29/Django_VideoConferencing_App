
const APP_ID = 'b17124e7876748daa8dc1a6dca8078d1'
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let  UID = sessionStorage.getItem('UID')
let Name = sessionStorage.getItem("name")

/// Initializing videoSDK engine 
const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

/// Store Local media tracks (audio , Video)
let localTracks = []
/// Store remote media tracks (audio , Video)
let remoteUsers = {} 

let joinAndDisplayLocalStream = async() => {

    document.getElementById("room-name").innerText = CHANNEL
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    try
    {
        await client.join(APP_ID , CHANNEL ,TOKEN, UID)
    }catch(error)
    {
        console.error(error)
        window.open('/','_self')
    }
    

   /// Fetch the local audio video tracks
   localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let member = await createMember()

   /// Create a dynamic video player element which take uid as element id
   let player =`<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player" id="user-${UID}">
                    </div>
                </div>`

    /// Render player element dynamicly inside video-strame element.
    document.getElementById('video-streams').insertAdjacentHTML('beforeend' , player)

    /// Set The local tracks for created player
    localTracks[1].play(`user-${UID}`)

    /// published the tracks.
    await client.publish([localTracks[0],localTracks[1]])
  
} 

let handleUserJoined = async (user, mediaType) => {
   remoteUsers[user.uid] = user
   await client.subscribe(user, mediaType)

   if(mediaType === 'video' ){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }

        player =`<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">User Name</span></div>
                    <div class="video-player" id="user-${user.uid}">
                    </div>
                </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend' , player)

        user.videoTrack.play(`user-${user.uid}`)
   }
   if(mediaType === 'audio'){
    user.audioTrack.play()
   }
}  

let handleUserLeft =async(user) =>
{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()

}

let leaveAndRemoveLocalstream = async()=>
{
    for(let i =0; localTracks.length >i; i++)
    {
       localTracks[i].stop()
       localTracks[i].stop() 
    }

    await client.leave()
    window.open('/','_self')
}

let toggleCamera = async (e)=>{
    if(localTracks[1].muted)
    {
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor ="#fff"
    }
    else
    {
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = "rgb(255,80,80,1)"
    }
}

let toggleMic = async (e)=>{
    if(localTracks[0].muted)
    {
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor ="#fff"
    }
    else
    {
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = "rgb(255,80,80,1)"
    }
}

let createMember =async()=>
{
    let response = await fetch('create_member/',{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ 
            'name': Name,
            'room_name':CHANNEL,
            'UID':UID
        })
    })
    let member = await response.json()
    return member
}


joinAndDisplayLocalStream()

document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalstream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)

