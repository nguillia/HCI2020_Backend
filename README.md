# HCI2020_Backend

## Endpoints

### Users

| Endpoint                  | Type | Parameters                                     | Description                                                             |
| ------------------------- | ---- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| **api/users/user**        | POST | **id**: User id                                | Get user specific information (eg. id, liked games, (dis)liked genres). |
| **api/users/like_genres** | POST | **id**: User id<br/>**genres**: Genres ID list | Like specified genres.                                                  |
| **api/users/like_games**  | POST | **id**: User id<br/>**games**: Games ID list   | Like specified games.                                                   |

### Games

| Endpoint       | Type | Parameters                               | Description         |
| -------------- | ---- | ---------------------------------------- | ------------------- |
| **api/games/** | GET  |                                          | List all the games. |
| **api/games/** | POST | **limit**: max amount of games to return | List all the games. |

### Genres

| Endpoint       | Type | Parameters | Description          |
| -------------- | ---- | ---------- | -------------------- |
| **api/games/** | GET  |            | List all the genres. |
