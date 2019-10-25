exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
exports.PORT = process.env.PORT || 3000;
exports.DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL
    : 'mongodb://' +
        process.env.MONGO_LOCAL_USERNAME + ':' +
        process.env.MONGO_LOCAL_PASSWORD + '@' +
        process.env.MONGO_LOCAL_HOST + '/' +
        process.env.MONGO_LOCAL_DATABASE;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-bathroom-finder';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';