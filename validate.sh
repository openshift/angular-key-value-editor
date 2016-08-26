#!/bin/bash
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

echo 'Validating build'
# options tried:
#  -uB --ignore-blank-lines --ignore-space-change --strip-trailing-cr
if ! assetdiff=$(diff -uB --ignore-blank-lines --ignore-space-change --strip-trailing-cr ./.tmp/build ./dist) ; then
  echo "${red}[ERROR] There is a diff that needs to be resolved (run gulp min) ${reset}"
  echo "$assetdiff"
  exit 1
else
  echo "${green}[SUCCESS] No diff ${reset}"
  exit 0
fi
