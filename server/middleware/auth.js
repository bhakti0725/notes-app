const jwt= require('jsonwebtoken');

const auth=(req, res, next)=>{
    const authHeader= req.header('Authorization');
    if(!authHeader|| !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success:false,
            msg:'No token, access denied'
        });
    }
        const token= authHeader.replace('Bearer ','');

        try{
            const decoded= jwt.verify(token, process.env.JWT_SECRET);

            req.user= decoded;

            next();
        }catch(error){
            res.status(401).json({
                success:false,
                msg:'Token is not valid'
            });
        }
    }

module.exports= auth;
