const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
    secret: 'rewear-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/Rewear', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
  });

// Schemas
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 100 },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const itemSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Tops', 'Bottoms', 'Dresses', 'Accessories', 'Shoes', 'Outerwear']
    },
    type: { type: String, required: true },
    size: { type: String, required: true },
    condition: { 
        type: String, 
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair']
    },
    tags: [String],
    status: { 
        type: String, 
        default: 'pending',
        enum: ['pending', 'approved', 'unavailable']
    },
    images: [String]
}, { timestamps: true });

const swapSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemOwnerEmail: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    status: { 
        type: String, 
        default: 'pending',
        enum: ['pending', 'accepted', 'declined', 'completed']
    },
    type: {
        type: String,
        enum: ['swap', 'points'],
        required: true
    },
    pointsUsed: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const Swap = mongoose.model('Swap', swapSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Routes

// Auth routes
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = new User({ email, password });
        await user.save();
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            points: user.points,
            isAdmin: user.isAdmin
        };
        
        res.json({ 
            user: {
                id: user._id,
                email: user.email,
                points: user.points,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/api/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            id: user._id,
            email: user.email,
            points: user.points,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Item routes
app.get('/api/items', async (req, res) => {
    try {
        const { status, category, condition, userEmail } = req.query;
        const filter = {};
        
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (condition) filter.condition = condition;
        if (userEmail) filter.userEmail = userEmail;
        
        const items = await Item.find(filter).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ error: 'Error fetching items' });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({ error: 'Error fetching item' });
    }
});

app.post('/api/items', requireAuth, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, category, type, size, condition, tags } = req.body;
        
        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        
        const item = new Item({
            userEmail: req.session.user.email,
            title,
            description,
            category,
            type,
            size,
            condition,
            tags: tags ? JSON.parse(tags) : [],
            images: imageUrls,
            status: req.session.user.isAdmin ? 'approved' : 'pending'
        });
        
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        console.error('Add item error:', error);
        res.status(500).json({ error: 'Error adding item' });
    }
});

// Admin routes
app.get('/api/admin/items', requireAdmin, async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Admin get items error:', error);
        res.status(500).json({ error: 'Error fetching items' });
    }
});

app.put('/api/admin/items/:id/approve', requireAdmin, async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id, 
            { status: 'approved' }, 
            { new: true }
        );
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(item);
    } catch (error) {
        console.error('Approve item error:', error);
        res.status(500).json({ error: 'Error approving item' });
    }
});

app.delete('/api/admin/items/:id/reject', requireAdmin, async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json({ message: 'Item rejected and deleted successfully' });
    } catch (error) {
        console.error('Reject item error:', error);
        res.status(500).json({ error: 'Error rejecting item' });
    }
});

// Swap routes
app.get('/api/swaps', requireAuth, async (req, res) => {
    try {
        const swaps = await Swap.find({
            $or: [
                { requesterEmail: req.session.user.email },
                { itemOwnerEmail: req.session.user.email }
            ]
        }).populate('itemId').sort({ createdAt: -1 });
        
        res.json(swaps);
    } catch (error) {
        console.error('Get swaps error:', error);
        res.status(500).json({ error: 'Error fetching swaps' });
    }
});

app.post('/api/items/:id/request-swap', requireAuth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        
        if (!item || item.status !== 'approved') {
            return res.status(400).json({ error: 'Invalid item or item not available' });
        }
        
        if (item.userEmail === req.session.user.email) {
            return res.status(400).json({ error: 'Cannot swap your own item' });
        }
        
        // Check if swap request already exists
        const existingSwap = await Swap.findOne({
            itemId: item._id,
            requesterEmail: req.session.user.email,
            status: 'pending'
        });
        
        if (existingSwap) {
            return res.status(400).json({ error: 'Swap request already exists' });
        }
        
        const swap = new Swap({
            itemId: item._id,
            itemOwnerEmail: item.userEmail,
            requesterEmail: req.session.user.email,
            type: 'swap'
        });
        
        await swap.save();
        await swap.populate('itemId');
        
        res.status(201).json(swap);
    } catch (error) {
        console.error('Request swap error:', error);
        res.status(500).json({ error: 'Error requesting swap' });
    }
});

app.post('/api/items/:id/redeem-points', requireAuth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        
        if (!item || item.status !== 'approved') {
            return res.status(400).json({ error: 'Invalid item or item not available' });
        }
        
        if (item.userEmail === req.session.user.email) {
            return res.status(400).json({ error: 'Cannot redeem your own item' });
        }
        
        const user = await User.findById(req.session.user.id);
        const requiredPoints = 50;
        
        if (user.points < requiredPoints) {
            return res.status(400).json({ error: 'Insufficient points' });
        }
        
        // Deduct points
        user.points -= requiredPoints;
        await user.save();
        
        // Create completed swap
        const swap = new Swap({
            itemId: item._id,
            itemOwnerEmail: item.userEmail,
            requesterEmail: req.session.user.email,
            type: 'points',
            pointsUsed: requiredPoints,
            status: 'completed'
        });
        
        await swap.save();
        
        // Mark item as unavailable
        item.status = 'unavailable';
        await item.save();
        
        // Update session
        req.session.user.points = user.points;
        
        await swap.populate('itemId');
        
        res.json({ 
            swap,
            newPointsBalance: user.points
        });
    } catch (error) {
        console.error('Redeem points error:', error);
        res.status(500).json({ error: 'Error redeeming points' });
    }
});

app.put('/api/swaps/:id/accept', requireAuth, async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id).populate('itemId');
        
        if (!swap) {
            return res.status(404).json({ error: 'Swap not found' });
        }
        
        if (swap.itemOwnerEmail !== req.session.user.email) {
            return res.status(403).json({ error: 'Not authorized to accept this swap' });
        }
        
        if (swap.status !== 'pending') {
            return res.status(400).json({ error: 'Swap is not pending' });
        }
        
        // Update swap status
        swap.status = 'accepted';
        await swap.save();
        
        // Mark item as unavailable
        await Item.findByIdAndUpdate(swap.itemId._id, { status: 'unavailable' });
        
        // Award points to item owner
        await User.findOneAndUpdate(
            { email: swap.itemOwnerEmail },
            { $inc: { points: 25 } }
        );
        
        res.json(swap);
    } catch (error) {
        console.error('Accept swap error:', error);
        res.status(500).json({ error: 'Error accepting swap' });
    }
});

app.put('/api/swaps/:id/decline', requireAuth, async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id).populate('itemId');
        
        if (!swap) {
            return res.status(404).json({ error: 'Swap not found' });
        }
        
        if (swap.itemOwnerEmail !== req.session.user.email) {
            return res.status(403).json({ error: 'Not authorized to decline this swap' });
        }
        
        if (swap.status !== 'pending') {
            return res.status(400).json({ error: 'Swap is not pending' });
        }
        
        swap.status = 'declined';
        await swap.save();
        
        res.json(swap);
    } catch (error) {
        console.error('Decline swap error:', error);
        res.status(500).json({ error: 'Error declining swap' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});