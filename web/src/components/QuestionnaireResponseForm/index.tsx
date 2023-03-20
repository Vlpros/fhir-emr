import { notification } from 'antd';
import _ from 'lodash';
import {
    FormItems,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    mapFormToResponse,
} from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isFailure, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { saveFHIRResource, updateFHIRResource } from 'aidbox-react/lib/services/fhir';
import { formatError } from 'aidbox-react/lib/utils/error';

import {
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
    useQuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';

import { Spinner } from '../Spinner';

interface Props extends QuestionnaireResponseFormProps {
    onSuccess?: (resource: any) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;
}

export const saveQuestionnaireResponseDraft = async (
    questionnaireId: string,
    formData: QuestionnaireResponseFormData,
    currentFormValues: FormItems,
) => {
    const isCreating = formData.context.questionnaireResponse.id === undefined;
    const transformedFormValues = mapFormToResponse(
        currentFormValues,
        formData.context.questionnaire,
    );

    const questionnaireResponse = {
        id: formData.context.questionnaireResponse.id,
        item: transformedFormValues.item,
        questionnaire: isCreating ? questionnaireId : formData.context.questionnaire.assembledFrom,
        resourceType: formData.context.questionnaireResponse.resourceType,
        source: formData.context.questionnaireResponse.source,
        status: 'in-progress',
        authored: new Date().toISOString(),
    };

    const response = isCreating
        ? await saveFHIRResource(questionnaireResponse)
        : await updateFHIRResource(questionnaireResponse);

    if (isSuccess(response)) {
        formData.context.questionnaireResponse.id = response.data.id;
    }
    if (isFailure(response)) {
        console.error('Error saving a draft: ', response.error);
    }

    return response;
};

export function useQuestionnaireResponseForm(props: Props) {
    const { response, handleSave } = useQuestionnaireResponseFormData(props);
    const { onSuccess, onFailure, readOnly, initialQuestionnaireResponse, onCancel } = props;

    const onSubmit = async (formData: QuestionnaireResponseFormData) => {
        const modifiedFormData = _.merge({}, formData, {
            context: {
                questionnaireResponse: {
                    questionnaire: initialQuestionnaireResponse?.questionnaire,
                },
            },
        });

        delete modifiedFormData.context.questionnaireResponse.meta;

        const saveResponse = await handleSave(modifiedFormData);

        if (isSuccess(saveResponse)) {
            if (saveResponse.data.extracted) {
                if (onSuccess) {
                    onSuccess(saveResponse.data);
                } else {
                    notification.success({
                        message: 'Form successfully saved',
                    });
                }
            } else {
                if (onFailure) {
                    onFailure('Error while extracting');
                } else {
                    notification.error({ message: 'Error while extracting' });
                }
            }
        } else {
            if (onFailure) {
                onFailure(saveResponse.error);
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        }
    };

    return { response, onSubmit, readOnly, onCancel };
}

export function QuestionnaireResponseForm(props: Props) {
    const { response, onSubmit, readOnly, onCancel } = useQuestionnaireResponseForm(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(formData) => (
                <BaseQuestionnaireResponseForm
                    formData={formData}
                    onSubmit={onSubmit}
                    readOnly={readOnly}
                    onCancel={onCancel}
                    {...props}
                />
            )}
        </RenderRemoteData>
    );
}
