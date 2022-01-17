import { Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ThemeContext } from 'styled-components';

import { useUserInfo } from '../../../context/UserInfoContext';
import { useDeleteMultiAccessUser } from '../../../endpoints/multiAccess/useDeleteMultiAccessUser';
import { Navigation } from '../../../navigation';
import { TextRegular } from '../../../style/utils';
import GradientButton from '../../GradientButton';
import Hr from '../../Hr';
import KamDeleteIcon from '../../icons/KamDeleteIcon';
import SafeHTMLTranslate from '../../SafeHTMLTranslate';
import Modal from '../Modal';

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
    <Modal className={className} icon={<KamDeleteIcon />} size="large" title={title} onCancel={onClose} {...modalProps}>
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
            <GradientButton variant="outlined" onClick={onClose}>
              {t('global-cancel')}
            </GradientButton>
            {canDelete && (
              <GradientButton
                isLoading={isLoading}
                style={{ background: themeContext.colors.orange }}
                onClick={handleDelete}
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
