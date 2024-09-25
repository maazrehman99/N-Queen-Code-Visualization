"use client"
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ArrowRight, ArrowDown } from 'lucide-react';

const NQueensCodeExecution = () => {
  const n = 4; // Using a 4x4 board for simplicity
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [executionSteps, setExecutionSteps] = useState([]);

  useEffect(() => {
    setExecutionSteps(solveNQueens(n));
  }, []);

  useEffect(() => {
    let timer;
    if (playing && step < executionSteps.length - 1) {
      timer = setTimeout(() => setStep(step + 1), 1500);
    } else {
      setPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [playing, step, executionSteps]);

  const solveNQueens = (n) => {
    const steps = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    const isSafe = (row, col) => {
      for (let i = 0; i < col; i++) {
        if (board[row][i] === 'Q') return false;
      }
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 'Q') return false;
      }
      for (let i = row, j = col; i < n && j >= 0; i++, j--) {
        if (board[i][j] === 'Q') return false;
      }
      return true;
    };

    const solve = (col) => {
      if (col === n) {
        steps.push({
          board: board.map(row => [...row]),
          message: `Solution found! All ${n} queens placed.`,
          code: 'if (col == n) { add(ans, board, n); return; }',
          currentCell: null
        });
        return true;
      }

      for (let row = 0; row < n; row++) {
        steps.push({
          board: board.map(row => [...row]),
          message: `Checking if queen can be placed at (${row}, ${col})`,
          code: `for (int row = 0; row < n; row++) {\n  if (isSafe(row, col, board, n)) {`,
          currentCell: [row, col]
        });

        if (isSafe(row, col)) {
          board[row][col] = 'Q';
          steps.push({
            board: board.map(row => [...row]),
            message: `Queen placed at (${row}, ${col})`,
            code: 'board[row][col] = "Q";',
            currentCell: [row, col]
          });

          steps.push({
            board: board.map(row => [...row]),
            message: `Recursively solving for next column (${col + 1})`,
            code: 'solve(col + 1, ans, board, n);',
            currentCell: null
          });

          if (solve(col + 1)) return true;

          board[row][col] = '.';
          steps.push({
            board: board.map(row => [...row]),
            message: `Backtracking: Removing queen from (${row}, ${col})`,
            code: 'board[row][col] = "."; // Backtrack',
            currentCell: [row, col]
          });
        }
      }

      steps.push({
        board: board.map(row => [...row]),
        message: `No safe position found in column ${col}. Backtracking.`,
        code: '} // End of for loop, backtrack',
        currentCell: null
      });

      return false;
    };

    solve(0);
    return steps;
  };

  const handlePlay = () => setPlaying(!playing);
  const handleStepBack = () => setStep(Math.max(0, step - 1));
  const handleStepForward = () => setStep(Math.min(executionSteps.length - 1, step + 1));
  const handleReset = () => {
    setStep(0);
    setPlaying(false);
  };

  // Ensure we have a valid board to render
  const currentStep = executionSteps[step] || { board: Array(n).fill().map(() => Array(n).fill('.')), message: 'Initializing...', code: '', currentCell: null };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg max-w-full">
      <h2 className="text-2xl font-bold mb-4">N-Queens Code Execution</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 w-full">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <ArrowRight className="mr-2" />
            <span className="font-bold">Columns</span>
          </div>
          <div className="relative">
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 flex items-center">
              <ArrowDown className="mr-2" />
              <span className="font-bold" style={{ writingMode: 'vertical-rl' }}>Rows</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              <div className="w-8 h-8"></div>
              {[...Array(n)].map((_, i) => (
                <div key={`col-${i}`} className="w-8 h-8 flex items-center justify-center font-bold">
                  {i}
                </div>
              ))}
              {currentStep.board.map((row, i) => (
                <React.Fragment key={`row-${i}`}>
                  <div className="w-8 h-8 flex items-center justify-center font-bold">
                    {i}
                  </div>
                  {row.map((cell, j) => (
                    <div 
                      key={`${i}-${j}`} 
                      className={`w-8 h-8 flex items-center justify-center 
                        ${cell === 'Q' ? 'bg-purple-500 text-white' : 'bg-white'}
                        ${currentStep.currentCell && 
                          currentStep.currentCell[0] === i && 
                          currentStep.currentCell[1] === j ? 'ring-2 ring-red-500' : ''}
                      `}
                    >
                      {cell === 'Q' ? '♕' : ''}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Current Step:</h3>
            <p>{currentStep.message}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Code:</h3>
            <pre className="bg-gray-800 text-white p-2 rounded overflow-x-auto">
              <code>{currentStep.code}</code>
            </pre>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center space-x-2 space-y-2">
        <button onClick={handlePlay} className="p-2 bg-blue-500 text-white rounded">
          {playing ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={handleStepBack} className="p-2 bg-gray-300 rounded">
          <SkipBack size={24} />
        </button>
        <button onClick={handleStepForward} className="p-2 bg-gray-300 rounded">
          <SkipForward size={24} />
        </button>
        <button onClick={handleReset} className="p-2 bg-red-500 text-white rounded">
          Reset
        </button>
      </div>
      <div className="mt-2">
        Step: {step + 1} / {executionSteps.length}
      </div>
    </div>
  );
};

export default NQueensCodeExecution;