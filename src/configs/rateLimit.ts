import rateLimit from "express-rate-limit";


// rate limiting configuration
const rateLimiter = rateLimit({
    windowMs : 60 * 1000,
    limit : 60,
    standardHeaders : 'draft-8',
    legacyHeaders : false,
    handler : (req , res) => {
        res.status(429).json({
            success : "error",
            message : "Too many requests"
        })
    }
})

export default rateLimiter;