import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className={"square " + (props.isHighlighted ? "highlight" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return {};
}

function getColRow(pos) {
  const col = Math.floor(pos % 3) + 1;
  const row = Math.ceil((pos + 1) / 3);
  return { col, row };
}

class Board extends React.Component {
  renderSquare(i) {
    const line = this.props.winLine;
    let isHighlighted;
    if (line && line.includes(i)) {
      isHighlighted = true;
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlighted={isHighlighted}
        key={i}
      />
    );
  }

  render() {
    let pos = 0;
    let children = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(pos++));
      }
      children.push(
        React.createElement("div", { className: "board-row", key: i }, squares)
      );
    }
    return React.createElement("div", null, children);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pos: 0,
          hand: "",
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const { winner } = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    let hand = this.state.xIsNext ? "X" : "O";
    squares[i] = hand;
    this.setState({
      history: history.concat([{ squares: squares, pos: i, hand: hand }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, line } = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const pos = getColRow(step.pos);
      let desc = move
        ? `Go to move #${move} [${pos.col}-${pos.row}-${step.hand}]`
        : "Go to game start";
      if (move === this.state.stepNumber) {
        desc = <b>{desc}</b>;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (history.length === 10 && this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{moves}</div>
        </div>
      </div>
    );
  }
}

// ===========================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
