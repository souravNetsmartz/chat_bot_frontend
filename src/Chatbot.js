import React, { useState } from "react";
import {
  TextField,
  Typography,
  Grid,
  Paper,
  Box,
  CardContent,
  Card,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { ThreeDots } from "react-loader-spinner";
import HeaderLogo from "./assets/NetsmartzLogo.jpg";
import BotGIF from "./assets/bot.gif";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SpeechRecognitionDialog from "./SpeechRecognitionDialogue";
// const dummyConversation = [
//   { user: "Hello", bot: "Hi there! How can I help you?" },
//   {
//     user: "Can you provide information on your services?",
//     bot: "Sure, we offer a range of services including...",
//   },
// ];
const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [myTranscript, setTranscript] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const handleQuery = async () => {
    try {
      setLoading(true);
      const apiUrl = "http://127.0.0.1:8000/db_chat";
      const requestBody = { query };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const updatedConversation = [
        ...conversation,
        {
          user: query,
          bot: <ThreeDots height={20} width={40} color="#F58220" />,
        },
      ];
      setConversation(updatedConversation);

      const res = await fetch(apiUrl, requestOptions);
      const data = await res.json();

      const responseMessage = data.answer || "No response received.";
      const updatedConversationWithResponse = [
        ...updatedConversation.slice(0, -1),
        { user: query, bot: responseMessage },
      ];

      setConversation(updatedConversationWithResponse);
      setLoading(false);
      setQuery("");
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorConversation = [
        ...conversation,
        { user: query, bot: "Error fetching data. Please try again." },
      ];
      setConversation(errorConversation);
      setLoading(false);
    }
  };

  const handleMicButton = () => {
    if (!isMicrophoneAvailable) {
      alert("Microphone is not available.");
      return;
    }
    if (!browserSupportsSpeechRecognition) {
      alert("Feature not supported in this browser.");
      return;
    }
    handleStartListening();
  };
  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsDialogOpen(true);
    setIsListening(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    setIsDialogOpen(false);
    setQuery(transcript);
    resetTranscript();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <Box height={"100vh"} display="flex" flexDirection="column">
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        {/* Your Header Logo */}
        <Box component="img" src={HeaderLogo} width={145} pl={3} />
        <Typography
          sx={{
            flexGrow: 1,
            mr: 20,
          }}
          variant="h5"
          color={"white"}
          textAlign="center"
        >
          ChatBOT
        </Typography>
      </Box>

      {/* Chat Container */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#f7f7f7", pt: 4, flex: 1 }}
      >
        <Grid item xs={12} sm={8} md={6} lg={12} mx={4}>
          <Paper
            sx={{
              padding: "20px",
              borderRadius: "8px",
              minHeight: "69.5vh",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Display Conversation */}
            <Box
              sx={{
                maxHeight: "calc(70vh - 120px)",
                overflowY: "auto",
                marginBottom: "20px",
              }}
            >
              {/* Display Welcome Message */}
              {!conversation.length && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50vh",
                    // color: "#F58220",
                    fontStyle: "italic",
                  }}
                >
                  <Typography variant="body1" textAlign="center">
                    Welcome to ChatBOT! How can I assist you today?
                  </Typography>
                  <img
                    src={BotGIF}
                    alt="GIF"
                    style={{
                      width: "70px",
                      height: "70px",
                      marginTop: "20px",
                    }} // Adjust width, height, and margins as needed
                  />
                </Box>
              )}

              {/* Display Conversation Messages */}
              {conversation.map((item, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ marginBottom: "10px" }}
                >
                  <CardContent>
                    {item.user && (
                      <Typography
                        variant="body1"
                        sx={{ marginBottom: "4px", fontWeight: "bold" }}
                      >
                        You: {item.user}
                      </Typography>
                    )}
                    <Typography variant="body1">Bot: {item.bot}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Input Textfield and Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                bottom: "30px",
                width: "97%",
                borderTop: "1px solid #d3d3d3",
                pt: 3,
              }}
            >
              <Box
                width={"70%"}
                sx={{
                  backgroundColor: "white",
                }}
              >
                {/* <TextField
                  placeholder="Enter your query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#B2BAC2",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        border: "0.1px solid #B2BAC2",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading ? (
                          <IconButton>
                            <ThreeDots height={30} width={30} color="#F58220" />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={handleQuery}
                            // sx={{
                            //   color: "#F58220",
                            // }}
                          >
                            <SendIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                /> */}
                <TextField
                  placeholder="Enter your query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#B2BAC2",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        border: "0.1px solid #B2BAC2",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading ? (
                          <IconButton>
                            <ThreeDots height={30} width={30} color="#F58220" />
                          </IconButton>
                        ) : (
                          <>
                            <IconButton onClick={() => handleMicButton()}>
                              <MicIcon />
                            </IconButton>
                            <IconButton onClick={handleQuery}>
                              <SendIcon />
                            </IconButton>
                          </>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      {/* <Box display={"flex"} justifyContent={"center"} p={1}>
        <Typography variant="body2" color={"#F58220"}>
          Powered by BYT strategy group
        </Typography>
      </Box> */}
      <SpeechRecognitionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        listening={listening}
        onStopListening={handleStopListening}
        transcript={transcript}
      />
    </Box>
  );
};

export default Chatbot;
