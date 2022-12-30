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

  play(row: number, col: number) {
    // Si la partie est terminée ou si la case est déjà occupée, on ne fait rien
    if (this.gameOver || this.grid[row][col] !== '') {
      return;
    }
    // On met à jour l'état de la grille et de la partie
    this.grid[row][col] = this.currentPlayer;
    this.checkGameOver();
    this.enCour = true;
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    // this.color === '2px 3px 4px rgb(2, 85, 194)'? '2px 3px 4px red' : '2px 3px 4px rgb(2, 85, 194)'
  }


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
