import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorBox = styled(Box)({
  color: "#E2483D",
  fontFamily: "Montserrat",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal",
  display: "flex",
  width: "360px",
  padding: "10px 32px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  border: "1px solid #E2483D",
  background: "#FCEDEC",
});

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <ErrorBox>
      <ErrorOutlineIcon />
      <Typography>{message}</Typography>
    </ErrorBox>
  );
};

export default ErrorMessage;
