//node dependencies
//KEEP THIS, we will use this
const express = require('express');
const path = require('path'); 
const mongo = require('mongodb');
const bodyParser = require('body-parser');

const app = express();

//db key hidden
const new_db = require('./config/keys').mongoURI;;

//middleware
app.use('/public', express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

//get for main screen
app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/index.html');
}).listen(3000);



// passing data from form to back end
//we make the form entries into a variable
app.post('/schedule' ,function(req,res){
	const name = req.body.name;
	const passengers= req.body.passengers;
    const pickup = req.body.pickup;
	const time = req.body.time;
    const notes = req.body.notes;
	

//then we add it all to the data object
	const data = {
		"name":name,
		"passengers":passengers,
		"pickup": pickup, 
		"time" : time,
        "notes" : notes
	}
	
    //connect to db
	mongo.connect(new_db , function(err , client){
		if (err){
			throw err;
		}
		//console.log("connected to database successfully");

        let db = client.db('bussystem');
        
		//adding our record into db
		db.collection("bussystem").insertOne(data, (err , collection) => {
			if(err) throw err;
			//console.log("Record inserted successfully");
			//console.log(collection);

		});
	});

    

    
	
    //just to get a visual confirmation, take this out later
	//console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
    //and then we show them the "success" page if it all worked
	return res.redirect('/public/success.html');  

});

console.log("Server listening at : 3000");
