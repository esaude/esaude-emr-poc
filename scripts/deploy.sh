#!/bin/bash
set -o xtrace

# Deploy to dev
echo "Deploying to dev."
sshpass -p$TRAVIS_USER_PASSWORD ssh -o StrictHostKeyChecking=no travis@dev.esaude.org 'curl -sL https://raw.githubusercontent.com/esaude/esaude-poc-docker/master/scripts/dev-server-deploy.sh | bash';

# Deploy to test if tag
if [ -z "$TRAVIS_TAG" ];
then
  echo "Not deploying to test because this is not a tag.";
else
  echo "Deploying to test because this is a tag."
  sshpass -p$TRAVIS_TEST_USER_PASSWORD ssh -o StrictHostKeyChecking=no travis@test-ssh.esaude.org 'curl -sL https://raw.githubusercontent.com/esaude/esaude-poc-docker/master/scripts/dev-server-deploy.sh | bash';
fi
