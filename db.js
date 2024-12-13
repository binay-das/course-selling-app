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
    firstName: {
        type: String,
        required: true
    },
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

const usersModel = mongoose.model('Users', userSchema);
const coursesModel = mongoose.model('Courses', courseSchema);
const adminsModel = mongoose.model('Admins', adminSchema);
const purchasesModel = mongoose.model('Purchases', purchaseSchema);


module.exports = {
    usersModel,
    coursesModel,
    adminsModel,
    purchasesModel
}