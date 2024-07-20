const express = require('express');
const { sequelize } = require('./src/utils/db');
const helmet = require('helmet');
const https = require('https');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./src/routes/auth.route');
const accountRoutes = require('./src/routes/account.route');
const transactionRoutes = require('./src/routes/transaction.route');
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());


app.use('/auth', authRoutes)
app.use('/account', accountRoutes)
app.use('/transaction', transactionRoutes)
app.use(helmet, helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    }
}));

app.use(helmet.frameguard({ action: 'deny' }));

app.use(helmet.xssFilter());

app.use(helmet.noSniff());

app.use(helmet.ieNoOpen());

app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }));


const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
};

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Server running on port https://localhost:${PORT}`);
        console.log('Postgre Connected')
    })
}). catch((err) => {
    console.log(err)
})


// sequelize.sync({ alter: true }).then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server running on port http://localhost:${PORT}`);
//         console.log('Postgre Connected')
//     })
// }). catch((err) => {
//     console.log(err)
// })