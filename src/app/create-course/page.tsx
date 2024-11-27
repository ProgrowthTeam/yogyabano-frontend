"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { postRequest } from "../utils/apiUtils";
import withAuth from "../components/WithAuth";
import {
  CircularProgress,
  Button,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyState from "../components/CreateCourse/EmptyState";

interface Course {
  course_id: number;
  title: string;
  industry: string;
  description: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  lesson_count: number;
  assessment_count: number;
  feedback_count: number;
}

const StyledContainer = styled(Container)`
  margin-top: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Heading = styled(Typography)`
  color: #2f4362;
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled(TextField)`
  width: 360px;
`;

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const EmptyStateButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  background: #ff7500;
  color: white;
`;

const CreateCourse: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Course>("title");

  const fetchCourses = async () => {
    const sessionUser = sessionStorage.getItem("user");
    try {
      if (!sessionUser) {
        throw new Error("User session not found");
      }
      const user = JSON.parse(sessionUser);
      const response = await postRequest("/allCourses", {
        company_id: user.user.user_metadata.companyId,
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRequestSort = (property: keyof Course) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredCourses = useMemo(() => {
    const comparator = (a: Course, b: Course) => {
      if (orderBy === "updated_at") {
        return order === "asc"
          ? new Date(a[orderBy]).getTime() - new Date(b[orderBy]).getTime()
          : new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
      }
      return order === "asc"
        ? a[orderBy] < b[orderBy]
          ? -1
          : 1
        : a[orderBy] > b[orderBy]
        ? -1
        : 1;
    };

    return Array.isArray(courses)
      ? courses
          .filter((course) => {
            const formattedDate = formatDate(course.updated_at);
            return (
              Object.values(course).some((value) =>
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ) ||
              formattedDate.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
          .sort(comparator)
      : [];
  }, [courses, searchQuery, order, orderBy]);

  const handleDeleteCourse = async (course: Course) => {
    console.log("Deleting course:", course);
    try {
      await postRequest("/deleteCourses", {
        course_id: course.course_id,
        company_id: course.company_id,
      });
      setSnackbar({
        open: true,
        message: "Course deleted successfully",
        severity: "success",
      });
      await fetchCourses();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting course",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
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

  return (
    <StyledContainer>
      <HeaderContainer>
        <Heading>List of Courses</Heading>
        <EmptyStateButton
          variant="contained"
          onClick={() => router.push("/create-course/new-course")}
        >
          + New Course
        </EmptyStateButton>
      </HeaderContainer>
      <SearchContainer>
        <SearchInput
          variant="outlined"
          placeholder="Search courses"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
      </SearchContainer>
      {loading ? (
        <CircularProgress />
      ) : filteredCourses.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl. No</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "title"}
                      direction={orderBy === "title" ? order : "asc"}
                      onClick={() => handleRequestSort("title")}
                    >
                      Program Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "lesson_count"}
                      direction={orderBy === "lesson_count" ? order : "asc"}
                      onClick={() => handleRequestSort("lesson_count")}
                    >
                      Videos
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "industry"}
                      direction={orderBy === "industry" ? order : "asc"}
                      onClick={() => handleRequestSort("industry")}
                    >
                      Platform
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
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
              <TableBody>
                {filteredCourses.length > 0 && filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course, index) => (
                    <TableRow key={course.course_id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.lesson_count}</TableCell>
                      <TableCell>{course.industry}</TableCell>
                      <TableCell>{formatDate(course.updated_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          sx={{ color: "#4F6D7A" }}
                          onClick={() => {
                            sessionStorage.setItem(
                              "courseInfo",
                              JSON.stringify(course)
                            );
                            router.push("/create-course/course-editor");
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#4F6D7A" }}
                          onClick={() => handleDeleteCourse(course)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCourses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <EmptyState
          componentProps={{
            title: "course",
            path: "/create-course/new-course",
          }}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default withAuth(CreateCourse);
