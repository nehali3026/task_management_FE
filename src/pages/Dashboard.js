import { useState, useEffect } from "react";
import { Button, Box, Pagination, Typography, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import api from "../services/api";
import AddIcon from "@mui/icons-material/Add";
import { formatDateToDDMMYYYY } from "../utils/dateConvert";
import { useError } from "../context/ErrorContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { showError } = useError();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTasks = async (pageNum = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks?page=${pageNum}&limit=${limit}`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
      setRowsPerPage(limit);
    } catch (err) {
      const message = err.response?.data?.message || "Error fetching tasks";
      showError(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleAddTask = () => {
    setEditingTask(null);
    setOpenForm(true);
  };

  const handleEditTask = (task) => {
    console.log(task, "---editing task---");
    setEditingTask(task);
    setOpenForm(true);
  };

  const handleSaveTask = () => {
    fetchTasks(page);
    setOpenForm(false);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks(page);
    } catch (err) {
      alert("Delete failed (Admin only)");
    }
  };

  const handlePaginationModelChange = (model) => {
    const newPage = model.page + 1; // DataGrid uses 0-based page
    const newRowsPerPage = model.pageSize;

    if (newRowsPerPage !== rowsPerPage) {
      // When rows per page changes → reset to page 1
      fetchTasks(1, newRowsPerPage);
    } else {
      fetchTasks(newPage, newRowsPerPage);
    }
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 160,
      valueFormatter: (params) => formatDateToDDMMYYYY(params),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleEditTask(params?.row)}>
            Edit
          </Button>
          {user?.role === "admin" && (
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteTask(params?.row.id)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard - {user?.username}'s Tasks
      </Typography>
      {user?.role === "admin" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Admin: You can delete any task.
        </Alert>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Total Pages: {totalPages}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          loading={loading}
          rowCount={totalPages * rowsPerPage} // helps with scrollbar
          pagination
          paginationMode="server"
          paginationModel={{
            page: page - 1, // DataGrid expects 0-based page
            pageSize: rowsPerPage,
          }}
          pageSizeOptions={[5, 10, 15, 20]}
          onPaginationModelChange={handlePaginationModelChange}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          sx={{ borderRadius: 1 }}
        />
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => fetchTasks(value, rowsPerPage)}
          color="primary"
        />
      </Box>
      <TaskForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </Box>
  );
};

export default Dashboard;
