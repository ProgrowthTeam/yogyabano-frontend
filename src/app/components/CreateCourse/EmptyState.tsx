import React from "react";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";
import EmptyCourseImage from "../../../../public/assets/emptycourse.svg";
import { useRouter } from "next/navigation";

const EmptyStateContainer = styled.div`
  max-width: 512px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const EmptyStateImage = styled(EmptyCourseImage)(() => ({
  marginBottom: "16px",
}));

const EmptyStateHeading = styled(Typography)`
  color: #4f6d7a;
  text-align: center;
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  margin-bottom: 8px;
`;

const EmptyStateDescription = styled(Typography)`
  color: #afafaf;
  text-align: center;
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  margin-bottom: 16px;
  max-width: 302px;
`;

const EmptyStateButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  background: #ff7500;
  color: white;
`;

interface EmptyStateProps {
  componentProps: {
    title: string;
    path: string;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ componentProps }) => {
  const router = useRouter();

  return (
    <EmptyStateContainer>
      <EmptyStateImage src="/public/assets/emptycourse.svg" alt="No courses" />
      <EmptyStateHeading>No {componentProps.title} added here</EmptyStateHeading>
      <EmptyStateDescription>
        To add or create a new {componentProps.title} click on the “+ New {componentProps.title}
      </EmptyStateDescription>
      <EmptyStateButton
        variant="contained"
        onClick={() => router.push(componentProps.path)}
      >
        + New {componentProps.title}
      </EmptyStateButton>
    </EmptyStateContainer>
  );
};

export default EmptyState;