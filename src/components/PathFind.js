import { useState, useEffect } from "react";
import React from "react";
import "./PathFind.css";
import Node from "./Node";
import Astar from "../a-star-algo/astar";

const rows = 15;
const cols = 20;
const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;

const PathFind = () => {
  const [Grid, setGrid] = useState([]);
  const [Path, setPath] = useState([]);
  const [VisitedNodes, setVisitedNodes] = useState([]);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const grid = new Array(rows);
    for (let i = 0; i < rows; ++i) {
      grid[i] = new Array(cols);
    }

    createSpot(grid);
    setGrid(grid);
    addNeighbours(grid);

    const startNode = grid[NODE_START_ROW][NODE_START_COL];
    const endNode = grid[NODE_END_ROW][NODE_END_COL];
    startNode.isWall = false;
    endNode.isWall = false;
    let path = Astar(startNode, endNode);
    setPath(path.path);
    setVisitedNodes(path.visitedNodes);
  };

  const createSpot = (grid) => {
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        grid[i][j] = new Spot(i, j);
      }
    }
  };

  const addNeighbours = (grid) => {
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        grid[i][j].addNeighbour(grid);
      }
    }
  };

  // SPOT CONSTRUCTOR
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
    this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;
    this.isWall = false;
    if (Math.random(1) < 0.2) {
      this.isWall = true;
    }
    this.addNeighbour = function (grid) {
      let i = this.x;
      let j = this.y;
      if (i > 0) this.neighbours.push(grid[i - 1][j]);
      if (j > 0) this.neighbours.push(grid[i][j - 1]);
      if (i < rows - 1) this.neighbours.push(grid[i + 1][j]);
      if (j < cols - 1) this.neighbours.push(grid[i][j + 1]);
    };
  }

  console.log(Grid);
  const gridWithNode = (
    <div className="Wrapper">
      {Grid.map((row, rowIndex) => {
        return (
          <div className="rowWrapper" key={rowIndex}>
            {row.map((col, colIndex) => {
              const { isStart, isEnd, isWall } = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={rowIndex}
                  col={colIndex}
                  isWall={isWall}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const visualizeShortestPath = (shortestPathNodes) => {
    for (let i = 0; i < shortestPathNodes.length; ++i) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        document.getElementById(`node-${node.x}-${node.y}`).className =
          "node node-shortest-path";
      }, i * 5);
    }
  };

  const visualizePath = () => {
    for (let i = 0; i <= VisitedNodes.length; ++i) {
      if (i === VisitedNodes.length) {
        setTimeout(() => {
          visualizeShortestPath(Path);
        }, i * 20);
      } else {
        const node = VisitedNodes[i];
        setTimeout(() => {
          document.getElementById(`node-${node.x}-${node.y}`).className =
            "node node-visited";
        }, i * 20);
      }
    }
  };

  console.log(Path);
  return (
    <div className="Wrapper">
      <button onClick={visualizePath}>Visualize Path</button>
      <h1>A* Algorithm Simulation</h1>
      {gridWithNode}
    </div>
  );
};

export default PathFind;
