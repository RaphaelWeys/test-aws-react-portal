import { Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ThemeContext } from 'styled-components';

import { useDeleteGroup } from '../../../endpoints/groups/useDeleteGroup';
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
  groupId: string;
  title: string;
}

const ModalDeleteGroup: FC<Props> = ({ className, onClose, title, groupId, ...modalProps }) => {
  const [t] = useTranslation();
  const { mutate: deleteGroup, isLoading } = useDeleteGroup(groupId);
  const themeContext = React.useContext(ThemeContext);
  const history = useHistory();

  const handleDelete = React.useCallback(() => {
    deleteGroup(null, {
      onSuccess() {
        history.push(Navigation.GROUP_LIST);
      },
    });
  }, [deleteGroup, history]);

  return (
    <Modal className={className} icon={<KamDeleteIcon />} size="large" title={title} onCancel={onClose} {...modalProps}>
      <Space direction="vertical" size={25}>
        <div>
          <TextRegular>
            <SafeHTMLTranslate template="modal-delete-multi-access-group-description" />
          </TextRegular>

          <Hr />

          <Space size="middle">
            <GradientButton variant="outlined" onClick={onClose}>
              {t('global-cancel')}
            </GradientButton>
            <GradientButton
              isLoading={isLoading}
              style={{ background: themeContext.colors.orange }}
              onClick={handleDelete}
            >
              {t('modal-delete-multi-access-group-valid-btn')}
            </GradientButton>
          </Space>
        </div>
      </Space>
    </Modal>
  );
};

export default ModalDeleteGroup;
