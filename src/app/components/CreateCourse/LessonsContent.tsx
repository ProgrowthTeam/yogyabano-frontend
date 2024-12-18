import React, { useState, useEffect, ReactNode } from "react";
import { postRequest } from "../../utils/apiUtils";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
  styled,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyState from "./EmptyState";
import CreateNewContent from "../CreateNewContent";
import router from "next/router";
import { set } from "react-hook-form";

interface Lesson {
  lesson_id: any;
  created_at: ReactNode;
  updated_at: ReactNode;
  id: string;
  title: string;
  description: string;
}

const contentType = {
  type: "lesson",
  title: "New Lesson",
};

const StyledAddButton = styled(Button)(({ theme }) => ({
  margin: "0 8px",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}));

const LessonsContent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateFlow, setIsUpdateFlow] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchLessons = async () => {
    const courseInfo = sessionStorage.getItem("courseInfo");
    try {
      if (!courseInfo) {
        throw new Error("Course info not found");
      }
      const course = JSON.parse(courseInfo);
      const response = await postRequest("/allLessons", {
        course_id: course.course_id,
      });
      setLessons(response.data);
      setIsDrawerOpen(false);
    } catch (error) {
      setSnackbarMessage("Error fetching lessons");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleDrawer = (open: boolean) => () => {
    setIsUpdateFlow(isUpdateFlow);
    setIsDrawerOpen(open);
  };

  const handleDeleteLesson = async (lessson: Lesson) => {
    sessionStorage.removeItem("lessonInfo");
    console.log("Deleting course:", lessson);
    try {
      await postRequest("/deleteLessons", {
        lesson_id: lessson.lesson_id,
      });
      setSnackbar({
        open: true,
        message: "Lesson deleted successfully",
        severity: "success",
      });
      await fetchLessons();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting Lesson",
        severity: "error",
      });
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    sessionStorage.setItem("lessonInfo", JSON.stringify(lesson));
    setIsUpdateFlow(true);
    setIsDrawerOpen(true);
  };

  const handleAddLessonClick = () => {
    sessionStorage.removeItem("lessonInfo");
    setIsUpdateFlow(false);
    setIsDrawerOpen(true);
  }

  return (
    <Box sx={{ width: "100%", padding: "0 60px" }}>
      {loading ? (
        <CircularProgress />
      ) : lessons.length > 0 ? (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#666",
                fontFamily: "Montserrat",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}  
            >
              To add more lessons click on “Add lesson”
            </Typography>
            <StyledAddButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleAddLessonClick}
            >
              + Lesson
            </StyledAddButton>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", width: "100%" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl. No</TableCell>
                  <TableCell>Lesson Tittle</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created On</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              {lessons.map((lesson, index) => (
              <TableBody key={lesson.id}>
                  <TableRow key={lesson.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lesson.title}</TableCell>
                    <TableCell>PDF</TableCell>
                    <TableCell>{lesson.created_at}</TableCell>
                    <TableCell>{lesson.updated_at}</TableCell>
                    <TableCell>
                      <IconButton
                        sx={{ color: "#4F6D7A" }}
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#4F6D7A" }}
                        onClick={() => handleDeleteLesson(lesson)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              </TableBody>
              ))}
            </Table>
          </TableContainer>
        </div>
      ) : (
        <Box onClick={toggleDrawer(true)}>
          <EmptyState componentProps={{ title: "lesson", path: "" }} />
        </Box>
      )}
      <CreateNewContent
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        contentType={contentType}
        fetchLessons={fetchLessons}
        isUpdateFlow={isUpdateFlow}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LessonsContent;
