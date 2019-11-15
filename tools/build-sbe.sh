#!/bin/sh
echo ".....Building SBE Site....."
mkdir -p $2
export GOPATH=$3
go get github.com/russross/blackfriday

#get SBE from the language master branch
#---- Disable temporary ---
#rm target/dependencies/siddhi-examples -rf
#rm ballerina-lang -rf
#git clone https://github.com/ballerina-platform/ballerina-lang
#git --git-dir=ballerina-lang/.git --work-tree=ballerina-lang/ checkout v0.991.0
#mkdir -p target/dependencies/ballerina-examples/
#mv ballerina-lang/examples target/dependencies/ballerina-examples/examples/
#rm ballerina-lang -r

rm -rf test-siddhi/*
go run tools/siddhiByExample/tools/generate.go $1 $2
echo "....Completed building SBE Site...."
