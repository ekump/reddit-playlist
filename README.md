# reddit-playlist
A web app I built in an effort to better understand Angular, TypeScript, Material, redis, coverage reporting, and devopy stuff with Heroku. As an added bonus I find the functionality quite useful.

## What does it do?
Pulls in posts from music related subreddits on reddit.com and attempts to find songs mentioned on Spotify and then create playlists from those songs.

## Where can I find it?
http://reddit-playlist.herokuapp.com

## What improvements are on the way?
* **Integration tests**. I've sort of been ignoring cucumber at the moment because I want to see what the newer E2E tests are all about.
* **UX/UI**. The workflow can definitely be improved and for the most part I'm using stock material components with minimal CSS changes.
* **Search**. Right now I assume the reddit post will be formatted as ` artist name - song`. I can improve this by further searching the media attached to a post, implementing something like elastic search, and maybe even some sort of machine learning.
* **Caching**. Right now the reddit requests are crudely cached in redis. The results from Spotify should also be stored in redis.

## Who are you?
[LinkedIn](https://www.linkedin.com/in/ekump/)

[Twitter](https://www.twitter.com/edtheprogrammer)
