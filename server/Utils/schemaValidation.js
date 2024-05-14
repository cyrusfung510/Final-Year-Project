const mongoose = require("mongoose");

const schemaValidation = (obj,schema) => {
    const TempDoc = mongoose.Document;
    const tempDoc = new TempDoc(obj,schema);
    const validationError = tempDoc.validateSync();
    return validationError;
}

module.exports = schemaValidation;