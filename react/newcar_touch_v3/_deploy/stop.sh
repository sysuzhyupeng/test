#!/bin/bash

# 應用版本
VERSION=`echo "$CI_BUILD_REF_NAME" | sed "s/^\(feature\|release\|hotfix\)\///g" | sed "s/#/-/g"`


# 應用實例名稱
RC_NAME="$APP_NAME-debug-$VERSION"

# 停止
stoptest(){
    if [ "`kubectl get rc ${RC_NAME} -t {{.status.replicas}} 2>/dev/null`" > 0 ] \
     || [ "`kubectl get rc ${RC_NAME}-rolling -t {{.status.replicas}} 2>/dev/null`" > 0 ]
    then
        echo "${RC_NAME} stop..."
        kubectl delete rc  --grace-period=0 $RC_NAME 2>/dev/null
        kubectl delete rc  --grace-period=0 ${RC_NAME}-rolling 2>/dev/null
    fi
}

stoptest

echo "stoped"