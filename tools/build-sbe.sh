#!/bin/sh
echo ".....Building SBE Site....."
mkdir -p $2

go get github.com/russross/blackfriday

go run tools/siddhiByExample/tools/generate.go $1 $2 $3

echo "....Completed building SBE Site...."
