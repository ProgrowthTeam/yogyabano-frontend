import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AWS from "aws-sdk";
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
  fetchLessons: () => void;
  isUpdateFlow: boolean;
}

const LessonForm: React.FC<LessonFormProps> = ({
  toggleDrawer,
  fetchLessons,
  isUpdateFlow,
}) => {
  const lessonInfo = isUpdateFlow
    ? JSON.parse(sessionStorage.getItem("lessonInfo") || "{}")
    : {};

  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      lessonTitle: lessonInfo.title || "",
      role: lessonInfo.role || "",
      topic: lessonInfo.topic || "",
      industry: lessonInfo.industry || "",
      convertInto: lessonInfo.convertInto || "text",
      file: null,
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isUpdateFlow && lessonInfo) {
      reset({
        lessonTitle: lessonInfo.title,
        role: lessonInfo.role,
        topic: lessonInfo.topic,
        industry: lessonInfo.industry,
        convertInto: lessonInfo.convertInto,
      });
    }
  }, [isUpdateFlow]);

  const [file, setFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (isUpdateFlow) {
      try {
        const response = await putRequest("/lessons", {
          lesson_id: sessionStorage.getItem("lessonInfo")
            ? JSON.parse(sessionStorage.getItem("lessonInfo")!).lesson_id
            : null,
          title: data.lessonTitle,
          role: data.role,
          topic: data.topic,
          industry: data.industry,
          convert_type: data.convertInto,
        });

        if (response?.data?.message) {
          setSnackbarMessage(
            response.data.message || "Submit API call successful"
          );
          setSnackbarSeverity("success");
          fetchLessons();
          reset();
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setSnackbarMessage("Submit API call failed");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setSnackbarMessage("Error uploading file");
        setSnackbarSeverity("error");
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    } else {
      if (file && file.size > 25 * 1024 * 1024) {
        setError("file", {
          type: "manual",
          message: "File size should be less than 25MB",
        });
        return;
      }

      setLoading(true);

      const s3 = new AWS.S3({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      });

      const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
      if (!bucketName) {
        console.error("S3 bucket name is not defined");
        setLoading(false);
        return;
      }

      if (!file) {
        console.error("File is not selected");
        setLoading(false);
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
          course_id: sessionStorage.getItem("courseInfo")
            ? JSON.parse(sessionStorage.getItem("courseInfo")!).course_id
            : null,
          title: data.lessonTitle,
          role: data.role,
          topic: data.topic,
          industry: data.industry,
          convert_type: data.convertInto,
          file_name: fileName,
        });

        if (response && response.data.lesson_id) {
          setSnackbarMessage(
            response.data.message || "Submit API call successful"
          );
          setSnackbarSeverity("success");
          fetchLessons();
          reset();
        } else {
          setSnackbarMessage("Submit API call failed");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setSnackbarMessage("Error uploading file");
        setSnackbarSeverity("error");
      } finally {
        setLoading(false);
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
      sx={{ height: "100%", overflow: "scroll", margin: "40px 20px" }}
    >
      <Title variant="h6" variantMapping={{ h6: "div" }}>
        {isUpdateFlow ? "Update Lesson" : "Start Creating Lesson"}
      </Title>
      <Subtitle>Lesson Title</Subtitle>
      <Controller
        name="lessonTitle"
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
      <Subtitle>Role</Subtitle>
      <Controller
        name="role"
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
      <Subtitle>Topic</Subtitle>
      <Controller
        name="topic"
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
      <Subtitle>Industry</Subtitle>
      <Controller
        name="industry"
        control={control}
        render={({ field }) => (
          <StyledTextField
            {...field}
            defaultValue={lessonInfo.industry || ""}
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
      {!isUpdateFlow && (
        <Box sx={{ height: "22%", overflowY: "auto" }}>
          <Subtitle>Do you have any existing material?</Subtitle>
          <Description>
            Upload the PDF document here for better results
          </Description>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                inputProps={{ accept: ".pdf" }}
                fullWidth
                inputRef={fileInputRef}
                onChange={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.files && input.files.length > 0) {
                    setFile(input.files[0]);
                    field.onChange(input.files[0]);
                  } else {
                    setFile(null);
                    field.onChange(null);
                  }
                }}
              />
            )}
          />
        </Box>
      )}
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

export default LessonForm;
