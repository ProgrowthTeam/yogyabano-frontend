//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Button as MuiButton,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
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

const CustomBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "12px",
  alignItems: "flex-start",
  gap: "8px",
  flexShrink: 0,
  borderRadius: "8px",
  border: "1px solid #CCC",
  marginTop: "24px",
});

interface AssessmentFormProps {
  toggleDrawer: (open: boolean) => () => void;
  fetchAssesment: () => void;
  isUpdateFlow: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  toggleDrawer,
  isUpdateFlow,
  fetchAssesment,
}) => {
  const assessmentInfo = isUpdateFlow
    ? JSON.parse(sessionStorage.getItem("assessmentInfo") || "{}")
    : {};
  const [lessons, setLessons] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      selectedLessonId: "",
      trainingProgramTitle: "",
      objectiveToAchieve: "",
      noOfQuizzes: "",
    },
  });

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

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (isUpdateFlow && assessmentInfo) {
      reset({
        selectedLessonId: assessmentInfo.lesson_id || "",
        trainingProgramTitle: assessmentInfo.title,
        objectiveToAchieve: assessmentInfo.objective,
        noOfQuizzes: assessmentInfo.number_of_questions,
      });
    }
  }, [isUpdateFlow]);

  const [questions, setQuestions] = useState<
    { question: string; options: string[] }[]
  >([]);
  const [mcqId, setMcqId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any, event: any) => {
    const submitterName = event.nativeEvent.submitter.name;
    setLoading(true);
    try {
      if (submitterName === "generateQuestions") {
        const response = await postRequest("/createMCQ", {
          lesson_id: data.selectedLessonId,
          title: data.trainingProgramTitle,
          objective: data.objectiveToAchieve,
          no_of_question: parseInt(data.noOfQuizzes, 10),
        });

        const generatedQuestions: { question: string; options: string[] }[] =
          JSON.parse(response.data.questions);
        setQuestions(generatedQuestions);
        setMcqId(response.data.MCQ_id);
        sessionStorage.setItem("mcqId", response.data.MCQ_id);
        setSnackbarMessage("Questions generated successfully");
        setSnackbarSeverity("success");
      } else if (submitterName === "addAssessment") {
        if (mcqId === null) {
          setSnackbarMessage("No MCQ ID available. Generate questions first.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        if (isUpdateFlow) {
          await putRequest("/assessments", {
            assessment_id: assessmentInfo.assessment_id,
            lesson_id: data.selectedLessonId,
            title: data.trainingProgramTitle,
            objective: data.objectiveToAchieve,
            number_of_questions: parseInt(data.noOfQuizzes, 10),
            mcq_id: parseInt(sessionStorage.getItem("mcqId") || "0"),
          });
          setSnackbarMessage("Assessment added successfully");
          setSnackbarSeverity("success");
          reset();
          fetchAssesment();
        } else {
          await postRequest("/assessments", {
            lesson_id: data.selectedLessonId,
            title: data.trainingProgramTitle,
            objective: data.objectiveToAchieve,
            number_of_questions: parseInt(data.noOfQuizzes, 10),
            mcq_id: parseInt(sessionStorage.getItem("mcqId") || "0"),
          });
          setSnackbarMessage("Assessment added successfully");
          setSnackbarSeverity("success");
          reset();
          fetchAssesment();
        }
      }
    } catch (error) {
      setSnackbarMessage("Error processing request");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        height: "100%",
        overflow: "scroll",
        margin: "40px 20px",
        minWidth: "500px",
        maxWidth: "500px",
      }}
    >
      <Title variant="h6" variantMapping={{ h6: "div" }}>
        {isUpdateFlow ? "Update Assessment" : "Start Creating Assessment"}
      </Title>
      <Subtitle>Title of Training Program</Subtitle>
      <Controller
        name="trainingProgramTitle"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <StyledTextField
            {...field}
            variant="outlined"
            fullWidth
            size="small"
          />
        )}
      />
      <Subtitle>Objective to Achieve</Subtitle>
      <Controller
        name="objectiveToAchieve"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <StyledTextField
            {...field}
            variant="outlined"
            fullWidth
            size="small"
          />
        )}
      />
      <Subtitle>No. of Quizzes</Subtitle>
      <Controller
        name="noOfQuizzes"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <StyledTextField
            {...field}
            variant="outlined"
            fullWidth
            size="small"
          />
        )}
      />
      <Subtitle>Choose lesson</Subtitle>
      <Controller
        name="selectedLessonId"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...field}
            fullWidth
            size="small"
            sx={{ marginBottom: "24px" }}
          >
            {lessons.map((lesson) => (
              <MenuItem key={lesson.lesson_id} value={lesson.lesson_id}>
                {lesson.title}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      <StyledAddButton
        type="submit"
        name="generateQuestions"
        variant="contained"
        color="primary"
        sx={{ marginBottom: "32px" }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Generate Questions"}
      </StyledAddButton>
      <CustomBox>
        {questions.map((question, index) => (
          <Box key={index}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Question {index + 1}
            </Typography>
            <Typography variant="body2">{question.question}</Typography>
            {question.options
              .split(",")
              .map(
                (option: string, optionIndex: React.Key | null | undefined) => (
                  <Typography key={optionIndex} variant="body2">
                    {option.trim()}
                  </Typography>
                )
              )}
          </Box>
        ))}
      </CustomBox>
      <ButtonContainer>
        <StyledBackButton
          type="button"
          variant="outlined"
          color="primary"
          onClick={toggleDrawer(false)}
        >
          Back
        </StyledBackButton>
        <StyledAddButton
          type="submit"
          name="addAssessment"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isUpdateFlow ? (
            "Update"
          ) : (
            "Add"
          )}
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

export default AssessmentForm;
