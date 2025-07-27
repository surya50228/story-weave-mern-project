const Story = require('../models/Story');
const Contribution = require('../models/Contribution');

const getStories = async (req, res) => {
    const stories = await Story.find({}).populate('author', 'username').sort({ createdAt: -1 });
    res.json(stories);
};

const createStory = async (req, res) => {
    const { title, firstParagraph } = req.body;

    const story = new Story({
        title,
        author: req.user._id,
    });

    const createdStory = await story.save();

    const contribution = new Contribution({
        text: firstParagraph,
        author: req.user._id,
        story: createdStory._id,
    });

    const createdContribution = await contribution.save();
    createdStory.contributions.push(createdContribution);
    await createdStory.save();

    res.status(201).json(createdStory);
};

const getStoryById = async (req, res) => {
    const story = await Story.findById(req.params.id)
        .populate('author', 'username')
        .populate({
            path: 'contributions',
            populate: { path: 'author', select: 'username' }
        });

    if (story) {
        res.json(story);
    } else {
        res.status(404).json({ message: 'Story not found' });
    }
};

const addContribution = async (req, res) => {
    const { text } = req.body;
    const story = await Story.findById(req.params.id);

    if (story) {
        const contribution = new Contribution({
            text,
            author: req.user._id,
            story: story._id,
        });

        const createdContribution = await contribution.save();
        story.contributions.push(createdContribution);
        await story.save();
        
        // Populate author for the response
        const populatedContribution = await Contribution.findById(createdContribution._id).populate('author', 'username');

        res.status(201).json(populatedContribution);
    } else {
        res.status(404).json({ message: 'Story not found' });
    }
};

module.exports = { getStories, createStory, getStoryById, addContribution };
            