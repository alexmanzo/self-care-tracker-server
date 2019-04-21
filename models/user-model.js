const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please create a username.'],
		unique: [true, 'Sorry, that username has already been taken.']
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
        required: [true, 'We require an email address to create your account.'],
        unique: [true, 'It looks like an account already exists for that e-mail address.']
	},
	firstName: {
		type: String,
		required: [true, 'Please enter your first name.']
	},
	lastName: {
		type: String,
		required: [true, 'Please enter your last name.']
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
})

UserSchema.methods.serialize = function() {
	return {
		id: this._id,
		username: this.username,
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		admin: this.role
	}
}

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password)
}

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10)
}

module.exports = mongoose.model('User', UserSchema)