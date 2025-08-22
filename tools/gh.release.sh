#! /bin/bash

GIT_ROOT=`git rev-parse --show-toplevel`

CURRENT_TIMESTAMP=`date +"%Y-%m-%d-%H%M%S"`

RELEASE_BRANCH='release'
BUILD_DIR='docs'

git checkout master
git branch -D $RELEASE_BRANCH
git checkout -b $RELEASE_BRANCH

rm -rf "$GIT_ROOT/$BUILD_DIR"
npm run build

git add -f "$GIT_ROOT/$BUILD_DIR"
git commit -m "release: $CURRENT_TIMESTAMP"

git push -f origin $RELEASE_BRANCH

rm -rf "$GIT_ROOT/$BUILD_DIR"
git checkout master
