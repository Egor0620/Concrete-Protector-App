#!/bin/bash
rm server.zip
zip -9 -r \
--exclude=*.git* \
--exclude=*.idea* \
--exclude=*.jshintrc* \
--exclude=*.DS_Store* \
--exclude=*.sh* \
--exclude=*node_modules* \
--exclude=*Gruntfile.js* \
--exclude=*skip* \
--exclude=*SQL* \
--exclude=*.zip* \
server.zip * -r