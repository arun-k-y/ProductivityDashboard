import { useState, useEffect, useRef } from 'react';
import { TimeEntry } from '../types';
import { storage } from '../utils/storage';
import { Play, Pause, Square, Clock, Trash2 } from 'lucide-react';

export default function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState('');
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setEntries(storage.timeEntries.get());
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    if (!description.trim()) {
      alert('Please enter a description for your timer');
      return;
    }
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    if (startTimeRef.current && description.trim()) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTimeRef.current) / 1000);
      
      const entry: TimeEntry = {
        id: Date.now().toString(),
        description,
        duration,
        startTime: startTimeRef.current,
        endTime,
        date: Date.now(),
      };
      
      const updatedEntries = [entry, ...entries];
      setEntries(updatedEntries);
      storage.timeEntries.set(updatedEntries);
    }
    
    setIsRunning(false);
    setElapsed(0);
    setDescription('');
    startTimeRef.current = null;
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    storage.timeEntries.set(updatedEntries);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  });

  const totalToday = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Time Tracker</h2>
        
        {/* Timer */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-8 mb-6 text-white">
          <div className="text-center">
            <div className="text-6xl font-bold mb-4 font-mono">
              {formatTime(elapsed)}
            </div>
            <input
              type="text"
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isRunning}
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            />
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                <Play size={20} />
                Start
              </button>
            ) : (
              <>
                <button
                  onClick={pauseTimer}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-semibold border border-white/30"
                >
                  <Pause size={20} />
                  Pause
                </button>
                <button
                  onClick={stopTimer}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  <Square size={20} />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock size={20} />
              <span className="font-semibold">Today's Total</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">
              {formatTime(totalToday)}
            </span>
          </div>
        </div>

        {/* Recent Entries */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {entries.slice(0, 10).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No time entries yet</p>
            ) : (
              entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{entry.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.startTime).toLocaleTimeString()} - {new Date(entry.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary-600">
                      {formatDuration(entry.duration)}
                    </span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

