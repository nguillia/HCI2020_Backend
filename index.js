require('dotenv').config();

/* NPM PACKAGES */
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const https = require('https');
const cors = require('cors');

/* END NPM PACKAGES */

/* CUSTOM PACKAGES */
const database = require('./database/init');
const { concat } = require('lodash');
/* END CUSTOM PACKAGES */

/* VARIABLES */
const app = express();
const port = process.env.PORT || 3001;
/* END VARIABLES */

/* HEROKU MAGIC */
// Keep Alive - Check every 25 minutes
setInterval(function () {
  console.log(new Date(Date.now()).toLocaleString(), 'Keeping app awake.');
  https.get('https://hci2020.herokuapp.com/api/auth/wake');
  https.get('https://hci2020-python.herokuapp.com/wake');
}, 25 * 60 * 1000);
/* END HEROKU MAGIC */

/* MIDDLEWARE */
app.options('*', cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
/* END MIDDLEWARE */

/* ROUTES */
require('./routes/routes')(app);

/* FUNCTIONS */
database
  .init()
  .then((r) => {
    console.log(r);
    require('./database/relations');

    /* DO ALL DB RELATED STUFF HERE*/
    //require('./services/gamepuller').pullGames();

    // const bcrypt = require('bcrypt');
    // bcrypt.hash('', 12).then((val) => console.log(val));
  })
  .catch((err) => console.error(err));

/* LISTEN */
app.listen(port, () => console.log(`Server up and running on port ${port}.`));
