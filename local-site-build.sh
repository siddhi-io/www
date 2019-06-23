#jenkins script 100% working local script

#!/bin/bash
set -o xtrace

cwd=`pwd`

#use for checkout and build a particular branch
build(){

	git checkout $1  
    version=$1
    #rename master to next
    if [ "$1" == "master" ]; then
      version="next"  
    fi

#obtain particular lang folder
#create folder structure
#build a particular branch

    for dir in */; do  
  
      if [ -d ${f} ]; then
         dir=${dir%*/}
         dirName=${dir##*/}
         cd ${dir}
         mkdocs build
         cd ..   
         mkdir -p ../dist/$dirName/$version
         ls      
         mv $dirName/site/*  ../dist/$dirName/$version
         rm -rf $dirName/site/
         cp -R $dirName/theme/  ../dist/$dirName/$version/theme/
      fi
    done
}

build_landing(){

	git checkout landing
    version=landing

    mkdocs build
    mv site/*  ../dist
    rm -rf site/
    cp -R theme/  ../dist/theme/
}

   echo clean dist
   rm -rf ../dist/*
   echo build triggered manually
   
   #obtain branch names in a git repo     
   for BRANCH in `git branch -a | grep remotes/origin/*` ;
     do   
      
     git checkout versions
     GIT_BRANCH_NAME="$(cut -d'/' -f3 <<<"$BRANCH")"  
   #obtain branch names from versions.json and check with the git branches
   CURRENT_VERSION=$(cat en/versions/assets/versions.json | jq -r '.current');
   for version in $(cat en/docs/assets/versions.json | jq -r '.all' | jq -r 'keys[]'); do 

     if [ "$GIT_BRANCH_NAME" == "${version}" ]; then 

      build "${version}"

     fi   
    done   
   done 
   #these branches must build in each trigger
   build "versions"

   #copy redirection
#  cp ./index.html ../dist/index.html
#  cp ./404.html ../dist/404.html
#  cp ./_config.yml ../dist/_config.yml
#  cp -R ./redirect/* ../dist/redirect/
#  cp ./en/index.html ../dist/en/index.html
   cp ./CNAME ../dist/CNAME

   build "master"

   echo CURRENT_VERSION : $CURRENT_VERSION;

   build_landing

  # git checkout gh-pages
  # rm -rf ./*
  # cp -R ../dist/* .
  # git add -A


     
