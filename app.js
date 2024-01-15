require('dotenv').config();

const express = require("express");
const expressLayout = require('express-ejs-layouts');
const methodOverrides = require('method-override')
const cookieParser = require('cookie-parser');
const mongooseStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { isActiveRoute } = require('./server/helpers/routerHelpers')

const app = express();
const PORT = 7000 || process.env.PORT;

//Connect DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverrides('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.listen(PORT, () => {
    console.log(`App is listen on PORT ${PORT}`);
});

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));


