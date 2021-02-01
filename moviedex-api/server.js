require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIES = require("./moviedex.json");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

// validate bearer token
// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN;
//   const authToken = req.get("Authorization");
//   // move to the next middleware
//   // if (!authToken || authToken.split(" ")[1] !== apiToken) {
//   //   return res.status(401).json({ error: "Unauthorized token!" });
//   // }
//   if (authToken !== apiToken) {
//     return res.status(401).json({ error: "Unauthorized access!" });
//   }
//   next();
// });

app.get("/movie", function handleGetMovie(req, res) {
  // get response
  let response = MOVIES;
  console.log(response);
  // search options queries
  const { genre, country, avg_vote } = req.query;

  // filter by genre, country, and avg_vote if present
  if (genre) {
    response = response.filter((movie) => {
      movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if (country) {
    response = response.filter((movie) => {
      movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  if (avg_vote) {
    response = response.filter(
      (movie) => Number(movie.avg_vote) >= Number(avg_vote)
    );
  }

  res.json(response);
});

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`MovieDex Server running at http://localhost:${PORT}`);
});
