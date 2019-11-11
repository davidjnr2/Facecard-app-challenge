const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');

router.get('/', stuffCtrl.getAllRecipe);
router.post('/', stuffCtrl.createRecipe);
router.get('/:id', stuffCtrl.getOneRecipe);
router.put('/:id', stuffCtrl.modifyRecipe);
router.delete('/:id', stuffCtrl.deleteRecipe);

module.exports = router;