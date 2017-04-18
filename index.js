const express = require('express');
const app = express();

app.use(express.static('./src/'))

app.listen(8000, () => {
    console.log('The server is running on the http://localhost:8000/......');
});
