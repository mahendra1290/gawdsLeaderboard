const router = require('express').Router();
const key = require('../config/keys');
const user = require('../models/userModel');
const octokit = require('../util/octokit');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test',{ useNewUrlParser: true });
mongoose.connection
    .once('open',()=>console.log('CONNECTED!'))
    .on('error',(err)=>{
        console.log("COuld not connect as ",err)
    });


router.get('/:username', (req, res) => {
  var name = req.params.username;
  //console.log(name)
  user.find({"login":name}).exec(function(err,user){
    console.log(user[0].year);
    res.render('dashboard.ejs', {Name: user[0].login, Bio: user[0].bio, Year: user[0].year})
  })
  

  // //Requests to server
  // octokit.repos.list().then(result => {

  //   // Storing data in database 
  //   // Check if user already exists in database
  // }).catch((err) => {
  //   console.log(err);
  // });
});

module.exports = router;