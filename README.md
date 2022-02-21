# "What Should We Play?"

## Project Background

This project was created by Abby Myers and Claire Nicholas for Michigan Tech's 2022 Winter Wonderhack.

## Inspiration

My friends and I love playing PC games together through Steam. However, Steam only allowed us to compare two of our game libraries at a time. We had to manually write down a list of games that we all owned. I wanted a website that could form a combined list of games for us in a matter of seconds.

## What it does

This site allows you to enter any number of Steam user IDs. At the click of a button, you can then generate a list of games owned by all users entered. Each game in the list opens a small modal containing playtime statistics - the total playtime and the average playtime between all users.

## How we built it

We used create-react-app to create a base React project. We then used GitHub pages right away to host the site. This allowed us to push our project changes to our GitHub repository and the hosted site with just one simple command each. We then used MUI (Material UI) to easily add visually appealing components to our page without needing to spend an overwhelming amount of time on CSS styling.

We took time before beginning to code on the project to design a color palette for the site and sketch a few layout ideas, but otherwise, designing was done on the fly.

## Challenges we ran into

The Steam API does not allow client-side requests. Everytime we tried to make an API call from the browser, we received CORS errors. Because GitHub Pages (our easiest hosting option) does not allow a server to be running alongside the site, the only solution was blocking the CORS errors to allow the API calls to go through. That is why there is a button on our site in the upper right for the user to install a CORS allowance extension.

## Accomplishments that we're proud of

We're really proud of how the site looks; the design is very clean and the colors are attractive. We took pride in every step of the project and ensured that all functionality was properly implemented.

## What we learned

We learned how to use the Steam API. We also learned a lot about the usage of MUI.

## What's next for "What Should We Play?"

If we had more time to continue work on the project, we would have added sort and filter functionality to the generated game list. We would have liked to sort the games by total or average playtime rather than just alphabetical order. We also liked the idea of being able to filter by the number of entered users that had to own the game for it to be on the list.

## FAQ

**Why is nothing working?**\
Download the CORS blocker for Google Chrome with the provided button.

Then, don't forget to turn the extension on.

**Why can't I get my game data?**\
Make sure that your Steam profile privacy settings are set to public, especially the game details.

**How do I get my Steam ID?**\
If you go to your Steam profile in a web browser and see a long number at the end of your URL, that's your ID.

If you have a custom URL, you can use [this site](https://steamid.io/) with your custom URL to get your steamID64.