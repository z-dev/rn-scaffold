CONFIGURATION=$CONFIGURATION||"Staging"
BUILD_DIR=ios/release
IPA_FILE_NAME="app.ipa"
IPA="$BUILD_DIR/$IPA_FILE_NAME"
WORKSPACE_FILE="ios/.xcworkspace/"
SCHEME=""
echo "Configuration: $CONFIGURATION"
echo "IPA: $IPA"
echo "IPA_FILE_NAME: $IPA_FILE_NAME"

fastlane gym --workspace $WORKSPACE_FILE --scheme $SCHEME --configuration $CONFIGURATION --output_directory $BUILD_DIR --output_name $IPA_FILE_NAME && \
  fastlane deliver --ipa "$IPA" --force
