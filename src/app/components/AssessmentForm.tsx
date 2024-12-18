import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button as MuiButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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

interface AssessmentFormProps {
  toggleDrawer: (open: boolean) => () => void;
  fetchAssesment: () => void;
  isUpdateFlow: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ toggleDrawer, isUpdateFlow, fetchAssesment }) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Assessment form data:", data);
    // Handle form submission
    fetchAssesment();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title variant="h6" variantMapping={{ h6: "div" }}>
        Start Creating Assessment
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
      <StyledAddButton type="submit" variant="contained" color="primary">
        Generate Questions
      </StyledAddButton>
      {/* Add more fields as needed */}
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
          Add
        </StyledAddButton>
      </ButtonContainer>
    </form>
  );
};

export default AssessmentForm;
