import { Col, Row, Space } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { FC, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CommonButton from '../../../components/CommonButton/CommonButton';
import TextArea from '../../../components/Input/TextArea/TextArea';
import UploadButton from '../../../components/UploadButton/UploadButton';
import { optionsUpdateSignaturePack } from '../../../endpoints/signature';
import useRequest from '../../../hooks/useRequest';
import { Step } from '../SignatureRfo.styled';

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
                multiple
                accept=".pdf"
                action={`${process.env.REACT_APP_BACKEND_PORTAL_URL}/signature/docSupplier/upload/${packId}`}
                beforeUpload={beforeUpload}
                error={errors.documents?.[0]}
                label={t('signature-rfo-upload-label')}
                onChange={handleChangeUploadButton}
                onRemove={handleOnRemove}
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
                autoSize={{ minRows: 5, maxRows: 5 }}
                control={control}
                error={errors.message}
                name="message"
              />
            </Col>
          </Row>
          <CommonButton
            disabled={!documents || documents?.length === 0}
            htmlType="submit"
            loading={isPending}
            type="primary"
          >
            {t('signature-rfo-send-document-btn')}
          </CommonButton>
        </Space>
      </Space>
    </form>
  );
};

export default NoDocument;
