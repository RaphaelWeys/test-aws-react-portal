import {
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DeleteTwoTone,
  EditTwoTone,
  SendOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Popconfirm, Space } from 'antd';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import HorizontalNavigation from '../../../../components/HorizontalNavigation';
import InvisibleButton from '../../../../components/InvisibleButton';
import ModalValidateRfo from '../../../../components/Modal/ModalValidateRfo';
import Select from '../../../../components/Select';
import Table from '../../../../components/Table';
import { useDeleteRfo } from '../../../../endpoints/admin/rfos/useDeleteRfo';
import { useGetRfos } from '../../../../endpoints/admin/rfos/useGetRfos';
import { i18nRfoState } from '../../../../i18n/utils';
import { Rfo } from '../../../../interface/rfo';

interface IProps {
  className?: string;
}

const stateRfo = {
  list: 'list',
  edit: 'To complete',
  tosend: 'To submit',
  sent: 'Submitted',
  completed: 'Completed',
} as const;

const filterValues = [
  { label: 'Check volumes before sending to suppliers', value: 'tocheck', key: '0' },
  { label: 'All', value: 'all', key: '1' },
];

const RfoList: FC<IProps> = ({ className }) => {
  const [t] = useTranslation();
  const [filter, setFilter] = useState(filterValues[0].value);
  const { data: rfos, isLoading: getRfosLoading } = useGetRfos(filter);
  const { mutate: deleteRfo } = useDeleteRfo();
  const [selectedRfo, setSelectedRfo] = useState<Rfo>();

  const navigationValue = useMemo(
    () => [
      { icon: <UnorderedListOutlined />, key: stateRfo.list, title: t('rfostate-all') },
      { icon: <CheckCircleOutlined />, key: stateRfo.edit, title: t('rfostate-edit') },
      { icon: <ClockCircleOutlined />, key: stateRfo.tosend, title: t('rfostate-tosend') },
      { icon: <SendOutlined />, key: stateRfo.sent, title: t('rfostate-sent') },
      { icon: <CheckOutlined />, key: stateRfo.completed, title: t('rfostate-completed') },
    ],
    [t],
  );
  const [categoryTable, setCategoryTable] = useState<string>(navigationValue[0].key);

  const headerTableI18n = useMemo(() => {
    return [
      t('label-reference'),
      t('label-version'),
      t('label-name'),
      t('label-energy'),
      t('label-rfoState'),
      t('label-rfoDate'),
      'actions',
    ];
  }, [t]);

  const headerTable = useMemo(
    () =>
      headerTableI18n.map((key) => ({
        title: key !== 'arrow' && <div>{capitalize(key)}</div>,
        dataIndex: key,
        key,
      })),
    [headerTableI18n],
  );

  const rfoDate = useCallback(
    (item) => {
      const date = item.offerResponseDate;
      if (date) {
        return moment(date).format(t('format-dateTime'));
      }
      return '';
    },
    [t],
  );

  const handleDeleteRfo = useCallback(
    (rfoId: string) => {
      deleteRfo(rfoId, {
        onSuccess() {
          setSelectedRfo(undefined);
        },
      });
    },
    [deleteRfo],
  );

  const dataTable = useMemo(
    () =>
      (rfos || []).map((rfo, index) => ({
        [headerTableI18n[0]]: rfo.reference,
        [headerTableI18n[1]]: rfo.version,
        [headerTableI18n[2]]: rfo.name,
        [headerTableI18n[3]]: rfo.energy,
        [headerTableI18n[4]]: i18nRfoState(rfo.state),
        [headerTableI18n[5]]: rfoDate(rfo),
        actions: (
          <Space>
            <InvisibleButton
              onClick={() => {
                setSelectedRfo(rfo);
              }}
            >
              <EditTwoTone style={{ fontSize: '18px' }} />
            </InvisibleButton>
            <Popconfirm
              title="Are you sure you want to delete it ?"
              onConfirm={() => handleDeleteRfo(rfo.id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Popconfirm>
          </Space>
        ),

        key: index,
      })),
    [rfos, headerTableI18n, rfoDate, handleDeleteRfo],
  );

  const filteredData = useMemo(
    () =>
      dataTable.filter((data) => {
        if (categoryTable === stateRfo.list) return true;

        return categoryTable === data.State;
      }),
    [dataTable, categoryTable],
  );

  return (
    <div className={className}>
      <Select items={filterValues} value={filterValues[0].value} onChange={setFilter} />

      <HorizontalNavigation
        menuItemProps={navigationValue}
        defaultValue={categoryTable}
        customOnClick={setCategoryTable}
      />

      <Table columns={headerTable} dataSource={filteredData} bordered size="small" loading={getRfosLoading} />

      {selectedRfo && <ModalValidateRfo visible rfo={selectedRfo} onClose={() => setSelectedRfo(undefined)} />}
    </div>
  );
};

export default styled(RfoList)``;
