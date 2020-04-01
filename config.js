exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
exports.PORT = process.env.PORT || 3000;
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://' +
        process.env.MONGO_LOCAL_USERNAME + ':' +
        process.env.MONGO_LOCAL_PASSWORD + '@' +
        process.env.MONGO_LOCAL_HOST + '/' +
        process.env.MONGO_LOCAL_DATABASE;
