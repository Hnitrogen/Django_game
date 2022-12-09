from django.http import JsonResponse
from django.contrib.auth import logout


def signout(request):           # 登出
    user = request.user
    if not user.is_authenticated:   
        return JsonResponse({
            'result': "success",
        })
    logout(request)
    return JsonResponse({
        'result': "success",
    })
