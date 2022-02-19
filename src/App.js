import React, { useState } from 'react';
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import theme from "./theme";

import "./App.css";
import secret from "./Resources/secret.json";
import steamGameList from "./Resources/steamGameList.json";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

function App() {
	const [steamUserId, setSteamUserId] = useState("");

    const getData = async () => {
        let apiKey = secret["steam-api-key"];
        // let userId = secret["my-id"];

        let url =
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
            apiKey +
            "&steamid=" +
            steamUserId +
            "&format=json";

        await fetch(url)
            .then((response) => response.json())
            .then((json) => {
                // Combine all games into one array
                let allGames = [];
                json.response.games.forEach((gameArr) => {
                    allGames.push(gameArr);
                });

                // Sort by playtime (highest to lowest)
                allGames.sort(
                    (a, b) =>
                        parseFloat(b.playtime_forever) -
                        parseFloat(a.playtime_forever)
                );

                let mostPlayed = steamGameList.applist.apps.find(
                    (game) => game.appid === allGames[0].appid
                ).name;

                document.getElementById("answer-pic").src =
                    "https://steamcdn-a.akamaihd.net/steam/apps/" +
                    allGames[0].appid +
                    "/library_600x900_2x.jpg";
                document.getElementById("answer").innerHTML = mostPlayed;
            })
            .catch((error) => console.error(error));
    };

    const theme2 = createTheme({
        palette: {
            primary: {
                main: "#FF0000",
            },
        },
    });

    return (
        <div className="App">
            <ThemeProvider theme={theme2}>
                <Grid
                    container
                    spacing={4}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Button
                            id="cors-button"
                            color="primary"
                            variant="outlined"
                            target="_blank"
                            href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en"
                        >
                            Download CORS Blocker
                        </Button>
                    </Grid>
                    <Grid item>
                        <TextField
                            id="steam-id"
                            label="Steam ID"
                            variant="outlined"
							onChange={(e) => setSteamUserId(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            id="test-button"
                            variant="contained"
                            color="primary"
                            onClick={getData}
                        >
                            What game have I played the most?
                        </Button>
                    </Grid>
                    <Grid item>
                        <img id="answer-pic" src="" />
                        <h1 id="answer"></h1>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default App;
