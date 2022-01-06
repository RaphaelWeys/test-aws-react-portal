import React, { FC, useCallback, useEffect } from 'react';
import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { UploadChangeParam } from 'antd/lib/upload';

import { Step } from '../SignatureRfo.styled';
import UploadButton from '../../../components/UploadButton/UploadButton';
import TextArea from '../../../components/Input/TextArea/TextArea';
import CommonButton from '../../../components/CommonButton/CommonButton';
import useRequest from '../../../hooks/useRequest';
import { optionsUpdateSignaturePack } from '../../../endpoints/signature';

interface Props {
  packId: string;
  getSignaturePack: () => void;
}

interface Form {
  documents: any[];
  message: string;
}

const NoDocument: FC<Props> = ({ packId, getSignaturePack }) => {
  const [t] = useTranslation();
  const { request: updatePack, isPending } = useRequest(optionsUpdateSignaturePack());
  const { handleSubmit, control, setValue, register, errors, watch } = useForm<Form>();
  const documents = watch('documents');

  useEffect(() => {
    register({ name: 'message' });
    register(
      { name: 'documents' },
      {
        validate: (value) => {
          if (!value || value?.length === 0) return 'global-field-upload-required';

          return undefined;
        },
      },
    );
  }, [register]);

  const beforeUpload = useCallback(
    (file) => (file.type === 'application/pdf' ? Promise.resolve() : Promise.reject()),
    [],
  );

  const handleChangeUploadButton = useCallback(
    (info: UploadChangeParam) => {
      if (info.file.status === 'done') {
        setValue('documents', [...info.fileList], { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleOnRemove = useCallback(
    (file) => {
      const findexFile = documents.findIndex((item) => item.uid === file.uid);
      const tmpFileList = [...documents];
      tmpFileList.splice(findexFile, 1);

      setValue('documents', tmpFileList);
    },
    [setValue, documents],
  );

  const onSubmit = useCallback(
    (data) => {
      updatePack({
        data: {
          documents: data.documents.map((doc: any) => doc.response),
          message: data.message,
          id: packId,
        },
      }).then(() => {
        getSignaturePack();
      });
    },
    [packId, getSignaturePack, updatePack],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Space direction="vertical" size="middle">
        <Space direction="vertical">
          <Row>
            <Col>
              <h2>{t('signature-rfo-documents')}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>{t('signature-rfo-documents-description')}</div>
            </Col>
          </Row>
        </Space>
        <Space direction="vertical" style={{ width: '65%' }}>
          <Row>
            <Col>
              <Step>1. {t('signature-rfo-documents-one')}</Step>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <UploadButton
                label={t('signature-rfo-upload-label')}
                action={`${process.env.REACT_APP_BACKEND_PORTAL_URL}/signature/docSupplier/upload/${packId}`}
                onChange={handleChangeUploadButton}
                onRemove={handleOnRemove}
                beforeUpload={beforeUpload}
                error={errors.documents?.[0]}
                multiple
                accept=".pdf"
              />
            </Col>
          </Row>
        </Space>
        <Space direction="vertical" style={{ width: '65%' }}>
          <Row>
            <Col>
              <Step>2. {t('signature-rfo-documents-two')}</Step>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Controller
                as={TextArea}
                control={control}
                error={errors.message}
                name="message"
                autoSize={{ minRows: 5, maxRows: 5 }}
              />
            </Col>
          </Row>
          <CommonButton
            htmlType="submit"
            type="primary"
            disabled={!documents || documents?.length === 0}
            loading={isPending}
          >
            {t('signature-rfo-send-document-btn')}
          </CommonButton>
        </Space>
      </Space>
    </form>
  );
};

export default NoDocument;
