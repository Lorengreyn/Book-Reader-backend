const isConflict = ({name, code}) => (name === "MongoServerError" && code === 11000);

const handleSchemaValidationErrors = (error, next) => {
    error.status = isConflict(error) ? 409 : 400;
    next();
}

module.exports = handleSchemaValidationErrors;