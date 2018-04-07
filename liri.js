require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Output file for logs.
var filename = './log.txt';

// NPM module used for logging solution.
var log = require('simple-node-logger').createSimpleFileLogger( filename );

// All log information printed to log.txt.
log.setLevel('all');

// Creates empty string to hold song title.
var songName = "";

// Creates empty string to hold movie title.
var movieTitle = "";

// Creates empty string to hold random argument title.
var randomArgument = "";

var argument = "";

var action = process.argv[2];

mainFunction(action, argument);

function mainFunction(action, argument) {

	argument = actualArgument();

	switch (action) {
		case "my-tweets": 
		getMyTweets();
		break;

		case "spotify-this-song":
		
		// First get song title argument.
		songName = argument;

		if (songName === "") {
			getSongInfo("The Sign Ace of Base");
		} else {
			// Get song information from Spotify.
			getSongInfo(songName);
		}
		
		break;

		case "movie-this":

		// First get movie title argument.
		
		movieTitle = argument;

		if (movieTitle === "") {
			getMovieInfo("Mr. Nobody");
		} else {
			getMovieInfo(movieTitle);
		}

		break;

		case "do-what-it-says": 
		
		randomArgument = argument;
		doWhatItSays(randomArgument);
		break;

		default:
		console.log("I don't know how to do that.Wrong action.Please try again!");
		break;
	}
}

function actualArgument() {

	// Stores all possible arguments in array.
	//argumentArray = process.argv;

	// Loops through words in node argument.
	//for (var i = 3; i < argumentArray.length; i++) {
		//argument += argumentArray[i];
		argument= process.argv.slice(3).join("+");
	//}

	return argument;
}

// Function to show my last 20 tweets.
function getMyTweets() {

	// Access twitter API through twitter module.
	var Twitter = require("twitter");

	// Passes twitter keys into call to Twitter API.
	var client = new Twitter(keys.twitter);

	// Search parameters includes my tweets up to last 20 tweets;
	var params = {q: '@codingteststuff', count: 20};

	// Shows last 20 tweets and when created in terminal
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {

	  	// Loop through tweets and print out tweet text and create date.
	  	for (var i = 0; i < tweets.length; i++) {
	  		var tweetText = tweets[i].text;
	  		console.log("Here's the tweet's text: " + tweetText);
	  		var tweetCreationDate = tweets[i].created_at;
	  		console.log("Here's the tweet's creation date: " + tweetCreationDate);
	  	}
	  } else {
	  	console.log(error);
	  }
	});
}


// spotify-this-song
// If no song is provided, default to "The Sign" by Ace of Base.

function getsongName() {
	// Stores all the song title arguments in array.
	var songNameArgument = process.argv;

	// Loops through words in node argument.
	// To be able to pass song title as a parameter to call to Spotify API.
	for (var i = 3; i < songNameArgument.length; i++) {
		songName += songNameArgument[i];
	}

	return songName;
}

/*function lookupSpecificSong() {

	// Access spotify API through spotify module.

	// Calls spotify API to retrieve a specific track, The Sign, Ace of Base.
	spotify.search({type: 'track', query: "The Sign"}, function(err, data) {
		if (err) {
			console.error(err);
			return
		}

		//console.log(data);

		// Priting the artist, track name, preview url, and album name.
		var artistsArray = data.tracks.items[0].album.artists;

		var artistsNames = [];

		
		for (var i = 0; i < artistsArray.length; i++) {
			artistsNames.push(artistsArray[i].name);
		}

		
		var artists = artistsNames.join(", ");

		// Priting the artist(s), track name, preview url, and album name.
		console.log("Artist(s): " + artists);
		console.log("Song: " + data.tracks.items[0].name)
		console.log("Spotify preview URL: " + data.tracks.items[0].preview_url)
		console.log("Album name: " + data.tracks.items[0].album.name);

		
		// Prints the artist, track name, preview url, and album name.
		logOutput("Artist: " + data.artists[0].name);
		logOutput("Song: " + data.name);
		logOutput("Spotify Preview URL: " + data.preview_url);
		logOutput("Album Name: " + data.album.name);
	});
}*/

function getSongInfo(songName) {

	// Access spotify API through spotify module.
	
	console.log("Song title: " + songName);

	// Calls spotify API to retrieve a track.
	spotify.search({type: 'track', query: songName}, function(err, data) {
		if (err) {
			console.error(err);
			return
		}
		var artistsArray = data.tracks.items[0].album.artists;

		var artistsNames = [];

		
		for (var i = 0; i < artistsArray.length; i++) {
			artistsNames.push(artistsArray[i].name);
		}

		
		var artists = artistsNames.join(", ");

		// Priting the artist(s), track name, preview url, and album name.
		console.log("Artist(s): " + artists);
		console.log("Song: " + data.tracks.items[0].name)
		console.log("Spotify preview URL: " + data.tracks.items[0].preview_url)
		console.log("Album name: " + data.tracks.items[0].album.name);

		
		// Prints the artist, track name, preview url, and album name.
		logOutput("Artist: " + artists);
		logOutput("Song: " + data.tracks.items[0].name);
		logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url);
		logOutput("Album Name: " + data.tracks.items[0].album.name);
	});
	
}


function getMovieInfo(movieTitle) {
	//console.log("We are getting the movie!" + movieTitle);

	// Include the request npm package.
	var request = require("request");

	// Run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
	// This line is just to help us debug against the actual URL.
	//console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
	  // If the request is successful
	  if (!error && response.statusCode === 200) {
	    
	    // Parse the body of the site and recover movie info.
	    var movie = JSON.parse(body);

	   // console.log(movie);

	    // Print out movie info.
	    console.log("Movie Title: " + movie.Title);
	    console.log("Release Year: " + movie.Year);
	    console.log("IMDB Rating: " + movie.imdbRating);
	    console.log("Country Produced In: " + movie.Country);
	    console.log("Language: " + movie.Language);
	    console.log("Plot: " + movie.Plot);
	    console.log("Actors: " + movie.Actors);
        console.log("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
	

		    // Prints out movie info.
			logOutput("Movie Title: " + movie.Title);
			logOutput("Release Year: " + movie.Year);
			logOutput("IMDB Rating: " + movie.imdbRating);
			logOutput("Country Produced In: " + movie.Country);
			logOutput("Language: " + movie.Language);
			logOutput("Plot: " + movie.Plot);
			logOutput("Actors: " + movie.Actors);
			logOutput("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
	  }
	});
}

function doWhatItSays() {

	var fs = require("fs");

		fs.readFile("random.txt", "utf8", function(err, data) {
			if (err) {
				logOutput.error(err);
			} else {
	
				// Creates array with data.
				var randomArray = data.split(",");
	
				// Sets action to first item in array.
				action = randomArray[0];
	
				// Sets optional third argument to second item in array.
				argument = randomArray[1];
	
				// Calls main controller to do something based on action and argument.
				mainFunction(action, argument);
			}
		});
	}

// Logs data to the terminal and output to a text file.
function logOutput(logText) {
	log.info(logText);
	console.log(logText);
}