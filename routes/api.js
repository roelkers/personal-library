/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var mongoose = require('mongoose');
var bookModel = require('../models/bookModel');

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});


module.exports = function (app) {

  function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      bookModel.find()
      .then((books)=>{
        var booksWithCommentCount = books.map((book)=>{
          var bookWithCommentCount = {};
          bookWithCommentCount.commentcount = book.comments.length;
          bookWithCommentCount.comments = book.comments;
          bookWithCommentCount._id = book._id;
          bookWithCommentCount.title = book.title;
          return bookWithCommentCount;
        });
        res.send(booksWithCommentCount)
      })
      .catch((error)=>{
        console.log(error)
      })
    })

    .post(function (req, res){
      var title = req.body.title;
      if(title == null){
        res.status(400).send('no title');
      }
      else {
        bookModel.create({title : title})
        .then((book)=>{
          res.send(book);
        })
        .catch((err)=>{
          console.log(err);
          res.status(400).send('could not create book')
        });
      }
    })

    .delete(function(req, res){
      bookModel.deleteMany({})
      .then(()=>{
        res.status(200).send('complete delete successful');
      })
      .catch((error)=>{
        res.status(400).send('complete delete unsuccessful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookId = req.params.id;
      if(bookId == null){
        res.status(400).send('id error')
      }
      else{
        bookModel.findById(bookId)
        .then((book)=>{
          res.send(book);
        })
        .catch((error)=>{
          res.status(400).send('no book exists')
        });
      }
    })

    .post(function(req, res){
      var bookId = req.params.id;
      var comment = req.body.comment;
      if(bookId == null){
        res.status(400).send('id error')
      }
      else {
        bookModel.findByIdAndUpdate(
          bookId,
          { $push: {comments : comment}},
          {new: true}
        )
        .then((book)=>{
          res.send(book);
        })
        .catch((error)=>{
          res.status(400).send('no book exists')
        });
      }
    })

    .delete(function(req, res){
      var bookId = req.params.id;
      console.log(bookId);
      if(bookId == null){
        res.status(400).send('id error')
      }
      else {
        bookModel.findByIdAndDelete(bookId)
        .then((book)=>{
          console.log(book);
          res.send('delete successful');
        })
        .catch((error)=>{
          res.status(400).send('no book exists')
        });
      }
    });

};
