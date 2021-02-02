require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MOVIES = require("./moviedex");

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// validate bearer token
app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  console.log(`Bearer token: `, bearerToken); //undefined

  if (!bearerToken) {
    return res
      .status(401)
      .json({ message: "Please provide your bearer API_TOKEN" });
  }

  // move to the next middleware
  if (!bearerToken || bearerToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized token!" });
  }

  next();
});

app.get("/movie", function handleGetMovies(req, res) {
  // get response
  let response = MOVIES;
  // search options queries
  const { genre, country, avg_vote } = req.query;

  // filter by genre, country, and avg_vote if present
  if (genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    response = response.filter((movie) =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    if (isNaN(avg_vote)) {
      return res.status(400).send("Average vote should be a number!");
    }
    response = response.filter(
      (movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`MovieDex Server running at http://localhost:${PORT}`);
});
