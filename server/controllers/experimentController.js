import Experiment from '../models/Experiment.js';

// @desc    Get all experiments with filtering and search
// @route   GET /api/experiments
export const getExperiments = async (req, res, next) => {
  console.log('GetExperiments endpoint reached', req.query);
  try {
    const { subject, difficulty, search } = req.query;
    const className = req.query['class'];
    const filter = {};
    
    if (subject) filter.subject = subject;
    if (className) filter.class = className;
    if (difficulty) filter.difficulty = difficulty;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const experiments = await Experiment.find(filter);
    res.status(200).json({ success: true, count: experiments.length, data: experiments });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new experiment
// @route   POST /api/experiments
// @access  Private/Admin
export const createExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.create(req.body);
    res.status(201).json({ success: true, data: experiment });
  } catch (err) {
    next(err);
  }
};

// @desc    Get experiments grouped by subject and class
// @route   GET /api/experiments/subjects
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Experiment.aggregate([
      {
        $group: {
          _id: { subject: "$subject", class: "$class" },
          count: { $sum: 1 },
          chapters: { $addToSet: "$chapter" }
        }
      },
      {
        $group: {
          _id: "$_id.subject",
          classes: {
            $push: {
              class: "$_id.class",
              count: "$count",
              chapters: "$chapters"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          classes: 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: subjects });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single experiment
// @route   GET /api/experiments/:id
export const getExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    res.status(200).json({ success: true, data: experiment });
  } catch (err) {
    next(err);
  }
};

// @desc    Update experiment
// @route   PUT /api/experiments/:id
// @access  Private/Admin
export const updateExperiment = async (req, res, next) => {
  try {
    let experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: experiment });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete experiment
// @route   DELETE /api/experiments/:id
// @access  Private/Admin
export const deleteExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    await experiment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single experiment by sceneKey
// @route   GET /api/experiments/scene/:sceneKey
export const getExperimentBySceneKey = async (req, res) => {
  try {
    const { sceneKey } = req.params;
    console.log('Fetching experiment by sceneKey:', sceneKey);
    const experiment = await Experiment.findOne({ sceneKey });
    if (!experiment) {
      return res.status(404).json({ success: false, message: 'Experiment not found' });
    }
    res.status(200).json({ success: true, data: experiment });
  } catch (error) {
    console.error('Get experiment by sceneKey error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
