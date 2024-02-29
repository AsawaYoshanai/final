const mongoose = require('mongoose')

const carouselSchema = new mongoose.Schema({
    title: String,
    body: String
});


const carouselModel = mongoose.model('carouselModel', carouselSchema);

module.exports = carouselModel;