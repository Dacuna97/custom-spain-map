const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Help = require('../../models/Help');

// @route   POST api/help
// @desc    Create help
// @access  Private
router.post(
  '/',
  auth,
  [
    check('title', 'Please include a valid province').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('typology', 'Typology is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, name, typology, status } = req.body;
    try {
      newHelp = new Help({
        title,
        name,
        typology,
        status
      });

      const help = await newHelp.save();

      // Return help
      res.json(help);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route  Get api/help
// @desc   Get all helps
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const help = await Help.find();
    res.json(help);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  Get api/help/:title
// @desc   Get help by province title
// @access Private
router.get('/:title', auth, async (req, res) => {
  try {
    const help = await Help.findOne({ title: req.params.title });

    if (!help) {
      return res.status(404).json({ msg: 'Help not found' });
    }
    res.json(help);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Help not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route  DELETE api/help/:id
// @desc   Delete a help
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const help = await help.findById(req.params.id);

    if (!help) {
      return res.status(404).json({ msg: 'Help not found' });
    }

    await help.remove();
    res.json({ msg: 'Help removed ' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'help not found' });
    }
    res.status(500).send('Server error');
  }
});
module.exports = router;
