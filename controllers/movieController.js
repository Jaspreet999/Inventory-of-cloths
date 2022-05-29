require('dotenv').config()

var Movie = require('../models/movies')
var fs = require('fs')
var path = require('path')
var {body,validationResult} = require('express-validator')

exports.movie_list = function(req,res,next){
    Movie.find()
    .exec(function(err,results){
        if(err) return next(err)

        res.render('home',{movies:results})
    })
}


exports.create_movie_get = function(req,res){
    res.render('addorUpdate',{title:'Add Movie'}) 
} 

exports.create_movie_post = [
 
    body('moviename','movie name is required').trim().isLength({min:'1'}).escape(),
    body('description','Description is required').trim().isLength({min:'1'}).escape(),
    body('starring','Name of artists are mandatory').trim().isLength({min:'1'}).escape(),
    body('rating').trim().optional(checkFalsy=true).isNumeric().withMessage('Rating field should not be empty'),
    body('price').trim().optional(checkFalsy=true).isNumeric().withMessage('Price should not be empty'),
    body('date', 'Invalid date of release').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('image').custom((value,{req})=>{
        var ext = (path.extname(req.file.originalname)).toLowerCase()
        switch(ext){
            case '.jpg':
                return '.jpg'
            case '.png':
                return '.png'
            case '.jpeg':
                return '.jpeg'    
            default:
                return false        
        }
    }).withMessage('Only jpg,png and jpeg document supported'),


    (req,res,next)=>{
       var error = validationResult(req)

       var movie = new Movie(
           {
               name:req.body.moviename,
               date:req.body.date,
               description:req.body.description,
               price:req.body.price,
               rating:req.body.rating,
               starring:req.body.starring
           }
        )

        if(req.file.filename && req.file.filename !== undefined && req.file.filename !== null){
            movie.image = req.file.filename
        }

       if(!error.isEmpty()){
            if(req.file){
                fs.unlink('public/uploads/'+req.file.filename,(err)=>{
                    if(err) return next(err)

                    console.log(req.file.fileName+ ' deleted')
                })
            }
            res.render('addorUpdate',{title:'Add Movie',movie:movie,error:error.array()})
       }else{
           movie.save(function(err){
               if(err) return next(err)

               console.log("one movie added!")
               res.redirect('/')
           })
       }

    }


]

exports.delete_movie_get = function(req,res){
    Movie.findById(req.params.id)
    .exec(function(err,results){
        if(err) return next(err)

        res.render('deletemovie',{movie:results})
    })  
}

exports.delete_movie_post = function(req,res,next){
   
    if(req.body.adminPassword === "jass123"){

        Movie.findByIdAndRemove(req.params.id)
        .exec(function(err){
            if(err) return next(err)

            console.log("one movie deleted!")
            res.redirect('/')
        })
        
    }else{
        Movie.findById(req.params.id)
        .exec(function(err,results){
            if(err) return next(err)

            res.render('deletemovie',{movie:results,error:"Password not matched"})
        })
    }
}

exports.update_movie_get = function(req,res){
    Movie.findById(req.params.id)
    .exec(function(err,results){
        if(err) return next(err)

        res.render('addorUpdate',{title:'Update Movie',movie:results})
    })
}


exports.update_movie_post = [
 
    body('moviename','movie name is required').trim().isLength({min:'1'}).escape(),
    body('description','Description is required').trim().isLength({min:'1'}).escape(),
    body('starring','Name of artists are mandatory').trim().isLength({min:'1'}).escape(),
    body('rating').trim().optional(checkFalsy=true).isNumeric().withMessage('Rating field should not be empty'),
    body('price').trim().optional(checkFalsy=true).isNumeric().withMessage('Price should not be empty'),
    body('date', 'Invalid date of release').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('image','please select an image').notEmpty(),
    body('image').custom((value,{req})=>{
        var ext = (path.extname(req.file.originalname)).toLowerCase()
        switch(ext){
            case '.jpg':
                return '.jpg'
            case '.png':
                return '.png'
            case '.jpeg':
                return '.jpeg'    
            default:
                return false        
        }
    }).withMessage('Only jpg,png and jpeg document supported'),


    (req,res,next)=>{
       var error = validationResult(req)
       
       var movie = new Movie(
           {
               name:req.body.moviename,
               date:req.body.date,
               description:req.body.description,
               price:req.body.price,
               rating:req.body.rating,
               starring:req.body.starring
           }
        )
        if(error.isEmpty()){
            if(req.file.filename!==undefined && req.file.filename !== null){
                movie.image = req.file.filename
            }
        }   
        

       if(!error.isEmpty()){
            if(req.file){
                fs.unlink('public/uploads/'+req.file.filename,(err)=>{
                    if(err) return next(err)

                    console.log(req.file.fileName+ ' deleted')
                })
            }
            res.render('addorUpdate',{title:'Add Movie',movie:movie,error:"Please fill all the fields"})
       }else{
           Movie.findByIdAndUpdate(req.params.id,{
               $set:{
                name:req.body.moviename,
                date:req.body.date,
                description:req.body.description,
                price:req.body.price,
                rating:req.body.rating,
                starring:req.body.starring,
                image:movie.image
               }
           },function(err,result){
               if(err) return next(err)
               console.log("one movie deleted")
               res.redirect('/')
           })
       }

    }
]

exports.movie_detail = function(req,res,next){
    Movie.findById(req.params.id)
    .exec(function(err,result){
        if(err) return next(err)
        
        res.render('detail',{movie:result} )
        
    })
   
}