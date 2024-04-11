// Othello Game Implementation with Chakra UI and React Icons
import { Box, Button, Flex, Grid, Text, useToast } from "@chakra-ui/react";
import { FaRobot, FaUserFriends } from "react-icons/fa";
import { useState, useEffect } from "react";

const boardSize = 8; // Othello board is 8x8

// Helper function to initialize the game board
const initializeBoard = () => {
  const board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));
  // Setting up the four initial pieces
  board[3][3] = "W";
  board[3][4] = "B";
  board[4][3] = "B";
  board[4][4] = "W";
  return board;
};

// Component for individual cells on the board
const Cell = ({ value, onClick }) => {
  const bgColor = value === "B" ? "black" : value === "W" ? "white" : "green.200";
  const color = value === "W" ? "black" : "white";
  return (
    <Button onClick={onClick} bgColor={bgColor} color={color} height="40px" width="40px">
      {value}
    </Button>
  );
};

const Index = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState("B"); // B for Black, W for White
  const toast = useToast();

  // Function to handle cell click
  const handleCellClick = (row, col) => {
    if (board[row][col] !== null) {
      toast({
        title: "Invalid move.",
        description: "You must place your piece on an empty spot.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Place the piece on the board
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "B" ? "W" : "B"); // Switch turns
  };

  // Render the game board
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <Grid templateColumns="repeat(8, 1fr)" gap={1} key={rowIndex}>
        {row.map((cell, colIndex) => (
          <Cell key={`${rowIndex}-${colIndex}`} value={cell} onClick={() => handleCellClick(rowIndex, colIndex)} />
        ))}
      </Grid>
    ));
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Text fontSize="2xl" mb={4}>
        Othello Game
      </Text>
      <Box>{renderBoard()}</Box>
      <Flex mt={4}>
        <Button leftIcon={<FaUserFriends />} colorScheme="teal" variant="solid" mr={2}>
          Play with friend
        </Button>
        <Button leftIcon={<FaRobot />} colorScheme="orange" variant="solid">
          Play with AI
        </Button>
      </Flex>
    </Flex>
  );
};

export default Index;
