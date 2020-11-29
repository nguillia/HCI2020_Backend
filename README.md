# HCI2020_Backend

## Endpoints

### Users

| Endpoint                  | Type | Parameters                                             | Description                                                             |
| ------------------------- | ---- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| **api/users/user**        | POST | **id**[Int]: User id                                   | Get user specific information (eg. id, liked games, (dis)liked genres). |
| **api/users/like_genres** | POST | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user like the specified genres.                                 |
| **api/users/like_games**  | POST | **id**[Int]: User id<br/>**games**[Array]: Games IDs   | Let the user like the specified games.                                  |

### Games

| Endpoint       | Type | Parameters                                    | Description         |
| -------------- | ---- | --------------------------------------------- | ------------------- |
| **api/games/** | GET  |                                               | List all the games. |
| **api/games/** | POST | **limit**[Int]: max amount of games to return | List all the games. |

### Genres

| Endpoint       | Type | Parameters | Description          |
| -------------- | ---- | ---------- | -------------------- |
| **api/games/** | GET  |            | List all the genres. |
