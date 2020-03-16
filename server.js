const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const passportConfig = require('./config/passport');

const app = express();

app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.render('index');
});

const isLogged = (req, res, next) => {
  if(!req.user){
    res.redirect('/user/no-permission');
  } else {
    next();
  }
};

app.get('/user/logged', isLogged, (req, res, next) => {
  next();
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);


app.get('/user/profile', isLogged, (req, res) => {
  res.send('profile');
});

app.get('/user/profile/settings', isLogged, (req, res) => {
  res.send('profile-settings');
});

app.get('/auth.logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use('/', (req, res) => {
  res.status(404).render('notFound');
});

app.listen('8000', () => {
  console.log('Server is running on port: 8000');
});
