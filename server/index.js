const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const { logger,logEvents } = require('./middlewares/logger')
const path = require('path')
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected!!!'))
.catch((err) => console.log('Database is not connected', err));

app.use(logger)
//app.use(cors(corsOptions))
//app.use(cors());
//middleware


app.use(cookieParser())
app.use(cors({
    origin: 'https://game-store-client.vercel.app', // Allow your frontend origin
    credentials: true, // Allow cookies to be sent
}));

//app.use('/', express.static(path.join(__dirname, 'public')))
//app.use(express.json());
app.use('/', require('./routes/authRoutes'))
/*app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})*/


const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
