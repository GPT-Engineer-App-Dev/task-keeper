import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, isFuture } from "date-fns";

const Upcoming = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    // Filter tasks to show only upcoming tasks
    setTasks(tasks.filter((task) => isFuture(new Date(task.dueDate))));
  }, [tasks]);

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ title: "", description: "", dueDate: "" });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, updatedTask) => {
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Upcoming Tasks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask();
              }}
            >
              <div className="mb-4">
                <Input
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <Textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Save Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={deleteTask} onEdit={editTask} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
        <p>Due: {format(new Date(task.dueDate), "PPP")}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}
              >
                <div className="mb-4">
                  <Input
                    placeholder="Title"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Textarea
                    placeholder="Description"
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <Input
                    type="date"
                    value={editedTask.dueDate}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Upcoming;