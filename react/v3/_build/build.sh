#!/bin/bash
#
# Build腳本：用於生成版本對應的鏡像 

IS_TEST_VERSION=`echo "$CI_BUILD_REF_NAME" | grep "feature\|release\|hotfix" -c`
GIT_VERSION=`echo "$CI_BUILD_REF_NAME" | sed "s/^\(feature\|release\|hotfix\)\///g" | sed "s/#/-/g"`
IMAGE_NAME="hub.8891.com.tw/t8891/$APP_NAME:$GIT_VERSION"
LATEST_IMAGE="hub.8891.com.tw/t8891/$APP_NAME:latest"
DOCKERFILE="$CI_PROJECT_DIR/_build/Dockerfile"

echo "正在 [構建鏡像] ..."
docker build -t $IMAGE_NAME -f $DOCKERFILE $CI_PROJECT_DIR

echo "正在 [提交鏡像] ..."
docker push $IMAGE_NAME

if [ "$IS_TEST_VERSION" == "0" ]; then
    echo "正在 [發佈正式版鏡像] ..."
    docker tag -f $IMAGE_NAME $LATEST_IMAGE
    docker push $LATEST_IMAGE
fi

echo "正在 [清理無用容器及鏡像] ..."
test "`docker ps -f status=exited -q | wc -l`" -gt 0 \
    && docker ps -f status=exited -q | xargs docker rm 2>&1
test "`docker images -f dangling=true -q | wc -l`" -gt 0 \
    && docker images -f dangling=true -q | xargs docker rmi 2>&1

echo "完成構建"