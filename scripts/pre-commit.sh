#!/usr/bin/env bash

BLUE='\033[1;34m'
BRIGHT_RED='\033[1;31m'
DARK_GRAY='\033[0;37m'
RESET='\033[m'
INFO="${BLUE}[INFO]${RESET}"

function task() {
  if [ "$3" != "" ] && [ $1 ]; then
    printf "$2 ..."

    $1 $3 &
    pid=$!
    wait $pid

    if [ $? == 0 ]; then
      echo -ne "\033[0K\r$2 ... done!\n"
    else
      printf "${BRIGHT_RED} Please fix the above errors before committing.\n"
      exit 1
    fi
  fi
}

printf "\n"

# CSS + SCSS linting
css_files=$(git diff --cached --name-only | grep -i '\.s\?css$')
CSS_MESSAGE="${INFO} Linting stylesheets ${DARK_GRAY}[*.css, *.scss]${RESET}"
task ./node_modules/.bin/stylelint "$CSS_MESSAGE" "$css_files"

# JavaScript
js_files=$(git diff --cached --name-only | grep -i '\.jsx\?$')
JS_MESSAGE="${INFO} Linting scripts ${DARK_GRAY}[*.js, *.jsx]${RESET}"
task ./node_modules/.bin/eslint "$JS_MESSAGE" "$js_files"

# TypeScript
ts_files=$(git diff --cached --name-only | grep -i '\.tsx\?$')
TS_MESSAGE="${INFO} Linting scripts ${DARK_GRAY}[*.ts, *.tsx]${RESET}"
task ./node_modules/.bin/tslint "$TS_MESSAGE" "$ts_files"
