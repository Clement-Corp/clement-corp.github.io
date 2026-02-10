import React, { useState, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Frame {
  id: string;
  name: string;
  positions: Record<string, Position>; // dancerName -> position
}

export function Choreography() {
  const [dancers, setDancers] = useState<string[]>([]);
  const [newDancerName, setNewDancerName] = useState('');
  const [frames, setFrames] = useState<Frame[]>([{ id: '1', name: 'Frame 1', positions: {} }]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const currentFrame = frames[currentFrameIndex];

  const addDancer = () => {
    if (newDancerName && !dancers.includes(newDancerName)) {
      setDancers([...dancers, newDancerName]);
      setNewDancerName('');
    }
  };

  const removeDancer = (name: string) => {
    setDancers(dancers.filter(d => d !== name));
    setFrames(frames.map(frame => {
      const newPositions = { ...frame.positions };
      delete newPositions[name];
      return { ...frame, positions: newPositions };
    }));
  };

  const addFrame = () => {
    const newFrame: Frame = {
      id: Date.now().toString(),
      name: `Frame ${frames.length + 1}`,
      positions: { ...currentFrame.positions }, // Copy positions from current frame
    };
    setFrames([...frames, newFrame]);
    setCurrentFrameIndex(frames.length);
  };

  const removeFrame = (id: string) => {
    if (frames.length === 1) return;
    const newFrames = frames.filter(f => f.id !== id);
    setFrames(newFrames);
    if (currentFrameIndex >= newFrames.length) {
      setCurrentFrameIndex(newFrames.length - 1);
    }
  };

  const updateDancerPosition = (dancerName: string, x: number, y: number) => {
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...newFrames[currentFrameIndex],
      positions: {
        ...newFrames[currentFrameIndex].positions,
        [dancerName]: { x, y },
      },
    };
    setFrames(newFrames);
  };

  const handleDragStart = (e: React.DragEvent, dancerName: string) => {
    e.dataTransfer.setData('dancerName', dancerName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!stageRef.current) return;

    const dancerName = e.dataTransfer.getData('dancerName');
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateDancerPosition(dancerName, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col p-4 h-screen bg-gray-100 text-gray-800">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Choreography Planner</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:underline"
          >
            Home
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white p-4 rounded-xl shadow-md overflow-y-auto flex flex-col">
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-1">Dancers</h2>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newDancerName} 
                onChange={(e) => setNewDancerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDancer()}
                className="border rounded px-3 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dancer name"
              />
              <button 
                onClick={addDancer} 
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {dancers.length === 0 && <p className="text-gray-400 text-sm italic">No dancers added yet.</p>}
              {dancers.map(dancer => (
                <div 
                  key={dancer} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, dancer)}
                  className="bg-gray-50 border border-gray-200 p-2 rounded cursor-grab active:cursor-grabbing hover:bg-gray-100 transition text-sm flex justify-between items-center group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{dancer}</span>
                    {!currentFrame.positions[dancer] && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold">Off Stage</span>
                    )}
                  </div>
                  <button 
                    onClick={() => removeDancer(dancer)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Frames</h2>
              <button 
                onClick={addFrame} 
                className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-emerald-600 transition"
              >
                + NEW FRAME
              </button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {frames.map((frame, index) => (
                <div key={frame.id} className="flex gap-1 group">
                  <button 
                    onClick={() => setCurrentFrameIndex(index)}
                    className={`flex-1 text-left p-2 rounded text-sm transition ${index === currentFrameIndex ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {index + 1}. {frame.name}
                  </button>
                  {frames.length > 1 && (
                    <button 
                      onClick={() => removeFrame(frame.id)}
                      className="text-gray-400 hover:text-red-500 px-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Area */}
        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex justify-between items-center bg-white p-2 px-4 rounded-t-lg shadow-sm border-b">
            <span className="font-bold text-blue-800 uppercase tracking-wider">{currentFrame.name}</span>
            <span className="text-xs text-gray-500 italic">Drag dancers from the list or move them on the stage</span>
          </div>
          <div 
            ref={stageRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex-1 bg-white border-b-4 border-x-4 border-gray-300 rounded-b-lg relative overflow-hidden shadow-inner"
            style={{ 
              backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)', 
              backgroundSize: '30px 30px' 
            }}
          >
            {/* Center line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 pointer-events-none"></div>

            {dancers.map(dancer => {
              const pos = currentFrame.positions[dancer];
              if (!pos) return null;
              return (
                <div
                  key={dancer}
                  draggable
                  onDragStart={(e) => handleDragStart(e, dancer)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2 border-white group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 10 }}
                >
                  <span className="text-xs font-black truncate px-1">{dancer.substring(0, 3).toUpperCase()}</span>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {dancer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Choreography;
