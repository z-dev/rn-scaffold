## rn-scaffold

rn-scaffold is a tool to help automate setting up the common parts of a react-native project:

* Different environments, debug, staging and release
* Provisioning profiles using match
* Deployment to Testflight and Playstore
* Notifications with firebase


It's opinionated, designed for real-life apps. We built it after building 5+ apps and doing the same steps over and over and screwing them up.

## Getting started

Install rn scaffold using: `npm install -g rn-scaffold`

In general we'll only be supporting the last minor version of the previous version of React Native (since this one is the most stable).

## Usage

If in doubt commands should be run in order listed below to avoid any errors!

`rn-scaffold react-native-init`
- runs react-native init
- renames your project correctly and updates the android package / file structure
- to switch react-native version use the flag `--react-native-version`

`rn-scaffold prettier-lint`
- Adds eslint, prettier and lint-staged to your project.

`rn-scaffold react-native-config`
- adds different build environments debug, staging and release to ios and android.
- adds different bundleIds and app names per environment, e.g. com.myApp.debug, myApp debug ect
- adds different app icons per environment
- adds [`react-native-schemes-manager`](https://github.com/Thinkmill/react-native-schemes-manager) to manage adding new environment to ios project
- adds code snippets to pass current environmet though intialProps into react-native app to allow correct config to be loaded
- add generates apk signing key stores for android environments

`rn-scaffold provisioning-profiles` (Requires manual steps that user needs complete, see logs for details)
- generates provisioning profiles per environment (debug, staging, release) for ios app on developer.apple.com
- syncs generated provisioning profiles to local machine


`rn-scaffold ios-deployment` (Requires `rn-scaffold provisioning-profiles` command to have been run first)
- adds deployment npm scripts for staging and release builds of app to app store
- adds `pushToITunes.sh` script to build ipa files and push them to itunes connect
- adds cocoa pods to app to create .xcworkspace file to generate ipa from


`rn-scaffold android-deployment`
- adds deployment npm scripts for staging and release builds of app to play store

`rn-scaffold notifications` (Requires `rn-scaffold provisioning-profiles` to have been run and cocoa pods to be installed. Requires a lot of manual user steps, see logs or details)
- generates ios certificates for push notifications per environment (debug, staging, release)
- adds FirebaseMessaging pod and installs react-native-fcm
- adds code to ios to handle multiple bundleIds for GoogleService-Info.plist files

## Running Locally

You can test local changes by doing something like:
```
(cd ../../scaffolding && npm i && npm build) && node ../../scaffolding/build/bin.js react-native-config
```
