import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const url = "https://api.weatherbit.io/v2.0/current";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  try {
    const respones = await axios.get(url, {
      params: {
        key: apiKey,
        city: city,
      },
    });
    const result = respones.data;
    const {
      temp: weather,
      weather: { icon: icon },
      city_name: city2,
      wind_spd: wind,
      rh: press,
    } = result.data[0];
    let iconUrl = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
    res.render("index", { weather, iconUrl, city2, wind, press });
  } catch (err) {
    res.render("index", { msg: err.message });
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
