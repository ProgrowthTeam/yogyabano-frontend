"use client";

import React, { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyCourseImage from "../../../public/assets/emptycourse.svg";

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

const EmptyStateContainer = styled.div`
  max-width: 512px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const EmptyStateImage = styled(EmptyCourseImage)(() => ({
  marginBottom: "16px",
}));

const EmptyStateHeading = styled(Typography)`
  color: #4f6d7a;
  text-align: center;
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  margin-bottom: 8px;
`;

const EmptyStateDescription = styled(Typography)`
  color: #afafaf;
  text-align: center;
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  margin-bottom: 16px;
  max-width: 302px;
`;

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

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const CreateCourse: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
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

    fetchCourses();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = useMemo(() => {
    return Array.isArray(courses)
      ? courses.filter((course) => {
          const formattedDate = formatDate(course.updated_at);
          return (
            Object.values(course).some((value) =>
              value.toString().toLowerCase().includes(searchQuery.toLowerCase())
            ) || formattedDate.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
      : [];
  }, [courses, searchQuery]);

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
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sl. No</TableCell>
                <TableCell>Program Title</TableCell>
                <TableCell>Videos</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course, index) => (
                <TableRow key={course.course_id}>
                  <TableCell>{index + 1}</TableCell>
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
                    <IconButton sx={{ color: "#4F6D7A" }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyStateContainer>
          <EmptyStateImage
            src="/public/assets/emptycourse.svg"
            alt="No courses"
          />
          <EmptyStateHeading>No course added here</EmptyStateHeading>
          <EmptyStateDescription>
            To add or create a new course click on the “+ New Course”
          </EmptyStateDescription>
          <EmptyStateButton
            variant="contained"
            onClick={() => router.push("/create-course/new-course")}
          >
            + New Course
          </EmptyStateButton>
        </EmptyStateContainer>
      )}
    </StyledContainer>
  );
};

export default withAuth(CreateCourse);
