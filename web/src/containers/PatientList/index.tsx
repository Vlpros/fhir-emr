import { PageHeader, Button, Table, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isLoading, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Patient } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { BaseLayout } from 'src/components/BaseLayout';
import { ModalNewPatient } from 'src/components/ModalNewPatient';

const columns: ColumnsType<Patient> = [
    {
        title: 'Пациент',
        dataIndex: 'name',
        key: 'name',
        render: (_text, resource) => renderHumanName(resource.name?.[0]),
    },
    {
        title: 'Дата рождения',
        dataIndex: 'birthDate',
        key: 'birthDate',
        render: (_text, resource) => {
            console.log(resource.birthDate);
            return resource.birthDate;
        },
    },
    {
        title: 'СНИЛС',
        dataIndex: 'identifier',
        key: 'identifier',
        render: (_text, resource) => {
            console.log(resource.identifier?.[0].value);
            return resource.identifier?.[0].value;
        },
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, resource) => {
            return (
                <Button type="link" block>
                    Редактировать
                </Button>
            );
        },
    },
];

export function PatientList() {
    const [patientsResponse] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Patient>('Patient', {}),
            (bundle) => extractBundleResources(bundle).Patient,
        ),
    );

    return (
        <BaseLayout bgHeight={281}>
            <PageHeader title="Пациенты" extra={[<ModalNewPatient />]} />
            <div
                style={{
                    position: 'relative',
                    padding: 16,
                    height: 64,
                    borderRadius: 10,
                    backgroundColor: '#C0D4FF',
                    marginBottom: 36,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Input.Search placeholder="Найти пациента" style={{ width: 264 }} />
                <Button>Сбросить</Button>
            </div>
            <Table<Patient>
                rowKey={(p) => p.id!}
                dataSource={isSuccess(patientsResponse) ? patientsResponse.data : []}
                columns={columns}
                loading={isLoading(patientsResponse)}
            />
        </BaseLayout>
    );
}
