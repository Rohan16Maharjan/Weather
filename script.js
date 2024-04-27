const API_KEY = '8103d05f17b1e5b66a839301ebd70a78';
let API_URL;
let API_URL1;

const button = document.getElementById('myButton');

button.addEventListener('click', function () {
	let cityName = document.getElementById('searching').value;
	API_URL = `https://api.opensjdfsjgdfsweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}
	`;
	API_URL1 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=15&appid=${API_KEY}&units=metric`;
	if (!cityName) {
		return;
		alert('Add the location');
	}
	weatherApi();
});

// fetching the api
let myChart;
async function weatherApi() {
	try {
		const data = await fetch(API_URL);
		const data1 = await fetch(API_URL1);

		//to see whether the response lies between range of 200-299 in Https Status Code
		if (!data.ok || !data1.ok) {
			if (data.status === 404 || data1.status === 404) {
				alert('Please add other City Name!!');
				document.getElementById('searching').value = '';
			} else {
				throw new Error('Failed to fetch weather data');
			}
		}
		const jsonValue = await data.json();
		const jsonValue1 = await data1.json();
		document.getElementById('searching').value = '';
		if (myChart) {
			myChart.destroy();
		}
		getHtml(jsonValue);
		getChart(jsonValue1.list);
	} catch (err) {
		console.log(err);
	}
}
// for html
function getHtml(jsonValue) {
	const iconUrl = `https://openweathermap.org/img/wn/${jsonValue.weather[0].icon}.png`;
	const img = document.getElementById('weather-icon');
	img.src = iconUrl;
	document.getElementById('weather-info').innerHTML = `
	<h1>${jsonValue.name}</h1>
	<h1> ${Math.floor(jsonValue.main.temp - 273.15)}&#8451; </h1>
	<h2>${jsonValue.weather[0].description}</h2>
	`;
}

// chart.js
function getChart(jsonValue1) {
	const ctx = document.getElementById('myChart');
	myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: jsonValue1.map((item) => item.dt_txt),
			datasets: [
				{
					label: 'Weather Hourly',
					data: jsonValue1.map((i) => i.main.temp),
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			maintainAspectRatio: false,
		},
	});
}
