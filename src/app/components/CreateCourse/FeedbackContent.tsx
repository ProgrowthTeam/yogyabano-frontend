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
  feedback_id: string;
  title: string;
  description: string;
  feedback: string;
}

const contentType = {
  type: "feedback",
  title: "New Feedback",
};

const StyledAddButton = styled(Button)(({ theme }) => ({
  margin: "0 8px",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}));

const EllipsisTableCell = styled(TableCell)({
  maxWidth: "150px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const FeedbackContent: React.FC = () => {
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
  const [orderBy, setOrderBy] = useState<keyof Lesson>("feedback");

  const fetchFeedback = async () => {
    const courseInfo = sessionStorage.getItem("courseInfo");
    try {
      if (!courseInfo) {
        throw new Error("Course info not found");
      }
      const course = JSON.parse(courseInfo);
      const response = await postRequest("/allFeedbacks", {
        course_id: course.course_id,
      });
      setLessons(response.data);
      setIsDrawerOpen(false);
    } catch (error) {
      setSnackbarMessage("Error fetching feedbacks");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleDrawer = (open: boolean) => () => {
    setIsUpdateFlow(isUpdateFlow);
    setIsDrawerOpen(open);
  };

  const handleDeleteLesson = async (lessson: Lesson) => {
    console.log("Deleting course:", lessson);
    try {
      await postRequest("/deleteFeedbacks", {
        feedback_id: lessson.feedback_id,
      });
      setSnackbar({
        open: true,
        message: "Feedback deleted successfully",
        severity: "success",
      });
      await fetchFeedback();
      sessionStorage.removeItem("feedbackInfo");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting Feedback",
        severity: "error",
      });
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    sessionStorage.setItem("feedbackInfo", JSON.stringify(lesson));
    setIsUpdateFlow(true);
    setIsDrawerOpen(true);
  };

  const handleAddLessonClick = () => {
    sessionStorage.removeItem("feedbackInfo");
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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Lesson
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedLessons = lessons.length > 0 && lessons.sort((a, b) => {
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
              To add more feedback click on “Add feedback
            </Typography>
            <StyledAddButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleAddLessonClick}
            >
              + feedback
            </StyledAddButton>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", width: "100%" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <EllipsisTableCell>Sl. No</EllipsisTableCell>
                  <EllipsisTableCell>
                    <TableSortLabel
                      active={orderBy === "feedback"}
                      direction={orderBy === "feedback" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "feedback")}
                    >
                      Feedback
                    </TableSortLabel>
                  </EllipsisTableCell>
                  <EllipsisTableCell>Type</EllipsisTableCell>
                  <EllipsisTableCell>
                    <TableSortLabel
                      active={orderBy === "created_at"}
                      direction={orderBy === "created_at" ? order : "asc"}
                      onClick={(event) =>
                        handleRequestSort(event, "created_at")
                      }
                    >
                      Created On
                    </TableSortLabel>
                  </EllipsisTableCell>
                  <EllipsisTableCell>Action</EllipsisTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(sortedLessons) && sortedLessons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lesson, index) => (
                    <TableRow key={lesson.feedback_id}>
                      <EllipsisTableCell>
                        {page * rowsPerPage + index + 1}
                      </EllipsisTableCell>
                      <EllipsisTableCell>{lesson.feedback}</EllipsisTableCell>
                      <EllipsisTableCell>Q/A</EllipsisTableCell>
                      <EllipsisTableCell>{lesson.created_at}</EllipsisTableCell>
                      <EllipsisTableCell>
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
                      </EllipsisTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={lessons.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      ) : (
        <Box onClick={toggleDrawer(true)}>
          <EmptyState componentProps={{ title: "feedback", path: "" }} />
        </Box>
      )}
      <CreateNewContent
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        contentType={contentType}
        fetchFeedback={fetchFeedback}
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

export default FeedbackContent;
