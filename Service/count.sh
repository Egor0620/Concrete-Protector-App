#!/bin/sh
  find . \
  -not -path '*/node_modules*' \
  -not -path '*.idea*' \
  -not -path '*.DS_*' \
  -a \( -name '*.js' -o -name '*.sql' \) | xargs cat | wc -l
  #-a \( -name '*.js' -o -name '*.html' \) | xargs cat | wc -l
