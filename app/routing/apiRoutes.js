// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources. 
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData		= require('../data/friends.js');
var path 			= require('path');




// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){

	// API GET Requests
	// Below code handles when users "visit" a page. 
	// In each of the below cases when a user visits a link 
	// (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table) 
	// ---------------------------------------------------------------------------

	app.get('/api/friends', function(req, res){
		res.json(friendsData);
	});

	// API POST Requests
	// Below code handles when a user submits a form and thus submits data to the server.
	// In each of the below cases, when a user submits form data (a JSON object)
	// ...the JSON is pushed to the appropriate Javascript array
	// (ex. User fills out a reservation request... this data is then sent to the server...
	// Then the server saves the data to the tableData array)
	// ---------------------------------------------------------------------------

    app.post("/api/friends", function(req, res) {
        // req.body hosts is equal to the JSON post sent from the user
        // This works because of our body-parser middleware
        var newfriend = req.body;
		console.log(newfriend);

	//	console.log("scores for new friend**** "+newfriend["scores[]"].length);
		
		console.log(friendsData.length);
		//now to add code to find the who is the closest match among the set of friends ! 
		//The closest one (most similar will be identified) & sent
		var ff_d = [];
		
		
		for (var i = 0;i<friendsData.length;i++){
			//console.log(friendsData[i].scores);
			var total_diff = 0;
			for (var j=0;j<newfriend["scores[]"].length;j++){
			    console.log("score " +j+" from FORM: "+newfriend["scores[]"][j]);	
				//console.log("Score "+ j+" from dataset for user "+i+" :"+friendsData[i].scores[j]);
				console.log("Score "+ j+" from dataset for user "+i+" :"+friendsData[i]["scores[]"][j]);
				console.log("For question/score "+j+" for user "+i+", score difference: "+Math.abs(newfriend["scores[]"][j] - friendsData[i]["scores[]"][j]))
				total_diff=total_diff+Math.abs(newfriend["scores[]"][j] - friendsData[i]["scores[]"][j]);
			}	
			console.log("*************");
			console.log("differences with user******"+i+" :"+total_diff);
			ff_d.push({
				user: i,
				score_diff:total_diff
			});
		}
		console.log("loop ended");
		console.log(ff_d);
		//End of code to find smilarity...

		var lowest = Number.POSITIVE_INFINITY;
		var highest = Number.NEGATIVE_INFINITY;
		var tmp;
		var associated_user;
		for (var i=0;i<ff_d.length;i++) {
			tmp = ff_d[i].score_diff;
			if (tmp < lowest) lowest = tmp;
			if (tmp > highest) highest = tmp;
		}
		console.log("****hi***");
		console.log(highest, lowest);

		for (var i=0;i<ff_d.length;i++){
			if(lowest==ff_d[i].score_diff){
				associated_user = ff_d[i].user;
			}
		}	

		console.log("user index with lowest difference: "+associated_user)

		friendsData.push(newfriend);

        res.json(friendsData[associated_user]);

    })

}