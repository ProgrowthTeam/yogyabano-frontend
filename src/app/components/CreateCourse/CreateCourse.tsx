"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { postRequest } from "../../utils/apiUtils";
import withAuth from "../../components/WithAuth";
import {
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type FormValues = {
  title: string;
  industry: string;
  description: string;
  company_id: number;
};

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  padding: 4,
});

const StyledTextField = styled(TextField)({
  width: "100%",
  marginBottom: 16,
});

const StyledButton = styled(Button)({
  width: 160,
  color: "#ffffff",
  marginTop: "16px",
});

const HeadingTypography = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "8px",
  color: "#4F6D7A",
  fontSize: "18px",
});

const SectionTypography = styled(Typography)({
  marginBottom: 16,
  color: "#2F4362",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "24px",
  width: "100%",
  maxWidth: "600px",
  "&:first-of-type": {
    marginTop: "24px",
  },
});

const CreateCourse: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    const sessionUser = sessionStorage.getItem("user");
    try {
      if (!sessionUser) {
        throw new Error("User session not found");
      }
      const user = JSON.parse(sessionUser);
      const response = await postRequest("/courses", {
        ...data,
        company_id: user.user.user_metadata.companyId,
      });
      router.push("/create-course");
      console.log("Course created successfully:", response.data);
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <SectionTypography variant="h4" gutterBottom>
        Title of the course
      </SectionTypography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", maxWidth: 600 }}
      >
        <StyledTextField
          fullWidth
          placeholder="Enter course title"
          {...register("title", { required: true })}
          error={!!errors.title}
          helperText={errors.title ? "Title is required" : ""}
          disabled={loading}
        />

        <HeadingTypography variant="h5" gutterBottom>
          About course
        </HeadingTypography>
        <SectionTypography variant="body1" gutterBottom>
          Industry
        </SectionTypography>
        <StyledTextField
          fullWidth
          placeholder="Enter the type of industry"
          {...register("industry", { required: true })}
          error={!!errors.industry}
          helperText={errors.industry ? "Industry is required" : ""}
          disabled={loading}
        />

        <SectionTypography variant="h5" gutterBottom>
          Description
        </SectionTypography>
        <StyledTextField
          fullWidth
          multiline
          rows={4}
          placeholder="Describe your course here"
          {...register("description", { required: true })}
          error={!!errors.description}
          helperText={errors.description ? "Description is required" : ""}
          disabled={loading}
        />

        <StyledButton
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Course"}
        </StyledButton>
      </form>
    </StyledContainer>
  );
};

export default withAuth(CreateCourse);
