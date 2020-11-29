# HCI2020_Backend

## Endpoints

**Main endpoint**: https://hci2020.herokuapp.com/api

### Users

#### POST Requests

| Endpoint                  | Parameters                                             | Description                                                             |
| ------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| **/users/user**           | **id**[Int]: User id                                   | Get user specific information (eg. id, liked games, (dis)liked genres). |
| **/users/like_genres**    | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user like the specified genres.                                 |
| **/users/dislike_genres** | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user dislike the specified genres.                              |
| **/users/like_games**     | **id**[Int]: User id<br/>**games**[Array]: Games IDs   | Let the user like the specified games.                                  |

### Games

#### GET Requests

| Endpoint    | Description         |
| ----------- | ------------------- |
| **/games/** | List all the games. |

#### POST Requests

| Endpoint    | Parameters                                    | Description             |
| ----------- | --------------------------------------------- | ----------------------- |
| **/games/** | **limit**[Int]: max amount of games to return | List the first x games. |

### Genres

#### GET Requests

| Endpoint     | Description          |
| ------------ | -------------------- |
| **/genres/** | List all the genres. |

### Recommender

No endpoints implemented yet.

<!-- | Endpoint       | Type | Parameters | Description          |
| -------------- | ---- | ---------- | -------------------- |
| **api/games/** | GET  |            | List all the genres. | -->
