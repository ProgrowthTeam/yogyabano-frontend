import React, { useState, useEffect } from "react";
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

interface Assessment {
  assessment_id: number;
  created_at: string;
  updated_at: string;
  title: string;
  objective: string;
  number_of_questions: number;
  mcq_id: number;
  lesson_id: number;
  lesson_title: string;
}

const contentType = {
  type: "assessment",
  title: "New Assessment",
};

const StyledAddButton = styled(Button)(({ theme }) => ({
  margin: "0 8px",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}));

const AssessmentContent: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
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
  const [orderBy, setOrderBy] = useState<keyof Assessment>(
    "number_of_questions"
  );

  const fetchAssessments = async () => {
    const courseInfo = sessionStorage.getItem("courseInfo");
    try {
      if (!courseInfo) {
        throw new Error("Course info not found");
      }
      const courseData = JSON.parse(courseInfo);
      const response = await postRequest("/allAssessments", {
        course_id: courseData.course_id,
      });
      setAssessments(response.data.data);
      setIsDrawerOpen(false);
    } catch (error) {
      setSnackbarMessage("Error fetching assessments");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleDrawer = (open: boolean) => () => {
    setIsUpdateFlow(isUpdateFlow);
    setIsDrawerOpen(open);
  };

  const handleDeleteAssessment = async (assessment: Assessment) => {
    sessionStorage.removeItem("assessmentInfo");
    console.log("Deleting assessment:", assessment);
    try {
      await postRequest("/deleteAssessments", {
        assessment_id: assessment.assessment_id,
      });
      setSnackbar({
        open: true,
        message: "Assessment deleted successfully",
        severity: "success",
      });
      await fetchAssessments();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting assessment",
        severity: "error",
      });
    }
  };

  const handleEditAssessment = (assessment: Assessment) => {
    sessionStorage.setItem("assessmentInfo", JSON.stringify(assessment));
    setIsUpdateFlow(true);
    setIsDrawerOpen(true);
  };

  const handleAddAssessmentClick = () => {
    sessionStorage.removeItem("assessmentInfo");
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
    property: keyof Assessment
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedAssessments = assessments && assessments.sort((a, b) => {
    if (
      orderBy === "number_of_questions" ||
      orderBy === "updated_at" ||
      orderBy === "created_at"
    ) {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    }
    return 0;
  });

  return (
    <Box sx={{ width: "100%", padding: "0 40px" }}>
      {loading ? (
        <CircularProgress />
      ) : assessments && assessments.length > 0 ? (
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
              To add more assessments click on “Add assessment”
            </Typography>
            <StyledAddButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleAddAssessmentClick}
            >
              + Assessment
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
                  <TableCell>Assessment Title</TableCell>
                  <TableCell>Objective</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "number_of_questions"}
                      direction={
                        orderBy === "number_of_questions" ? order : "asc"
                      }
                      onClick={(event) =>
                        handleRequestSort(event, "number_of_questions")
                      }
                    >
                      Number of Questions
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "created_at"}
                      direction={orderBy === "created_at" ? order : "asc"}
                      onClick={(event) =>
                        handleRequestSort(event, "created_at")
                      }
                    >
                      Created On
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "updated_at"}
                      direction={orderBy === "updated_at" ? order : "asc"}
                      onClick={(event) =>
                        handleRequestSort(event, "updated_at")
                      }
                    >
                      Last Updated
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Lesson Title</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAssessments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((assessment, index) => (
                    <TableRow key={assessment.assessment_id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {assessment.title}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {assessment.objective}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {assessment.number_of_questions}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {assessment.created_at}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {assessment.updated_at}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {assessment.lesson_title}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          sx={{ color: "#4F6D7A" }}
                          onClick={() => handleEditAssessment(assessment)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#4F6D7A" }}
                          onClick={() => handleDeleteAssessment(assessment)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={assessments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      ) : (
        <Box onClick={toggleDrawer(true)}>
          <EmptyState componentProps={{ title: "assessment", path: "" }} />
        </Box>
      )}
      <CreateNewContent
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        contentType={contentType}
        fetchAssesment={fetchAssessments}
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

export default AssessmentContent;
