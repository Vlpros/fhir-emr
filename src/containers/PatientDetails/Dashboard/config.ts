import { Patient } from 'fhir/r4b';
import moment from 'moment';

import { formatFHIRDate } from '@beda.software/fhir-react';

import { DashboardInstance } from 'src/components/Dashboard/types';
import {
    prepareActivitySummary,
    prepareAllergies,
    prepareConditions,
    prepareConsents,
    prepareImmunizations,
    prepareMedications,
    prepareServiceRequest,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/prepare';
import { CreatinineDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashboardContainer';
import { GeneralInformationDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';

export const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: GeneralInformationDashboardContainer,
        },
        {
            query: {
                resourceType: 'ServiceRequest',
                search: (patient: Patient) => ({
                    subject: patient.id,
                }),
            },
            widget: StandardCardContainerFabric(prepareServiceRequest),
        },
    ],
    left: [
        {
            query: {
                resourceType: 'AllergyIntolerance',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    _sort: ['-_date'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareAllergies),
        },
        {
            query: {
                resourceType: 'Condition',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    _sort: ['-_recorded-date'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareConditions),
        },
        {
            query: {
                resourceType: 'Observation',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    status: 'final',
                    code: 'activity-summary',
                    date: `ge${formatFHIRDate(moment().subtract(6, 'days'))}`,
                }),
            },
            widget: StandardCardContainerFabric(prepareActivitySummary),
        },
        {
            query: {
                resourceType: 'MedicationStatement',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    _sort: ['-_lastUpdated'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareMedications),
        },
    ],
    right: [
        {
            query: {
                resourceType: 'Immunization',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    _sort: ['-_date'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareImmunizations),
        },
        {
            query: {
                resourceType: 'Consent',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    status: 'active',
                    _sort: ['-_lastUpdated'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareConsents),
        },
    ],
    bottom: [],
};
