/*
 *	Node.js Server 
 * 
 *	@author : Angel Rivas Casado
 *	@email : <rivas.angel@gmail.com>
 *	@licence: GNU GENERAL PUBLIC LICENSE Version 2, June 1991
 *  
 */

/**********************************
 * 
 *   Mongo DB Connection & Model
 *   
 **********************************/
//Dependence
var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log("Mongo DB up & running");
});

//Connecting with the Local Data Base
mongoose.connect('mongodb://localhost/vessel');

//Vessel Model Definition
var Vessel = mongoose.model('Vessel', { 
	name: String,
	width: Number,
	length: Number,
	draft: Number,
	last_geo: {type: [Number], index: '2d'}
});

/**********************************
 * 
 * 	   Web Server Configuration
 * 
 **********************************/

//Web Server Dependence
var express = require('express');
var app = express();

//Static Context Configuration
app.use(express.static(__dirname + '/app'));

//JSON Parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
	
/***** REST Methods Definition *****/

//Get all Vessels
app.get("/api/v1/create", function(req,res){

	var v1 = new Vessel({ 
		name: 'Name',
		width: 10,
		length: 10,
		draft: 10,
		last_geo: [10,10]
	});

	v1.save(function (err) {
		if (err) console.error.bind(console, 'DB save error');
	    console.log('saved');
	    res.send(200);
	});
});


// Get all Vessels
app.get("/api/v1/vessel", jsonParser, function(req,res){
	console.log("GET - /api/v1/vessel");
	
	Vessel.find(function (err, doc) {
	    if (err) return res.send(404);
	    res.send(doc);
    });
	
});

// Get a Vessel by Id
app.get("/api/v1/vessel/:id", jsonParser, function(req,res){
	console.log("GET - /api/v1/vessel/:id");
	
	Vessel.findById(req.params.id, function (err, doc) {
	    if (err) return res.send(404);
	    res.send(doc);
    });

});

// Create a new Vessel
app.post("/api/v1/vessel", jsonParser, function(req,res){
	console.log("POST - /api/v1/vessel");
	newVessel = new Vessel({
			name: req.body.name,
			width: req.body.width,
			length: req.body.length,
			draft: req.body.draft,
			last_geo: req.body.last_geo}
	);
	console.log("New Vessel: " + newVessel);
	newVessel.save(function (err) {
		if (err) console.error.bind(console, 'DB save error');
		res.send(newVessel);
		console.log('saved');
	});
	
});

//Update a Vessel by Id
app.post("/api/v1/vessel/:id", jsonParser, function(req,res){
	console.log("POST - /api/v1/vessel/:id - " + req.params.id);
	
	Vessel.findById(req.params.id, function (err,doc) {
	    if (err) return res.send(404);
		doc.name = req.body.name;
		doc.width = req.body.width;
		doc.length = req.body.length;
		doc.draft = req.body.draft;
		doc.last_geo = req.body.last_geo;
		doc.save(function (err) {
			if (err) console.error.bind(console, 'DB save error');
			console.log('Updated');
			res.send(200);
		});  
    });
});

//Delete Vessel by Id
app.delete("/api/v1/vessel/:id", jsonParser, function(req,res){
	console.log("DELETE - /api/v1/vessel/:id");
	Vessel.remove({_id: req.params.id}, function (err, doc) {
	    if (err) return res.send(404);
	    res.send(200);
    });
});

app.all("*", function(req,res){
	console.log(req);
	res.send(200);
});

app.listen(3000);
console.log("Server Running on port 3000");

