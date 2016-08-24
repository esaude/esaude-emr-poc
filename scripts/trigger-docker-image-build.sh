#!/bin/bash
set -o xtrace

if [ -z "$TRAVIS_TAG" ];
then
  # build from master
  POC_VERSION=master
else
  # build from tag
  POC_VERSION="$TRAVIS_TAG"
fi

# Notify to slack
SLACK_MESSAGE="New eSaude POC version ($POC_VERSION) published <https://bintray.com/esaude/poc/distributable|here>"
curl -X POST --data-urlencode 'payload={"username": "eSaude Bintray", "text": "'"$SLACK_MESSAGE"'", "icon_url": "https://bintray.com/assets/favicon.png"}' $SLACK_WEBHOOK_URL

body='{
  "request": {
    "branch":"master",
    "config": {
      "env": {
        "POC_VERSION": "'$POC_VERSION'"
      }
    }
  }
}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Travis-API-Version: 3" \
  -H "Authorization: token $TRAVIS_API_TOKEN" \
  -d "$body" \
  https://api.travis-ci.org/repo/esaude%2Fesaude-poc-docker/requests
