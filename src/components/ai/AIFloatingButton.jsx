import React, { useState } from 'react';
import { Zap, X } from 'lucide-react';
import AIChatWindow from './AIChatWindow';

export default function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-8 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95"
          title="Chat với AI"
        >
          <Zap size={24} />
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 h-96 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition"
              title="Đóng"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Window */}
          <AIChatWindow />
        </div>
      )}
    </>
  );
}
