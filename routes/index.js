const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController')
var path = require('path')
var multer = require('multer')

var storage = multer.diskStorage(
    {
        destination:'./public/uploads/',
        filename:function(req,file,cb){
            cb(null,Date.now()+ file.originalname)
        }
    }
)

var upload = multer(
    {storage:storage}
)


//handle event

router.get('/',movieController.movie_list)

router.get('/create',movieController.create_movie_get)

router.post('/create',upload.single('image'),movieController.create_movie_post)

router.get('/:id/update',movieController.update_movie_get)

router.post('/:id/update',upload.single('image'),movieController.update_movie_post)

router.get('/:id/delete',movieController.delete_movie_get)

router.post('/:id/delete',movieController.delete_movie_post)

router.post('/:id/update',movieController.delete_movie_post)

router.get('/:id/detail',movieController.movie_detail)

module.exports = router