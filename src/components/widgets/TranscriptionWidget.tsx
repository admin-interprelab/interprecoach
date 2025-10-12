import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface TranscriptionWidgetProps {
  socket: Socket | null;
  transcript: string;
  setTranscript: (transcript: string) => void;
}

const TranscriptionWidget: React.FC<TranscriptionWidgetProps> = ({ socket, transcript, setTranscript }) => {
  useEffect(() => {
    if (!socket) return;

    socket.on('transcript', (data) => {
      setTranscript(data);
    });

    return () => {
      socket.off('transcript');
    };
  }, [socket, setTranscript]);

  return (
    <div className="bg-white/5 rounded-lg p-4 col-span-2 flex flex-col">
      <h3 className="text-lg font-bold mb-2">Live Transcription</h3>
      <div className="flex-grow bg-black/20 rounded-md p-2 overflow-y-auto">
        <p className="text-sm">{transcript}</p>
      </div>
    </div>
  );
};

export default TranscriptionWidget;