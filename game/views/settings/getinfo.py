from django.http import JsonResponse 
from game.models.player.player import Player 

def getinfo_acapp(request) :
    player = Player.objects.all()[0] 
    return JsonResponse({
        'result' : "success" ,              # 取出第一个返回对象的属性
        'username' : player.user.username ,
        'photo' : player.photo , 
    })  

def getinfo_web(request) :
    user = request.user 
    if not user.is_authenticated:       # 判断是否登录
        return JsonResponse({
            'result' : "未登录" 
        })
    else:
        player = Player.objects.all()[0] 
        return JsonResponse({
            'result' : "success" , 
            'username' : player.user.username ,
            'photo' : player.photo ,    
        })

def getinfo(request) : 
    platform = request.GET.get('platform')
    if platform == "ACAPP":                  # 独立后端判断前端 --- 分别处理不同前端的请求
        return getinfo_acapp(request) 
    elif platform == "WEB": 
        return getinfo_web(request) 