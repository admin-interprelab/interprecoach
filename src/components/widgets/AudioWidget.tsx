import React, { useState, useRef } from 'react';
import { Socket } from "socket.io-client";

interface AudioWidgetProps {
  socket: Socket | null;
}

const AudioWidget: React.FC<AudioWidgetProps> = ({ socket }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startSession = async () => {
    setError(null);
    if (chrome.tabCapture) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
            if (stream) {
              mediaStream.current = stream;
              setIsRecording(true);

              mediaRecorder.current = new MediaRecorder(stream);
              mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  socket?.emit('audioStream', event.data);
                }
              };
              mediaRecorder.current.start(1000);

              console.log('Tab audio capture started.');
            } else {
              setError('Could not capture tab audio.');
            }
          });
        }
      });
    } else {
      setError('Tab capture API is not available.');
    }
  };

  const stopSession = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    console.log('Recording stopped and microphone released.');
  };

  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-lg text-white">
      <h3 className="text-lg font-bold mb-2">Session Control</h3>
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startSession}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Stop Session
          </button>
        )}
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span>{isRecording ? 'Recording...' : 'Idle'}</span>
        </div>
      </div>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default AudioWidget;
