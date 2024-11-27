const mongoose = require('mongoose');

const HeirarchySchema = new mongoose.Schema({
   
    hierarchy  : {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return Array.isArray(value) && new Set(value).size === value.length;
            },
            message: 'Permissions array contains duplicate values.'
        }
    },
});

const HeirarchyModel = mongoose.model('Heirarchy', HeirarchySchema);
module.exports = HeirarchyModel;