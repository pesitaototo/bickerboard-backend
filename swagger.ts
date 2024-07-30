import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Bickerboard API Documentation',
    description: 'Bickerboard backend API documentation'
  },
  host: 'localhost:3001',
  // servers: [
  //   {
  //     url: 'http://localhost:3001/api/topics',
  //     description: ''
  //   },
  // ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{
    bearerAuth: [] // apply globally
  }]
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);