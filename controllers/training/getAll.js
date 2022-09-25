const {Training} = require("../../models/training");

const getAll = async(req, res) => {
    const {_id: owner} = req.user;
    const result = await Training.find({owner}, "-createdAt -updatedAt",)
                            .populate();
    res.json(result);
}

module.exports = getAll;