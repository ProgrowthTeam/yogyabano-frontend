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
  TablePagination,
  TableSortLabel,
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Lesson>("title");

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
      const sortedLessons = response.data.sort((a: Lesson, b: Lesson) => {
        if (orderBy === "created_at" || orderBy === "updated_at") {
          return order === "asc"
            ? new Date(a[orderBy] as string).getTime() -
                new Date(b[orderBy] as string).getTime()
            : new Date(b[orderBy] as string).getTime() -
                new Date(a[orderBy] as string).getTime();
        } else {
          return order === "asc"
            ? (a[orderBy] as string).localeCompare(b[orderBy] as string)
            : (b[orderBy] as string).localeCompare(a[orderBy] as string);
        }
      });
      setLessons(sortedLessons);
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
  }, [page, rowsPerPage, order, orderBy]);

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
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Lesson) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: "100%", padding: "0 40px" }}>
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
                  <TableCell
                    sortDirection={orderBy === "title" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "title"}
                      direction={orderBy === "title" ? order : "asc"}
                      onClick={() => handleRequestSort("title")}
                    >
                      Lesson Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    Type
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "created_at" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "created_at"}
                      direction={orderBy === "created_at" ? order : "asc"}
                      onClick={() => handleRequestSort("created_at")}
                    >
                      Created On
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "updated_at" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "updated_at"}
                      direction={orderBy === "updated_at" ? order : "asc"}
                      onClick={() => handleRequestSort("updated_at")}
                    >
                      Last Updated
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              {lessons
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lesson, index) => (
                  <TableBody key={lesson.id}>
                    <TableRow key={lesson.id}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={lessons.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        fetchLessons={() => fetchLessons()}
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
