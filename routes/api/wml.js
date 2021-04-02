// 1. import dependencies
const { Router } = require("express");
const express = require("express");
const router = express.Router();
const request = require("request-promise");
const utils = require("../../utils/utils");
const fields = utils.fields;

// 2. Setup router
router.post("/score", async (req, res) => {
  // 3. Get access token from WML
  const options = {
    method: "POST",
    url: process.env.AUTH_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      apikey: process.env.WML_API_KEY,
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
    },
  };
  let response = "";
  try {
    response = await request(options);
    access_token = JSON.parse(response)["access_token"];
    // res.send(access_token);
  } catch (err) {
    console.log(err);
    res.send(err);
  }

  // 4. Make a scoring request
  const { age, partner, sex, embarked, passenger_class } = req.body;

  let template = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  //   populate age
  template[fields.findIndex((val) => val == `Age_${age}`)] = 1;
  //   populate passenger class
  template[fields.findIndex((val) => val === `class_${passenger_class}`)] = 1;
  //   populate sex
  template[fields.findIndex((val) => val === `Sex_${sex}`)] = 1;
  //   populate embarkment
  template[fields.findIndex((val) => val === `Embarked_${embarked}`)] = 1;
  //   populate partner
  template[fields.findIndex((val) => val === `Partner_${partner}`)] = 1;

  //   res.send(""{ fields: fields, template: template });

  const scoring_options = {
    method: "POST",
    url: process.env.WML_SCORING_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      input_data: [{ fields: fields, values: [template] }],
    }),
  };

  let scoring_response = "";
  try {
    scoring_response = await request(scoring_options);
    // const score = JSON.parse(scoring_response)["values"];
    res.send(scoring_response);
  } catch (err) {
    console.log(err);
    // res.send(err);
  }
});

module.exports = router;
