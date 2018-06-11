import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return(
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.PureComponent {   
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}/>
        );
    }
    render() {  
        var grid = [];
        var row = [];
        var count = 0;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                row.push(this.renderSquare(count));
                count++;
            }
            grid.push(<div className="board-row">{ row }</div>);
            row = [];
        }    
        return (
            // <div>
            //     <div className="board-row">
            //         {this.renderSquare(0)}
            //         {this.renderSquare(1)}
            //         {this.renderSquare(2)}
            //     </div>
            //     <div className="board-row">
            //         {this.renderSquare(3)}
            //         {this.renderSquare(4)}
            //         {this.renderSquare(5)}
            //     </div>
            //     <div className="board-row">
            //         {this.renderSquare(6)}
            //         {this.renderSquare(7)}
            //         {this.renderSquare(8)}
            //     </div>
            // </div>
           <div>
               {grid}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                Array(9).fill(null)
            ],
            step: 0,
            isNextX: true
        }
    }
    handleClick(i){
        var step = this.state.step;
        var history = this.state.history.slice(0, step + 1);
        var current = history[history.length - 1];
        if(this.calculateWinner(current) || current[i]){
            return;
        }
        var ns = Object.assign({}, current);
        ns[i] = this.state.isNextX ? "X" : "O";
        var nh = JSON.parse(JSON.stringify(history));
        nh.push(ns);
        this.setState({history: nh,
                       step: nh.length - 1,
                       isNextX: !this.state.isNextX});
    }
    calculateWinner(squares){
        const winPattern = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for(let i = 0; i < winPattern.length; i++){
            if(squares[winPattern[i][0]] && squares[winPattern[i][0]] === squares[winPattern[i][1]] && squares[winPattern[i][0]] === squares[winPattern[i][2]]){
                return "Winner: " + squares[winPattern[i][0]];
            }
        }
        return null;
    }
    jumpTo(step){
        this.setState({
            step: step,
            isNextX: step % 2 == 0
        })
    }
    render() {
        var step = this.state.step;
        var history = this.state.history.slice(0, step + 1);
        var current = history[history.length - 1];
        var moves = this.state.history.map( (squares, index) => {
            var move = index == 0 ? "Start Over" : "Move: " + index;
            return (
                <button key={index} onClick={() => this.jumpTo(index)}>{move}</button>
            )
        });
        var status;
        if(this.calculateWinner(current)){
            status = this.calculateWinner(current);
        }else{
            status = 'Next player: ' + (this.state.isNextX ? "X" : "O");
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current}
                           onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root') //?
);  