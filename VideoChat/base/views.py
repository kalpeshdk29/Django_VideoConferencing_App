from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt
import random
import time
import json


def getToken(request):
    appId = 'b17124e7876748daa8dc1a6dca8078d1'
    appCertificate ='a98d0edde67449309d446323da1df366'
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    role = 1
    expirationTimeInSeconds = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds 
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return  JsonResponse({'token': token , 'uid': uid}, safe=False)

# Create your views here.
def lobby(request):
    return render(request,'base/lobby.html' )

# Create your views here.
def room(request):
    return render(request,'base/room.html' )

# Create your views here.
def home(request):
    return render(request,'base/main.html' )

@csrf_exempt
def createMember(request):
    data = json.load(request.body)
    member , created = RoomMember.objects.get_or_create(

        name = data['name'],
        uid = data['uid'],
        room_name = data['room_name']
    )

    return JsonResponse({'name': data['name']}, safe=False)