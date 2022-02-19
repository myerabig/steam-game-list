import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import theme from "./theme";

import "./App.css";
import secret from "./Resources/secret.json";
import steamGameList from "./Resources/steamGameList.json";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

function App() {
    const [steamUserId, setSteamUserId] = useState([]);
    const [steamUserIds, setSteamUserIds] = useState([]);
    const [commonGames, setCommonGames] = useState([]);
    const [users, setUsers] = useState([]);

    const apiKey = secret["steam-api-key"];

    const getGameList = async (userId) => {
        let url =
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
            apiKey +
            "&steamid=" +
            userId +
            "&format=json";

        return fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
    };

    const getUsername = async (userId) => {
        let url =
            "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
            apiKey +
            "&steamids=" +
            userId +
            "&format=json";

        return fetch(url)
            .then((response) => response.json())
            .then((json) => {
                setUsers((oldArray) => [
                    ...oldArray,
                    json.response.players[0].personaname,
                ]);
            })
            .catch((error) => console.error(error));
    };

    const getGameImage = (appId) => {
        return (
            "https://steamcdn-a.akamaihd.net/steam/apps/" +
            appId +
            "/library_600x900_2x.jpg"
        );
    };

    const getData = async () => {
        Promise.all(steamUserIds.map((v) => getGameList(v)))
            .then((resolvedValues) => {
                let allGames = [];
                let allAppIds = [];

                // Create arrays of each user's games
                resolvedValues.forEach((value) => {
                    let games = [];
                    let appIds = [];

                    // Add game objects to allGames
                    value.response.games.forEach((game) => {
                        games.push(game);
                    });

                    // Add game IDs to allAppIds
                    games.forEach((game) => {
                        appIds.push(game.appid);
                    });

                    allGames.push(value.response.games);
                    allAppIds.push(appIds);
                });

                // Generate list of common game IDs between users
                let commonGameIds = allAppIds.reduce((p, c) =>
                    p.filter((e) => c.includes(e))
                );

                // Convert ID list to game name list
                let common = [];
                commonGameIds.forEach((gameId) => {
                    let gameMatch = steamGameList.applist.apps.find(
                        (game) => game.appid === gameId
                    );

                    if (gameMatch) {
                        common.push(gameMatch.name);
                    }
                });

                // Sort by playtime
                // common.sort(
                // 	(a, b) =>
                // 		parseFloat(b.playtime_forever) -
                // 		parseFloat(a.playtime_forever)
                // );

                common.sort();
                setCommonGames(common);
            })
            .catch((err) => console.log(err));
    };

    const handleIdClick = async () => {
        await getUsername(steamUserId);
        setSteamUserIds((oldArray) => [...oldArray, steamUserId]);
        setSteamUserId("");
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
                            value={steamUserId}
                            onChange={(e) => setSteamUserId(e.target.value)}
                        />
                        <Button variant="outlined" onClick={handleIdClick}>
                            Add
                        </Button>
                    </Grid>
                    <Grid item>
                        {users.length > 0 ? (
                            users.length === 1 ? (
                                <h3>{users.length} User:</h3>
                            ) : (
                                <h3>{users.length} Users:</h3>
                            )
                        ) : (
                            ""
                        )}
                        {users.map((user) => (
                            <div key={user}>
                                <p>{user}</p>
                            </div>
                        ))}
                    </Grid>
                    <Grid item>
                        <Button
                            id="test-button"
                            variant="contained"
                            color="primary"
                            onClick={getData}
                        >
                            What games do we have in common?
                        </Button>
                    </Grid>
                    <Grid item>
                        {commonGames.length > 0 ? (
                            <h3>{commonGames.length} games:</h3>
                        ) : (
                            ""
                        )}
                        {commonGames.map((game) => (
                            <div key={game}>
                                <p>{game}</p>
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default App;
