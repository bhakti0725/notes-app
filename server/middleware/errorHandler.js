const errorHandler=(err, req, res, next)=>{
    console.error(err.stack);

    let statusCode= err.statusCode||500;
    let message= err.message||'Server error';

    if(err.name==='CastError'){
        statusCode=400;
        message='Invalide ID format';
    }

    if(err.name ==='ValidationError'){
        statusCode=400;
        message=Object.values(err.errors).map(e=>e.message);
    }

    if(err.name==='JsonWebTokenError'){
        statusCode=401;
        message='Invalid token';
    }
    if(err.name==='TokenExpiredError'){
        statusCode=401;
        message='Token expired, please login again';
    }

    res.status(statusCode).json({
        success:false,
        msg: message
    });
};

module.exports = errorHandler;