async function getCountriesList() {
    const response = await fetch('https://raw.githubusercontent.com/pavelbaranchuk/findcountry/master/countries.json');  
    const data = await response.json();
    return data;
}

async function getTheNearestCountry(data) {
    let nearest = [];
    let distance = 0;
    let smallest = 1000000;
    countries = await getCountriesList();

    for (let i = 0; i < countries.length; i++) {
        let obj = countries[i];

        if ((data.x) && (data.y)) {
            distance =
            Math.sqrt((obj.y - data.y)*(obj.y - data.y) +
            (obj.x - data.x)*(obj.x - data.x));
        } else ((data.y) || data.y == 0) 
        ? distance = Math.abs((obj.y - data.y)) 
        : distance = Math.abs((obj.x - data.x));
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

async function getCountry() {
    let input = document.getElementById("txt").value;
    let result = validateInput(input);
    print = '';
    if (!result) {
        alert("Пожалуйста, введите корректные данные, например:\nx=54,y=3\ny=13,x=782\nx=245\ny=24")
    } else {
        print = await getTheNearestCountry(result);
        console.log(print,'print')
        document.getElementById("output")
        .innerHTML = 'Ближайшая страна: ' + "<u>" + print.join(', '); + " </u>";
    }
    return false;
}

function validateInput(s) {
  const matches = s.trim().match(/^([xy])=(\d+)(,([xy])=(\d+))?$/)
  if (matches) {
    const [, xy1, value1, , xy2, value2] = matches;
    if (xy1 !== xy2) {
      const result = {}
      result[xy1] = +value1;

      if (xy2) {
        result[xy2] = +value2;
      }
      return result;
    }
  }
  return null
}
