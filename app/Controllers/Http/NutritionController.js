'use strict'
const Helpers = use('Helpers');
const cos = require('ibm-cos-sdk')

const cos_config = {
  endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'NSExMfDxG-9kKJl_0XVkV7JNhZgSSWmtue9VCVp2GyRQ',
  ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
  serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/372c042faa8843aab77320ed7b243158:a63b9ffb-5444-4f58-8c2d-5af9dee9afab::',
};


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

  async upload_to_cos(file) {
    return new Promise(async (resolve, reject) => {
      try {

        const sw_config = {
          Bucket: 'cloud-object-storage-9l-cos-standard-zcp',
          key: Date.now().toString(),
          body: Buffer.from(file)
        }
        const client = new cos.S3(cos_config);
        client.putObject(sw_config, (error, data) => {
          if(error) throw error;
          resolve(data);
        })
      } catch (error) {
        reject(error);
      }
    });
  }

  async index({ request, response, view }) {
    const file = request.file('food_image', {
      types: ['image'],
      size: '2mb'
    });

    console.log(request);

    const client = new cos.S3(cos_config);

    const file_upload = Drive.disk(client).putObject(file);

    await file.move(Helpers.tmpPath('uploads'), {
      name: Date.now() + '.jpg',
      overwrite: true
    });


    if (!file.moved) {
      response.header('Content-type', 'application/json');
      response.status(400).send(file.errors())
    }

    response.header('Content-type', 'application/json');
    response.status(200).send(file_upload)
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
