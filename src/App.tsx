import { useState } from 'react';
import TaskManager from './components/TaskManager';
import TimeTracker from './components/TimeTracker';
import Notes from './components/Notes';
import { CheckSquare, Clock, FileText } from 'lucide-react';

type Tab = 'tasks' | 'timer' | 'notes';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  const tabs = [
    { id: 'tasks' as Tab, label: 'Tasks', icon: CheckSquare },
    { id: 'timer' as Tab, label: 'Time Tracker', icon: Clock },
    { id: 'notes' as Tab, label: 'Notes', icon: FileText },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Productivity Dashboard</h1>
          <p className="text-white/80">Organize your work, track your time, and capture your thoughts</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'timer' && <TimeTracker />}
          {activeTab === 'notes' && <Notes />}
        </div>
      </div>
    </div>
  );
}

export default App;

