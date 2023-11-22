import { MicOff as MicOffIcon } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import React from "react";
import { ThreeDots } from "react-loader-spinner";
const SpeechRecognitionDialog = ({
  isOpen,
  onClose,
  onStopListening,
  transcript,
  listening,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box display={"flex"} gap={2}>
          <Typography variant="h6" gutterBottom>
            Listening
          </Typography>
          {listening ? (
            <ThreeDots height={30} width={30} color="#F58220" />
          ) : null}
        </Box>
        <Typography variant="body1" paragraph>
          {transcript}
        </Typography>
        <Box textAlign={"center"}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={onStopListening}
          >
            Stop Listening <MicOffIcon style={{ marginLeft: "8px" }} />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SpeechRecognitionDialog;
