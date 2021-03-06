import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

import "./App.css";
import secret from "./Resources/secret.json";
import steamGameList from "./Resources/steamGameList.json";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActions } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

function App() {
    const [steamUserId, setSteamUserId] = useState([]);
    const [steamUserIds, setSteamUserIds] = useState([]);
    const [commonGames, setCommonGames] = useState([]);
    const [users, setUsers] = useState([]);

    const [sortMethod, setSortMethod] = useState("titleasc");

    const [modalOpen, setmodalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        image: "",
    });
    const handleClickOpen = (game) => {
        let image = getGameImage(game.appid);
        let data = {
            appid: game.appid,
            title: game.name,
            image: image,
            total_playtime: game.total_playtime,
            avg_playtime: game.avg_playtime,
        };
        setModalData(data);
        setmodalOpen(true);
    };
    const handleClose = () => {
        setmodalOpen(false);
    };

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
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
            apiKey +
            "&steamids=" +
            userId +
            "&format=json";

        return fetch(url)
            .then((response) => response.json())
            .then((json) => {
                let user = {
                    personaname: json.response.players[0].personaname,
                    avatarfull: json.response.players[0].avatarfull,
                    steamid: json.response.players[0].steamid,
                };
                setUsers((oldArray) => [...oldArray, user]);
            })
            .catch((error) => console.error(error));
    };

    const getGameImage = (appId) => {
        return "https://steamcdn-a.akamaihd.net/steam/apps/" + appId + "/library_600x900_2x.jpg";
    };

    const calculateTotalPlaytime = (gameId, allGames) => {
        let total = 0;

        allGames.forEach((gameList) => {
            total += gameList.find((game) => game.appid === gameId).playtime_forever;
        });

        return total / 60;
    };

    const calculateAvgPlaytime = (gameId, allGames) => {
        return calculateTotalPlaytime(gameId, allGames) / users.length;
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
                let commonGameIds = allAppIds.reduce((p, c) => p.filter((e) => c.includes(e)));

                // Convert ID list to game name list
                let common = [];
                commonGameIds.forEach((gameId) => {
                    let gameMatch = steamGameList.applist.apps.find((game) => game.appid === gameId);

                    if (gameMatch) {
                        let gameObject = {
                            appid: gameId,
                            name: gameMatch.name,
                            total_playtime: calculateTotalPlaytime(gameId, allGames),
                            avg_playtime: calculateAvgPlaytime(gameId, allGames),
                        };
                        common.push(gameObject);
                    }
                });

                setCommonGames(common);
                sortGames(sortMethod, common);
            })
            .catch((err) => console.log(err));

        if (users.length === 0) {
            setCommonGames([]);
        }
    };

    const handleIdClick = () => {
        getUsername(steamUserId);
        setSteamUserIds((oldArray) => [...oldArray, steamUserId]);
        setSteamUserId("");
    };

    const handleMissingGameImage = (e, id) => {
        e.target.onerror = null;
        document.getElementsByClassName(id)[0].src =
            "https://www.pngitem.com/pimgs/m/468-4685484_transparent-video-game-clipart-game-console-clipart-hd.png";
    };

    const removeUser = (user) => {
        let index = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i].personaname === user.personaname) {
                index = i;
                break;
            }
        }

        if (users.length > 1) {
            let temp = [...users];
            temp.splice(index, 1);
            setUsers(temp);
        } else {
            setUsers([]);
        }

        if (steamUserIds.length > 1) {
            let temp = [...steamUserIds];
            temp.splice(index, 1);
            setSteamUserIds(temp);
        } else {
            setSteamUserIds([]);
        }
    };

    const handleSortChange = (e) => {
        setSortMethod(e.target.value);
        sortGames(e.target.value, commonGames);
    };

    const sortGames = (method, games) => {
        let temp = [...games];

        if (method === "titleasc") {
            temp.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
        } else if (method === "titledesc") {
            temp.sort((a, b) => b.name.toUpperCase().localeCompare(a.name.toUpperCase()));
        } else if (method === "timedesc") {
            temp.sort((a, b) => b.total_playtime - a.total_playtime);
        } else if (method === "timeasc") {
            temp.sort((a, b) => a.total_playtime - b.total_playtime);
        }

        setCommonGames(temp);
        console.log(temp);
    };

    return (
        <div
            className="App"
            style={{
                backgroundColor: "#0D2840",
                height: "100%",
            }}
        >
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        width: "100%",
                        height: 100,
                        backgroundColor: "#28292b",
                        marginBottom: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{ float: "left", marginLeft: "20px" }}>
                        <h1>"What Should We Play?"</h1>
                    </Typography>
                    <div>
                        <Button
                            id="cors-button"
                            color="primary"
                            variant="contained"
                            target="_blank"
                            href="https://www.steamidfinder.com/"
                            align="right"
                        >
                            Find a Steam ID
                        </Button>
                        <Button
                            id="cors-button"
                            color="warning"
                            variant="contained"
                            target="_blank"
                            href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en"
                            align="right"
                            sx={{ float: "right", marginRight: "20px" }}
                        >
                            Download CORS Blocker
                        </Button>
                    </div>
                </Box>
                <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                    <Grid
                        container
                        item
                        xs={3}
                        spacing={2}
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="left"
                        padding="10px"
                    >
                        <Grid item>
                            <TextField
                                sx={{ width: "100%", backgroundColor: "#fafafa" }}
                                id="steam-id"
                                label="Steam ID"
                                variant="outlined"
                                value={steamUserId}
                                onChange={(e) => setSteamUserId(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#165F8C", width: "100%" }}
                                onClick={handleIdClick}
                            >
                                ADD
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
                                <div key={user.personaname}>
                                    <Card sx={{ display: "flex", margin: "10px" }} elevation={6}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                width: "90%",
                                                fontFamily: "Poppins",
                                                alignItems: "center",
                                            }}
                                        >
                                            <CardMedia
                                                className={"usercard" + user.personaname}
                                                component="img"
                                                sx={{ height: 80, width: 80 }}
                                                image={user.avatarfull}
                                                alt="User Avatar"
                                            />
                                            <CardContent
                                                sx={{ paddingBottom: "0px !important", paddingTop: "0px !important" }}
                                            >
                                                <Typography
                                                    component="div"
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: "Poppins",
                                                        padding: "0px",
                                                        marginLeft: "10px",
                                                    }}
                                                >
                                                    {user.personaname}
                                                </Typography>
                                            </CardContent>
                                        </Box>
                                        <CardActions>
                                            <IconButton
                                                aria-label="close"
                                                onClick={() => removeUser(user)}
                                                color="warning"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={9}
                        spacing={4}
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        width="100%"
                    >
                        <Grid item>
                            <Button
                                id="list-button"
                                variant="contained"
                                sx={{ backgroundColor: "#165f8c" }}
                                onClick={getData}
                            >
                                Generate Game List
                            </Button>
                        </Grid>
                        <Grid item>
                            {commonGames.length > 0 ? (
                                <div id="sortFilterBar">
                                    <h3>{commonGames.length} Games:</h3>
                                    <div>
                                        <InputLabel id="sort-label" sx={{color: 'white'}}>Sort by</InputLabel>
                                        <Select
                                            labelId="sort-label"
                                            id="demo-simple-select"
                                            value={sortMethod}
                                            label="Sort by"
                                            onChange={handleSortChange}
                                            sx={{
                                                backgroundColor: "white",
                                                border: "1px solid black",
                                                padding: "0 5px 0 5px",
                                                fontFamily: "unset",
                                            }}
                                        >
                                            <MenuItem value={"titleasc"}>Title (ascending)</MenuItem>
                                            <MenuItem value={"titledesc"}>Title (descending)</MenuItem>
                                            <MenuItem value={"timedesc"}>Playtime (highest first)</MenuItem>
                                            <MenuItem value={"timeasc"}>Playtime (lowest first)</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {commonGames.map((game) => (
                                <Card sx={{ display: "flex", margin: "10px" }} elevation={6}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: "90%",
                                        }}
                                    >
                                        <CardMedia
                                            className={"gamecard" + game.appid}
                                            component="img"
                                            sx={{ height: 100, width: 350 }}
                                            image={getGameImage(game.appid)}
                                            alt="Game Cover"
                                            onError={(e) => handleMissingGameImage(e, "gamecard" + game.appid)}
                                        />
                                        <CardContent>
                                            <Typography
                                                component="div"
                                                variant="h5"
                                                sx={{ fontFamily: "Poppins", marginLeft: "15px", marginRight: "15px" }}
                                            >
                                                {game.name}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                    <CardActions>
                                        <Button
                                            sx={{ backgroundColor: "#165f8c" }}
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleClickOpen(game)}
                                        >
                                            Details
                                        </Button>
                                        <Dialog
                                            onClose={handleClose}
                                            aria-labelledby="customized-dialog-title"
                                            open={modalOpen}
                                        >
                                            <DialogTitle>
                                                {modalData.title}
                                                <IconButton
                                                    aria-label="close"
                                                    onClick={handleClose}
                                                    sx={{
                                                        position: "absolute",
                                                        right: 8,
                                                        top: 8,
                                                        color: "#F9912B",
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </DialogTitle>
                                            <DialogContent dividers sx={{ display: "flex", flexDirection: "row" }}>
                                                <img src={modalData.image} width="150px" />
                                                <div>
                                                    <Typography gutterBottom sx={{ marginLeft: "20px" }}>
                                                        <a
                                                            href={
                                                                "https://store.steampowered.com/app/" + modalData.appid
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Store Link
                                                        </a>
                                                        <br />
                                                        <br />
                                                        <b>Total Playtime:</b>{" "}
                                                        {(Math.round(modalData.total_playtime * 100) / 100).toFixed(2)}{" "}
                                                        hours
                                                        <br />
                                                        <b>Average Playtime:</b>{" "}
                                                        {(Math.round(modalData.avg_playtime * 100) / 100).toFixed(2)}{" "}
                                                        hours
                                                    </Typography>
                                                </div>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button sx={{ color: "#F9912B" }} onClick={handleClose}>
                                                    CLOSE
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </CardActions>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default App;
