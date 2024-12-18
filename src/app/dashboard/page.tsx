"use client";

import React, { useEffect, useState } from "react";
import withAuth from "../components/WithAuth";
import { Box, Typography, styled } from "@mui/material";
import { Gauge, BarChart, AxisConfig, ChartsXAxisProps } from "@mui/x-charts";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "24px",
  margin: "24px 0 24px 24px",
});

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "182px",
  height: "110px",
  padding: "18px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "24px",
  flexShrink: 0,
  borderRadius: "16px",
  border: "2px solid #F2F3F5",
  background: "#FFF",
}));

const StyledTotalUsers = styled(Typography)(({ theme }) => ({
  color: "#64748B",
  fontFamily: "Montserrat",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "16px", // 100%
}));

const StyledTotalUsersValue = styled(Typography)(({ theme }) => ({
  color: "#2F4362",
  fontFamily: "Montserrat",
  fontSize: "38px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "30px",
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "stretch",
  borderRadius: "18px",
  border: "2px solid #F2F3F5",
  background: "#FFF",
  marginLeft: "24px",
}));

const StyledTrainingCompletionRate = styled(Typography)(({ theme }) => ({
  color: "#2F4362",
  fontFamily: "Montserrat",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "28px", // 155.556%
  padding : 10,
}));

const InnerText = styled(Typography)(({ theme }) => ({
  color: "#FF7500",
  textAlign: "center",
  fontFamily: "Montserrat",
  fontSize: "40px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "30px", // 75%
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

const Dashboard: React.FC = () => {
  const [data, setData] = useState({
    totalUsers: 536,
    totalCourses: 40,
    totalAssessments: 18,
    trainingCompletionRate: 80,
  });

  const regionData = [
    { name: "Mumbai", users: 50 },
    { name: "Noida", users: 70 },
    { name: "Bangalore", users: 90 },
    { name: "Hyderabad", users: 80 },
    { name: "Chennai", users: 75 },
    { name: "Pune", users: 80 },
  ];

  console.log("Rendering Dashboard with data:", data);

  return (
    <Box display="flex">
      <Box>
        <Container>
          <StyledContainer>
            <StyledTotalUsers>Total Users</StyledTotalUsers>
            <StyledTotalUsersValue>{data.totalUsers}</StyledTotalUsersValue>
          </StyledContainer>
          <StyledContainer>
            <StyledTotalUsers>Total Courses</StyledTotalUsers>
            <StyledTotalUsersValue>{data.totalCourses}</StyledTotalUsersValue>
          </StyledContainer>
          <StyledContainer>
            <StyledTotalUsers>Total Assessments</StyledTotalUsers>
            <StyledTotalUsersValue>
              {data.totalAssessments}
            </StyledTotalUsersValue>
          </StyledContainer>
        </Container>
        <Wrapper sx={{ maxWidth: 590 }}>
          <StyledTrainingCompletionRate variant="h6">Region Wise Users</StyledTrainingCompletionRate>
          <Box>
            <BarChart
              borderRadius={8}
              xAxis={[
                {
                  scaleType: 'band',
                  data: regionData.map((item) => item.name), 
                  barGapRatio: 0.1,
                  categoryGapRatio: 0.5,
                } as AxisConfig<'band', any, ChartsXAxisProps>,
              ]}
              series={[{ data: regionData.map((item) => item.users), color: '#0557A2',}]}
              width={590} // Makes it responsive to container width
              height={344}
            />
          </Box>
        </Wrapper>
      </Box>
      <Box sx={{ marginTop: "24px" }}>
        <Wrapper>
          <StyledTrainingCompletionRate>
            Training Completion Rate
          </StyledTrainingCompletionRate>
          <Box width={500} height={344} position="relative">
            <Gauge
              value={data.trainingCompletionRate}
              startAngle={360}
              endAngle={0}
              innerRadius="80%"
              outerRadius="100%"
              cornerRadius={20}
            />
            <InnerText>{data.trainingCompletionRate}%</InnerText>
          </Box>
        </Wrapper>
      </Box>
    </Box>
  );
};

export default withAuth(Dashboard);
