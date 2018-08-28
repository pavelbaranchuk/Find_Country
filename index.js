async function getCountriesList() {
  const response = await fetch("https://raw.githubusercontent.com/pavelbaranchuk/findcountry/master/countries.json");  
  const data = await response.json();
  return data;
}


async function getNearestCountry(data) {
  let nearest =  [];
  let distance = 0;
  let smallest = Math.pow(10, 10);
  const countries = await getCountriesList()
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log("error: ", err));

  for (let i = 0; i < countries.length; i++) {
    const obj = countries[i];

    if ((data.x) && (data.y)) {
      distance = Math.sqrt((obj.y - data.y) * (obj.y - data.y) +
      (obj.x - data.x) * (obj.x - data.x));
    } else if ((data.y) || data.y == 0) {
      distance = Math.abs((obj.y - data.y));
    } else {
      distance = Math.abs((obj.x - data.x));
    }

    if (smallest == distance) {
      nearest.push(obj.country);
    }

    if (smallest > distance) {
      nearest = [];
      smallest = distance;
      nearest.push(obj.country);
    }
  }
  return nearest;   
}

async function getCountries() {
  const input =  document.getElementById("txt").value;
  const result = validateInput(input);
  let print =  "";
  if (!result) {
    alert("Пожалуйста, введите корректные данные, например:\nx=54,y=3\ny=13,x=782\nx=245\ny=24");
  } else {
    print = await getNearestCountry(result);
    console.log(print, "print");
    document.getElementById("output")
      .innerHTML = "Ближайшая страна: " + "<u>" + print.join(", "); + " </u>";
  }
  return false;
}

function validateInput(s) {
  const matches = s.trim().match(/^([xy])=(\d+)(,([xy])=(\d+))?$/);
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

