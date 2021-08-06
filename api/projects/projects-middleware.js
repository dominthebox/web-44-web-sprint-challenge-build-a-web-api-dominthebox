// add middlewares here related to projects

const server = require('../server');

server.use('*', (req, res, next) => {
    res.status(404).json({
        message: `${req.method} ${req.baseUrl} not found`
    })
    next({ status: 404, message: 'not found' })
});

server.use((err, req, res) => {
    res.status(err.status || 500).json({ message: `HORROR: ${err.message}`});
});