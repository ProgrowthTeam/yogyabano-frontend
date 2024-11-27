import React from "react";
import { Drawer } from "@mui/material";
import LessonForm from "./LessonForm";
import AssessmentForm from "./AssessmentForm";
import FeedbackForm from "./FeedbackForm";

interface CreateNewContentProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => () => void;
  contentType: { title: string; type: string };
  fetchLessons?: () => void;
  fetchAssesment?: () => void;
  fetchFeedback?: () => void;
  isUpdateFlow?: boolean;
}

const CreateNewContent: React.FC<CreateNewContentProps> = ({
  isDrawerOpen,
  toggleDrawer,
  contentType,
  fetchLessons,
  fetchAssesment,
  fetchFeedback,
  isUpdateFlow,
}) => {
  const renderForm = () => {
    switch (contentType.type) {
      case "lesson":
        return (
          <LessonForm
            toggleDrawer={toggleDrawer}
            fetchLessons={fetchLessons ?? (() => {})}
            isUpdateFlow={isUpdateFlow ?? false}
          />
        );
      case "assessment":
        return (
          <AssessmentForm
            toggleDrawer={toggleDrawer}
            fetchAssesment={fetchAssesment ?? (() => {})}
            // fetchLessons={fetchLessons ?? (() => {})}
            isUpdateFlow={isUpdateFlow ?? false}
          />
        );
      case "feedback":
        return (
          <FeedbackForm
            toggleDrawer={toggleDrawer}
            fetchFeedback={fetchFeedback ?? (() => {})}
            isUpdateFlow={isUpdateFlow ?? false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      variant="persistent"
    >
      {renderForm()}
    </Drawer>
  );
};

export default CreateNewContent;
