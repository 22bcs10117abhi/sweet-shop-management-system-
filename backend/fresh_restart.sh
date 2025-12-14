#!/bin/bash

echo "removing node modules"

rm -rf ./node_modules

echo "modules removed"

echo "install fresh modules"

echo "switching to node 22 version"
nvm use 22
npm i

echo "fresh moduls installed"
echo "starting server"
node src/index.js
