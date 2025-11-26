import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import '../App.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Update stats when tasks change
  useEffect(() => {
    updateStats();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to load tasks:', error);
      showError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const newStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length
    };
    setStats(newStats);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await tasksAPI.create(newTask.trim());
        setTasks(prev => [...prev, response.data]);
        setNewTask('');
        showSuccess('Task added successfully!');
      } catch (error) {
        console.error('Failed to create task:', error);
        showError('Failed to create task. Please try again.');
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      showSuccess('Task deleted successfully!');
    } catch (error) {
      console.error('Failed to delete task:', error);
      showError('Failed to delete task. Please try again.');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await tasksAPI.update(id, { status });
      setTasks(prev => prev.map(task => 
        task.id === id ? response.data : task
      ));
      showSuccess('Task updated successfully!');
    } catch (error) {
      console.error('Failed to update task:', error);
      showError('Failed to update task. Please try again.');
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    if (completedTasks.length === 0) return;

    try {
      // Delete all completed tasks
      for (const task of completedTasks) {
        await tasksAPI.delete(task.id);
      }
      setTasks(prev => prev.filter(task => task.status !== 'completed'));
      showSuccess('Completed tasks cleared!');
    } catch (error) {
      console.error('Failed to clear completed tasks:', error);
      showError('Failed to clear completed tasks.');
    }
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' ? true : task.status === filter
  );

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      default: return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <h2>Loading your dashboard...</h2>
        <p>Getting everything ready for you</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1 className="header-title">
                <span className="welcome-text">Welcome back,</span>
                <span className="user-name">{user?.name}!
                </span>
              </h1>
              <p className="header-subtitle">Here's what's happening with your tasks today</p>
            </div>
            <div className="header-actions">
              <div className="user-greeting">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-greet">Hi, {user?.name?.split(' ')[0]}!</span>
              </div>
              <button
                onClick={logout}
                className="btn-logout"
              >
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container dashboard-content">
        {/* Notifications */}
        {(error || success) && (
          <div className={`notification ${error ? 'error' : 'success'}`}>
            <span className="notification-icon">
              {error ? '❌' : '✅'}
            </span>
            {error || success}
            <button 
              onClick={() => { setError(''); setSuccess(''); }}
              className="notification-close"
            >
              ×
            </button>
          </div>
        )}

        {/* Progress Overview */}
        <div className="progress-section">
          <div className="progress-header">
            <h2>Your Progress</h2>
            <span className="completion-rate">{completionPercentage}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <div className="progress-stat">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Done</span>
            </div>
            <div className="progress-stat">
              <span className="stat-number">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="progress-stat">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">To Do</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card total-tasks">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-title">Total Tasks</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card completed-tasks">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-title">Completed</h3>
              <p className="stat-value">{stats.completed}</p>
            </div>
          </div>
          <div className="stat-card progress-tasks">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3 className="stat-title">In Progress</h3>
              <p className="stat-value">{stats.inProgress}</p>
            </div>
          </div>
          <div className="stat-card pending-tasks">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-title">Pending</h3>
              <p className="stat-value">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Add Task */}
        <div className="actions-section">
          <div className="add-task-card">
            <h2 className="section-title">Add New Task</h2>
            <div className="add-task-form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done today?"
                className="task-input"
              />
              <button
                onClick={addTask}
                className="btn-add-task"
                disabled={!newTask.trim()}
              >
                <span className="btn-icon">+</span>
                Add Task
              </button>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                onClick={clearCompleted}
                className="btn-action clear-completed"
                disabled={stats.completed === 0}
              >
                🗑️ Clear Completed
              </button>
              <button 
                onClick={loadTasks}
                className="btn-action refresh"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="task-management-section">
          <div className="section-header">
            <h2 className="section-title">Your Tasks</h2>
            <div className="section-controls">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Tasks ({stats.total})</option>
                <option value="pending">Pending ({stats.pending})</option>
                <option value="in-progress">In Progress ({stats.inProgress})</option>
                <option value="completed">Completed ({stats.completed})</option>
              </select>
            </div>
          </div>

          <div className="task-list">
            {filteredTasks.map((task, index) => (
              <div key={task.id} className="task-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="task-main">
                  <div className="task-status-section">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`task-status ${getStatusColor(task.status)}`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                  <div className="task-content">
                    <span className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                      {task.title}
                    </span>
                    <div className="task-meta">
                      <span className="task-date">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-delete-task"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No tasks found</h3>
              <p>
                {tasks.length === 0 
                  ? 'Get started by adding your first task above!' 
                  : 'No tasks match the current filter. Try changing the filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="footer-stat-value">{stats.total}</span>
            <span className="footer-stat-label">Total Tasks</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat-value">{completionPercentage}%</span>
            <span className="footer-stat-label">Completion Rate</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat-value">
              {tasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length}
            </span>
            <span className="footer-stat-label">Today's Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;