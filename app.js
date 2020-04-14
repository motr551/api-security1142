console.log('app.js')

var express = require('express');
var jwt  = require('jsonwebtoken');

var app = express();

app.get('/api', (req, res)=>{
  res.json({
    "message": "welcome to api"
  })
});


app.post('/api/unprotectedpost', (req, res)=>{
  res.json({
    message: 'unprotected post created...'
  })
})

app.post('/api/posts', verifyToken, (req, res)=>{
  jwt.verify(req.token, 'MySecretkey',  (err, authData) =>{
    if (err) {
      res.json({
        "message": "Token does not match -secretkey-! Get new token with matching -secretkey"
      });
    } else {
      res.json({
        message: 'Protected Post created...',
        authData
      })
    }
  })
  
})

app.post('/api/loginNoExpiry',  (req, res)=>{
  // get user from database. However, here simple
  // create user
  var user1 = {
    id: '1',
    username: 'brad',
    email: 'brad@gmail.com'
  }

  jwt.sign({user: user1}, 'MySecretkey',  (err, token1)=>{
    res.json({
      token: token1
    });
  });

});

app.post('/api/login',  (req, res)=>{
  // get user from database. However, here simple
  // create user
  var user2 = {
    id: '2',
    username: 'brad2',
    email: 'brad2@gmail.com'
  }

  jwt.sign({user: user1}, 'MySecretkey', {expiresIn: '90s'}, (err, token1)=>{
    res.json({
      token: token1
    });
  });

});

//verify token a middleware function
function verifyToken(req, res, next) {
  // get the authorisation value
  var bearerHeader = req.headers['authorization'];

  // check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){
    //continue
    // split at the space
    var bearer = bearerHeader.split(' ');
    
    // get token from the array
    var bearerToken = bearer[1];

    // set token
    req.token = bearerToken;

    //next middleware
    next();

  } else {
    // forbidden to login
    res.json({
      message: 'posts are protected, so they need a token to make any update'
    });

  }

}





app.listen(3000, ()=> {
  console.log('server listening on port 3000 or url http://localhost:3000')
})