"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRequest } from "../utils/apiUtils";
import withAuth from "../components/WithAuth";
import {
  CircularProgress,
  Button,
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import EmptyCourseImage from "../../../public/assets/emptycourse.svg";

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

const CreateCourse: React.FC = () => {
    const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getRequest("/api/courses");
        const data = response.data;
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
          placeholder="Search course by title"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <FormControl variant="outlined">
          <InputLabel>Filter By</InputLabel>
          <Select label="Filter By">
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="lastAdded">Last Added</MenuItem>
            <MenuItem value="courseName">Course Name</MenuItem>
          </Select>
        </FormControl>
      </SearchContainer>
      {loading ? (
        <CircularProgress />
      ) : courses.length > 0 ? (
        <TableContainer component={Paper}>
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
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.videos}</TableCell>
                  <TableCell>{course.platform}</TableCell>
                  <TableCell>{course.lastUpdated}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
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
