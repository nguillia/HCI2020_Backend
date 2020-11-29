# HCI2020_Backend

## Endpoints

**Main endpoint**: https://hci2020.herokuapp.com/

### Users

#### POST Requests

| Endpoint                     | Parameters                                             | Description                                                             |
| ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| **api/users/user**           | **id**[Int]: User id                                   | Get user specific information (eg. id, liked games, (dis)liked genres). |
| **api/users/like_genres**    | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user like the specified genres.                                 |
| **api/users/dislike_genres** | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user dislike the specified genres.                              |
| **api/users/like_games**     | **id**[Int]: User id<br/>**games**[Array]: Games IDs   | Let the user like the specified games.                                  |

### Games

#### GET Requests

| Endpoint       | Description         |
| -------------- | ------------------- |
| **api/games/** | List all the games. |

#### POST Requests

| Endpoint       | Parameters                                    | Description             |
| -------------- | --------------------------------------------- | ----------------------- |
| **api/games/** | **limit**[Int]: max amount of games to return | List the first x games. |

### Genres

#### GET Requests

| Endpoint        | Description          |
| --------------- | -------------------- |
| **api/genres/** | List all the genres. |

### Recommender

No endpoints implemented yet.

<!-- | Endpoint       | Type | Parameters | Description          |
| -------------- | ---- | ---------- | -------------------- |
| **api/games/** | GET  |            | List all the genres. | -->
