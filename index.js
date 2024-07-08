import { create } from '@open-wa/wa-automate';
import fs from 'fs';
import path from 'path';
import { cepapi } from './src/modules/cepapi/index.js';
import { qrcode } from './src/modules/qrcode/index.js';
import { init } from './seed.js';
import { brapi } from './src/modules/brapi/index.js';

// init();



create({
  sessionId: "!Robot",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {

  client.onMessage(async message => {
    if (message.body === 'Pai Aldo') {
      await client.sendText(message.from, '✋😞');
    }
  });

  client.onMessage(async message => {
    if (message.body === '!help') {
      await client.sendText(message.from, `
      *Principais Comandos:*
Pai Aldo
!cep {cep apenas números}

!qrcode {texto, link, etc...}

!cota {sigla}

`);
    }
  });



  client.onMessage(async message => {
    if (message.body.slice(0,4) === '!cep' && message.body.length == 13) {
      const cep = Number(message.body.slice(5));
      if(isNaN(cep)){
        await client.sendText(message.from, 'Apenas números');
        return;
      }
      const endereco = await cepapi(cep);
      await client.sendText(message.from, endereco);
    }
  });

  client.onMessage(async message => {
    if (message.body.slice(0,7) === '!qrcode') {
      const info = message.body.slice(8).trim();
      const filePath = await qrcode(info);
      await client.sendImage(message.from, filePath, 'qrcode.png', 'Gerado com sucesso')
      fs.unlink(filePath, () => {});
    }
  });

  client.onMessage(async message => {
    if (message.body.slice(0,5) === '!cota') {
      const cota = message.body.slice(6).trim().toUpperCase();
      const response = await brapi(cota);
      await client.sendText(message.from, response);
    }
  });



}