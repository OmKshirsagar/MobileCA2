import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  ngOnInit() {}
  // Standard numbers to display the stage of game.
  start:number = 1;
  stop: number = 0;
  // Use Standard numbers to see the status of game
  GameStatus: number;
  // get the current player
  currentPlayer: number;
  // get what is the players symbol i.e X or O
  currentPlayerSybol: string;
  // initialize a default board
  Board:Array<number> = this.initialBoard();
  // check if gameboard screen is shown (false in the start)  
  gameboard:boolean = false;
  // check if mainmenu is shown(true in start.)
  mainmenu:boolean = true;
  // var for storing a empty cell in board
  Empty: 0;
  // current commentry of the game.
  Title:string;
  
  // onload initialize board and set game status to stop.
  constructor() { 
    this.Board = this.initialBoard();
    this.GameStatus = this.stop; 
  }
  // when user presses Play button
  startGame(){
    //call the start function
    this.GameStart();
    // Set the title.
    this.Title = "Current player: " + this.currentPlayer;
  }
  // def of start function
  GameStart(){
    // hide main menu and show gameboard.
    this.gameboard = true;
    this.mainmenu = false;
    // reset the board for all previous values
    this.Board = this.initialBoard();
    // get a random player 1, 2
    this.currentPlayer = this.randomPlayer();
    console.log("Player:" + this.currentPlayer);
    // change the gamestatus
    this.GameStatus = this.start;
  }

  // def randomplayer
  randomPlayer(): number {
    // formula for getting 1 or 2 randomly
    const player = (Math.floor(Math.random() * 2) + 1);
    // set the symbol
    if (player === 1){
      this.currentPlayerSybol = 'X'
    }else{
      this.currentPlayerSybol = 'O';
    }
    // return player
    return player;
  }

  // Function to get input and do the necesary jobs of game management
  // async as I want to use await in the method
  // Promise as i want the function to wait for the checking process. 
  async gameCellClick(cell: any): Promise<void>{
    // run on if Game is started
    if(this.GameStatus === 1){
      // Cell is a event that is passed as parameter
      // currentTarget method gets the HTML element to which this event was attached to.
      // from that element get the position attribute which is defined by me.
      const position = cell.currentTarget.getAttribute('position');
      // update the gameboard on if the cell user clicked on is empty
      if (this.Board[position] === this.Empty){
        // update the board with cell clicked
        this.setFeild(position, this.currentPlayer)
        // make a string to get id of the element = f(cas all the id's of all cell start with f)
        // append the position of the element to the string and position and id are similarly numbered
        const id: string = "f"+position;
        // get the element
        const changeCell = document.getElementById(id);
        // add the graphics of the player symbol.
        if (this.currentPlayerSybol === "X"){
          changeCell.innerHTML += '<img src="../../assets/gameico/cross.png" class="boardicon" />'
        }if (this.currentPlayerSybol === "O"){
          changeCell.innerHTML += '<img src="../../assets/gameico/O.png" class="boardicon" />'
        }

        // Wait to get if there is a winner
        // CheckGameWinner returns bool true or false. 
        // if true execute the method defined in then block
        await this.checkGameWinner().then((end: boolean) => {
          // checkGameWinner sets the value of Gamestatus to STOP if there is a winner. 
          if(this.GameStatus === this.stop && end){
            console.log("entered winner check")
            // Declare the winner
            this.Title = "player " + this.currentPlayer + " wins !!";
          }
        });
        // Wait to get if there is a draw
        // CheckGAmeBoard returns bool true or false. 
        // if true execute the method defined in then block
        await this.checkGameBoard().then((end: boolean) => {
          // checkGameBoard sets the value of Gamestatus to STOP if there is a winner.
          if(this.GameStatus === this.stop && end){
            // Print Draw.
            this.Title = "No winner Draw!"
          }
        });
        // if the gamestatus is start i.e game is going on
        if (this.GameStatus != this.stop){
          // change the player and title
          this.changePlayer();
          this.Title = "Currnt player: " + this.currentPlayer;
        }
      }
    }
  }
  // def change player
  changePlayer(){
    // check which is the current player and alternate to other one.
    this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
    // change the symbol too.
    this.currentPlayerSybol = (this.currentPlayerSybol === 'X') ? "O" : "X";
  }
  // def winner checker
  async checkGameWinner(): Promise<boolean>{
    // set no winner by default
    let isWinner = false;
    // all the winning combinations
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
    // for each combination in lines array
    for (let i = 0; i < lines.length; i++) {
      // unpack positions in the combination
      const [a, b, c] = lines[i];
      // check if the elements in those positions are same and not Empty.
      if (
        this.Board[a] != this.Empty &&
        this.Board[a] === this.Board[b] &&
        this.Board[a] === this.Board[c]
      ){
        // if set winner to true
        console.log("entered checking winner")
        isWinner = true;
      }
    }
    // if we get a winner
    if (isWinner){
      // call the endGame funtion and return true
      console.log("finally full")
      this.endGame();
      return true ;
    }else{
      return false;
    }
  }

  async checkGameBoard(): Promise<boolean>{
    // board is full by default
    let isfull = true;
    // if there are any empty cells in the board then
    if (this.Board.includes(this.Empty)){
      // set full to false
      console.log("check is woking")
      isfull = false;
    }
    // if we get a winner
    if (isfull){
      console.log("finally full")
      // call the endGame funtion and return true
      this.endGame();
      return true ;
    }else{
      return false;
    }
  }
  // endGame set the variable 
  endGame(){
    // set GameStatus to STOP
    this.GameStatus = this.stop;
  }
  // def mehtod to return to main menu 
  backToMainMenu(){
    this.GameStatus = this.stop
    this.gameboard = false;
    this.mainmenu = true;
  }
  // method to generate a empty board
  initialBoard(): Array<number>{
    var IBoard= [this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty, this.Empty];
    return IBoard;
  }
  // add the move to the board
  setFeild(index: number, value: number){
    // go to the cell in the board and set it to the value given
    this.Board[index] = value;
  }
  
}
