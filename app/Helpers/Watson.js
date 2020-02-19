'use strict';

const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    authenticator: new IamAuthenticator({
        apikey: Env.get('IBM_API_KEY'),
    }),
    url: Env.get('IBM_URL'),
});

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