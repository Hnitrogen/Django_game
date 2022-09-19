from django.http import HttpResponse

def index(request):
    return HttpResponse("每个人都有自己的选择")