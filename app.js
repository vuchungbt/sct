const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
//const csrf = require('csurf');
const flash = require('connect-flash');
var cors = require('cors');

// const dbConnect = require('./config/database');
const webRoutes = require('./routes/web');
const supplierRoutes = require('./routes/supplier');

const app = express();

app.set('view engine','ejs');
app.set('views','resource/views');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}));
//app.use(express.static(path.join(__dirname,'public')));
app.use(express.static("public")); //static rsc from public folder


app.use(cookieParser());
//app.use(csrf({ cookie: true }));

app.use(session({
    name: "my-session-name",
    secret: 'keyboardcat',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3*24*60*60*1000 },
   // cookie: { secure: true, httpOnly: true }
}));
app.use(flash());

app.use((req, resp, next) => {
    //resp.locals.csrfToken = req.csrfToken();
    resp.locals.auth = req.session.auth? req.session.auth : false;
    resp.locals.username = req.session.username? req.session.username : '';
    resp.locals.user_id = req.session.id? req.session.id : '';
    resp.locals.roles = req.session.roles?req.session.roles:'';
    resp.locals.routeName = req.originalUrl.split('/')[1];
    resp.locals.message = req.flash();
    resp.locals.notification = req.session.notification;
    next();
});


app.use(webRoutes);//
app.use('/stock',supplierRoutes);

 app.use((req,resp,next) => {
    // resp.status(404).sendFile(path.join(__dirname,'views','errors','404.html'));
    resp.status(404).render('errors/404');
 });

 app.use((error,req,resp,next) => {
    // resp.status(404).sendFile(path.join(__dirname,'views','errors','404.html'));
    resp.status(500).render('errors/500',{
        error: error
    });
 });
 

 const port = process.env.PORT || 3040;
 const server = require("http").Server(app);
 server.listen(port, () => console.log(`Started on port ${port}...`));
 

// const http = require('http');
//Core way of http server initialization
// const test = (req,res) => {
//     res.write("<h1>Hi I am  here</h1>");
//     return res.end();
// }

// const server = http.createServer(test);
// server.listen(8000);
