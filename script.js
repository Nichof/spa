window.onload = function () {
    updateContent();

    const list = document.querySelector('ul').children;
    Array.prototype.forEach.call(list, (node) => {node.children[0].setAttribute('onclick','updateContent(null, this)')}); 
    window.onhashchange = updateContent;
}

function updateContent(evt, elem) {
    let hashSign = window.location.hash;
    if (elem !== undefined ) {
        hashSign = elem.attributes.href.nodeValue;
    }
    
    switch (hashSign) {
        case '':
            loadPage('#home');
            break;

        case '#chuck_norris': 
            chuck();
            break;

        case '#pokemon':
            pokemon();
            break;

        default:
            loadPage(hashSign);
            break;
    }
}

function loadPage(hex) {
    const hexArray = [...hex];
    hexArray.shift();
    const hexString = hexArray.join('');
    
    const loaderElement = document.querySelector('.loader');
    loaderElement.style.visibility = 'visible';

    const xhrMain = new XMLHttpRequest;
    xhrMain.open('GET', hexString + '.html');

    xhrMain.onreadystatechange = function (e) {
        if (xhrMain.readyState === 4 && xhrMain.status >= 200 && xhrMain.status < 400 ) {
            document.querySelector('main').innerHTML = xhrMain.responseText;
            loaderElement.style.visibility = 'hidden'; 
        }
    }

    xhrMain.send();
}

function chuck() {
    const loaderElement = document.querySelector('.loader');
    loaderElement.style.visibility = 'visible';

    const xhrMain= new XMLHttpRequest;
    xhrMain.open('GET', 'https://api.chucknorris.io/jokes/random?category=science');

    xhrMain.onreadystatechange = function (e) {
        if (xhrMain.readyState === 4 && xhrMain.status >= 200 && xhrMain.status < 400 ) {
            const chuck = JSON.parse(xhrMain.responseText);
            const display = `<img src="${chuck.icon_url}"/> <p>${chuck.value}</p>`;
            document.querySelector('main').innerHTML = display;
            loaderElement.style.visibility = 'hidden'; 
        }
    }
    xhrMain.send();
    }

function pokemon(pokemonURL) {
    if (pokemonURL === undefined ) {
        pokemonURL = 'https://pokeapi.co/api/v2/pokemon/';
    }

    let pokemonUrlSubstr = pokemonURL.replace(/https:\/\/pokeapi.co\/api\/v2\/pokemon\//, '');
    let pokemonUrlParamStr = pokemonUrlSubstr.replace(/\?/, "").split('&');
    let pokemonUrlParamObj = {};
    pokemonUrlParamStr.forEach( (val) => { const list = val.split('='); pokemonUrlParamObj[list[0]] = list[1]; } );

    if (pokemonURL === 'https://pokeapi.co/api/v2/pokemon/') {
            pokemonUrlParamObj = { offset: '0', limit: '20' } ;
        }
        
    const loaderElement = document.querySelector('.loader');
    loaderElement.style.visibility = 'visible';

    const xhrMain = new XMLHttpRequest;
    xhrMain.open('GET', pokemonURL );

    xhrMain.onreadystatechange = function (e) {
        if (xhrMain.readyState === 4 && xhrMain.status >= 200 && xhrMain.status < 400 ) {
            const pokemonObject = JSON.parse(xhrMain.responseText);
            console.log(pokemonObject);
            const pokemonList = [];
            pokemonObject.results.forEach( (item, index) => {pokemonList.push(`<tr> <td>${index + 1 +  Number(pokemonUrlParamObj.offset)}</td><td> ${item.name} </td></tr>`)});
            let pokemonTable = '<table>' + pokemonList.join().replace(/,/g, '') + '</table>';
            if (pokemonUrlParamObj.offset === '0') { 
                pokemonTable += `[ Back ] [ <a href="#" onclick="pokemon('${pokemonObject.next}')">Next</a> ]`;
            } else if (pokemonObject.next === null) {
                let backOffset = (Number(pokemonUrlParamObj.offset) - 20);
                let backLimit = 20;
                pokemonTable += `[ <a href="#" onclick="pokemon('https://pokeapi.co/api/v2/pokemon/?offset=${backOffset.toString()}&limit=${String(backLimit)}')">Back</a> ] [ Next ]`;

            } else {
                let backOffset = (Number(pokemonUrlParamObj.offset) - Number(pokemonUrlParamObj.limit));
                pokemonTable += `[ <a href="#" onclick="pokemon('https://pokeapi.co/api/v2/pokemon/?offset=${backOffset.toString()}&limit=${pokemonUrlParamObj.limit}')">Back</a> ] [ <a href="#" onclick="pokemon('${pokemonObject.next}')">Next</a> ]`;
            }

            document.querySelector('main').innerHTML = pokemonTable;
            loaderElement.style.visibility = 'hidden'; 
        }
    }

xhrMain.send();
}