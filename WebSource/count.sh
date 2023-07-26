#!/bin/bash
 find .\
  -not -path '*/.sass-cache*' \
  -not -path '*/.tmp*' \
  -not -path '*/dist*' \
  -not -path '*/node_modules*' \
  -not -path '*/projectFilesBackup*' \
  -not -path '*/test*' \
  -not -path '*/app/bower_components*' \
  -not -path '*/app/fonts*' \
  -not -path '*/app/images*' \
  -not -path '*/app/styles/Lata/*' \
  -not -path '*/app/styles/Oxygen/*' \
  -a \( -name '*.js' -o -name '*.html' -o -name '*.scss' \) | xargs cat | wc -l
