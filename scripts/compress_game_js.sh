#! /bin/bash

# 这是一个打包的shell脚本
# 他将 src里面的js代码打包放到dist里面去

JS_PATH=/home/acs/django_webapp/game/static/js/    # 声明宏
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/ 

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js
# 在src下找到js文件,并按照字典序输出到dist的game.js文件
echo yes | python3 manage.py collectstatic
