import express from "express"; // express server
import { dirname } from "path"; // files for route handler
import { fileURLToPath } from "url"; // files for route handler
import bcrypt from "bcrypt"; // for password hashing
import flash from "express-flash"; // for flash messages
import session from "express-session"; // for session management
import dotenv from "dotenv"; // for loading environment variables
import passport from "passport"; // for authentication

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const users = [];

// Import and initialize Passport configuration
import initializePassport from './passport-config.js';
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware for flash messages
app.use(flash());

// Middleware for session management
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Define routes
app.get("/", (req, res) => {
    try {
      if (req.isAuthenticated()) {
        res.render("index.ejs", { user: req.user });
      } else {
        res.render("index.ejs", { user: null });
      }
    } catch (error) {
      console.error("Error rendering index page:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.get("/my-story", (req, res) => {
  res.render("my-story.ejs",{user:req.user});
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs', {user:req.user});
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});


app.get('/blog',(req,res)=> {
    res.render("blog.ejs", {user:req.user})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', {user:req.user});
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/register',
  failureRedirect: '/login',
  failureFlash: true
}));

// In your server.js or app.js file

// Add this route to handle the logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/');
      }
  
      res.clearCookie('connect.sid'); // Clear the cookie used for session
      res.redirect('/'); // Redirect to login page or homepage
    });
  });
  

app.get('/myAccount',(req,res)=> {
    res.render('myAccount.ejs',{user:req.user});
})
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/register');
  }
  next();
}

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
