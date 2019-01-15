/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
chai.config.includeStack = true;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {


      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title : 'Lord of the Rings'
        })
        .end(function(err,res){
          if(err){
            console.log(err)
          }
          assert.equal(res.status,200);
          assert.isString(res.body._id);
          assert.equal(res.body.title, 'Lord of the Rings');
          done();
        });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err,res){
          assert.equal(res.status,400);
          assert.equal(res.text, 'no title');
          done();
        });
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.isArray(res.body);
          assert.isString(res.body[0].title);
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          assert.property(res.body[0], 'commentcount', 'Books in array should commentcount');
          done();
        })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      var _id;

      before(function(done){

        chai.request(server)
        .post('/api/books')
        .send({
          title : 'Harry Potter'
        })
        .end(function(err,res){
          if(err) console.log(err);
          _id = res.body._id;
          done();
        });
      });

      test('Test GET /api/books/[id] with id not in db',  function(done){
        var invalidId = '1234';

        chai.request(server)
        .get('/api/books/'+invalidId)
        .end(function(err,res){
          assert.equal(res.status,400);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+_id)
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body._id, _id);
          assert.equal(res.body.title, 'Harry Potter');
          assert.isArray(res.body.comments);
          done();
        })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      var _id;

      before(function(done){

        chai.request(server)
        .post('/api/books')
        .send({
          title : 'Moby Dick'
        })
        .end(function(err,res){
          if(err) console.log(err);
          _id = res.body._id;
          done();
        });
      });

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+_id)
        .send({
          comment : 'Interesting book. Would recommend.'
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body._id, _id);
          assert.equal(res.body.title, 'Moby Dick');
          assert.equal(res.body.comments[0],'Interesting book. Would recommend.');
          done();
        })
      });

      var invalidId = 1234;

      test('Test POST /api/books/[id] with comment with invalid id in db', function(done){
        chai.request(server)
        .post('/api/books/'+ invalidId)
        .send({
          comment : 'Good book. Would recommend.'
        })
        .end(function(err,res){
          assert.equal(res.status,400);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });

    });

  });

  suite('DELETE /api/books/[id] => delete book object with id', function(){

      var _id;

      before(function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          title : 'Juliet, Naked'
        })
        .end(function(err,res){
          if(err) console.log(err);
          _id = res.body._id;
           console.log(_id)
          done();
        });
      });

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/'+_id)
        .send({
          _id : _id
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      var invalidId = 1234;

      test('Test DELETE /api/books/[id] with invalid id in db', function(done){
        chai.request(server)
        .delete('/api/books/'+ invalidId)
        .send({
          _id : invalidId
        })
        .end(function(err,res){
          assert.equal(res.status,400);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
  });

  suite('DELETE /api/books/[id] => delete all book objects', function(){

    test('Test DELETE /api/books/', function(done){
      chai.request(server)
      .delete('/api/books/')
      .end(function(err,res){
        assert.equal(res.status,200);
        assert.equal(res.text, 'complete delete successful');
        done();
      });
    });

  });

});
