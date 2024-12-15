import React from "react";
import { Drawer, Box } from "@mui/material";
import LessonForm from "./LessonForm";
import AssessmentForm from "./AssessmentForm";
import FeedbackForm from "./FeedbackForm";

interface CreateNewContentProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => () => void;
  contentType: { title: string; type: string };
  fetchLessons: () => void;
}

const CreateNewContent: React.FC<CreateNewContentProps> = ({
  isDrawerOpen,
  toggleDrawer,
  contentType,
  fetchLessons,
}) => {
  const renderForm = () => {
    switch (contentType.type) {
      case "lesson":
        return <LessonForm toggleDrawer={toggleDrawer} fetchLessons={fetchLessons} />;
      case "assessment":
        return <AssessmentForm toggleDrawer={toggleDrawer} />;
      case "feedback":
        return <FeedbackForm toggleDrawer={toggleDrawer} />;
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 500,
          padding: "40px 24px",
          position: "relative",
          height: "100%",
          overflowY: "auto",
        }}
        role="presentation"
      >
        {renderForm()}
      </Box>
    </Drawer>
  );
};

export default CreateNewContent;
