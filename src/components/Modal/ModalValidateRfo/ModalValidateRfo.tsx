import { message, Space } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { useGeneratePDF } from '../../../endpoints/admin/rfos/useGeneratePDF';
import { useUpdateRfo } from '../../../endpoints/admin/rfos/useUpdateRfo';
import { useValidateRfo } from '../../../endpoints/admin/rfos/useValidateRfo';
import { Rfo, RfoDetailFiles } from '../../../interface/rfo';
import CommonButton from '../../CommonButton';
import UploadButton from '../../UploadButton';
import Modal from '../Modal';
import ModalPending from '../ModalPending';

type IProps = {
  className?: string;
  rfo: Rfo;
  onClose: () => void;
} & ModalProps;

const RFO_STATE = {
  edit: 'edit',
  tosend: 'tosend',
  sent: 'sent',
  completed: 'completed',
};

const ModalValidateRfo: FC<IProps> = ({ className, rfo, onClose, ...modalProps }) => {
  const [t] = useTranslation();
  const [canSendToSuppliers, setCanSendToSuppliers] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { mutate: updateRfo } = useUpdateRfo(rfo.id);
  const { mutate: validateRfo, isLoading: validateRfoLoading } = useValidateRfo();
  const { mutate: generatePdf, isLoading: generatePDFLoading } = useGeneratePDF();

  const cervedScoreIsAvailable = useCallback((rfoItem: Rfo) => {
    // Check if companies are present and score is defined for each company
    if (!rfoItem.companies.length) return false;

    return rfoItem.companies.every(
      (company) => company.cervedScore && company.cervedScore.score > 0 && company.cervedScore.fake !== true,
    );
  }, []);

  const volumeFileDownloadUrl = useCallback(
    (rfoItem: Rfo, file) =>
      `${process.env.REACT_APP_BACKEND_TENDER_URL}/rfo-operation/volume/file/download/${rfoItem.id}/${file.filename}`,
    [],
  );

  const excelFileDownloadUrl = useCallback((rfoItem: Rfo, file) => {
    const backend = process.env.REACT_APP_BACKEND_TENDER_URL;

    return `${backend}/rfo-operation/multisite/file/download/${rfoItem.id}/${file.filename}`;
  }, []);

  const canEditSupplierFiles = useCallback(
    (rfoItem) => rfoItem.state === RFO_STATE.sent && !rfoItem.sentToSuppliers,
    [],
  );

  const onUploadFilesChanged = useCallback((info: UploadChangeParam) => {
    setCanSendToSuppliers(!!info.fileList.length);
    setFileList(info.fileList);

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }, []);

  const handleOnRemove = useCallback(
    (file: UploadFile) => {
      const index = fileList.findIndex((item) => item.fileName === file.fileName);
      const tmpFiles = [...fileList];

      tmpFiles.splice(index, 1);
      setFileList(tmpFiles);
    },
    [fileList],
  );

  const sendToSuppliers = useCallback(() => {
    const volumeCheckedFiles: RfoDetailFiles[] = fileList.map((file) => ({
      complete: true,
      lastModifiedDate: file.lastModifiedDate,
      name: file.name,
      size: file.size,
      type: file.type,
      filename: file.response.filename,
    }));

    updateRfo(
      { ...rfo, volumeCheckedFiles },
      {
        onSuccess() {
          validateRfo(rfo.id, {
            onSuccess() {
              onClose();
            },
          });
        },
      },
    );
  }, [fileList, rfo, updateRfo, validateRfo, onClose]);

  const generatePDF = useCallback(() => {
    generatePdf(rfo.id, {
      onSuccess() {
        onClose();
      },
    });
  }, [generatePdf, rfo.id, onClose]);

  useEffect(() => {
    if (fileList.length > 0) {
      setCanSendToSuppliers(true);
    } else setCanSendToSuppliers(false);
  }, [setCanSendToSuppliers, fileList.length]);

  return (
    <Modal
      className={className}
      footer={false}
      getContainer={false}
      size="large"
      title={`${rfo.name} - ${rfo.reference} - V${rfo.version}`}
      onCancel={onClose}
      {...modalProps}
    >
      <h4>Cerved Score</h4>
      {rfo.companies.map((company) => (
        <div key={company.fiscalId}>
          <span>
            {company.name} - {company.fiscalId} - Score: {company && company.cervedScore && company.cervedScore.score}
          </span>
          {company && company.cervedScore && company.cervedScore.fake && <span>Score is fake (demo)</span>}
        </div>
      ))}
      {cervedScoreIsAvailable(rfo) && <div className="correct">Every company have a real score</div>}
      {!cervedScoreIsAvailable(rfo) && (
        <div className="error">Score is missing or demo, do not send to supplier!!!</div>
      )}

      {rfo.multisite?.isMultisite && (
        <>
          <h4>Multisite</h4>
          <div key={rfo.multisite.excelFile?.name}>
            <a href={excelFileDownloadUrl(rfo, rfo.multisite.excelFile)}>{rfo.multisite.excelFile?.name}</a>
          </div>
        </>
      )}

      <h4>Client volume files</h4>
      {rfo.volumeUserFiles.map((file) => (
        <div key={file.name}>
          <a href={volumeFileDownloadUrl(rfo, file)}>{file.name}</a>
        </div>
      ))}

      <h4>Suppliers volume files</h4>
      {canEditSupplierFiles(rfo) && (
        <div>
          <UploadButton
            action={`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfo-operation/volume/file/upload/${rfo.id}`}
            label={t('page-rfo-page-site-volumes-upload-title')}
            onChange={onUploadFilesChanged}
            onRemove={handleOnRemove}
          />
          <br />
          <CommonButton disabled={!canSendToSuppliers} onClick={sendToSuppliers}>
            Save & send to suppliers
          </CommonButton>
        </div>
      )}

      <hr />
      <br />
      <Space>
        <CommonButton onClick={() => onClose()}>Close</CommonButton>
        <CommonButton onClick={generatePDF}>Re-generate all RFO PDF</CommonButton>
      </Space>

      {validateRfoLoading && <ModalPending content="Sending to suppliers, please wait..." />}
      {generatePDFLoading && <ModalPending content="Generating PDF files, please wait..." />}
    </Modal>
  );
};

export default styled(ModalValidateRfo)`
  ${({ theme: { colors } }) => css`
    .correct {
      color: ${colors.green};
      font-weight: bold;
    }
    .error {
      color: ${colors.orange};
      font-weight: bold;
    }

    h4 {
      font-family: 'Fira Sans', sans-serif;
      color: ${colors.baseColor};
      margin-bottom: 0.5em;
      font-weight: 600;
      font-size: 1.3rem;
      margin-top: 1.25em;
    }
  `}
`;
