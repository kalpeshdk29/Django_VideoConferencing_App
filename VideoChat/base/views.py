from django.shortcuts import render

# Create your views here.
def lobby(request):
    return render(request,'base/lobby.html' )

# Create your views here.
def room(request):
    return render(request,'base/room.html' )

# Create your views here.
def home(request):
    return render(request,'base/main.html' )