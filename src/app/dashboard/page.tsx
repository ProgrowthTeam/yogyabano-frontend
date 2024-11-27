"use client";

import React, { useEffect, useState } from "react";
import withAuth from "../components/WithAuth";
import { Box, Typography, styled } from "@mui/material";
import { Gauge, BarChart, AxisConfig, ChartsXAxisProps } from "@mui/x-charts";
import { postRequest } from "../utils/apiUtils";

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
  padding: 10,
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
  interface RegionData {
    name: string;
    users: number;
  }

  const [data, setData] = useState<{
    totalUsers: number;
    totalCourses: number;
    totalAssessments: number;
    trainingCompletionRate: number;
    regionData: RegionData[];
  }>({
    totalUsers: 0,
    totalCourses: 0,
    totalAssessments: 0,
    trainingCompletionRate: 0,
    regionData: [],
  });

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (!sessionUser) {
      throw new Error("User session not found");
    }
    const user = JSON.parse(sessionUser);
    const fetchData = async () => {
      try {
        const response = await postRequest("/dashboard", {
          company_id: user.user.user_metadata.companyId,
          "user_id": 98420925890
        });
        const {
          user_count,
          course_count,
          assessment_count,
          training_completion_rate,
          user_count_by_city,
        } = response.data;
        const regionData = user_count_by_city.monthly.map((item: { city: any; user_count: any; }) => ({
          name: item.city,
          users: item.user_count,
        }));
        setData({
          totalUsers: user_count,
          totalCourses: course_count,
          totalAssessments: assessment_count,
          trainingCompletionRate: training_completion_rate,
          regionData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

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
          <StyledTrainingCompletionRate variant="h6">
            Region Wise Users
          </StyledTrainingCompletionRate>
          <Box>
            <BarChart
              borderRadius={8}
              xAxis={[
                {
                  scaleType: "band",
                  data: data.regionData.map((item) => item.name),
                  barGapRatio: 0.1,
                  categoryGapRatio: 0.5,
                } as AxisConfig<"band", any, ChartsXAxisProps>,
              ]}
              series={[
                {
                  data: data.regionData.map((item) => item.users),
                  color: "#0557A2",
                },
              ]}
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
