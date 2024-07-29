---
layout: default
title: Thumb up or down!
permalink: /thumb/
---

<img src="{{ '/assets/images/banner.webp' | relative_url }}" alt="banner" class="banner">

# Image classification: Thumb up or down
<a href="{{ '/tryme' | relative_url }}" class="btn btn-primary">Back to Try Me!</a>

<div>Use your left hand to give a thumb up or thumb down</div>
<button type='button' onclick='toggleWebcam()'>Start or Stop</button>
<video id="webcam" autoplay playsinline width="200" height="200"></video>
<div id='label-container'></div>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.3/dist/teachablemachine-image.min.js"></script>
<script type="text/javascript">

    let model, video, labelContainer, maxPredictions;
    let requestId;  // To track the requestAnimationFrame
    let isWebcamActive = false; // To track webcam state
    let isModelLoaded = false;  // To track if the model is loaded
    const URL = '/assets/models/thumb/';
    async function initModel() {
        if (!isModelLoaded) {
            const modelURL = URL + 'model.json';
            const metadataURL = URL + 'metadata.json';

            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            labelContainer = document.getElementById('label-container');
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement('div'));
            }
            isModelLoaded = true;
        }
    }

    async function setupWebcam() {
        video = document.getElementById('webcam');
        const constraints = {
            video: { width: 200, height: 200, facingMode: "user" }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    resolve(video);
                };
            });
        } catch (error) {
            console.error('Error accessing webcam', error);
        }
    }

    async function startWebcam() {
        await initModel();
        await setupWebcam();
        video.play();
        isWebcamActive = true;
        requestId = window.requestAnimationFrame(loop);
    }

    function stopWebcam() {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        if (requestId) {
            window.cancelAnimationFrame(requestId);
        }
        isWebcamActive = false;
    }

    async function loop() {
        if (isWebcamActive) {
            await predict();
            requestId = window.requestAnimationFrame(loop);
        }
    }

    async function predict() {
        let prediction = await model.predict(video);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }

    function toggleWebcam() {
        if (isWebcamActive) {
            stopWebcam();
        } else {
            startWebcam();
        }
    }
</script>

