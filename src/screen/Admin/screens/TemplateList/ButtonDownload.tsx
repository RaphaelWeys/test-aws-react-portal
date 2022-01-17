import { Button } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useDownloadDocument } from '../../../../endpoints/admin/template/useDownloadDocument';
import { getCorrectBackend } from '../../../../utils';

interface IProps {
  app: string;
  filename: string;
  action: string;
  isTemplateSaved: boolean;
}

const ButtonDownload: FC<IProps> = ({ app, filename, action, isTemplateSaved }) => {
  const [t] = useTranslation();
  const { refetch: downloadDocument } = useDownloadDocument(app, filename);
  const baseUrl = getCorrectBackend(app);

  const handleClickDownload = () => {
    if (action === 'generatePdf') {
      window.location.assign(`${baseUrl}/template/download/pdf/${filename}`);
    } else {
      downloadDocument();
    }
  };

  return (
    <Button disabled={!filename || !isTemplateSaved} onClick={handleClickDownload}>
      {t('global-download')}
    </Button>
  );
};

export default ButtonDownload;
