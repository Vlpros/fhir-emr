import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'production',
    baseURL: 'https://aidbox.fhir-emr.beda.software',
    sdcIdeUrl: 'http://sdc.beda.software',

    webSentryDSN: null,
    mobileSentryDSN: null,

    // TODO: These settings are required
    // TODO: you should manually uncomment them and fill with the correct values
    // baseURL: '',

    // TODO: if you don't need to use sentry for now - you can simply set null as value
    // webSentryDSN: '',
    // mobileSentryDSN: '',
};
