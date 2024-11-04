// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');


// GET /api/restore-user
const { restoreUser, requireAuth, spotAuth, imgAuth } = require('../../utils/auth.js');
const { SpotImage } = require('../../db/models');

router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);

// Keep this route to test frontend setup in Mod 5
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

// Delete a spot image
router.delete('/spot-images/:imageId', requireAuth, imgAuth, async (req, res) => {
  const { imageId } = req.params;
  const img = await SpotImage.findByPk(imageId);

  if(!img) return res.status(404).json({ message: "Spot Image couldn't be found" });

  await img.destroy();

  return res.status(200).json({ message: "Successfully deleted" });
});


/* ************** */
module.exports = router;