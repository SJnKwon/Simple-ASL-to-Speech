const video = document.getElementById('video');                     // Video container element
const letterContainer = document.getElementById('letter');          // Letter container element
const frequencyList = document.getElementById('frequency-list');    // Frequency list element

let handModel, tmModel, maxPredictions;
let predictionHistory = [];                                         // History to store predictions
const historySize = 10;                                             // Number of frames to store in history for smoothing
let finalLetter = '';                                               // The final determined letter
let lastLetter = '';                                                // The last letter added to the container
let letterFrequencyMap = {};                                        // Track the frequency of each letter
let clearFrequencyTimeout;                                          // Timeout for clearing frequency list
let noHandTimer;                                                    // Timer for no gesture detection
const noHandDelay = 5000;                                           // Delay for no gesture (5 seconds)

// Load the Teachable Machine model
async function loadTeachableMachineModel() {
    const modelURL = 'tm-my-image-model/model.json';
    const metadataURL = 'tm-my-image-model/metadata.json';

    try {
        tmModel = await tmImage.load(modelURL, metadataURL);
        maxPredictions = tmModel.getTotalClasses();
        console.log("Teachable Machine model loaded successfully");
    } catch (error) {
        console.error("Failed to load the Teachable Machine model", error);
    }
}

loadTeachableMachineModel();

// Asynchronously loading Hand Model
async function loadHandPoseModel() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'full'
    };
    const detector = await handPoseDetection.createDetector(model, detectorConfig);
    return detector;
}

// Initialize video stream
async function setupVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

// Keypoint connections defining hand structure
const handConnections = [
    [0, 1], [0, 5], [0, 9], [0, 13], [0, 17],
    [1, 2], [2, 3], [3, 4],
    [5, 6], [6, 7], [7, 8],
    [9, 10], [10, 11], [11, 12],
    [13, 14], [14, 15], [15, 16],
    [17, 18], [18, 19], [19, 20]
];

// Model Brain - hand detection, letter assignment, and landmarks drawing
async function handDetection(detector) {
    const predictions = await detector.estimateHands(video, {flipHorizontal: true});

    if (predictions.length > 0) {
        resetNoHandTimer();

        const hand = predictions[0]; // Assuming single hand detection
        const keypoints = hand.keypoints;

        const canvas = document.getElementById('hand-canvas');
        const ctx = canvas.getContext('2d');

        // Using 2D drawing context to draw predicted hand keypoints
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw lines between keypoints
        handConnections.forEach((connection) => {
            const [startIdx, endIdx] = connection;
            const startKeypoint = keypoints[startIdx];
            const endKeypoint = keypoints[endIdx];

            if (startKeypoint && endKeypoint) {
                ctx.beginPath();
                ctx.moveTo(startKeypoint.x * canvas.width / video.videoWidth, startKeypoint.y * canvas.height / video.videoHeight);
                ctx.lineTo(endKeypoint.x * canvas.width / video.videoWidth, endKeypoint.y * canvas.height / video.videoHeight);
                ctx.lineWidth = 1;  // Set line thickness
                ctx.strokeStyle = 'green';  // Set line color
                ctx.stroke();
            }
        });

        // Drawing keypoints on the video
        keypoints.forEach(keypoint => {
            const { x, y } = keypoint;
            ctx.beginPath();
            ctx.arc(x * canvas.width / video.videoWidth, y * canvas.height / video.videoHeight, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        });

        await predictLetter();
    } else {
        // Clears canvas if no hand is detected
        const canvas = document.getElementById('hand-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(() => handDetection(detector));    
}

// Predict the letter based on the hand gesture
async function predictLetter() {
    try {
        const prediction = await tmModel.predict(video);
        const highestPrediction = prediction.reduce((max, p) => (p.probability > max.probability ? p : max), prediction[0]);

        // Add the current prediction to the history
        predictionHistory.push(highestPrediction.className);

        // Trim the history to maintain a fixed size
        if (predictionHistory.length > historySize) {
            predictionHistory.shift();  // Remove the oldest prediction
        }

        const mostStableLetter = stableLetter(predictionHistory);

        // If the most stable letter is different from the current final letter
        if (mostStableLetter !== finalLetter) {
            finalLetter = mostStableLetter;
            updateLetterContainer(finalLetter);
            updateLetterFrequency(finalLetter);
        }
    } catch (error) {
        console.error("Error during prediction", error);
    }
}

// Function to get the most stable letter from the history
function stableLetter(history) {
    const frequencyMap = history.reduce((acc, letter) => {
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
    }, {});

    // Find the most frequent letter
    return Object.keys(frequencyMap).reduce((a, b) => (frequencyMap[a] > frequencyMap[b] ? a : b));
}

// Update the letter container and handle special cases (SPACE, DELETE)
function updateLetterContainer(letter) {
    if (letter === 'SPACE') {
        letterContainer.textContent += ' ';
    } else if (letter === 'DELETE') {
        letterContainer.textContent = letterContainer.textContent.slice(0, -1);
    } else {
        if (letter === lastLetter) {
            letterContainer.textContent += letter;
        } else {
            letterContainer.textContent += letter;
            lastLetter = letter;
        }
    }
}

// Update the letter frequency and display it in the frequency container
function updateLetterFrequency(letter) {
    letterFrequencyMap[letter] = (letterFrequencyMap[letter] || 0) + 1;

    // Clear the existing timeout
    if (clearFrequencyTimeout) {
        clearTimeout(clearFrequencyTimeout);
    }

    // Clear the frequency list after 5 seconds
    clearFrequencyTimeout = setTimeout(() => {
        letterFrequencyMap = {};
        frequencyList.innerHTML = '';
    }, 5000);

    // Clear the list and update with new frequencies
    frequencyList.innerHTML = '';
    for (const [key, value] of Object.entries(letterFrequencyMap)) {
        const li = document.createElement('li');
        li.textContent = `${key}: ${value}`;
        frequencyList.appendChild(li);
    }
}

// Text-to-Speech Function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

// Reset no-gesture timer
function resetNoHandTimer() {
    if (noHandTimer) {
        clearTimeout(noHandTimer);
    }
    noHandTimer = setTimeout(() => {
        speak(letterContainer.textContent.trim()); // Speak the current text in the letter container
    }, noHandDelay);
}

// Run application
async function main() {
    await setupVideo();
    const detector = await loadHandPoseModel();
    handDetection(detector);
}

main();
