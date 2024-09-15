# ASL Alphabet Translation based on Hand Gesture Recognition
A work-in-progress simple project, inspired by several other projects.
This project uses MediaPipe HandPose detection and a Teachable Machine Model to recognize American Sign Language (ASL) hand gestures from a live video feed. The recognized gestures are converted to text and displayed on the screen, with options to include a frequency tracker and text-to-speech functionality.

Features
- **Hand Gesture Detection:** Detects hand keypoints using MediaPipe and draws keypoint landmarks on the video feed.
- **ASL to Text Translation:** Predicts ASL letters using a machine learning model trained with Teachable Machine.
- **Letter Frequency Tracker:** Tracks the frequency of each detected letter and displays it on the screen.
- **Text-to-Speech:** Converts the translated text to speech using the Web Speech API.
- **Special Keys:** Supports SPACE (for space character) and DELETE (for deleting characters).
- **Smoothing Predictions:** Utilizes a history buffer to determine the most stable predicted letter over a series of frames, improving accuracy.

How It Works
1. Hand Detection:
The app uses MediaPipe’s HandPose model to detect keypoints of the hand in real-time. It draws keypoints and connections on the video feed to visualize hand gestures.

2. Letter Prediction:
The Teachable Machine model predicts the ASL letter based on the video frames. The most frequent letter prediction is shown in the letter container, updated at each frame.

3. Prediction History and Smoothing:
Predictions are stored in a history array to smooth the predictions and avoid flickering between different letters. The stableLetter function ensures that the most frequent letter in the last few frames is chosen.

4. Special Cases:
The system recognizes specific commands like "SPACE" to insert a space and "DELETE" to remove the last character from the text.

5. Text-to-Speech:
If no hand gestures are detected for 5 seconds, the current text in the letter container is spoken aloud using the browser's SpeechSynthesis API.


