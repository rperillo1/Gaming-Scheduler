// require('./config/database');// connect this script to the database
// const Movie = require('./models/movie');
// const Performer = require('./models/performer');
// const data = require('./data');


// const p1 = Movie.deleteMany({})
// const p2 = Performer.deleteMany({})


// Promise.all([p1, p2])
// 	.then(function (results) {
// 		console.log(results)
// 		return Movie.create(data.movies)
// 	}).then(function (results) {
// 		console.log(results)
// 		return Performer.create(data.performers)
// 	}).then(function (results) {
// 		console.log(results)
// 	}).then(function () {
// 		process.exit();
// 	})



//  Movie.deleteMany({})
//  .then(function(result){
// 	 console.log(result);
// 	 process.exit();
//  }).catch(function(err){
// 	 console.log(err);
//  });