from django.db import models
from django.contrib.auth.models import User

# 自定义数据表 --- 要在admin.py 注册
# 用户 --- 类 --- 数据库对象
class Player(models.Model) :
    user = models.OneToOneField(User,on_delete=models.CASCADE)      # 和数据库的user 11对应
    photo = models.URLField(max_length=256 , blank=True)        # 获取用户头像

    def __str__(self) :
        return  str(self.user)      # 后台显示用户id

  