import { useState } from "react";
import "./app.scss";
import axios from "axios";
import {
  Form,
  FormGroup,
  Select,
  SelectItem,
  Button,
  Loading,
} from "carbon-components-react";

import { passenger_class, genders, embarked, partners, ages } from "./utils";
import BarChart from "./components/dataviz/BarChart";

function App() {
  const [passenger, setPassenger] = useState(3);
  const [gender, setGender] = useState("female");
  const [embark, setEmbark] = useState("S");
  const [partner, setPartner] = useState("yes");
  const [age, setAge] = useState("Youth");
  const [prediction, setPrediction] = useState();
  const [scores, setScores] = useState([]);

  const runPred = async (passenger, gender, embark, partner, age) => {
    setPrediction("Scoring");
    const res = await axios.post("/api/wml/score", {
      passenger,
      gender,
      embark,
      partner,
      age,
    });
    try {
      const data = res.data.predictions[0];
      setPrediction(data.values[0][0]);
      setScores([
        ...scores,
        {
          group: passenger + gender + embark + partner + age,
          value: data.values[0][0],
        },
      ]);
      console.log(prediction, scores);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div className="mainContainer">
        <Form>
          <FormGroup legendText="">
            <Select
              id="select-0"
              labelText="Select Passenger Class"
              onChange={(e) => setPassenger(e.target.value)}
            >
              {passenger_class.map((passengerVal) => (
                <SelectItem text={passengerVal} value={passengerVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup legendText="">
            <Select
              id="select-1"
              labelText="Select Gender"
              onChange={(e) => setGender(e.target.value)}
            >
              {genders.map((genderVal) => (
                <SelectItem text={genderVal} value={genderVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup legendText="">
            <Select
              id="select-2"
              labelText="Select Embarkment"
              onChange={(e) => setEmbark(e.target.value)}
            >
              {embarked.map((embarkedVal) => (
                <SelectItem text={embarkedVal} value={embarkedVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup legendText="">
            <Select
              id="select-3"
              labelText="Select Partner"
              onChange={(e) => setPartner(e.target.value)}
            >
              {partners.map((partnerVal) => (
                <SelectItem text={partnerVal} value={partnerVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup legendText="">
            <Select
              id="select-4"
              labelText="Select Age Group"
              onChange={(e) => setAge(e.target.value)}
            >
              {ages.map((ageVal) => (
                <SelectItem text={ageVal} value={ageVal} />
              ))}
            </Select>
            <Button
              onClick={(e) => runPred(passenger, gender, embark, partner, age)}
            >
              Predict
            </Button>
          </FormGroup>
        </Form>
        <div className="predictionContainer">
          {prediction !== "Scoring" && prediction ? "The model predicted" : ""}
          <div className="predictionResult">
            {prediction === "Scoring" ? (
              <Loading description="Loading..." />
            ) : !prediction ? (
              ""
            ) : (
              parseInt(prediction)
            )}
          </div>
        </div>
        <div className="chartContainer">
          {scores.length === 0 ? "" : <BarChart data={scores} />}
        </div>
      </div>
    </div>
  );
}

export default App;
