# ASL Alphabet Translation based on Hand Gesture Recognition
A work-in-progress simple project, inspired by several other projects.<br>
This project uses MediaPipe HandPose detection and a Teachable Machine Model to recognize American Sign Language (ASL) alphabet hand signs from a live video feed. The recognized signs are converted to text and displayed on the screen, with options to include a frequency tracker and text-to-speech functionality.

# Features
- **Hand Gesture Detection:** Detects hand keypoints using MediaPipe and draws keypoint landmarks on the video feed.
- **ASL to Text Translation:** Predicts ASL letters using a machine learning model trained with Teachable Machine.
- **Letter Frequency Tracker:** Tracks the frequency of each detected letter and displays it on the screen.
- **Text-to-Speech:** Converts the translated text to speech using the Web Speech API.
- **Special Keys:** Supports SPACE (for space character) and DELETE (for deleting characters).
- **Smoothing Predictions:** Utilizes a history buffer to determine the most stable predicted letter over a series of frames, improving accuracy.

# How It Works
1. **Hand Detection:**
The app uses MediaPipe’s HandPose model to detect keypoints of the hand in real-time. It draws keypoints and connections on the video feed to visualize hand gestures.

2. **Letter Prediction:**
The Teachable Machine model predicts the ASL letter based on the video frames. The most frequent letter prediction is shown in the letter container, updated at each frame.

3. **Prediction History and Smoothing:**
Predictions are stored in a history array to smooth the predictions and avoid flickering between different letters. The stableLetter function ensures that the most frequent letter in the last few frames is chosen.

4. **Special Cases:**
The system recognizes specific commands like "SPACE" to insert a space and "DELETE" to remove the last character from the text.

5. **Text-to-Speech:**
If no hand gestures are detected for 5 seconds, the current text in the letter container is spoken aloud using the browser's Web Speech API.

**Setup**
To get started with this project, follow these steps:

**Prerequisites**
- A browser that supports WebRTC (for camera access) and Web Speech API.
- Internet access to load MediaPipe and Teachable Machine models via CDN.

Installation
Clone the repository:
```git bash
git clone https://github.com/your-username/asl-hand-gesture-recognition.git
cd asl-hand-gesture-recognition
```
Open index.html in a browser:
```git bash
open index.html
```

**Usage**
- Allow the browser to access the webcam when prompted.
- Hold your hand in the frame and make an ASL gesture. The predicted letter will be displayed on the screen.
- View the frequency of each detected letter on the side.
- If no gesture is detected for 5 seconds, the current string will be spoken aloud.
<br>
**Model Integration**
To replace the current model with your own, follow these steps:
Train a new model on Teachable Machine. (Currently, code is structured around )
Download the model files (model.json, metadata.json, and weights.bin).
Replace the files in the tm-my-image-model directory with your new model files.
<br>
**Customization**
- Hand Connections: The keypoint connections can be customized in scripts.js under the handConnections array.
- Text-to-Speech Delay: The no-gesture timer can be adjusted by changing the value of noHandDelay (currently set to 5000ms).
- Letter History Size: The number of frames used for smoothing predictions is controlled by the historySize variable (currently set to 10).
<br>
**Future Enhancements**
- Add support for two-hand gesture recognition.
- Improve model accuracy with more training data.
- Implement a word or sentence prediction system to further streamline communication.

