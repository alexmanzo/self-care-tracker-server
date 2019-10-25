conn = new Mongo();
db = conn.getDB("bathroom-finder");

db.createUser(
    {
        user: 'local',
        pwd: 'password',  // or cleartext password
        roles: [
            { role: "readWrite", db: 'bathroom-finder' }
        ]
    }
)