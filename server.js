const express = require('express');
const path = require('path'); 
const mongo = require('mongodb');
const bodyParser = require('body-parser');

const app = express();

const new_db = require('./config/keys').mongoURI;;

app.use('/public', express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));


app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/index.html');
}).listen(3000);

// Sign-up function starts here. . .
app.post('/sign_up' ,function(req,res){
	const name = req.body.name;
	const passengers= req.body.passengers;
    const pickup = req.body.pickup;
	const time = req.body.time;
    const notes = req.body.notes;
	//var password = getHash( pass , phone ); 

//name, passengers, pickup, time, notes
	
	const data = {
		"name":name,
		"passengers":passengers,
		"pickup": pickup, 
		"time" : time,
        "notes" : notes
	}
	
	mongo.connect(new_db , function(err , client){
		if (err){
			throw err;
		}
		console.log("connected to database successfully");

        let db = client.db('bussystem');
        
		//CREATING A COLLECTION IN MONGODB USING NODE.JS
		db.collection("bussystem").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
			console.log(collection);
		});
	});
	
	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html');  

});


console.log("Server listening at : 3000");
