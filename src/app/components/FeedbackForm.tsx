import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Button as MuiButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { postRequest, putRequest } from "../utils/apiUtils";

const Title = styled(Typography)({
  color: "#4F6D7A",
  fontFamily: "Montserrat",
  fontSize: "20px",
  fontWeight: 600,
  marginBottom: "24px",
});

const Subtitle = styled(Typography)({
  color: "#2F4362",
  fontFamily: "Montserrat",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "12px",
});

const StyledTextField = styled(TextField)({
  width: "100%",
  marginBottom: "24px",
});

const ButtonContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: "24px 48px 24px 0",
  backgroundColor: "#fff",
});

const StyledBackButton = styled(MuiButton)(({ theme }) => ({
  margin: "0 8px",
}));

const StyledAddButton = styled(MuiButton)(({ theme }) => ({
  margin: "0 8px",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}));

interface FeedbackFormProps {
  toggleDrawer: (open: boolean) => () => void;
  fetchFeedback: () => void;
  isUpdateFlow: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  toggleDrawer,
  isUpdateFlow,
  fetchFeedback,
}) => {
  const feedbackInfo = isUpdateFlow
    ? JSON.parse(sessionStorage.getItem("feedbackInfo") || "{}")
    : {};

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      feedbackQuestion: feedbackInfo.feedback || "",
    },
  });

  useEffect(() => {
    if (isUpdateFlow && feedbackInfo) {
      reset({
        feedbackQuestion: feedbackInfo.feedback,
      });
    }
  }, [isUpdateFlow]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const onSubmit = async (data: any) => {
    if (isUpdateFlow) {
      try {
        const response = await putRequest("/feedbacks", {
          feedback_id: feedbackInfo.feedback_id,
          feedback_question: data.feedbackQuestion,
        });

        if ((response && response.status === 200) || response.status === 201) {
          setSnackbarMessage("Feedback updated successfully");
          setSnackbarSeverity("success");
          fetchFeedback();
        } else {
          setSnackbarMessage("Failed to update feedback");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Error updating feedback:", error);
        setSnackbarMessage("Error updating feedback");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    } else {
      try {
        const response = await postRequest("/feedbacks", {
          course_id: sessionStorage.getItem("courseInfo")
            ? JSON.parse(sessionStorage.getItem("courseInfo")!).course_id
            : null,
          feedback_question: data.feedbackQuestion,
        });

        if ((response && response.status === 200) || response.status === 201) {
          setSnackbarMessage("Feedback submitted successfully");
          setSnackbarSeverity("success");
          fetchFeedback();
        } else {
          setSnackbarMessage("Failed to submit feedback");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setSnackbarMessage("Error submitting feedback");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ height: "100%", overflow: "scroll", margin: "40px 20px", minWidth: "400px", maxWidth: "400px" }}
    >
      <Title variant="h6" variantMapping={{ h6: "div" }}>
        {isUpdateFlow ? "Update Feedback" : "Start Creating Feedback"}
      </Title>
      <Subtitle>Feedback Question</Subtitle>
      <Controller
        name="feedbackQuestion"
        control={control}
        render={({ field }) => (
          <StyledTextField
            {...field}
            variant="outlined"
            fullWidth
            size="small"
          />
        )}
      />
      <ButtonContainer>
        <StyledBackButton
          type="button"
          variant="outlined"
          color="primary"
          onClick={toggleDrawer(false)}
        >
          Back
        </StyledBackButton>
        <StyledAddButton type="submit" variant="contained" color="primary">
          {isUpdateFlow ? "Update" : "Add"}
        </StyledAddButton>
      </ButtonContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackForm;
