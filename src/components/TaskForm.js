import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useError } from "../context/ErrorContext";
import api from "../services/api";

const TaskForm = ({ open, onClose, task, onSave }) => {
  console.log(task, "---task");
  const { showError } = useError();
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "Pending",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
      });
    }
  }, [task]);

  console.log(formData, "---formData");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      status: "Pending",
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await api.put(`/tasks/${task.id}`, formData);
      } else {
        await api.post("/tasks", formData);
      }
      onSave();
      handleCancel();
    } catch (err) {
      const message = err.response?.data?.message || "Error saving task";
      showError(message);
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
