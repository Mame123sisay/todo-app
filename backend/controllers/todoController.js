import Todo from "../models/todos.js"
export const createTodos=async(req,res)=>{
  try{
     const {task}=req.body
  const newTodo= new Todo({task})
  await newTodo.save();
  //console.log(newTodo);
  res.status(201).json(newTodo);

  }catch(error){
     console.error(error);
    res.status(500).json({ message: "Failed to create todos", error: error.message });
  }
};
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();   // fetch all todos
   // console.log(todos);
    res.status(200).json(todos);       // send with 200 OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch todos", error: error.message });
  }
};
export const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { task: req.body.task, status: req.body.status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo" });
  }
};


export const deleteTodos = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted", id: req.params.id });
  } catch (error) {
    console.error("error deleting todos:", error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
};

