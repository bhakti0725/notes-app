const express= require('express');
const router= express.Router();
const Note= require('../models/Note');
const auth= require('../middleware/auth');
const AppError= require('../utils/AppError');
const { upload, cloudinary } = require('../config/cloudinary');

// let notes=[
//     { id: '1', title:'First note', body: 'Hello world', createdAt: new Date()},
//     { id: '2', title: 'Second note', body: 'Learning REST', createdAt: new Date()},
// ];

router.get('/', auth,async (req,res)=>{
    try{
        const notes= await Note.find({userId: req.user.id}).sort({createdAt:-1});
    
    res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
    });
} catch(error){
    next(error);
}}
);

router.get('/:id',auth,async (req,res)=>{
    try{const note= await Note.findOne({
        _id: req.params.id,
        userId: req.user.id
    });
    if(!note){
            return next(new AppError('Note not found', 404));
        }
    res.status(200).json({
        success:true,
        data:note
    });
}catch(error){
    next(error);}
});

router.post('/', auth, async (req,res)=>{
    try{const {title, body}=req.body;
    const note= await Note.create({title, body, userId: req.user.id});

    res.status(201).json({
        success: true,
        data: note
    });} catch(error){
        next(error);
    }
});

router.patch('/:id',auth, async (req,res)=>{
    try{
        const note= await Note.findOneAndUpdate(
            {_id: req.params.id, userId:req.user.id},
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
       if(!note){
            return next(new AppError('Note not found', 404));
        }
        res.status(200).json({
            success: true,
            data: note
        });
    }catch(error){
        next(error);}
});

router.delete('/:id', auth, async (req, res)=>{
    try{
        const note= await Note.findOneAndDelete({_id:req.params.id, userId:req.user.id});

        if(!note){
            return next(new AppError('Note not found', 404));
        }
        res.status(200).json({
            success: true,
            msg: 'Note deleted successfully'
        });
    }catch(error){
        next(error);
    }
});

// POST /api/v1/notes/:id/image — upload image to a note
router.post('/:id/image', auth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    // find the note — must belong to this user
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note) {
      // delete uploaded file since note doesn't exist
      await cloudinary.uploader.destroy(req.file.filename);
      return next(new AppError('Note not found', 404));
    }

    // if note already has an image, delete the old one
    if (note.imagePublicId) {
      await cloudinary.uploader.destroy(note.imagePublicId);
    }

    // save new image URL and public ID to note
    note.imageUrl = req.file.path;
    note.imagePublicId = req.file.filename;
    await note.save();

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/notes/:id/image — remove image from a note
router.delete('/:id/image', auth, async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note) return next(new AppError('Note not found', 404));
    if (!note.imageUrl) return next(new AppError('Note has no image', 400));

    // delete from cloudinary
    await cloudinary.uploader.destroy(note.imagePublicId);

    // remove from database
    note.imageUrl = null;
    note.imagePublicId = null;
    await note.save();

    res.status(200).json({ success: true, msg: 'Image removed' });
  } catch (error) {
    next(error);
  }
});


module.exports= router;