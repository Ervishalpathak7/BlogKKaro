import { Router } from "express";

const blogRouter = Router();

// create a  blog
blogRouter.post('/');

// update blog by id
blogRouter.put('/:id');

// get blog by id
blogRouter.get('/:id');

// delete blog by id 
blogRouter.delete('/:id');

export default blogRouter;