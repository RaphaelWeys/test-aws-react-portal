import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';
import capitalize from 'lodash/capitalize';
import React, { FC, useCallback, useMemo, useState } from 'react';

import InvisibleButton from '../../../../components/InvisibleButton';
import ModalEditSupplier from '../../../../components/Modal/ModalEditSupplier';
import Table from '../../../../components/Table';
import { useDeleteSupplier } from '../../../../endpoints/admin/suppliers/useDeleteSupplier';
import { useGetSuppliers } from '../../../../endpoints/admin/suppliers/useGetSuppliers';
import { Supplier } from '../../../../interface/supplier';

interface IProps {
  className?: string;
}

const SuppliersList: FC<IProps> = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [showModal, setShowModal] = useState(false);
  const { data: suppliers, isLoading: getSuppliersLoading } = useGetSuppliers();
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const handleCancelModal = useCallback(() => {
    setSelectedSupplier(undefined);
    setShowModal(false);
  }, [setShowModal, setSelectedSupplier]);

  const handleDeleteSupplier = useCallback(
    (supplierId) => {
      deleteSupplier(supplierId, {
        onSuccess() {
          handleCancelModal();
        },
      });
    },
    [deleteSupplier, handleCancelModal],
  );

  const headerI18n = useMemo(() => ['Supplier name', 'Country', 'Language', 'Demo', 'actions'], []);

  const headerColumn = useMemo(
    () =>
      headerI18n.map((key) => ({
        title: key !== 'actions' && <div>{capitalize(key)}</div>,
        dataIndex: key,
      })),
    [headerI18n],
  );

  const dataSource = useMemo(
    () =>
      (suppliers || []).map((supplier) => ({
        [headerI18n[0]]: supplier.name,
        [headerI18n[1]]: supplier.country,
        [headerI18n[2]]: supplier.language,
        [headerI18n[3]]: supplier.demo && 'Demo',
        actions: (
          <Space>
            <InvisibleButton
              data-testid="submit-btn"
              type="submit"
              onClick={() => {
                setSelectedSupplier(supplier);
              }}
            >
              <EditTwoTone style={{ fontSize: '18px' }} />
            </InvisibleButton>
            <Popconfirm
              cancelText="No"
              okText="Yes"
              title="Are you sure you want to delete it ?"
              onConfirm={() => handleDeleteSupplier(supplier.id)}
            >
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Popconfirm>
          </Space>
        ),
      })),
    [suppliers, headerI18n, handleDeleteSupplier],
  );

  return (
    <div>
      <Button style={{ marginBottom: 16 }} type="primary" onClick={() => setShowModal(true)}>
        Add a supplier
      </Button>

      <Table bordered columns={headerColumn} dataSource={dataSource} loading={getSuppliersLoading} size="small" />

      {(showModal || selectedSupplier) && (
        <ModalEditSupplier
          visible
          customCancel={handleCancelModal}
          handleOnSuccess={handleCancelModal}
          selectedSupplier={selectedSupplier}
          onCancel={handleCancelModal}
        />
      )}
    </div>
  );
};

export default SuppliersList;
