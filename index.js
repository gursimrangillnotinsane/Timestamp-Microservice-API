// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/:date?", (req, res) => {
  const paramDate = req.params.date; // Get the date parameter
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  const integerRegex = /^\d+$/; // Only numbers

  // If no date is provided, return current date
  if (!paramDate) {
    const currentDate = new Date();
    return res.json({
      unix: Math.floor(currentDate.getTime()), // Current Unix timestamp
      utc: currentDate.toUTCString()            // Current UTC time
    });
  }

  // Check if the date matches the YYYY-MM-DD format
  else if (dateRegex.test(paramDate)) {
    const dateObject = new Date(paramDate);
    // Check if the date is valid
    if (isNaN(dateObject.getTime())) {
      return res.json({ error: "Invalid Date" });
    }
    return res.json({
      unix: Math.floor(dateObject.getTime()), // Unix timestamp
      utc: dateObject.toUTCString()            // UTC time
    });
  }
  // Check if the date is a valid Unix timestamp
  else if (integerRegex.test(paramDate)) {
    const unixTime = parseInt(paramDate, 10);
    const parsedDate = new Date(unixTime); // Convert to Date object
    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return res.json({ error: "Invalid Date" });
    }
    return res.json({
      unix: unixTime,                           // Keep the Unix timestamp as is
      utc: parsedDate.toUTCString()             // Convert to UTC string
    });
  }
  // Handle strings that can be parsed by new Date
  else {
    const parsedDate = new Date(paramDate);
    if (isNaN(parsedDate.getTime())) {
      return res.json({ error: "Invalid Date" });
    }
    return res.json({
      unix: Math.floor(parsedDate.getTime()), // Unix timestamp
      utc: parsedDate.toUTCString()            // UTC time
    });
  }
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
