import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionRouter from './src/routes/session.js';
import viewsRouter from './src/routes/views.js';
import handlebars from 'express-handlebars';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('.hbs', handlebars.engine({ extname: '.hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(session({
    store: MongoStore.create({
        mongoUrl: '',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 3600
    }), 
    secret: 'esteesmisecret',
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter)

const server = app.listen(8080, () =>  console.log(`Server running on port: ${server.address().port}`))