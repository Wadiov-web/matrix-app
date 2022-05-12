#! /bin/bash

echo "Deployment started"

rm -r ~/web_development/nodePro1/client/build/

rm -r ~/web_development/nodePro1/startServer/build/

npm run build --prefix ~/web_development/nodePro1/client/

cp -r ~/web_development/nodePro1/client/build/ ~/web_development/nodePro1/startServer/

echo "Done"