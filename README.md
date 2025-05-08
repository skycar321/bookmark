nohup java \
  --add-opens java.base/java.io=ALL-UNNAMED \
  -XX:MaxPermSize=128m \
  -Xms2048m -Xmx12g \
  -Djasypt.encryptor.password=1234@ \
  -Dspring.profiles.active="${APPLICATION PROFILE}" \
  -Dinnoexpert.home="${RULE PATH}" \
  -Dapplication.log.path="${LOG_PATH}" \
  -jar "${JAR}" --server.port="${APPLICATION PORT}" \
  > /app/batch/log.log 2>&1 &
