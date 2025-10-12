'use client';

import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faCircleHalfStroke, faMicrophone, faEllipsisVertical, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

// FontAwesome CSS import
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

// Import Widget Components
import TranscriptionWidget from './widgets/TranscriptionWidget';
import TerminologyWidget from './widgets/TerminologyWidget';
import NotesWidget from './widgets/NotesWidget';
import AudioWidget from './widgets/AudioWidget';
import QATipsWidget from './widgets/QATipsWidget';
import DictionaryWidget from './widgets/DictionaryWidget';

import { io, Socket } from "socket.io-client";

const CoachOverlay = () => {
  const [size, setSize] = useState({ width: 700, height: 500 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const newSocket = io("https://localhost:8080");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const themeClasses = isDarkTheme
    ? 'bg-gray-900/80 backdrop-blur-xl border border-white/10 text-gray-200'
    : 'bg-white/80 backdrop-blur-xl border border-black/10 text-gray-800';

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e, d) => { setPosition({ x: d.x, y: d.y }); }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.style.width,
          height: ref.style.height,
        });
        setPosition(position);
      }}
      minWidth={500}
      minHeight={400}
      dragHandleClassName="handle"
      className="absolute"
      data-testid="coach-overlay"
    >
      <div className={`w-full h-full rounded-xl shadow-2xl overflow-hidden flex flex-col ${themeClasses}`}>
        {/* Header */}
        <header className="handle cursor-move p-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLanguage} className="text-blue-400" />
            <h1 className="font-bold text-base">Interpre<span className="text-blue-400">Coach</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkTheme(!isDarkTheme)} className="focus:outline-none">
              <FontAwesomeIcon icon={faCircleHalfStroke} />
            </button>
            <FontAwesomeIcon icon={faMicrophone} className="text-green-400" />
            <button className="focus:outline-none">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
        </header>

        {/* Widgets Grid */}
        <main className="flex-grow p-2.5 grid grid-cols-3 gap-2.5">
          <TranscriptionWidget socket={socket} transcript={transcript} setTranscript={setTranscript} />
          <TerminologyWidget />
          <NotesWidget />
          <AudioWidget socket={socket} />
          <QATipsWidget />
          <DictionaryWidget />
        </main>

        {/* Footer */}
        <footer className="p-2 border-t border-white/10 flex items-center gap-2">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search terminology..."
            className="bg-transparent w-full focus:outline-none"
          />
        </footer>
      </div>
    </Rnd>
  );
};

export default CoachOverlay;