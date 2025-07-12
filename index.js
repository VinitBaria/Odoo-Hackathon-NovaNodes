const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'rewear-secret',
    resave: false,
    saveUninitialized: true
}));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/rewear', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => {
      console.error('MongoDB connection error:', err.message);
      console.error('Error stack:', err.stack);
      process.exit(1); // Exit if DB connection fails
  });

// Schemas
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In production, hash passwords
    points: { type: Number, default: 100 },
    isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

const itemSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    condition: { type: String, required: true },
    tags: [String],
    status: { type: String, default: 'pending' },
    images: { type: [String], default: ['/images/placeholder.jpg'] }
});
const Item = mongoose.model('Item', itemSchema);

const swapSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemOwnerEmail: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    status: { type: String, default: 'pending' }
});
const Swap = mongoose.model('Swap', swapSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const featuredItems = await Item.find({ status: 'approved' }).limit(3);
        res.render('index', { user: req.session.user, featuredItems });
    } catch (err) {
        console.error('Error in / route:', err);
        res.status(500).render('error', { error: 'Unable to load featured items. Please try again later.' });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'Email already exists' });
        }
        const user = new User({ email, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error('Error in /signup:', err);
        res.render('signup', { error: 'Error creating user' });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error in /login:', err);
        res.render('login', { error: 'Error logging in' });
    }
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const userItems = await Item.find({ userEmail: req.session.user.email });
        const userSwaps = await Swap.find({
            $or: [{ requesterEmail: req.session.user.email }, { itemOwnerEmail: req.session.user.email }]
        }).populate('itemId');
        res.render('dashboard', { user: req.session.user, userItems, userSwaps });
    } catch (err) {
        console.error('Error in /dashboard:', err);
        res.status(500).render('error', { error: 'Unable to load dashboard' });
    }
});

app.get('/item/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).render('error', { error: 'Item not found' });
        res.render('item', { user: req.session.user, item });
    } catch (err) {
        console.error('Error in /item/:id:', err);
        res.status(404).render('error', { error: 'Item not found' });
    }
});

app.get('/add-item', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('add-item', { user: req.session.user });
});

app.post('/add-item', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { title, description, category, type, size, condition, tags } = req.body;
        const item = new Item({
            userEmail: req.session.user.email,
            title,
            description,
            category,
            type,
            size,
            condition,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            status: req.session.user.isAdmin ? 'approved' : 'pending'
        });
        await item.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error in /add-item:', err);
        res.status(500).render('error', { error: 'Error adding item' });
    }
});

app.get('/admin', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) return res.redirect('/');
    try {
        const items = await Item.find();
        res.render('admin', { user: req.session.user, items });
    } catch (err) {
        console.error('Error in /admin:', err);
        res.status(500).render('error', { error: 'Unable to load admin panel' });
    }
});

app.post('/admin/approve/:id', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) return res.redirect('/');
    try {
        await Item.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.redirect('/admin');
    } catch (err) {
        console.error('Error in /admin/approve/:id:', err);
        res.redirect('/admin');
    }
});

app.post('/admin/reject/:id', async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) return res.redirect('/');
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error in /admin/reject/:id:', err);
        res.redirect('/admin');
    }
});

app.post('/item/:id/request-swap', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const item = await Item.findById(req.params.id);
        if (!item || item.status !== 'approved') {
            return res.status(400).render('error', { error: 'Invalid item' });
        }
        const swap = new Swap({
            itemId: item._id,
            itemOwnerEmail: item.userEmail,
            requesterEmail: req.session.user.email
        });
        await swap.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error in /item/:id/request-swap:', err);
        res.status(400).render('error', { error: 'Error requesting swap' });
    }
});

app.post('/item/:id/redeem-points', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const item = await Item.findById(req.params.id);
        if (!item || item.status !== 'approved') {
            return res.status(400).render('error', { error: 'Invalid item' });
        }
        const user = await User.findOne({ email: req.session.user.email });
        if (user.points < 50) {
            return res.status(400).render('error', { error: 'Insufficient points' });
        }
        user.points -= 50;
        await user.save();
        const swap = new Swap({
            itemId: item._id,
            itemOwnerEmail: item.userEmail,
            requesterEmail: req.session.user.email,
            status: 'completed'
        });
        await swap.save();
        item.status = 'unavailable';
        await item.save();
        req.session.user.points = user.points; // Update session
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error in /item/:id/redeem-points:', err);
        res.status(400).render('error', { error: 'Error redeeming points' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Error destroying session:', err);
        res.redirect('/');
    });
});

// Start server only if MongoDB is connected
mongoose.connection.once('open', () => {
    app.listen(3000, () => console.log('Server running on port 3000'));
});

mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});