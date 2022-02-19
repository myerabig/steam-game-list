import * as React from 'react';

import './App.css';
import secret from './Resources/secret.json';
import steamGameList from './Resources/steamGameList.json';

import Button from '@mui/material/Button';

function App() {
	const getData = async () => {
		let apiKey = secret['steam-api-key'];
		let userId = secret['my-id'];

		let url =
			'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' +
			apiKey +
			'&steamid=' +
			userId +
			'&format=json';

		await fetch(url)
			.then((response) => response.json())
			.then((json) => {
				// Combine all games into one array
				let allGames = [];
				json.response.games.forEach((gameArr) => {
					allGames.push(gameArr);
				});

				// Sort by playtime (highest to lowest)
				allGames.sort((a, b) => parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever));

				let mostPlayed = steamGameList.applist.apps.find((game) => game.appid == allGames[0].appid).name;

				console.log(allGames);
				console.log('Most Played: ' + mostPlayed);

				document.getElementById('answer-pic').src = 'https://steamcdn-a.akamaihd.net/steam/apps/' + allGames[0].appid +'/library_600x900_2x.jpg';
				document.getElementById('answer').innerHTML = mostPlayed;
			})
			.catch((error) => console.error(error));
	};

	return (
		<div className="App">
			<Button id="test-button" variant="contained" onClick={getData}>
				What game has Abby played the most?
			</Button>
			<br />
			<br />
			<img id="answer-pic" src="" />
			<h1 id="answer"></h1>
		</div>
	);
}

export default App;
