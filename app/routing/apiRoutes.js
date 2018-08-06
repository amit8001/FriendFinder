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
	// Below code handles the POST listener on the server there is a POST request sent on filing up the survey.
	// ---------------------------------------------------------------------------

    app.post("/api/friends", function(req, res) {
        // req.body hosts is equal to the JSON post sent from the user
        // This works because of our body-parser middleware
        var newfriend = req.body;
		console.log(newfriend);
	
	    //now to add code to find the who is the closest match among the set of friends ! 
		//The closest one (most similar will be identified) & sent back as the recommneded match!

		//Defining an empty array that will host the user index and the total score diiferences for each user in friends Data array 
		//compared to the survey submitted.
		var ff_d = [];
		
		//below code has 2 for loops one to traverse through the friends array and the other inner loop to navigate through
		//the 10 survey results.
		for (var i = 0;i<friendsData.length;i++){
			//console.log(friendsData[i].scores);
			var total_diff = 0;
			for (var j=0;j<newfriend["scores[]"].length;j++){
				//below logs the score for a question (jth question) based on the submitted survey
			    console.log("score " +j+" from FORM: "+newfriend["scores[]"][j]);	
				//below logs the score for the ith user for that jth question. 
				console.log("Score "+ j+" from dataset for user "+i+" :"+friendsData[i]["scores[]"][j]);
				//below code logs the difference of the user score from the score in survey for that question.
				console.log("For question/score "+j+" for user "+i+", score difference: "+Math.abs(newfriend["scores[]"][j] - friendsData[i]["scores[]"][j]))
				//below line of code incrementally adds up the difference for each question
				total_diff=total_diff+Math.abs(newfriend["scores[]"][j] - friendsData[i]["scores[]"][j]);
			}	
			console.log("*************");
			//finally in the outer loop scope, the below line logs for a particular user in the friends array, 
			//what is the total difference between each question as answered in current survey V/S that user. 
			console.log("differences with user******"+i+" :"+total_diff);
			//Then we are pushing this to the empty array we defined earlier and has 2 properties user index & score diff for that user
			// e.g. ....
			// [ { user: 0, score_diff: 3 },
			// 	{ user: 1, score_diff: 12 },
			// 	{ user: 2, score_diff: 14 },
			// 	{ user: 3, score_diff: 14 },
			// 	{ user: 4, score_diff: 15 },
			// 	{ user: 5, score_diff: 13 },
			// 	{ user: 6, score_diff: 16 } ]
			//
			ff_d.push({
				user: i,
				score_diff:total_diff
			});
		}
		console.log("loop ended");
		console.log(ff_d);
		//End of code to find smilarity...

		//below lines of code help identify from the new array which element object has the lowest score diff.
		var lowest = Number.POSITIVE_INFINITY;
		var highest = Number.NEGATIVE_INFINITY;
		var tmp;
		var associated_user;
		for (var i=0;i<ff_d.length;i++) {
			tmp = ff_d[i].score_diff;
			if (tmp < lowest) lowest = tmp;
			if (tmp > highest) highest = tmp;
		}
	//	console.log("****hi***");
		console.log(highest, lowest);

		//then using that lowest value we loop through that new array and find the associated user index who has the lowest score differnce.
		for (var i=0;i<ff_d.length;i++){
			if(lowest==ff_d[i].score_diff){
				associated_user = ff_d[i].user;
			}
		}	

		console.log("user index with lowest difference: "+associated_user)

		//then we push the survey data to the friends array!
		friendsData.push(newfriend);

		//finally using the identified user index of the user who has the LOWEST score difference, we send back the details 
		//from the friends array for that 'perfect' match!
        res.json(friendsData[associated_user]);

    })

}