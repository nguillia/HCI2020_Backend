# HCI2020_Backend

## Endpoints

**Main endpoint**: https://hci2020.herokuapp.com/api

### Users

#### POST Requests

| Endpoint                  | Parameters                                                                           | Description                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **/users/user**           | **id**[Int]<br/>&nbsp;&nbsp;User id                                                  | Get user specific information (eg. id, (dis)liked games, disliked genres).           |
| **/users/dislike_genres** | **id**[Int]<br/>&nbsp;&nbsp;User id<br/>**genres**[Array]<br/>&nbsp;&nbsp;Genres IDs | Let the user dislike the genres with specified ID, all other genres will be "liked". |
| **/users/dislike_games**  | **id**[Int]<br/>&nbsp;&nbsp;User id<br/>**genres**[Array]<br/>&nbsp;&nbsp;Genre IDs  | Let the user dislike the games with specified ID.                                    |
| **/users/like_games**     | **id**[Int]<br/>&nbsp;&nbsp;User id<br/>**games**[Array]<br/>&nbsp;&nbsp;Game IDs    | Let the user like the games with specified ID.                                       |
| **users/remove_games**    | **id**[Int]<br/>&nbsp;&nbsp;User id<br/>**games**[Array]<br/>&nbsp;&nbsp;Game IDs    | Remove the games with specified ID from the users' list.                             |

### Games

#### GET Requests

| Endpoint    | Description         |
| ----------- | ------------------- |
| **/games/** | List all the games. |

#### POST Requests

| Endpoint    | Parameters                                                   | Description             |
| ----------- | ------------------------------------------------------------ | ----------------------- |
| **/games/** | **limit**[Int]<br/>&nbsp;&nbsp;Max amount of games to return | List the first x games. |

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
