import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Input,
  Box,
  Button as MuiButton,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AWS from "aws-sdk";
import { postRequest } from "../utils/apiUtils";

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

const Description = styled(Typography)({
  color: "#999",
  fontFamily: "Montserrat",
  fontSize: "12px",
  fontWeight: 500,
  marginBottom: "28px",
});

const StyledTextField = styled(TextField)({
  width: "100%",
  marginBottom: "24px",
});

const StyledDropdown = styled(TextField)({
  width: "452px",
  height: "39px",
  marginBottom: "80px",
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

interface LessonFormProps {
  toggleDrawer: (open: boolean) => () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ toggleDrawer }) => {
  const { control, handleSubmit, setError } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const onSubmit = async (data: any) => {
    if (file && file.size > 25 * 1024 * 1024) {
      setError("file", {
        type: "manual",
        message: "File size should be less than 25MB",
      });
      return;
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });

    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
    if (!bucketName) {
      console.error("S3 bucket name is not defined");
      return;
    }

    if (!file) {
      console.error("File is not selected");
      return;
    }

    const params = {
      Bucket: bucketName,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      const fileName = uploadResult.Key;

      const response = await postRequest("/lessons", {
        course_id: 16,
        title: data.lessonTitle,
        role: data.role,
        topic: data.topic,
        industry: data.industry,
        convert_type: data.convertInto,
        file_name: fileName,
      });

      if (response) {
        setSnackbarMessage("Submit API call successful");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Submit API call failed");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbarMessage("Error uploading file");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title variant="h6" variantMapping={{ h6: "div" }}>
        Start Creating Lesson
      </Title>
      <Subtitle>Lesson Title</Subtitle>
      <Controller
        name="lessonTitle"
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
      <Subtitle>Role</Subtitle>
      <Controller
        name="role"
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
      <Subtitle>Topic</Subtitle>
      <Controller
        name="topic"
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
      <Subtitle>Industry</Subtitle>
      <Controller
        name="industry"
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
      <Subtitle>Convert Into (Text and Voice)</Subtitle>
      <Controller
        name="convertInto"
        control={control}
        defaultValue="text"
        render={({ field }) => (
          <StyledDropdown
            {...field}
            select
            variant="outlined"
            fullWidth
            size="small"
          >
            <MenuItem value="voice">Voice</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </StyledDropdown>
        )}
      />
      <Subtitle>Do you have any existing material?</Subtitle>
      <Description>Upload the PDF document here for better results</Description>
      <Input
        type="file"
        inputProps={{ accept: ".pdf" }}
        fullWidth
        onChange={(e) => {
          const input = e.target as HTMLInputElement;
          if (input.files && input.files.length > 0) {
            setFile(input.files[0]);
          } else {
            setFile(null);
          }
        }}
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
          Add
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
    </form>
  );
};

export default LessonForm;
