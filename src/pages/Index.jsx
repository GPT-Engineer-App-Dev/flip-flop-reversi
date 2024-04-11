import { useState, useEffect } from "react";
import { Box, Grid, GridItem, Button, Text, useToast } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";

const Index = () => {
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const boardSize = 8;
  const initialBoard = () => {
    const mid = boardSize / 2;
    let board = Array(boardSize)
      .fill()
      .map(() => Array(boardSize).fill(null));
    board[mid - 1][mid - 1] = "white";
    board[mid][mid] = "white";
    board[mid - 1][mid] = "black";
    board[mid][mid - 1] = "black";
    return board;
  };

  const [board, setBoard] = useState(initialBoard());
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const toast = useToast();

  const isValidMove = (x, y) => {
    if (board[x][y] !== null) return false;
    let valid = false;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      let i = x + dx,
        j = y + dy,
        validDir = false;
      while (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === (currentPlayer === "black" ? "white" : "black")) {
        i += dx;
        j += dy;
        if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === currentPlayer) {
          validDir = true;
        }
      }
      if (validDir) {
        valid = true;
      }
    });

    return valid;
  };

  const simulateMove = (x, y, board, player) => {
    let score = 0;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    directions.forEach(([dx, dy]) => {
      let i = x + dx,
        j = y + dy,
        potentialScore = 0;
      while (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === (player === "black" ? "white" : "black")) {
        potentialScore++;
        i += dx;
        j += dy;
      }
      if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === player) {
        score += potentialScore;
      }
    });
    return score;
  };

  const aiMove = () => {
    let maxScore = -1;
    let bestMove = null;
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (isValidMove(x, y)) {
          const score = simulateMove(x, y, board, currentPlayer);
          if (score > maxScore) {
            maxScore = score;
            bestMove = { x, y };
          }
        }
      }
    }
    if (bestMove) {
      placePiece(bestMove.x, bestMove.y);
    }
  };

  const placePiece = (x, y, isPlayer = true) => {
    if (!isValidMove(x, y)) {
      toast({
        title: "Invalid move",
        description: "You can't place a piece here.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[x][y] = currentPlayer;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      let i = x + dx,
        j = y + dy,
        piecesToFlip = [];
      while (i >= 0 && i < boardSize && j >= 0 && j < boardSize && newBoard[i][j] === (currentPlayer === "black" ? "white" : "black")) {
        piecesToFlip.push([i, j]);
        i += dx;
        j += dy;
      }
      if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && newBoard[i][j] === currentPlayer) {
        piecesToFlip.forEach(([pi, pj]) => {
          newBoard[pi][pj] = currentPlayer;
        });
      }
    });

    setBoard(newBoard);

    if (isPlayer) {
      setCurrentPlayer((prevPlayer) => (prevPlayer === "black" ? "white" : "black"));
      if (isAIEnabled) {
        setTimeout(aiMove, 1000);
      }
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="xl" mb={4}>
        Othello Game - Current Player: {currentPlayer.toUpperCase()}
      </Text>
      <Grid templateColumns={`repeat(${boardSize}, 1fr)`} gap={0}>
        {board.map((row, x) =>
          row.map((cell, y) => (
            <GridItem key={`${x}-${y}`} w="50px" h="50px" bg="green.500" onClick={() => placePiece(x, y)}>
              {cell && <FaCircle color={cell === "black" ? "black" : "white"} size="40px" />}
            </GridItem>
          )),
        )}
      </Grid>
      <Button
        mt={4}
        colorScheme="blue"
        onClick={() => {
          setBoard(initialBoard());
          setCurrentPlayer("black");
        }}
      >
        Restart Game
      </Button>
      <Button
        mt={4}
        colorScheme="teal"
        onClick={() => {
          setIsAIEnabled(!isAIEnabled);
          setCurrentPlayer("black");
        }}
      >
        {isAIEnabled ? "Disable AI" : "Enable AI"}
      </Button>
    </Box>
  );
};

export default Index;
