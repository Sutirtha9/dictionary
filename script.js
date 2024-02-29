var word = document.querySelector('#search').value;
var audio;

document.querySelector('form').addEventListener('submit',e =>
{
    e.preventDefault();

    if(isWordValid())
    {
        document.querySelector('.searchPanel').style.marginTop='150px';
        document.querySelector('#wait').style.visibility='visible';
        document.querySelector('.pronouncePanel').style.visibility='hidden';
        document.querySelector('#wait').innerHTML=`Please Wait For A Moment...`;
        fetchMeaning();
    }
    else
    {
        return;
    }
});

document.querySelector('form').addEventListener('keyup',()=>
{
    word = document.querySelector('#search').value;

    isWordValid();
});


async function fetchMeaning()
{
    document.querySelector('.cards').innerHTML='';

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(result => result.json())
    .then(data =>
    {


        if(data.title == null)
        {
            document.querySelector('#wait').style.visibility='hidden';
            document.querySelector('.pronouncePanel').style.visibility='visible';

            document.querySelector('.cards').innerHTML+= `<div id="example" class="card"><h1>EXAMPLES</h1> <ul></ul> </div>`;

            data.forEach(e => 
            {
                e.meanings.forEach(meanings => 
                {
                    var cardExist=false,antoSynoExist=false;

                    document.querySelectorAll('.card').forEach(card =>
                    {
                        if(card.id == meanings.partOfSpeech)
                            cardExist=true;

                        if(card.id == 'antonyms' || card.id == 'synonyms')
                            antoSynoExist=true;
                    });


                    if(!cardExist)
                    {
                        document.querySelector('.cards').innerHTML+=`<div id="${meanings.partOfSpeech}" class="card"><h1>${meanings.partOfSpeech.toUpperCase()}</h1> <ul></ul> </div>`;
                        
                        meanings.definitions.forEach(definitions => 
                        {
                            document.querySelector(`#${meanings.partOfSpeech}`).innerHTML+=`<li>${definitions.definition}</li>`;

                            if(definitions.example != null)
                            {
                                document.querySelector('#example ul').innerHTML+=`<li>${definitions.example}</li>`;
                            }

                            if(document.querySelector('#example ul').innerHTML == '')
                            {
                                document.querySelector('#example ul').innerHTML+=`Nothing Here..`;
                            }
                            
                        });


                        if(!antoSynoExist)
                        {
                            if(meanings.antonyms.length != 0)
                            {
                                document.querySelector('.cards').innerHTML+= `<div id="antonyms" class="card"><h1>ANTONYMS</h1> <ul></ul> </div>`;
                            }
                            meanings.antonyms.forEach(antonym =>
                            {
                                if(antonym != null)
                                {
                                    document.querySelector('#antonyms ul').innerHTML+=`<li>${antonym}</li>`;
                                }

                            });

                            if(meanings.synonyms.length != 0)
                            {
                                document.querySelector('.cards').innerHTML+= `<div id="synonyms" class="card"><h1>SYNONYMS</h1> <ul></ul> </div>`;
                            }
                        }
                        meanings.synonyms.forEach(synonym =>
                        {
                            if(synonym != null)
                                document.querySelector('#synonyms ul').innerHTML+=`<li>${synonym}</li>`;
                        });
                    }

                });
            });
            
            // For Pronounce Panel
            var flag=false;

            data[0].phonetics.forEach(phonetics => 
            {
                if(phonetics.audio != null && flag == false)
                {
                    document.querySelector('.pronouncePanel h1 i').innerHTML=phonetics.text;
                    audio = new Audio(`${phonetics.audio}`);
                    flag=true;

                }
            });
            document.querySelector('.pronouncePanel ion-icon').addEventListener('click',()=>
            {
                audio.play();
            });
        }
        else
        {
            document.querySelector('#wait').innerHTML=`<ion-icon name="close-circle"></ion-icon> Sorry Pal, We Couldn't Find Definitions For The Word You Were Looking For...`;
            document.querySelector('.pronouncePanel').style.visibility='hidden';
        }
    });

}



function isWordValid()
{
    const pattern = "[^A-Za-z ]";

    if (word == '')
    {
        document.querySelector('#error').innerText = `Please Enter A Word!`;
        document.querySelector('#error').style.visibility='visible';
        return false;
    }
    else
    {
        if(word.length < 2)
        {
            document.querySelector('#error').innerText = `Word Is Too Short!`;
            document.querySelector('#error').style.visibility='visible';
            return false;
        }
        else
        {
            if (word.match(pattern))
            {
                document.querySelector('#error').innerText = `Invalid Word!`;
                document.querySelector('#error').style.visibility='visible';
                return false;
            }
            else
            {
                document.querySelector('#error').style.visibility='hidden';
                return true;
            }
        }
    }
}