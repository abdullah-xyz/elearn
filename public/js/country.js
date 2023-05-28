const country = document.getElementById("country");
const state = document.getElementById("state");
const city = document.getElementById("city");
const url = `http://${window.location.host}/countries`;

// fill states option after country is selected
country.addEventListener("change", async () => {
  state.innerHTML = '<option value="">--Please choose an option--</option>';

  if (country.value != "") {
    fetch(`${url}/?country=${country.value}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          var opt = document.createElement("option");
          opt.value = item.isoCode;
          opt.innerHTML = item.name;
          state.appendChild(opt);
        });
        state.disabled = false;
      })
      .catch((err) => console.log("err", err));
  } else {
    state.disabled = true;
  }
});

// fill city option after state is selected
state.addEventListener("change", async () => {
  city.innerHTML = '<option value="">--Please choose an option--</option>';

  if (state.value != "") {
    fetch(`${url}/?country=${country.value}&state=${state.value}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          var opt = document.createElement("option");
          opt.value = item.name;
          opt.innerHTML = item.name;
          city.appendChild(opt);
        });
        city.disabled = false;
      })
      .catch((err) => console.log("err", err));
  } else {
    city.disabled = true;
  }
});
