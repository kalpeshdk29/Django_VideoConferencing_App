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
    data = json.loads(request.body)
    member , created = RoomMember.objects.get_or_create(

        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name']
    )

    return JsonResponse({'name': data['name']}, safe=False)

@csrf_exempt
def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid = uid,
        room_name = room_name,
        
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)

    member = RoomMember.objects.get(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name'],
        
    )
    member.delete()
    return JsonResponse("{uid}Member is deleted", safe=False)
