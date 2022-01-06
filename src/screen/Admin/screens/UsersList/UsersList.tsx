import capitalize from 'lodash/capitalize';
import moment from 'moment';
import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import EditUserAdminModal from '../../../../components/Modal/ScreenModal/EditUserAdminModal';
import { useDeleteUser } from '../../../../endpoints/admin/users/useDeleteUser';
import { useGetUsers } from '../../../../endpoints/admin/users/useGetUsers';
import { useUpdateUser } from '../../../../endpoints/admin/users/useUpdateUser';
import Table from '../../../../components/Table';

interface IProps {
  className?: string;
}

export interface IFormattedUser {
  id: string;
  name: string;
  company: string;
  'email / username': string;
  role: string;
  'demo admin': string;
  created: string;
  key: number;
  products: any;
}

const UsersList: FC<IProps> = ({ className }) => {
  const [rowClicked, setRowClicked] = useState<IFormattedUser | null>(null);
  const { data: users, isLoading: getUsersLoading } = useGetUsers();
  const { mutate: deleteUser } = useDeleteUser(rowClicked?.id);
  const { mutate: updateUser } = useUpdateUser(rowClicked?.id);

  const handleDeleteUser = useCallback(() => {
    deleteUser(null);
    setRowClicked(null);
  }, [deleteUser]);

  const handleUpdateUser = useCallback(
    (user) => {
      if (user) {
        updateUser(user);
        setRowClicked(null);
      }
    },
    [updateUser],
  );

  const headerTableUsers = useMemo(() => {
    return ['name', 'company', 'email / username', 'role', 'demo admin', 'created'].map((text) => ({
      title: capitalize(text),
      dataIndex: text,
    }));
  }, []);

  const formattedUsers = useMemo(
    () =>
      (users || []).map((user, index) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        company: user.company,
        'email / username': `${user.username}`,
        role: user.role,
        'demo admin': user.demo ? 'true' : 'false',
        created: moment(user.createdDate).format('DD/MM/YYYY hh:mm'),
        key: index,
      })),
    [users],
  );

  return (
    <div className={className}>
      <Table
        bordered
        columns={headerTableUsers}
        loading={getUsersLoading}
        dataSource={formattedUsers}
        onRow={(record) => ({
          onDoubleClick: () => {
            setRowClicked(record);
          },
        })}
      />

      {rowClicked && (
        <EditUserAdminModal
          userLight={rowClicked}
          deleteUser={handleDeleteUser}
          updateUser={handleUpdateUser}
          toggleModal={() => setRowClicked(null)}
        />
      )}
    </div>
  );
};

export default styled(UsersList)``;
