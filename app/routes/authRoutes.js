const Router = require('express').Router();
const octokit = require('@octokit/rest');
const request = require('request');
const randomString = require('randomstring');
const key = require('../config/keys');
const qs = require('querystring');
const url = require('url');

const csrfString = randomString.generate();

Router.get('/login', (req, res) => {
  const githubAuthUrl = 
  'https://github.com/login/oauth/authorize?' +
  qs.stringify({
    client_id: key.keys.clientId,
    redirect_uri: key.keys.redirectUri,
    state: csrfString,
    scope: 'repos'
  });

  res.redirect(githubAuthUrl);
  console.log('User successfully redirected');
});

Router.all('/redirect', (req, res) => {
  const code = req.query.code;
  const returnedState = req.query.state;

  if(returnedState == csrfString) {
    
    request.post({
      url: 
        'https://github.com/login/oauth/access_token?' +
        qs.stringify({
          client_id: key.keys.clientId,
          client_secret: key.keys.clientSecret,
          code: code,
          redirect_uri: key.keys.redirectUri,
          state: csrfString 
        })
    }, (error, response, body) => {
          key.keys.accessToken = qs.parse(body).access_token;
          res.redirect('/user');
    });
  } else {
      res.redirect('/');
      console.log('An error occured');
  }
});

module.exports = Router;