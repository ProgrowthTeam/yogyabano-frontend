import { useState } from "react";
import Link from "next/link";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Container,
  Box,
  Modal,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import LoginPreview from "../../../public/assets/login_preview.svg";
import Logo from "../../../public/assets/logo.svg";

import ErrorMessage from "./ErrorMessage";

type FormProps = {
  component: string;
};

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: theme.typography.fontWeightMedium,
  marginBottom: 40,
}));

const StyledTypographyHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.rhino,
  fontSize: "34px",
  fontWeight: theme.typography.fontWeightBold,
  marginBottom: "10px",
}));

const StyledTypographySubHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.blueBayoux,
  fontSize: "16px",
  fontWeight: theme.typography.fontWeightRegular,
  paddingBottom: "40px",
  width1: "100%",
}));

const StyledContainer = styled(Container)(() => ({
  display: "flex",
  justifyContent: "center",
  minWidth: "100%",
}));

const StyledLogo = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  minWidth: "812px",
}));

const StyledLoginForm = styled(Box)<FormProps>(() => ({
  component: "form",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  minWidth: "456px",
  maxWidth: "624px",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledLoginLogo = styled(LoginPreview)(() => ({
  maxWidth: "790px",
  position: "relative",
  left: "-60px",
}));

const StyledYogabanoLogo = styled(Logo)(() => ({
  maxWidth: "310px",
  marginBottom: "12px",
}));

const StyledTagline = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.blueBayoux,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: "16px",
  maxWidth: "255px",
  marginBottom: "40px",
}));

const StyledTermsandConditions = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.blueBayoux,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 14,
  marginBottom: 10,
  justifyContent: "center",
  display: "flex",
  cursor: "pointer",
}));

const StyledSignUp = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.blueBayoux,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 14,
  marginBottom: 10,
  justifyContent: "center",
  display: "flex",
}));

const StyledLink = styled(Link)(() => ({
  textDecoration: "underline",
}));

const StyledDisclaimer = styled(Typography)(() => ({
  color: "#4F6D7A",
  fontSize: 16,
  fontWeight: 500,
  marginBottom: "35px",
}));

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [companyId, setCompanyId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const options = {
      apiKey: apiKey,
      companyId: companyId,
    };
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, options }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Sign up successful");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <StyledContainer style={{ padding: "60px 60px 0 60px" }}>
      <StyledLogo>
        <StyledYogabanoLogo />
        <StyledTagline>
          AI Assisted Skilling Platform for Frontline Workers
        </StyledTagline>
        <StyledLoginLogo />
      </StyledLogo>
      <StyledLoginForm component="form" onSubmit={handleSubmit}>
        <StyledTypographyHeading variant="h4">
          Welcome to Yogyabano
        </StyledTypographyHeading>
        <StyledTypographySubHeading variant="h6">
          Create your account
        </StyledTypographySubHeading>
        {error && <ErrorMessage message={error} />}
        <TextField
          label="Email"
          type="email"
          value={email}
          sx={{ maxWidth: 360 }}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          sx={{ maxWidth: 360 }}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="API Key"
          type="password"
          value={apiKey}
          sx={{ maxWidth: 360 }}
          onChange={(e) => setApiKey(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Company ID"
          type="name"
          value={companyId}
          sx={{ maxWidth: 360 }}
          onChange={(e) => setCompanyId(Number(e.target.value))}
          required
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2, position: "relative" }}>
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 280 }}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </StyledButton>
          <StyledTermsandConditions variant="h6" onClick={handleOpen}>
            Terms and Conditions
          </StyledTermsandConditions>
          <StyledSignUp>
            Have an account?&nbsp;
            <StyledLink href={"/"}>Click here to Login</StyledLink>
          </StyledSignUp>
        </Box>
      </StyledLoginForm>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              flexDirection: "column",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 820,
              borderRadius: 4,
              border: `1px solid rgba(175, 175, 175, 0.50)`,
              bgcolor: "background.paper",
              boxShadow: `4px 4px 20px 0px rgba(0, 0, 0, 0.08)`,
              p: 4,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <StyledYogabanoLogo />
            <Typography
              sx={{
                mt: 2,
                color: "#2F4362",
                textAlign: "center",
                fontFamily: "var(--font-montserrat)",
                fontSize: "34px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                marginBottom: "35px",
              }}
            >
              ProGrowth Services Terms of Service
            </Typography>
            <StyledDisclaimer>
              Welcome to ProGrowth Services, a B2B marketing agency specializing
              in lead generation and digital advertising for technology
              companies.
            </StyledDisclaimer>
            <StyledDisclaimer>
              Our services are intended for businesses only, and users must be
              at least 18 years old. To access certain features, you may need to
              create an account and maintain its confidentiality. You agree to
              use our services legally and refrain from unauthorized activities.
            </StyledDisclaimer>
            <StyledDisclaimer>
              All content is owned by ProGrowth Services and protected by
              intellectual property laws. We offer a 7-day money-back guarantee,
              but cancellations do not provide partial refunds after the billing
              cycle ends.
            </StyledDisclaimer>
            <StyledDisclaimer>
              Our services are provided &quot;as is,&quot; without warranties,
              and we are not liable for indirect damages. Users agree to
              indemnify us against claims arising from their use of our
              services. These terms are governed by Indian law, with disputes
              subject to Bangalore courts.
            </StyledDisclaimer>
            <StyledDisclaimer>
              For any questions, please contact us at &nbsp;
              <StyledLink href="">contact@progrowth.services.</StyledLink>
            </StyledDisclaimer>
            <StyledButton
              onClick={handleClose}
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: 280 }}
              disabled={loading}
            >
              Agree and Continue
            </StyledButton>
          </Box>
        </Fade>
      </Modal>
    </StyledContainer>
  );
}