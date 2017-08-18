#!/bin/bash

# 應用版本
VERSION=`echo "$CI_BUILD_REF_NAME" | sed "s/^\(feature\|release\|hotfix\)\///g" | sed "s/#/-/g"`


# 應用鏡像名稱
IMAGE_NAME="hub.8891.com.tw/t8891/$APP_NAME:$VERSION"


# 應用實例名稱
RC_NAME="$APP_NAME-debug-$VERSION"


# RC模板
TMPL_FILE="$CI_PROJECT_DIR/_deploy/test.yml"

echo "deploy is ${DEPLOY}"

# 若是上線應用，修改應用版本為最新版
if [ "$DEPLOY" == 1 ]; then
  IMAGE_NAME="hub.8891.com.tw/t8891/$APP_NAME:latest"
  RC_NAME="$APP_NAME-online"
  TMPL_FILE="$CI_PROJECT_DIR/_deploy/deploy.yml"
fi


# POD_NUM: pod的實例數量，默認為1。通過gitlab-ci設定，不要修改此處
POD_NUM=${POD_NUM:-1}

RUNTIME_DIRNAME=${RUNTIME_DIRNAME:-empty}
RUNTIME_PATH=${RUNTIME_PATH:-/tmp/empty}

# 配置模板
tmpl(){
  local TMPL_VARS=(RC_NAME APP_NAME POD_NUM IMAGE_NAME VERSION RUNTIME_DIRNAME RUNTIME_PATH)
  local TMPL=`cat $TMPL_FILE`
  for v in "${TMPL_VARS[@]}"
  do
    vv=`echo "${!v}" | sed -e "s/\//{{xie}}/g"`
    TMPL=`echo "$TMPL" | sed -e "s/{{$v}}/$vv/g"`
  done
  TMPL=`echo "$TMPL" | sed -e "s/{{xie}}/\//g"`
  echo "$TMPL"
}

# 上線應用實例
deploy(){
  local RC=`tmpl`
  if [ "`kubectl get rc ${RC_NAME} -t {{.status.replicas}} 2>/dev/null`" > 0 ]; then
        echo "${RC_NAME} rolling-update..."
        echo "$RC" | sed -e "s/$RC_NAME/${RC_NAME}-rolling/g" | kubectl rolling-update $RC_NAME -f -

  else
    if [ "`kubectl get rc ${RC_NAME}-rolling -t {{.status.replicas}} 2>/dev/null`" > 0 ]; then
        echo "${RC_NAME} rolling-update..."
        echo "$RC" | kubectl rolling-update "${RC_NAME}-rolling" -f -

    else 
        echo "creating ${RC_NAME}..."
        echo "$RC" | kubectl create -f -
    fi
  fi
}

# 運行測試版本
runtest(){
    local RC=`tmpl`
    if [ "`kubectl get rc ${RC_NAME} -t {{.status.replicas}} 2>/dev/null`" > 0 ] \
     || [ "`kubectl get rc ${RC_NAME}-rolling -t {{.status.replicas}} 2>/dev/null`" > 0 ]
    then
        echo "${RC_NAME} stop..."
        kubectl delete rc  --grace-period=0 $RC_NAME 2>/dev/null
        kubectl delete rc  --grace-period=0 ${RC_NAME}-rolling 2>/dev/null
    fi
    echo "${RC_NAME} start..."
    echo "$RC" | kubectl create -f -
}


if [ "$DEPLOY" == 1 ]; then
  deploy
else
  runtest
fi