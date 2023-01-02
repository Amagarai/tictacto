import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({opacity:0}),
        animate('500ms', style({opacity:1}))
      ]),
      transition(':leave', [
        style({opacity:1}),
        animate('500ms', style({opacity:0}))
      ])
    ])
  ]
})
export class HomePage {

  // Tableau représentant l'état de chaque case de la grille
  grid: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  // Indique si c'est à X ou à O de jouer
  currentPlayer: 'X' | 'O' = 'X';
  //pour le mode du jeu (single or multi)
  mode: 'single' | 'multi' = 'single';
  //choisis de la dificulté
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  // Indique si la partie est terminée
  gameOver: boolean = false;
  // Stocke le gagnant (X ou O) si la partie est terminée
  winner: 'X' | 'O' | any= null
  player1: string = '';
  player2: string = '';
  gameStart: boolean = false;
  winPlayer1 : number = 0
  winPlayer2 : number = 0
  enCour: boolean = false ;

  constructor(private alerte: AlertController) {}


  definePlayer(data: NgForm){
    if (data.value.player1.trim() === '' || data.value.player2.trim() === '') {
      this.presentAlert();
    } else {
      this.player1 = data.value.player1
      this.player2 = data.value.player2
      this.gameStart = true
      this.enCour = true;
      data.reset();
    }

  }

  //Pour le mode facile
  strategyEasy(grid: string[][]): [number, number] | null {
    // Récupère les cases vides de la grille
    const emptyCells : any = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j] === '') {
          emptyCells.push([i, j]);
        }
      }
    }
    // Choisit une case vide au hasard
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[randomIndex];
    }
    return null;
  }

  //Pour les strategie moyens
  strategyMedium(grid: string[][]): [number, number] | null {
    // Récupère les cases vides de la grille
    const emptyCells : any = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j] === '') {
          emptyCells.push([i, j]);
        }
      }
    }
    // Essaie de bloquer le prochain coup du joueur
    for (const cell of emptyCells) {
      const tempGrid = grid.map(row => row.slice());
      tempGrid[cell[0]][cell[1]] = 'O';
      if (this.checkWin(tempGrid, 'X')) {
        return cell;
      }
    }
    // Essaie de créer une opportunité de victoire
    for (const cell of emptyCells) {
      const tempGrid = grid.map(row => row.slice());
      tempGrid[cell[0]][cell[1]] = 'O';
      if (this.checkWin(tempGrid, 'O')) {
        return cell;
      }
    }
    // Choisit une case vide au hasard
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[randomIndex];
    }
    return null;
  }

  //La fonction checkWin() vérifie si le joueur courant peut remporter la partie en jouant dans chaque case vide de la grille.
   checkWin = (gameState: any, player: any) => {
    gameState = this.grid;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameState[i][j] === '') {
          // Simule le coup joué par le joueur courant
          gameState[i][j] = player;
          // Vérifie si le joueur courant a remporté la partie
          const result = this.checkGameOver();
          if (result === player) {
            // Annule le coup et renvoie true
            gameState[i][j] = '';
            return true;
          }
          // Annule le coup
          gameState[i][j] = '';
        }
      }
    }
    // Aucun coup ne permet de remporter la partie, renvoie false
    return false;
  }

  play(row: number, col: number) {
    // Si la partie est terminée ou si la case est déjà occupée, on ne fait rien
    if (this.gameOver || this.grid[row][col] !== '') {
      return;
    }
    // Si on est en mode solo, le joueur courant est toujours X
    if (this.mode === 'single') {
      this.currentPlayer = 'X';
    }
    // On met à jour l'état de la grille et de la partie
    this.grid[row][col] = this.currentPlayer;
    this.checkGameOver();
    this.enCour = true;
    // Si la partie n'est pas terminée, on fait jouer l'ordinateur si on est en mode solo
    if (!this.gameOver && this.mode === 'single') {
      this.playComputer();
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  //Lors qu'on joue contre l'ordinateur
  playComputer(){
    // On récupère les cases vides de la grille
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[i][j] === '') {
          emptyCells.push([i, j]);
        }
      }
    }

    //**** a tester */
    // On choisit une case vide au hasard
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    // On met à jour l'état de la grille et de la partie
    this.grid[cell[0]][cell[1]] = 'O';
    this.checkGameOver();
    // On passe au joueur suivant
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    //fin
  }

  //Selectioner le mode du jeu------------------------------------******************

  checkGameOver() {
    // Vérifie si une ligne est complète et contient les mêmes symboles
    for (let i = 0; i < 3; i++) {
      if (this.grid[i][0] !== '' && this.grid[i][0] === this.grid[i][1] && this.grid[i][1] === this.grid[i][2]) {
        this.gameOver = true;
        this.enCour = false;
        if (this.grid[i][0] === 'X') {
          this.winner = this.player1;
          this.winPlayer1 = this.winPlayer1 + 1
          this.enCour = false;
        }else if(this.grid[i][0] === 'O'){
          this.winner = this.player2;
          this.winPlayer2 = this.winPlayer2 + 1
          this.enCour = false;
        }
        // this.winner = this.grid[i][0];
        return;
      }
    }
    // Vérifie si une colonne est complète et contient les mêmes symboles
    for (let i = 0; i < 3; i++) {
      if (this.grid[0][i] !== '' && this.grid[0][i] === this.grid[1][i] && this.grid[1][i] === this.grid[2][i]) {
        this.gameOver = true;
        this.enCour = false;
        if (this.grid[0][i] === 'X') {
          this.winner = this.player1;
          this.winPlayer1 = this.winPlayer1 + 1
          this.enCour = false;
        }else if(this.grid[0][i] === 'O'){
          this.winner = this.player2;
          this.winPlayer2 = this.winPlayer2 + 1
          this.enCour = false;
        }
        // this.winner = this.grid[0][i];
        return;
      }
    }
    // Vérifie si la première diagonale est complète et contient les mêmes symboles
    if (this.grid[0][0] !== '' && this.grid[0][0] === this.grid[1][1] && this.grid[1][1] === this.grid[2][2]) {
      this.gameOver = true;
      this.enCour = false;
      if (this.grid[0][0] === 'X') {
        this.winner = this.player1;
        this.winPlayer1 = this.winPlayer1 + 1
        this.enCour = false;
      }else if(this.grid[0][0] === 'O'){
        this.winner = this.player2;
        this.winPlayer2 = this.winPlayer2 + 1
        this.enCour = false;
      }
      // this.winner = this.grid[0][0];
      return;
    }
    // Vérifie si la seconde diagonale est complète et contient les mêmes symboles
    if (this.grid[0][2] !== '' && this.grid[0][2] === this.grid[1][1] && this.grid[1][1] === this.grid[2][0]) {
      this.gameOver = true;
      this.enCour = false;
      if (this.grid[0][2] === 'X') {
        this.winner = this.player1;
        this.winPlayer1 = this.winPlayer1 + 1
        this.enCour = false;
      }else if(this.grid[0][2] === 'O'){
        this.winner = this.player2;
        this.winPlayer2 = this.winPlayer2 + 1
        this.enCour = false;
      }
      // this.winner = this.grid[0][2];
      return;
    }
    // Vérifie s'il y a un match nul
    let full = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[i][j] === '') {
          full = false;
          break;
        }
      }
    }
    if (full) {
      this.gameOver = true;
      this.winner = null;
      this.enCour = false;
      return;
    }
  }

  reset() {
    this.grid = [['', '', ''], ['', '', ''], ['', '', '']];
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winner = null;
    this.enCour = true;
  }

  newPart(){
    this.grid = [['', '', ''], ['', '', ''], ['', '', '']];
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winner = null;
    this.gameStart = false;
    this.winPlayer1 = 0;
    this.winPlayer2 = 0;
    this.enCour = false
  }

  async presentAlert() {
    const alert = await this.alerte.create({
      // subHeader: 'Subtitle',
      mode: 'ios',
      cssClass: 'my-custom-class',
      message: '<b>Remplissez tout les champs</b>',
      buttons: ['OK']
    });

    await alert.present();
  }

}
