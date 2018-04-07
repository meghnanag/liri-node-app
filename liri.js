require("dotenv").config();
var keys = require("./keys.js");

// Creates empty string to hold song title.
var songTitle = "";

// Creates empty string to hold movie title.
var movieTitle = "";

// Creates empty string to hold random argument title.
var randomArgument = "";

var argument = "";

var action = process.argv[2];

doSomething(action, argument);

function doSomething(action, argument) {

	argument = actualArgument();

	switch (action) {
		case "my-tweets": 
		getMyTweets();
		break;

		case "spotify-this-song":
		
		// First get song title argument.
		songTitle = argument;

		if (songTitle === "") {
			lookupSpecificSong();
		} else {
			// Get song information from Spotify.
			getSongInfo(songTitle);
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
	}
}

function actualArgument() {

	// Stores all possible arguments in array.
	argumentArray = process.argv;

	// Loops through words in node argument.
	for (var i = 3; i < argumentArray.length; i++) {
		argument += argumentArray[i];
	}

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

	// Shows last 20 tweets and when created in terminal.
	client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {

	  	// Loop through tweets and print out tweet text and create date.
	  	for (var i = 0; i < tweets.statuses.length; i++) {
	  		var tweetText = tweets.statuses[i].text;
	  		console.log("Here's the tweet's text: " + tweetText);
	  		var tweetCreationDate = tweets.statuses[i].created_at;
	  		console.log("Here's the tweet's creation date: " + tweetCreationDate);
	  	}
	  } else {
	  	console.log(error);
	  }
	});
}


// spotify-this-song
// If no song is provided, default to "The Sign" by Ace of Base.

function getSongTitle() {
	// Stores all the song title arguments in array.
	var songTitleArgument = process.argv;

	// Loops through words in node argument.
	// To be able to pass song title as a parameter to call to Spotify API.
	for (var i = 3; i < songTitleArgument.length; i++) {
		songTitle += songTitleArgument[i];
	}

	return songTitle;
}

function lookupSpecificSong() {

	// Access spotify API through spotify module.
	// ** Will most likely move all of these out of functions!
	var spotify = require("spotify");


	// Calls spotify API to retrieve a specific track, The Sign, Ace of Base.
	spotify.lookup({type: 'track', id: 'ab824636d9d94dc0946e6b18cb834303'}, function(err, data) {
		if (err) {
			console.error(err);
			return
		}

		console.log(data);

		// Priting the artist, track name, preview url, and album name.
		console.log("Artist: " + data.artists[0].name);
		console.log("Song: " + data.name);
		console.log("Spotify preview URL: " + data.preview_url);
		console.log("Album name: " + data.album.name);
	});
}

function getSongInfo(songTitle) {

	// Access spotify API through spotify module.
	var spotify = require("spotify");

	console.log("Song title: " + songTitle);

	// Calls spotify API to retrieve a track.
	spotify.search({type: 'track', query: songTitle}, function(err, data) {
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
	
	  }
	});
}

function doWhatItSays() {

	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			console.error(err);
		} else {


			randomArray = data.split(",");


			console.log(randomArray);

			action = randomArray[0];

			console.log("Random Action: " + action);

			argument = randomArray[1];

			console.log("Random argument: " + argument);

			doSomething(action, argument);
		}
	});
}

