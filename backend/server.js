import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.JWT_SECRET || 'intern-assignment-secret-key-2024';

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mock database (in real app, use MongoDB/PostgreSQL)
let users = [];
let tasks = [];

// Enhanced Auth middleware with better error handling
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Input validation middleware
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, status } = req.body;
  
  if (req.method === 'POST' && !title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be pending, in-progress, or completed' });
  }

  next();
};

// Routes

// Health check - Enhanced
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    // eslint-disable-next-line no-undef
    uptime: process.uptime(),
    // eslint-disable-next-line no-undef
    memory: process.memoryUsage(),
    usersCount: users.length,
    tasksCount: tasks.length
  });
});

// Register - Enhanced with validation
app.post('/api/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = { 
      id: uuidv4(), 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login - Enhanced
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email (case insensitive)
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get user profile - Enhanced
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        createdAt: user.createdAt
      } 
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Task CRUD operations - Enhanced

// Get all tasks for user with filtering and sorting
app.get('/api/tasks', authenticateToken, (req, res) => {
  try {
    const { status, sort = 'createdAt' } = req.query;
    let userTasks = tasks.filter(task => task.userId === req.user.userId);

    // Filter by status if provided
    if (status && status !== 'all') {
      userTasks = userTasks.filter(task => task.status === status);
    }

    // Sort tasks
    userTasks.sort((a, b) => new Date(b[sort]) - new Date(a[sort]));

    res.json(userTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task - Enhanced
app.post('/api/tasks', authenticateToken, validateTask, (req, res) => {
  try {
    const { title, status = 'pending' } = req.body;

    const task = {
      id: uuidv4(),
      userId: req.user.userId,
      title: title.trim(),
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(task);
    
    res.status(201).json({
      ...task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task - Enhanced
app.put('/api/tasks/:id', authenticateToken, validateTask, (req, res) => {
  try {
    const { title, status } = req.body;
    const taskIndex = tasks.findIndex(task => 
      task.id === req.params.id && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = { 
      ...tasks[taskIndex], 
      ...(title && { title: title.trim() }),
      ...(status && { status }),
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;

    res.json({
      ...updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task - Enhanced
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(task => 
      task.id === req.params.id && task.userId === req.user.userId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    
    res.status(200).json({ 
      message: 'Task deleted successfully',
      taskId: req.params.id
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get task statistics
app.get('/api/tasks/stats', authenticateToken, (req, res) => {
  try {
    const userTasks = tasks.filter(task => task.userId === req.user.userId);
    
    const stats = {
      total: userTasks.length,
      pending: userTasks.filter(task => task.status === 'pending').length,
      inProgress: userTasks.filter(task => task.status === 'in-progress').length,
      completed: userTasks.filter(task => task.status === 'completed').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((error, req, res) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 JWT Secret: ${JWT_SECRET === 'intern-assignment-secret-key-2024' ? 'Using default secret' : 'Using custom secret from environment'}`);
});

export default app;