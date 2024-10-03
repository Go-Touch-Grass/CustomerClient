# To Run CustomerClient


## If you are running on Expo Go (Physical Mobile Device):

### Pre-Requisites:
1. Download Expo Go on your mobile phone

2. Ensure the commonbackend is running


### Steps to follow:
1. Open up customerclient folder

2. Go to your .env file, and input your local machine's IP Address
e.g. http://192.168.XX.XXX:8080/ and save

3. Install the necessary packages by running 'npm install'

4. Once the packages are installed, run the command 'npx expo start' to run the frontend
- Once the frontend is running, a QR code should be generated in the terminal

5. Open up your mobile device's camera and scan the QR code
- It will redirect you to Expo Go on your phone

6. Wait for Expo Go to finish setting up packages, and the mobile app should appear on your phone under the 'Expo Go' app




## If you are running on Virtual Emulator:

### Pre-Requisites:
1. Download and set up Android Studio on your local machine
- Android Studio can be downloaded from here: https://developer.android.com/studio

2. Set up virtual phone on Android Studio
- If you are using Windows and facing issues setting up the virtual phone due to HAXM being unable to install, refer to this: https://stackoverflow.com/questions/32795704/failed-to-install-haxm-during-android-studio-installation
- For the issue stated above, go to your operating system's BIOS and enable Virtualization (VT-x) because it is set to disabled by nature for Windows

3. Ensure that Anrdoid Studio is up and running

### Steps to follow: 
1. Open up customerclient folder

2. Go to your .env file, and input your local machine's IP Address
e.g. http://192.168.XX.XXX:8080/ and save

3. Install the necessary packages by running 'npm install'

4. Once the packages are installed, run the command 'npm run android' to run the frontend on your virtual phone emulator from Android Studio