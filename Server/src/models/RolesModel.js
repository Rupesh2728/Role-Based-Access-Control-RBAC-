const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role : {
        type: String,
        required: true
    },

    permissions : {
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

const RoleModel = mongoose.model('Role', RoleSchema);
module.exports = RoleModel;