#!/bin/bash
set -o xtrace

if [ -z "$TRAVIS_TAG" ];
then
  # Deploy to dev
 echo "Temporary alternative Deploying to dev."
 #For now we will rely on an alternative deploy which doesn't depend on bintray
 sshpass -p$TRAVIS_USER_PASSWORD ssh -o StrictHostKeyChecking=no travis@dev.esaude.org 'curl -sL https://raw.githubusercontent.com/esaude/esaude-poc-docker/master/scripts/dev-server-manual-deploy.sh | bash';
else
  # Deploy to test if tag
  echo "Deploying to test because this is a tag."
  sshpass -p$TRAVIS_TEST_USER_PASSWORD ssh -o StrictHostKeyChecking=no travis@test-ssh.esaude.org 'curl -sL https://raw.githubusercontent.com/esaude/esaude-poc-docker/master/scripts/dev-server-deploy.sh | POC_VERSION='"$TRAVIS_TAG"' bash';
fi
