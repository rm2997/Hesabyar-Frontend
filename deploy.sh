#!/bin/bash

DEPLOY_DIR="../hesabyaar_front_deploy"

echo "Start deploying..."
pattern=`date  '+%Y-%m-%d_%H%M%S'`
mv  ./build/ ../build_${pattern}
npm run build

rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

echo "Start copying..."

cp -r build $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/

if [ -f .env ]; then
  cp .env $DEPLOY_DIR/
fi
echo "Compressing deploy..."
zip -r ${DEPLOY_DIR}_${pattern}.zip $DEPLOY_DIR/
echo "Deploying finished..."
