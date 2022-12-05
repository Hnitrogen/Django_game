from django.urls import path
from game.views.settings.getinfo import getinfo         # 调包hhh

urlpatterns = [
    path("getinfo/",getinfo,name="settings_getinfo") , 

    # game.urls/getinfo
]

