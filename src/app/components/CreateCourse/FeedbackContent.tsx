import React, { useState, useEffect } from "react";
import { postRequest } from "../../utils/apiUtils";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import EmptyState from "./EmptyState";
import CreateNewContent from "../CreateNewContent";

interface Lesson {
  id: string;
  title: string;
  description: string;
}

const contentType = {
  type: "feedback",
  title: "New Feedback",
};

const FeedbackContent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
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
        setLessons(response.data);
      } catch (error) {
        setSnackbarMessage("Error fetching lessons");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : lessons.length > 0 ? (
        <div>
          {/* Render lessons here */}
          {lessons.map((lesson) => (
            <div key={lesson.id}>{lesson.title}</div>
          ))}
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
