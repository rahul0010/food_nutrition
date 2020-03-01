'use strict';



const classifyParams = {
    url: 'https://ibm.biz/Bd2NPs',
    classifierIds: ['food'],
};

visualRecognition.classify(classifyParams)
    .then(response => {
        const classifiedImages = response.result;
        console.log(JSON.stringify(classifiedImages, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
    });