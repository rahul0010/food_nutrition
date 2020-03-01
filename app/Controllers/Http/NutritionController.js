'use strict'
const Helpers = use('Helpers');
const cloudniary = require('cloudinary').v2;
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const Env = use('Env');

const cloud_config = {
  cloud_name: 'bhavans',
  api_key: '767655656278485',
  api_secret: '1E9_EXuO0YDyGZ1Ak6uJU0NDVkk'
}



/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with nutritions
 */
class NutritionController {
  /**
   * Show a list of all nutritions.
   * GET nutritions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async upload_to_cloud(file) {
    return new Promise(async (resolve, reject) => {
      try {
        cloudniary.config(cloud_config);
        const response = await cloudniary.uploader.upload(file.tmpPath);
        // console.log(response);
        resolve(response.secure_url);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  async get_watson_data(url) {
    return new Promise(async (resolve, reject) => {
      const visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        authenticator: new IamAuthenticator({
          apikey: Env.get('IBM_API_KEY'),
        }),
        url: Env.get('IBM_URL'),
      });

      const classifyParams = {
        url,
        classifierIds: ['food'],
      };

      visualRecognition.classify(classifyParams)
        .then(response => {
          const classifiedImages = response.result;
          // console.log(JSON.stringify(classifiedImages, null, 2));
          resolve(classifiedImages);
        })
        .catch(err => {
          console.log('error:', err);
          reject(err);
        });
    });
  }


  async index({ request, response, view }) {
    console.log('Uploading');
    const file = request.file('food_image', {
      types: ['image'],
      size: '2mb'
    });

    // await file.move(Helpers.tmpPath('uploads'), {
    //   name: Date.now() + '.jpg',
    //   overwrite: true
    // });

    const file_link = await this.upload_to_cloud(file);

    const image_results = await this.get_watson_data(file_link);

    // console.log(image_results);

    if (!file.moved) {
      response.header('Content-type', 'application/json');
      response.status(400).send(file.errors())
    }

    response.header('Content-type', 'application/json');
    response.status(200).send({ file_link, image_results });
  }

  /**
   * Render a form to be used for creating a new nutrition.
   * GET nutritions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new nutrition.
   * POST nutritions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single nutrition.
   * GET nutritions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing nutrition.
   * GET nutritions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update nutrition details.
   * PUT or PATCH nutritions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a nutrition with id.
   * DELETE nutritions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = NutritionController
