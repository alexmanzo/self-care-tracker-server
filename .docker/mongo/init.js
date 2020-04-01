conn = new Mongo();
db = conn.getDB("self-care-tasks");

db.createUser(
    {
        user: 'local',
        pwd: 'password',  // or cleartext password
        roles: [
            { role: "readWrite", db: 'self-care-tasks' }
        ]
    }
)