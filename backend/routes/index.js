// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res, next) => {
    const csrfToken = req.csrfToken();
    try {
      res.cookie("XSRF-TOKEN", csrfToken);
      res.status(200).json({ 'XSRF-Token': csrfToken });
    } catch (error) { next(error); };
});

const apiRouter = require('./api');

router.use('/api', apiRouter);






/* ************** */
module.exports = router;