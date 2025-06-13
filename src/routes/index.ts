
// router
import { Router } from "express";

// routes
import authRouter from "@/routes/v1/auth";
import userRouter from "@/routes/v1/user";
import blogRouter from "@/routes/v1/blog";

const router = Router();
router.get('/' , (_req , res) => {
    res.status(200).json({
        status : "ok",
        message : "API is running",
        timeStamp : new Date().toLocaleDateString()
    })
})

// Auth Router 
router.use('/auth' , authRouter);

// User Router
router.use('/user' , userRouter);

// Blog Router
router.use('/blog' , blogRouter)

export default router;