import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  ngOnInit() {}
  start:number = 1;
  stop: number = 0;
  GameStatus: number;
  currentPlayer: number;
  currentPlayerSybol: string;
  pauseGame:boolean = false;
  Board:Array<number> = this.initialBoard();  
  gameboard:boolean = false;
  mainmenu:boolean = true;
  user: string;
  Empty: 0;
  Title:string;
  
  
  constructor() { 
    this.Board = this.initialBoard();
    this.GameStatus = this.stop; 
  }

  startGame(){
    this.GameStart();
    this.Title = "Current player: " + this.currentPlayer;
  }

  GameStart(){
    this.gameboard = true;
    this.mainmenu = false;
    this.Board = this.initialBoard();
    this.currentPlayer = this.randomPlayer();
    console.log("Player:" + this.currentPlayer);
    this.GameStatus = this.start;
  }


  randomPlayer(): number {
    const player = (Math.floor(Math.random() * 2) + 1);
    if (player === 1){
      this.currentPlayerSybol = 'X'
    }else{
      this.currentPlayerSybol = 'O';
    }
    return player;
  }

  
  async gameCellClick(cell: any): Promise<void>{
    if(this.GameStatus === 1){
      const position = cell.currentTarget.getAttribute('position');
      if (this.Board[position] === this.Empty){
        this.setFeild(position, this.currentPlayer)
        const id: string = "f"+position;
        const changeCell = document.getElementById(id);
        if (this.currentPlayerSybol === "X"){
          changeCell.innerHTML += '<img src="../../assets/gameico/cross.png" class="boardicon" />'
        }if (this.currentPlayerSybol === "O"){
          changeCell.innerHTML += '<img src="../../assets/gameico/O.png" class="boardicon" />'
        }

        // await this.checkGameWinner();
        await this.checkGameWinner().then((end: boolean) => {
          if(this.GameStatus === this.stop && end){
            console.log("entered winner check")
            this.Title = "player " + this.currentPlayer + " wins !!";
          }
        });
        await this.checkGameBoard().then((end: boolean) => {
          if(this.GameStatus === this.stop && end){
            this.Title = "No winner Draw!"
          }
        });

        if (this.GameStatus != this.stop){
          this.changePlayer();
          this.Title = "Currnt player: " + this.currentPlayer;
        }
      }
    }
  }

  changePlayer(){
    this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
    this.currentPlayerSybol = (this.currentPlayerSybol === 'X') ? "O" : "X";
  }

  async checkGameWinner(): Promise<boolean>{
    
    let isWinner = false;

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.Board[a] != this.Empty &&
        this.Board[a] === this.Board[b] &&
        this.Board[a] === this.Board[c]
      ){
        console.log("entered checking winner")
        isWinner = true;
      }
    }
    
    if (isWinner){
      console.log("finally full")
      this.endGame();
      return true ;
    }else{
      return false;
    }
  }

  async checkGameBoard(): Promise<boolean>{
    
    let isfull = true;

    if (this.Board.includes(this.Empty)){
      console.log("check is woking")
      isfull = false;
    }
    if (isfull){
      console.log("finally full")
      this.endGame();
      return true ;
    }else{
      return false;
    }
  }

  endGame(){
    this.GameStatus = this.stop;
  }
  
  backToMainMenu(){
    this.GameStatus = this.stop
    this.gameboard = false;
    this.mainmenu = true;
  }

  initialBoard(): Array<number>{
    var IBoard= [this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty];
    return IBoard;
  }

  setFeild(index: number, value: number){
    this.Board[index] = value;
  }
  
}
