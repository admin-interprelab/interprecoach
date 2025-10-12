const express = require('express');
const https = require('https');
const fs = require('fs');
const { Server } = require("socket.io");
const speech = require('@google-cloud/speech');

const app = express();

const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');

const server = https.createServer({ key, cert }, app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = 8080;

const speechClient = new speech.SpeechClient();

const request = {
  config: {
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
    model: 'medical_conversation',
  },
  interimResults: true,
};

app.get('/', (req, res) => {
  res.send('Transcription Service is running!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let recognizeStream = null;

  socket.on('audioStream', (data) => {
    if (!recognizeStream) {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', console.error)
        .on('data', data => {
          socket.emit('transcript', data.results[0].alternatives[0].transcript);
        });
    }
    recognizeStream.write(data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (recognizeStream) {
      recognizeStream.end();
    }
  });
});

server.listen(port, () => {
  console.log(`Transcription Service listening at https://localhost:${port}`);
});