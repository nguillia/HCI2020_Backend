# HCI2020_Backend

## Endpoints

**Main endpoint**: https://hci2020.herokuapp.com/

### Users

| Endpoint                     | Type | Parameters                                             | Description                                                             |
| ---------------------------- | ---- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| **api/users/user**           | POST | **id**[Int]: User id                                   | Get user specific information (eg. id, liked games, (dis)liked genres). |
| **api/users/like_genres**    | POST | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user like the specified genres.                                 |
| **api/users/dislike_genres** | POST | **id**[Int]: User id<br/>**genres**[Array]: Genres IDs | Let the user dislike the specified genres.                              |
| **api/users/like_games**     | POST | **id**[Int]: User id<br/>**games**[Array]: Games IDs   | Let the user like the specified games.                                  |

### Games

| Endpoint       | Type | Parameters                                    | Description             |
| -------------- | ---- | --------------------------------------------- | ----------------------- |
| **api/games/** | GET  |                                               | List all the games.     |
| **api/games/** | POST | **limit**[Int]: max amount of games to return | List the first x games. |

### Genres

| Endpoint       | Type | Parameters | Description          |
| -------------- | ---- | ---------- | -------------------- |
| **api/games/** | GET  |            | List all the genres. |

### Recommender

No endpoints implemented yet.

<!-- | Endpoint       | Type | Parameters | Description          |
| -------------- | ---- | ---------- | -------------------- |
| **api/games/** | GET  |            | List all the genres. | -->
