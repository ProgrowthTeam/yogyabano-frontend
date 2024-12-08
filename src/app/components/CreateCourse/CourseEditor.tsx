"use client";

import React, { useState, useEffect } from "react";
import withAuth from "../../components/WithAuth";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import SampleSvg from "../../../../public/assets/course_editor.svg"; // Adjust the path to your SVG file
import LessonsIcon from "@mui/icons-material/Book"; // Example icon, adjust as needed
import AssessmentIcon from "@mui/icons-material/Assignment"; // Example icon, adjust as needed
import FeedbackIcon from "@mui/icons-material/Feedback"; // Example icon, adjust as needed

interface Course {
  id: string;
  title: string;
  description: string;
  industry: string;
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
  marginRight: "20px"
}));

const CourseEditor: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<string>("lessons");

  useEffect(() => {
    const courseData = sessionStorage.getItem("courseInfo");
    if (courseData) {
      setCourse(JSON.parse(courseData));
    }
  }, []);

  return (
    <>
      <StyledBox>
        <Container>
          <ImageBox />
          <ContentBox>
            {course && (
              <>
                <Title>
                  {course.title ? "Introduction to V-Mart Ethics" : ""}
                </Title>
                <Industry>{course.industry ? "Retail Store" : ""}</Industry>
                <Stats>Lessons 0, Assessment 0, Feedback 0</Stats>
                <Description>
                  {course.description
                    ? "This course focuses on the Ethics of V-Mart, exploring the principles that guide the company's operations and decision-making processes. It provides an introduction to V-Mart's ethical policies, emphasizing their commitment to integrity, respect for individuals, and social responsibility."
                    : ""}
                </Description>
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
      <Box>
        {activeTab === "lessons" && <div>Lessons content goes here</div>}
        {activeTab === "assessment" && <div>Assessment content goes here</div>}
        {activeTab === "feedback" && <div>Feedback content goes here</div>}
      </Box>
    </>
  );
};

export default withAuth(CourseEditor);
