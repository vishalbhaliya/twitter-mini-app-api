const express = require('express');
const cors = require('cors');
const TweetController = require("./controllers/TweetController");

const bodyParser = require("body-parser");

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const TweetRoutes = require("./routes/TweetRoutes");
const UserRoutes = require("./routes/UserRoutes");
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');



dotenv.config();

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.JWT_AUTH_ISSUER}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.JWT_API_AUDIENCE,
  issuer: `https://${process.env.JWT_AUTH_ISSUER}/`,
  algorithms: ['RS256']
});


var corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();

// Set up mongoose connection

const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'));
app.use(cookieParser());
// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '100mb'}));
app.use(cors(corsOptions));




// config express-session
var sess = {
  secret: 'CHANGE THIS SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // If you are using a hosting provider which uses a proxy (eg. Heroku),
  // comment in the following app.set configuration command
  //
  // Trust first proxy, to prevent "Unable to verify authorization request state."
  // errors with passport-auth0.
  // Ref: https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614
  // Ref: https://www.npmjs.com/package/express-session#cookiesecure
  // app.set('trust proxy', 1);
  
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

app.use('/api/v1', TweetRoutes);
app.use('/api/v1', UserRoutes);
app.post("/api/v1/createTweet", checkJwt, TweetController.createTweet);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
db.once('open', function() {
  console.log('Connected!');
  const server = app.listen(PORT)
  const io = require('socket.io')(server);
  app.set("socketio", io);
  io.on("connection", (socket) => {
    console.log("connection done");
    socket.on("message", (msg) => {
      console.log("message ", msg);
    })
  })
});
