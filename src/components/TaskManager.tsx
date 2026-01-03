import { useState, useEffect } from 'react';
import { Task } from '../types';
import { storage } from '../utils/storage';
import { Check, Plus, Trash2, Edit2, Flag } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    setTasks(storage.tasks.get());
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    storage.tasks.set(updatedTasks);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      createdAt: Date.now(),
    };
    
    saveTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    saveTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
    ));
    setEditingId(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tasks</h2>
        
        {/* Add Task Form */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <textarea
            placeholder="Description (optional)..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
          />
          <div className="flex items-center gap-4">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              onClick={addTask}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                  task.completed
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : 'bg-white border-gray-200 hover:border-primary-300'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {task.completed && <Check size={14} className="text-white" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  {editingId === task.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTask(task.id, { title: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        autoFocus
                        onBlur={() => setEditingId(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <>
                      <h3
                        className={`font-semibold ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded border ${priorityColors[task.priority]}`}
                        >
                          <Flag size={12} className="inline mr-1" />
                          {task.priority}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {editingId !== task.id && (
                    <button
                      onClick={() => setEditingId(task.id)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
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
  );
}

