"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_REGION = exports.COGNITO_USER_POOL_ID = exports.COGNITO_APP_SECRET_HASH = exports.COGNITO_APP_CLIENT_ID = void 0;
exports.COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID ? process.env.COGNITO_APP_CLIENT_ID : '';
exports.COGNITO_APP_SECRET_HASH = process.env.COGNITO_APP_SECRET_HASH ? process.env.COGNITO_APP_SECRET_HASH : '';
exports.COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID ? process.env.COGNITO_USER_POOL_ID : '';
exports.AWS_REGION = 'us-east-1';
