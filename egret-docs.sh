#!/usr/bin/env bash
# engine-apidoc-generator build script for Jenkins ONLY
# Any issue, contact Dakun Leng (lengdakun)

WORKSPACE="./"
PROJECT_NAME="egret-docs"
PROJECT_GIT="https://github.com/egret-labs/egret-docs"
PROJECT_TREE="engine2d,3d,db"
IS_CLEAN=false
IS_RELEASE=false

WORK_ROOT=$WORKSPACE/$PROJECT_NAME

function cleanup() {
	echo "build.txt"
	rm -rf $WORKSPACE/$PROJECT_NAME
}

function assert_error() {
	# Assert if err_code is none zero
	# Usage: assert_error err_code [err_message]
	if [[ $# < 1 ]]; then
		echo "assert_error(): necessary parameter required."
		exit 1
	else
		err_code=$1
		if [[ $# = 1 ]]; then
			err_message="Error found with code: $1"
		else
			shift
			err_message=$*
		fi
		if [[ $err_code -ne 0 ]]; then
			cleanup
			echo $err_message
			exit $err_code
		fi
	fi
}

function reloadAll() {
	cd $WORKSPACE
	echo "clone docs"
	git clone $PROJECT_GIT $WORK_ROOT
    assert_error $?	
}

function pullGit() {
	cd $WORK_ROOT
	echo "pull docs generator script..."$WORK_ROOT
    git fetch
    
	echo "values : "$PROJECT_TREE

	
	trees=${PROJECT_TREE//,/ }    #这里是将var中的,替换为空格  
	for element in $trees   
	do  
	    echo $element 

	    git checkout $element

	    assert_error $?
		git pull
		echo "pull "$element
	    assert_error $?
	done 

	# 转到 beta 分支
    git checkout beta
    assert_error $?
	git pull
	echo "pull beta"

	# 合并分支到 beta
	for element in $trees   
	do  
		echo "merge "$element
		git merge --no-ff $element
	    assert_error $?
	done 

	# 执行生成目录脚本



	if [[ $IS_RELEASE = true ]]; then
		# 提交到本地 beta
		# git push

		# 转到 master
	    git checkout master
	    assert_error $?
		git pull

		# 合并 beta 到 master
		git merge --no-ff beta
	    assert_error $?
		# git push
	fi
}

if [[ $IS_CLEAN = true ]]; then
	cleanup
	reloadAll
else 
	pullGit
fi
