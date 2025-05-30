import 'dotenv/config';

export const brapi = async (cota) => {
    const quote = cota.toUpperCase()
    const apikey = process.env.brapi_apikey;
    const url = `https://brapi.dev/api/quote/${quote}?token=${apikey}`;
    const response = await (await fetch(url)).json();

    
    if(response.error){
        return `Não encontramos a ação ${quote}`;
    }


    
    const {longName, symbol, regularMarketPrice} = response.results[0];

    if(longName && symbol && regularMarketPrice){
        const preco = regularMarketPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    
        return `
    *${symbol}:* 
    *Empresa:* ${longName}
    *Preço:* ${preco}
    `
    }else{
        return `Não encontramos a ação ${quote}`;
    }

}

