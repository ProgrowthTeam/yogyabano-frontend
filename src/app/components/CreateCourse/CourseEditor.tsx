"use client";

import React, { useState, useEffect } from "react";
import withAuth from "../../components/WithAuth";
import { postRequest } from "../../utils/apiUtils";
import { styled } from "@mui/material/styles";
import { Box, IconButton, TextField, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import SampleSvg from "../../../../public/assets/course_editor.svg";
import LessonsIcon from "@mui/icons-material/Book";
import AssessmentIcon from "@mui/icons-material/Assignment";
import FeedbackIcon from "@mui/icons-material/Feedback";
import BorderColor from "@mui/icons-material/BorderColor";
import SaveIcon from "@mui/icons-material/Save";
import LessonsContent from "./LessonsContent";
import AssessmentContent from "./AssessmentContent";
import FeedbackContent from "./FeedbackContent";

interface Course {
  id: string;
  title: string;
  description: string;
  industry: string;
  lesson_count: number;
  assessment_count: number;
  feedback_count: number;
}

const StyledBox = styled(Box)({
  display: "inline-flex",
  padding: "30px 130px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  background: "#EAECEF",
  width: "100%",
});

const StyledNav = styled(Box)({
  height: "40px",
  background: "#EAECEF",
  width: "100%",
  display: "flex",
  alignItems: "center",
  paddingLeft: "130px",
});

const Container = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const ImageBox = styled(SampleSvg)({
  marginRight: "22px",
});

const ContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  maxWidth: "600px",
});

const Title = styled(Box)({
  color: "#2F4362",
  fontFamily: "Montserrat",
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  marginBottom: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Industry = styled(Box)({
  color: "#4F6D7A",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  marginBottom: "32px",
});

const Stats = styled(Box)({
  color: "#FF7500",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  marginBottom: "8px",
});

const Description = styled(Box)({
  color: "#4F6D7A",
  fontFamily: "Montserrat",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
});

const Tab = styled(Box)<{ active: boolean }>(({ active }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "0 10px",
  color: active ? "#FF7500" : "#4F6D7A",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontWeight: 500,
  borderBottom: active ? "1px solid #FF7500" : "none",
  background: active ? "#FFEAD9" : "transparent",
  marginRight: "20px",
}));

const CourseEditor: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("lessons");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();

  useEffect(() => {
    const courseData = sessionStorage.getItem("courseInfo");
    if (courseData) {
      const parsedCourse = JSON.parse(courseData);
      setCourse(parsedCourse);
      setTitle(parsedCourse.title);
      setIndustry(parsedCourse.industry);
      setDescription(parsedCourse.description);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleIndustryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndustry(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    const courseInfo = sessionStorage.getItem("courseInfo");
    try {
      if (!courseInfo) {
        throw new Error("User session not found");
      }
      const course = JSON.parse(courseInfo);
      const response = await postRequest("/updateCourses", {
        title: title,
        industry: industry,
        description: description,
        course_id: course?.course_id,
        // company_id: user.user.user_metadata.companyId,
      });
      setIsEditing(false);
      setSnackbarMessage("Course updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push("/create-course");
      }, 2000);
    } catch (error) {
      setSnackbarMessage("Error updating course");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <StyledBox>
        <Container>
          <ImageBox />
          <ContentBox>
            {course && (
              <>
                <Title>
                  {isEditing ? (
                    <TextField
                      value={title}
                      onChange={handleTitleChange}
                      autoFocus
                      variant="standard"
                      sx={{ width: "500px" }}
                    />
                  ) : (
                    <>
                      {course.title}
                      <IconButton onClick={handleEdit}>
                        <BorderColor />
                      </IconButton>
                    </>
                  )}
                </Title>
                <Industry>
                  {isEditing ? (
                    <TextField
                      value={industry}
                      onChange={handleIndustryChange}
                      autoFocus
                      variant="standard"
                      sx={{ width: "500px" }}
                    />
                  ) : (
                    <>{course.industry}</>
                  )}
                </Industry>
                <Stats>
                  Lessons {course.lesson_count}, Assessment{" "}
                  {course.assessment_count}, Feedback {course.feedback_count}
                </Stats>
                <Description>
                  {isEditing ? (
                    <TextField
                      value={description}
                      onChange={handleDescriptionChange}
                      autoFocus
                      variant="standard"
                      sx={{ width: "500px" }}
                    />
                  ) : (
                    <>{course.description}</>
                  )}
                </Description>
                {isEditing && (
                  <IconButton onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                )}
              </>
            )}
          </ContentBox>
        </Container>
      </StyledBox>
      <StyledNav>
        <Tab
          active={activeTab === "lessons"}
          onClick={() => setActiveTab("lessons")}
        >
          <LessonsIcon style={{ marginRight: "5px" }} />
          Lessons
        </Tab>
        <Tab
          active={activeTab === "assessment"}
          onClick={() => setActiveTab("assessment")}
        >
          <AssessmentIcon style={{ marginRight: "5px" }} />
          Assessment
        </Tab>
        <Tab
          active={activeTab === "feedback"}
          onClick={() => setActiveTab("feedback")}
        >
          <FeedbackIcon style={{ marginRight: "5px" }} />
          Feedback
        </Tab>
      </StyledNav>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // padding: "150px",
          width: "100%",
        }}
      >
        {activeTab === "lessons" && <LessonsContent />}
        {activeTab === "assessment" && <AssessmentContent />}
        {activeTab === "feedback" && <FeedbackContent />}
      </Box>
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
    </>
  );
};

export default withAuth(CourseEditor);
