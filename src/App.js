import React, { useState } from 'react';
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import theme from "./theme";

import "./App.css";
import secret from "./Resources/secret.json";
import steamGameList from "./Resources/steamGameList.json";

import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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


    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="App">
            <ThemeProvider theme={theme2}>
                <Box
                    sx={{
                        width: {
                            xs: 400, // theme.breakpoints.up('xs')
                            sm: 800, // theme.breakpoints.up('sm')
                            md: 1500, // theme.breakpoints.up('md')
                            lg: 2200, // theme.breakpoints.up('lg')
                            xl: 2900, // theme.breakpoints.up('xl')
                        },
                        height: 100,
                        backgroundColor: '#0D2840',
                    }}
                >
                    <Typography component="legend">Website</Typography>
                </Box>

                <Grid
                    container
                    spacing={2}
                    direction="column"
                    justifyContent="left"
                    alignItems="left"
                >
                    <Grid item>
                        <Typography component="legend">Enter Steam ID</Typography>
                    </Grid>
                    <Grid item>
                        <TextField id="outlined-basic" label="Steam ID" variant="outlined" />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" sx={{backgroundColor: '#165F8C',}}>ADD</Button>
                    </Grid>
                </Grid>





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
