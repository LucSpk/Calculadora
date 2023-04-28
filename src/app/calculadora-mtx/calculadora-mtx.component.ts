import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-calculadora-mtx',
  templateUrl: './calculadora-mtx.component.html',
  styleUrls: ['./calculadora-mtx.component.css']
})
export class CalculadoraMtxComponent implements OnInit {

  lcdPrincipal:string = "";
  lcdSecundario:string = "";

  atual: number = 0;
  secundario: number = 0;
  operador: String = "";

  isOperador: boolean = false;

  isPonto: boolean = false;
  contaDecimal: number = 0;

  operadores: any = {
    sum: "+",
    sub: "-",
    mut: "*",
    div: "/"
  };

  constructor() { }

  ngOnInit(): void {
  }

  nrClick(event: number) {
    // -- Limita a 16 Caracteres para nao perder a precisao da variavel 
    if(this.lcdPrincipal.length >= 16)
      return;

    // -- Reseta o Secundario caso nao haja operacao a ser feira.
    if(this.lcdPrincipal == "" && this.lcdSecundario != "" && !this.isOperador) {
      this.lcdSecundario = ""
      this.secundario = 0;
    }
    
    if(this.isPonto) {
      this.contaDecimal += 1;  
      event = event / Math.pow(10, this.contaDecimal);

      if(this.lcdPrincipal.indexOf("-") != -1) {
        this.atual -= event;
        this.lcdPrincipal = String(this.atual.toFixed(this.contaDecimal));
        return;
      }

      this.atual += event;
      this.lcdPrincipal = String(this.atual.toFixed(this.contaDecimal));
      return;
    }

    // -- Adiciona o numero digitado no fim do numero atual
    if(this.atual == 0) {
      if(this.lcdPrincipal == "-")
        event *= -1;

      if(event == 0 && this.lcdPrincipal == "0") 
          return;

      this.atual = event;
      this.lcdPrincipal = String(this.atual);
      return;

    } else if(this.atual < 0) {
      this.atual = ((this.atual * 10) - event);
      this.lcdPrincipal = String(this.atual);
      return;
    }
    this.atual = ((this.atual * 10) + event);
    this.lcdPrincipal = String(this.atual);
  }

  opClick(event: string) {
    this.isPonto = false;
    this.contaDecimal = 0;
    if(this.isOperador && this.lcdSecundario != "") {
      this.secundario = this.calcula(this.secundario, this.atual, this.operador);
      this.atual = this.secundario;
      this.atualizaLcd(event);
      return;
    }

    this.isOperador = true;
    if(this.lcdSecundario != "") {
      this.atual = this.secundario;
      this.atualizaLcd(event);
      return;
    } 

    if(event == "sub") {
      if(this.lcdPrincipal == "" && this.lcdSecundario == "") {
        this.lcdPrincipal = "-";
        return;
      } else if(this.lcdPrincipal == "-") {
        this.lcdPrincipal = "";
        return;
      } 
      this.atualizaLcd(event);
      return;
    }

    this.operador = event;
    this.atualizaLcd(event);
  }

  pontoClicl() {
    if(this.isPonto)
      return;
      
    this.isPonto = true;
    if(this.lcdPrincipal == "") {
      this.lcdPrincipal = "0.";
      return;
    }

    if(this.lcdPrincipal == "-") {
      this.lcdPrincipal = "-0.";
      return;
    }

    this.lcdPrincipal = this.lcdPrincipal + ".";
  }

  igClick() {
    this.isPonto = false;
    this.contaDecimal = 0;

    if(!this.isOperador) {
      if(this.lcdSecundario == "") {
        this.secundario =  this.atual;
        this.lcdSecundario = this.lcdPrincipal;
        this.atual = 0;
        this.lcdPrincipal = "";
        return;
      }
      let result = this.calcula(this.secundario, this.secundario, "sum");
      this.secundario = result;
      this.lcdSecundario = String(result);
      return;
    }

    let resultado = this.calcula(this.secundario, this.atual, this.operador)
    this.atual = 0;
    this.secundario = resultado;
    this.lcdSecundario = String(resultado);
    this.lcdPrincipal = "";
    this.isOperador = false;
  }

  mudaSinal() {
    if(this.lcdPrincipal == "") 
      return;

    this.atual *= -1;
    this.lcdPrincipal = String(this.atual);
  }

  cClick() {
    this.isOperador = false;
    this.isPonto = false;
    this.contaDecimal = 0;
    this.atual = 0;
    this.secundario = 0;
    this.lcdPrincipal = "";
    this.lcdSecundario = "";
  }

  ceClick() {
    if(this.lcdPrincipal == "") 
      return;

    if(this.lcdPrincipal == "-") {
      this.lcdPrincipal = this.lcdPrincipal.slice(0, this.lcdPrincipal.length - 1);
      return;
    }
    
    this.lcdPrincipal = this.lcdPrincipal.slice(0, this.lcdPrincipal.length - 1);
    this.atual = Number(this.lcdPrincipal);
  }

  calcPercem() {
    if(this.lcdSecundario == "" || !this.isOperador) {
      this.atual = 0;
      this.secundario = 0;
      this.lcdPrincipal = "";
      this.lcdSecundario = "";
      return;
    }

    let parcial = this.calcula(this.secundario, this.atual, "mut");
    let result = this.calcula(parcial, 100, "div");
    
    this.secundario = this.calcula(this.secundario, result, this.operador);

    this.lcdSecundario = String(this.secundario);
    this.atual = 0;
    this.lcdPrincipal = "";
  }

  calcula(num01: number, num02: number, operador: String) {  
    if(operador === "sum")
      return num01 + num02;

    if(operador === "sub")
      return num01 - num02;

    if(operador === "mut")
      return num01 * num02;
    
    if(operador === "div")
      return num01 / num02;
    
    return 0;
  }

  atualizaLcd(operador: string) {
    this.operador = operador;
    this.secundario = this.atual;
    this.lcdSecundario = this.secundario + this.operadores[operador];
    this.atual = 0;
    this.lcdPrincipal = "";
  }

}
