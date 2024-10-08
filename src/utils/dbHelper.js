const dbHelper = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}
export {dbHelper}

// Method 2 --> using the try n catch
/*
const dbHelper = (fn) => async (req,res,next) => {
    try{
        await fn(req,res,next)
    }
    catch(error){
        req.status(err.code || 5000).json({
            success: false,
            message: err.message
        })
    }
}
*/