const { Country, State, City } = require("country-state-city");

const listCountries = (req, res) => {
  const { country, state } = req.query;

  if (!country) {
    res.send(Country.getAllCountries());
    return;
  }

  if (!state) {
    res.send(State.getStatesOfCountry(country));
    return;
  }

  res.json(City.getCitiesOfState(country, state));
};

module.exports = { listCountries };
