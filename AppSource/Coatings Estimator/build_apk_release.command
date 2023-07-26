cd /Volumes/Work/Hybrid/Concrete/AppSource/Coatings\ Estimator
sudo ionic build android --release
sudo jarsigner -storepass Coatings -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore coatings.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk Coatings
sudo zipalign -f -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk coatings.apk
sudo adb install -r coatings.apk
sudo adb shell am start -n com.ionicframework.coatings642386/.MainActivity
