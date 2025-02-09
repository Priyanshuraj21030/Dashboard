"use client";

// Suppress Recharts defaultProps warnings
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0]?.includes?.("Warning: %s: Support for defaultProps") &&
    (args[1] === "XAxis" || args[1] === "YAxis")
  ) {
    return;
  }
  originalError.apply(console, args);
};

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, FileText, CheckCircle, Target } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const data = [
  { percentile: 0, count: 0 },
  { percentile: 10, count: 10 },
  { percentile: 20, count: 20 },
  { percentile: 30, count: 50 },
  { percentile: 40, count: 80 },
  { percentile: 50, count: 100 },
  { percentile: 60, count: 85 },
  { percentile: 70, count: 60 },
  { percentile: 80, count: 40 },
  { percentile: 90, count: 20 },
  { percentile: 100, count: 10 },
];

const syllabusData = [
  { topic: "HTML Tools, Forms, History", progress: 80, color: "bg-blue-500" },
  { topic: "Tags & References in HTML", progress: 60, color: "bg-orange-500" },
  { topic: "Tables & References in HTML", progress: 24, color: "bg-red-500" },
  { topic: "Tables & CSS Basics", progress: 96, color: "bg-green-500" },
];

// First, let's update the data array to be dynamic based on percentile
const generateComparisonData = (userPercentile: number) => {
  const data = [];
  const mean = userPercentile;
  const standardDeviation = 15;

  // Generate bell curve data points
  for (let x = 0; x <= 100; x += 5) {
    const exponent =
      -Math.pow(x - mean, 2) / (2 * Math.pow(standardDeviation, 2));
    const count = Math.round(100 * Math.exp(exponent));

    data.push({
      percentile: x,
      count: count,
    });
  }

  // Add user's point with higher count for visibility
  data.push({
    percentile: userPercentile,
    count: Math.max(...data.map((d) => d.count)) + 10,
    isUser: true,
  });

  return data.sort((a, b) => a.percentile - b.percentile);
};

// Update the comparison graph section
const getPerformanceText = (percentile: number) => {
  const avgPercentile = 72;
  if (percentile > avgPercentile) {
    return `You scored ${percentile}% percentile which is higher than the average percentile ${avgPercentile}% of all the engineers who took this assessment`;
  } else if (percentile < avgPercentile) {
    return `You scored ${percentile}% percentile which is lower than the average percentile ${avgPercentile}% of all the engineers who took this assessment`;
  } else {
    return `You scored ${percentile}% percentile which is equal to the average percentile of all the engineers who took this assessment`;
  }
};

// Update the question analysis text
const getQuestionAnalysisText = (score: number) => {
  const maxScore = 15;
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) {
    return `Great performance! You've mastered ${score} out of ${maxScore} questions. Your strong understanding of HTML is evident.`;
  } else if (percentage >= 60) {
    return `Good effort! With ${score} out of ${maxScore} correct, you're on the right track. Focus on the topics you missed to improve further.`;
  } else {
    return `You've completed ${score} out of ${maxScore} questions correctly. Review the topics and try again to strengthen your HTML knowledge.`;
  }
};

// Add this helper function at the top with other functions
const getScoreColor = (score: number) => {
  const percentage = (score / 15) * 100;
  if (percentage >= 80) return "#22c55e"; // Green
  if (percentage >= 60) return "#3b82f6"; // Blue
  return "#f43f5e"; // Red
};

export default function Home() {
  const [rank, setRank] = useState("1");
  const [percentile, setPercentile] = useState("30");
  const [score, setScore] = useState("10");
  const [open, setOpen] = useState(false);
  const [percentileError, setPercentileError] = useState("");
  const [rankError, setRankError] = useState("");
  const [scoreError, setScoreError] = useState("");

  const handleUpdate = () => {
    const percentileValue = parseInt(percentile);
    const rankValue = parseInt(rank);
    const scoreValue = parseInt(score);

    let hasError = false;

    if (isNaN(rankValue) || rankValue <= 0) {
      setRankError("Rank must be a positive number!");
      hasError = true;
    }

    if (isNaN(percentileValue) || percentileValue < 0 || percentileValue > 99) {
      setPercentileError("Please enter a value between 0-99");
      hasError = true;
    }

    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 15) {
      setScoreError("Please enter a value between 0-15");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Here you would typically update the backend
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header - Make it stack on mobile */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
              alt="HTML5"
              className="h-10 w-10 md:h-12 md:w-12"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Hyper Text Markup Language
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Questions: 08 | Duration: 15 mins | Submitted on 5 June 2021
              </p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Update</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update scores</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rank">Update your Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={rank}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setRank("");
                        setRankError("Rank is required!");
                      } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue) && numValue > 0) {
                          setRank(value);
                          setRankError("");
                        } else {
                          setRank(value);
                          setRankError("Rank must be a positive number!");
                        }
                      }
                    }}
                    min="1"
                    placeholder="Enter rank (must be greater than 0)"
                    className={rankError ? "border-red-500" : ""}
                    required
                  />
                  {rankError && (
                    <p className="text-sm text-red-500">{rankError}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="percentile">Update your Percentile</Label>
                  <Input
                    id="percentile"
                    type="number"
                    value={percentile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setPercentile("");
                        setPercentileError("Percentile is required!");
                      } else {
                        const numValue = parseInt(value);
                        if (
                          !isNaN(numValue) &&
                          numValue >= 0 &&
                          numValue <= 99
                        ) {
                          setPercentile(value);
                          setPercentileError("");
                        } else {
                          setPercentile(value);
                          setPercentileError(
                            "Please enter a value between 0-99"
                          );
                        }
                      }
                    }}
                    min="0"
                    max="99"
                    placeholder="Enter percentile (0-99)"
                    className={percentileError ? "border-red-500" : ""}
                    required
                  />
                  {percentileError && (
                    <p className="text-sm text-red-500">{percentileError}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="score">
                    Update your Current Score (out of 15)
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    value={score}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setScore("");
                        setScoreError("Score is required!");
                      } else {
                        const numValue = parseInt(value);
                        if (
                          !isNaN(numValue) &&
                          numValue >= 0 &&
                          numValue <= 15
                        ) {
                          setScore(value);
                          setScoreError("");
                        } else {
                          setScore(value);
                          setScoreError("Please enter a value between 0-15");
                        }
                      }
                    }}
                    min="0"
                    max="15"
                    placeholder="Enter score (0-15)"
                    className={scoreError ? "border-red-500" : ""}
                    required
                  />
                  {scoreError && (
                    <p className="text-sm text-red-500">{scoreError}</p>
                  )}
                </div>
                <Button onClick={handleUpdate}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main content grid - Single column on mobile, two columns on larger screens */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {/* Quick Statistics - Adjust for smaller screens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{rank}</p>
                    <p className="text-sm text-gray-600">YOUR RANK</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{percentile}%</p>
                    <p className="text-sm text-gray-600">PERCENTILE</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{score}/15</p>
                    <p className="text-sm text-gray-600">CORRECT ANSWERS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main sections grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Comparison Graph */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">
                    Comparison Graph
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <p className="mb-4 text-sm md:text-base text-gray-600">
                    {getPerformanceText(parseInt(percentile))}
                  </p>
                  <div className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={generateComparisonData(parseInt(percentile))}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="percentile"
                          type="number"
                          domain={[0, 100]}
                          tickCount={6}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          type="number"
                          domain={[0, "dataMax + 10"]}
                          tickCount={6}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value, name, props) => {
                            if (props.payload.isUser) {
                              return [`${value} (Your Score)`, "Count"];
                            }
                            return [value, "Count"];
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={(props) => {
                            if (props.payload.isUser) {
                              return (
                                <circle
                                  key={`dot-${props.payload.percentile}-user`}
                                  cx={props.cx}
                                  cy={props.cy}
                                  r={6}
                                  fill="#ff0000"
                                  stroke="none"
                                />
                              );
                            }
                            return (
                              <circle
                                key={`dot-${props.payload.percentile}`}
                                cx={props.cx}
                                cy={props.cy}
                                r={3}
                                fill="#8884d8"
                                stroke="none"
                              />
                            );
                          }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Syllabus Analysis */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">
                    Syllabus Wise Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {syllabusData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-sm font-medium">
                            {item.topic}
                          </span>
                          <span className="text-sm font-medium">
                            {item.progress}%
                          </span>
                        </div>
                        <Progress
                          value={item.progress}
                          className={item.color}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Question Analysis */}
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span>Question Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                    <div className="relative w-32 h-32 sm:w-44 sm:h-44">
                      <CircularProgressbar
                        value={(parseInt(score) / 15) * 100}
                        text={`${score}/15`}
                        styles={buildStyles({
                          rotation: 0,
                          strokeLinecap: "round",
                          textSize: "20px",
                          pathTransitionDuration: 0.5,
                          pathColor: getScoreColor(parseInt(score)),
                          textColor: "#1f2937",
                          trailColor: "#e5e7eb",
                        })}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm md:text-base text-gray-600">
                        {getQuestionAnalysisText(parseInt(score))}
                      </p>
                      <div className="flex justify-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-green-400" />
                          Correct
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-gray-200" />
                          Remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
