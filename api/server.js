const express = require('express');
const server = express();

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// const actionsRouter = require('./actions/actions-router');
// Build your projects router in /api/projects/projects-router.js
const projectsRouter = require('./projects/projects-router');
// Do NOT `server.listen()` inside this file!

server.use(express.json());

server.use('/api/projects', projectsRouter)

// server.use('/api/actions', actionsRouter)

server.use('*', (req, res, next) => {
    res.status(404).json({
        message: `${req.method} ${req.baseUrl} not found`
    })
    next({ status: 404, message: 'not found' })
});

server.use((err, req, res) => {
    res.status(err.status || 500).json({ message: `HORROR: ${err.message}`});
});


module.exports = server;
