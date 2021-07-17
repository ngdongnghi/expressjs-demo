const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const auth = require('../middlewares/authenticate');
const uploadFile = require('../middlewares/uploadFile');

const cors = require('./cors');

const Courses = require('../models/course');

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Courses.find()
            .populate('author')
            .then((courses) => {
                res.statusCode = 200;
                res.setHeader('ContentType', 'application/json');
                res.json(courses);
            }, (err) => next(err))
            .catch((err)=> next(err));
    })
    .post(cors.corsWithOptions, auth.verifyUser,  (req, res, next) => {
        uploadFile.uploadImage.single("image")(req, res, function(err) {
            if(err instanceof multer.MulterError) {
                console.log('A Multer error occurred when uploading');
            }
            else if(err) {
                console.log('An unknown err occurred when uploading' + err);
            }
            else {
                console.log('Upload is okay!');
                var newCourse = new Courses({
                    name: req.body.name,
                    description: req.body.description,
                    author: req.user,
                    image: 'images/' + req.file.filename
                });
                Courses.create(newCourse)
                    .then((course) => {
                        Courses.findById(course._id)
                            .populate('author')
                            .then((course) => {
                                res.statusCode = 200;
                                res.setHeader('ContentType', 'application/json');
                                res.json(course);
                            })         
                    }, (err) => {
                        console.log('Error');
                        res.json({err: err});
                    })
                    .catch((err) => next(err));
            }
        })
    })
    .put((req, res, next) => {

    })
    .delete((req, res, next) => {
        Courses.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('ContentType', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

courseRouter.route('/:courseId')
    .get((req, res, next) => {
        Courses.findById(req.params.courseId)
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('ContentType', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {

    })
    .put((req, res, next) => {
        Courses.findByIdAndUpdate(req.params.courseId, { $set: req.body }, { new: true })
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('ContentType', 'application/json');
                res.json(course);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Courses.findOneAndRemove(req.params.courseId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('ContentType', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = courseRouter;