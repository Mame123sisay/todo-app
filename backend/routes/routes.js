import express from 'express'
import { createTodos,deleteTodos,getTodos, updateTodo } from '../controllers/todoController.js';
const router=express.Router();
router.get('/',getTodos)
router.get('/:id',async(req,res)=>{
  res.send('particular todo retrieved')

})
router.post('/',createTodos);
router.put('/:id',updateTodo);
router.delete('/:id',deleteTodos);
export default router