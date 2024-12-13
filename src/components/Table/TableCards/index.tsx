import { TableProps } from 'antd/lib/table';

import { S } from './styles';
import { Pagination, TablePaginationConfig } from 'antd';
import { ColumnTitle, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import _ from 'lodash';

export function TableCards<T extends object>(props: TableProps<T>) {
    const { pagination, onChange, dataSource, columns = [], rowKey } = props;

    const renderTitle = (title: ColumnTitle<T>) => {
        if (typeof title === 'function') {
            return <S.Title>{title({})}</S.Title>;
        }

        return <S.Title>{title}</S.Title>;
    };

    const getCardKey = (resource: T) => {
        if (typeof rowKey === 'function') {
            return rowKey(resource) as string;
        }

        return rowKey as string;
    };

    return (
        <S.Container>
            {dataSource?.map((resource, index) => {
                const key = getCardKey(resource);

                return (
                    <S.Card key={key}>
                        {columns.map((column) => (
                            <S.Column key={`${key}-${column.key}`}>
                                {column?.title ? renderTitle(column.title) : null}
                                <S.Content>
                                    {
                                        // @ts-ignore
                                        column?.render
                                            ? (column?.render(
                                                  // @ts-ignore
                                                  column.dataIndex ? _.get(resource, column.dataIndex) : null,
                                                  resource,
                                                  index,
                                              ) as React.ReactNode)
                                            : // @ts-ignore
                                              _.get(resource, column.dataIndex)
                                    }
                                </S.Content>
                            </S.Column>
                        ))}
                    </S.Card>
                );
            })}
            <S.Pagination>
                <Pagination
                    {...pagination}
                    size="small"
                    onChange={(page: number, pageSize: number) => {
                        const paginationConfig: TablePaginationConfig = {
                            ...(pagination ?? {}),
                            current: page,
                            pageSize,
                        };
                        const filtersConfig: Record<string, null> = {};
                        const sorterConfig: SorterResult<T> = {};
                        const extraConfig: TableCurrentDataSource<T> = {} as any;

                        // @ts-ignore
                        onChange(paginationConfig, filtersConfig, sorterConfig, extraConfig);
                    }}
                />
            </S.Pagination>
        </S.Container>
    );
}
