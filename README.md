# Node-WoT-Architecture
Architettura con Node WoT.
Attraverso l'utilizzo di una board e una architettura wot vengono forniti vari tipi di dati da diversi endpoint (meteo, traffico, incidenti, asteroidi, terreno).
Il servient gestisce un piccolo index in cui e' possibile vedere le properties delle thing che produce e, se concesso, invocare le sue actions o eventi qualora presenti.
L'arduino viene utilizzato come canale tra le componenti e il servient in quanto javascript riesce a gestire il tutto.
Sono presenti due circuiti principali al momento.

## Going Out:
   ![alt text](https://github.com/riccardopreite/Node-WoT-Architecture/blob/master/motionFinal.jpg?raw=true)
   Semplicemente il circuito e' composto da un sensore di movimento e dei led. Quando il sensore di movimento viene triggerato il consumer va a controllare il   meteo, traffico e gli incidenti. In seguito, in base al meteo trovato comunica all'utente che tempo fa, se conviene prendere il giubbotto e/o l'ombrello. L'Lcd non è riportato nello schema in quanto quello utilizzato è provvisto di uno shield che ne permette il collegamento diretto all'Arduino.

## Motor Run:
   ![alt text](https://github.com/riccardopreite/Node-WoT-Architecture/blob/master/motorFinal.jpg?raw=true)
   Il circuito e' composto da 3 motorini. Ogni tot di tempo viene triggerata una funzione che va a controllare il meteo, o quando vengono triggerati i sensori di pioggia ecc (ancora da implementare), va a controllare il meteo e gestisce i motorini in base al meteo trovato.
   * Para Piante;
   * Telo Auto;
   * Tenda Balcone.


# Arduino

Viene utilizzato un Arduino uno con delle componenti molto semplici.

* **Componenti**:
  * Un arduino;
  * Cavo seriale;
  * 1 Motorino DC 3,3-6V;
  * Transistor BC-337-40;
  * Diodo;
  * Jumper vari;
  * Resistenza da 2,2Kohm

  Grazie al modulo di node johnny-five e' possibile comunicare con l'arduino e controllare tutti i pin in modo molto semplice col javascript.
  ```javascript
    var johnny_five=require("johnny-five");
    arduino_board = new johnny_five.Board();
    arduino_board.on("ready", async function() {
        // ... the board is connected, and capabilities reported
        var rainSens = new johnny_five.Sensor({
            pin: "A0"
        });
    })
  ```
  # PROTOTIPO REALIZZATO
    **Foto del prototipo:**
   ![alt text](https://github.com/riccardopreite/Node-WoT-Architecture/blob/master/prototype.jpg?raw=true)
   
  # INSTALLAZIONE
  
  git clone https://github.com/riccardopreite/Node-WoT-Architecture.git
  
  cd Node-WoT-Architecture
   
  **Prima di eseguire il servizio bisogna inserire i propri indirizzi IP all'interno del file crawler/crawler.js alle voci ddnsName, servientIp, serverIp e estrarre il contenuto del file node_modules.rar nella directory corrente**
  
  ./runWoTArchitecture.sh 

