const search = document.getElementById('search');

async function gettingStateInfo(searchText) {
    try {
        const statesDataList = document.getElementById('states');
        const stateCardHolder = document.getElementById('state-card-holder');

        const statesUrl = 'https://api.sampleapis.com/the-states/the-states';
        const response = await fetch(statesUrl);
        if(response.ok) {
            console.log('url is fine');
        } else {
            console.log('something is wrong with URL');
        }
        const statesData = await response.json();
        
        // находим совпадения в массиве и выводим варианты в строку поиска
        let matches = statesData.filter(state => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return state.name.match(regex);
        });

        if(searchText.length === 0) {
            matches = [];
        }

        const dataListHTML = matches.map(state => {
           return `<option value="${state.name}">`;
        }).join('');

        statesDataList.innerHTML = dataListHTML;

        // поиск нужного штата и вывод информации

        const stateInfo = statesData.find(state => state.name === searchText);

        let stateInfoHTML;

        if(stateInfo) {
            stateInfoHTML = `
                                <div class="state-card" style="background-image: url('${stateInfo.flag}')">
                                    <h2>${stateInfo.name}</h2>
                                    <ul>
                                        <li>capital: ${stateInfo.capital}</li>
                                        <li>largest city: ${stateInfo.largest_city}</li>
                                        <li>population: ${stateInfo.population}</li>
                                    </ul>
                                    <button id="flag-btn">show the flag</button>
                                </div>
                                `
            stateCardHolder.innerHTML = stateInfoHTML;

            // избавляемся от списка, закрывающего карточку штата
            if(stateInfo) {
                statesDataList.innerHTML = '';
            }

            // флаг штата в модальном окне
            const showFlagBtn = document.getElementById('flag-btn');
            let isBigFlagOpen = false;
            const lightboxHolder = document.getElementById('lightbox-holder');
            
            const lightBoxFlagHTML = `
                <div class="lightbox">
                    <div class="image-box">
                        <button class="close-flag-btn">&times;</button>
                        <img id="big-flag" src='${stateInfo.flag}'>
                    </div>
                </div>

            `
            
            showFlagBtn.addEventListener('click', () => {
                lightboxHolder.innerHTML = lightBoxFlagHTML;

                const lightBox = document.querySelector('.lightbox');
                lightBox.addEventListener('click', (e) => {
                    if(e.target !== e.currentTarget) return;
                    closeModalFlag(lightboxHolder, search);
                });

                const closeFlagButton = document.querySelector('.close-flag-btn');
                closeFlagButton.addEventListener('click', () => {
                    closeModalFlag(lightboxHolder, search);
                });

                window.addEventListener('keyup', (e) => {
                    if(e.keyCode === 27) {
                        closeModalFlag(lightboxHolder, search);
                    }
                })
                
            });
            
        }

    } catch (err) {
        console.log(err, "something go wrong")
    }
}

function cleanSearch(text) {
    let cleanText;
    cleanText = text.trim();
    cleanText = cleanText[0].toUpperCase() + cleanText.slice(1).toLowerCase();
    return cleanText;
}

function closeModalFlag(div, input) {
    div.innerHTML = '';
    input.focus();
}

search.addEventListener('input', () => {
    gettingStateInfo(search.value)
});

search.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        let cleanSearchValue = cleanSearch(search.value);
        gettingStateInfo(cleanSearchValue);
    } 
})

search.focus();

