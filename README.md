# HCI2020_Backend

## Endpoints

**Main endpoint**: https://hci2020.herokuapp.com/api

### Authentication

#### POST Requests

| Endpoint        | Parameters                                                                                      | Description                                                       |
| :-------------- | ----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **/auth/login** | **username**[String]<br/>&nbsp;&nbsp;Username<br/>**password**[String]<br/>&nbsp;&nbsp;Password | Log the user in and obtain an authentication token. (not working) |

### Users

#### GET Requests

| Endpoint       | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| **users/user** | Get user specific information (eg. id, liked and disliked games, and disliked genres). |

#### POST Requests

| Endpoint                       | Parameters                                  | Description                                                                          |
| :----------------------------- | ------------------------------------------- | :----------------------------------------------------------------------------------- |
| **/users/user/dislike_genres** | **genres**[Array]<br/>&nbsp;&nbsp;Genre IDs | Let the user dislike the genres with specified ID, all other genres will be "liked". |
| **/users/user/dislike_games**  | **games**[Array]<br/>&nbsp;&nbsp;Game IDs   | Let the user dislike the games with specified ID.                                    |
| **/users/user/like_games**     | **games**[Array]<br/>&nbsp;&nbsp;Game IDs   | Let the user like the games with specified ID.                                       |
| **users/user/remove_games**    | **games**[Array]<br/>&nbsp;&nbsp;Game IDs   | Remove the games with specified ID from the users' list.                             |

### Games

#### GET Requests

| Endpoint    | Description         |
| :---------- | :------------------ |
| **/games/** | List all the games. |

#### POST Requests

| Endpoint    | Parameters                                                   | Description             |
| :---------- | ------------------------------------------------------------ | :---------------------- |
| **/games/** | **limit**[Int]<br/>&nbsp;&nbsp;Max amount of games to return | List the first x games. |

### Genres

#### GET Requests

| Endpoint     | Description          |
| :----------- | :------------------- |
| **/genres/** | List all the genres. |

### Recommender

#### GET Requests

| Endpoint                      | Description                                                              |
| :---------------------------- | :----------------------------------------------------------------------- |
| **api/recommender/recommend** | Recommend ten new games, games that the user has not yet liked/disliked. |
