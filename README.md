# ASL Alphabet Translation based on Hand Gesture Recognition
This project uses MediaPipe HandPose detection and a Teachable Machine Model to recognize American Sign Language (ASL) hand gestures from a live video feed. The recognized gestures are converted to text and displayed on the screen, with options to include a frequency tracker and text-to-speech functionality.

Features
Hand Gesture Detection: Detects hand keypoints using MediaPipe and draws keypoint landmarks on the video feed.
ASL to Text Translation: Predicts ASL letters using a machine learning model trained with Teachable Machine.
Letter Frequency Tracker: Tracks the frequency of each detected letter and displays it on the screen.
Text-to-Speech: Converts the translated text to speech using the Web Speech API.
Special Keys: Supports special actions like SPACE (for space character) and DELETE (for deleting characters).
Smoothing Predictions: Utilizes a history buffer to determine the most stable predicted letter over a series of frames, improving accuracy.
