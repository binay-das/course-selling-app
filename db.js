const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String
});


const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    imgUrl: String,
    creatorId: ObjectId
});


const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String
});


const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
    purchaseDate: Date
});

const usersSchema = mongoose.model('Users', userSchema);
const coursesSchema = mongoose.model('Courses', courseSchema);
const adminsSchema = mongoose.model('Admins', adminSchema);
const purchasesSchema = mongoose.model('Purchases', purchaseSchema);


module.exports = {
    userSchema,
    courseSchema,
    adminSchema,
    purchaseSchema
}