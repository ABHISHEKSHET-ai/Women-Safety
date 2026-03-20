// Media Capture Utility for Emergency Alerts
// Handles camera photo capture and audio recording

class MediaCapture {
    constructor() {
        this.mediaRecorder = null;
        this.audioRecorder = null;
        this.photoStream = null;
        this.audioStream = null;
        this.capturedPhotos = [];
        this.audioChunks = [];
        this.isRecording = false;
        this.photoInterval = null;
    }

    /**
     * Start capturing photos every 2 seconds for specified duration
     * @param {number} duration - Duration in seconds (default 30)
     * @returns {Promise<Array>} Array of captured photo blobs
     */
    async startPhotoCapture(duration = 30) {
        try {
            // Request camera access
            this.photoStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment' // Use back camera on mobile
                }
            });

            this.capturedPhotos = [];
            const videoElement = document.createElement('video');
            videoElement.srcObject = this.photoStream;
            videoElement.play();

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Capture photo every 2 seconds
            const capturePhoto = () => {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                context.drawImage(videoElement, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        this.capturedPhotos.push({
                            blob: blob,
                            timestamp: new Date().toISOString(),
                            type: 'image/jpeg'
                        });
                        console.log(`Photo ${this.capturedPhotos.length} captured`);
                    }
                }, 'image/jpeg', 0.8);
            };

            // Wait for video to be ready
            await new Promise((resolve) => {
                videoElement.onloadedmetadata = resolve;
            });

            // Capture first photo immediately
            capturePhoto();

            // Capture photos every 2 seconds
            this.photoInterval = setInterval(capturePhoto, 2000);

            // Stop after specified duration
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.stopPhotoCapture();
                    resolve(this.capturedPhotos);
                }, duration * 1000);
            });

        } catch (error) {
            console.error('Photo capture error:', error);
            throw new Error('Camera access denied or not available: ' + error.message);
        }
    }

    /**
     * Stop photo capture
     */
    stopPhotoCapture() {
        if (this.photoInterval) {
            clearInterval(this.photoInterval);
            this.photoInterval = null;
        }

        if (this.photoStream) {
            this.photoStream.getTracks().forEach(track => track.stop());
            this.photoStream = null;
        }

        console.log(`Photo capture stopped. Total photos: ${this.capturedPhotos.length}`);
    }

    /**
     * Start audio recording for specified duration
     * @param {number} duration - Duration in seconds (default 30)
     * @returns {Promise<Blob>} Recorded audio blob
     */
    async startAudioRecording(duration = 30) {
        try {
            // Request microphone access
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            this.audioChunks = [];
            this.audioRecorder = new MediaRecorder(this.audioStream, {
                mimeType: this.getSupportedMimeType()
            });

            this.audioRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.isRecording = true;
            this.audioRecorder.start(1000); // Collect data every second

            console.log('Audio recording started');

            // Stop after specified duration
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.stopAudioRecording()
                        .then(resolve)
                        .catch(reject);
                }, duration * 1000);
            });

        } catch (error) {
            console.error('Audio recording error:', error);
            throw new Error('Microphone access denied or not available: ' + error.message);
        }
    }

    /**
     * Stop audio recording
     * @returns {Promise<Blob>} Recorded audio blob
     */
    stopAudioRecording() {
        return new Promise((resolve, reject) => {
            if (!this.audioRecorder || this.audioRecorder.state === 'inactive') {
                reject(new Error('No active recording'));
                return;
            }

            this.audioRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, {
                    type: this.getSupportedMimeType()
                });
                
                console.log(`Audio recording stopped. Size: ${(audioBlob.size / 1024).toFixed(2)} KB`);
                
                // Stop audio stream
                if (this.audioStream) {
                    this.audioStream.getTracks().forEach(track => track.stop());
                    this.audioStream = null;
                }

                this.isRecording = false;
                resolve(audioBlob);
            };

            this.audioRecorder.stop();
        });
    }

    /**
     * Start both photo and audio capture simultaneously
     * @param {number} duration - Duration in seconds (default 30)
     * @returns {Promise<Object>} Object containing photos and audio
     */
    async startEmergencyRecording(duration = 30) {
        console.log(`Starting emergency recording for ${duration} seconds...`);
        
        try {
            // Start both captures in parallel
            const [photos, audio] = await Promise.all([
                this.startPhotoCapture(duration),
                this.startAudioRecording(duration)
            ]);

            console.log(`Emergency recording complete. Photos: ${photos.length}, Audio size: ${(audio.size / 1024).toFixed(2)} KB`);

            return {
                photos: photos,
                audio: audio,
                duration: duration,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            // Stop any active recordings
            this.stopAll();
            throw error;
        }
    }

    /**
     * Stop all active recordings
     */
    stopAll() {
        this.stopPhotoCapture();
        if (this.isRecording) {
            this.stopAudioRecording().catch(console.error);
        }
    }

    /**
     * Get supported MIME type for audio recording
     * @returns {string} Supported MIME type
     */
    getSupportedMimeType() {
        const types = [
            'audio/webm',
            'audio/webm;codecs=opus',
            'audio/ogg;codecs=opus',
            'audio/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return 'audio/webm'; // Default fallback
    }

    /**
     * Get captured photos
     * @returns {Array} Array of photo blobs
     */
    getPhotos() {
        return this.capturedPhotos;
    }

    /**
     * Check if browser supports media capture
     * @returns {Object} Support status
     */
    static checkSupport() {
        return {
            camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            mediaRecorder: typeof MediaRecorder !== 'undefined'
        };
    }
}

// Export for use in other scripts
window.MediaCapture = MediaCapture;
