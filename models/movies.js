const mongoose = require("mongoose")
const {DateTime} = require('luxon')

var movieSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        date:{type:Date,default:new Date(),immutable:true},
        description:String,
        image:String,
        rating:{type:Number,require:true,maxlength:5,minlength:1},
        starring:{type:String},
        price:{type:Number,required:true}
    }
)

movieSchema.virtual('url').get(function(){
    return this._id
})

movieSchema.virtual('imagePath').get(function(){
    return this.image
})

movieSchema.virtual('ratingNum').get(function(){
    return this.rating
})

movieSchema.virtual('dateofrelease').get(function(){
    return DateTime.fromJSDate(this.date).toISODate()
})

module.exports = mongoose.model("Movie",movieSchema)