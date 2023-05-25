import { service } from 'fhir-react';

import config from 'shared/src/config';

import { getToken } from './auth';

export async function generateQuestionnaire(prompt: string, questionnaire?: string) {
    const appToken = getToken();

    return await service<any>({
        baseURL: config.aiQuestionnaireBuilderUrl,
        url: `/questionnaire`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}

export async function generateMapper(questionnaire: string, resource: string) {
    const appToken = getToken();

    return await service<any>({
        baseURL: config.aiQuestionnaireBuilderUrl,
        url: `/mapper`,
        method: 'POST',
        data: { questionnaire, resource },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}
