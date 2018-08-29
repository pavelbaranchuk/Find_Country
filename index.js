const COUNTRIES_URL = "https://raw.githubusercontent.com/pavelbaranchuk/findcountry/master/countries.json";
let countries;

// Getting the data from 'countries.json' file
async function getCountriesList() { 
  try {
    const response = await fetch(COUNTRIES_URL);  
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Fetch Error :-S", err);
    return null;
  }
}

//Searching for the nearest country or countries
async function getNearestCountry(data) { 
  let nearest =  [];
  let distance = 0;
  let smallest;
  
  // Checking if we have the data from 'countries.json' file, so we don't need to call the function again
  if (!countries) { 
    countries = await getCountriesList();  
  }

  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];

    if (data.x && data.y) { 
      distance = Math.sqrt((country.y - data.y) * (country.y - data.y)
        + (country.x - data.x) * (country.x - data.x));
    } else if (data.y != null) {
      distance = Math.abs(country.y - data.y);
    } else {
      distance = Math.abs(country.x - data.x);
    }

    if (smallest === undefined || distance <= smallest) {
      if (distance === smallest) {
        // If we have several countries with the same distance we save it to array
        nearest.push(country.country); 
      } else {
        nearest = [country.country];
        smallest = distance;
      }
    }
  }
  
  return nearest;
}

//Main function
async function getCountries() { 
  event.preventDefault();
  const input =  document.getElementById("txt").value;
  const result = validateInput(input);
  let country =  "";
  if (!result) {
    alert("Пожалуйста, введите корректные данные, например:\nx=54,y=3\ny=13,x=782\nx=245\ny=24");
  } else {
    country = await getNearestCountry(result);
    document.getElementById("output1")
      .innerHTML = "Ближайшая страна: ";
    document.getElementById("output2")
      .innerHTML = country.join(", ");
  }
  return false;
}

function validateInput(s) {
  const matches = s.trim().match(/^([xy])=(\d+)(,([xy])=(\d+))?$/); // Check that entered data is valid
  if (matches) {
    const [, xy1, value1, , xy2, value2] = matches;
    if (xy1 !== xy2) {
      const result = {};
      result[xy1] = +value1;

      if (xy2) {
        result[xy2] = +value2;
      }
      return result;
    }
  }
  return null;
}
