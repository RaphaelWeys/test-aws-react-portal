import React, { FC } from 'react';
import { ThemeContext } from 'styled-components';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';

import Modal from '../Modal';
import { TextRegular } from '../../../style/utils';
import Hr from '../../Hr';
import GradientButton from '../../GradientButton';
import SafeHTMLTranslate from '../../SafeHTMLTranslate';
import { useUserInfo } from '../../../context/UserInfoContext';
import { useHistory } from 'react-router';
import { useDeleteMultiAccessUser } from '../../../endpoints/multiAccess/useDeleteMultiAccessUser';
import KamDeleteIcon from '../../icons/KamDeleteIcon';
import { Navigation } from '../../../navigation/index';

interface Props {
  className?: string;
  onClose: () => void;
  canDelete: boolean;
  companyName: string;
  firstName: string;
  lastName: string;
  userId: string;
}

const ModalDeleteMultiAccess: FC<Props> = ({
  className,
  onClose,
  canDelete,
  companyName,
  firstName,
  lastName,
  userId,
  ...modalProps
}) => {
  const [t] = useTranslation();
  const { mutate: deleteUser, isLoading } = useDeleteMultiAccessUser();
  const { userInfo } = useUserInfo();
  const themeContext = React.useContext(ThemeContext);
  const history = useHistory();

  const title = React.useMemo(() => {
    if (userInfo.role === 'kam') {
      return `${companyName} - ${firstName} ${lastName}`;
    }
    return `${firstName} ${lastName}`;
  }, [companyName, firstName, lastName, userInfo.role]);

  const handleDelete = React.useCallback(() => {
    deleteUser(
      { id: userId },
      {
        onSuccess() {
          history.push(Navigation.MULTI_ACCESS);
        },
      },
    );
  }, [deleteUser, history, userId]);

  return (
    <Modal className={className} size="large" onCancel={onClose} icon={<KamDeleteIcon />} title={title} {...modalProps}>
      <Space direction="vertical" size={25}>
        <div>
          <TextRegular>
            {!canDelete ? (
              <SafeHTMLTranslate template={`modal-delete-multi-access-is-not-deletable-${userInfo.role}-info`} />
            ) : (
              <SafeHTMLTranslate template={`modal-delete-multi-access-is-deletable-${userInfo.role}-info`} />
            )}
          </TextRegular>

          <Hr />

          <Space size="middle">
            <GradientButton onClick={onClose} variant="outlined">
              {t('global-cancel')}
            </GradientButton>
            {canDelete && (
              <GradientButton
                style={{ background: themeContext.colors.orange }}
                onClick={handleDelete}
                isLoading={isLoading}
              >
                {t('modal-delete-multi-access-delete-account-btn')}
              </GradientButton>
            )}
          </Space>
        </div>
      </Space>
    </Modal>
  );
};

export default ModalDeleteMultiAccess;
