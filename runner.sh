npm ci 
$APP_NAME="siri"
pm2 start src/index.js --name ${APP_NAME}
