import { Button, Checkbox, Col, Popconfirm, Row, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import GradientButton from '../../../../components/GradientButton';
import { Input } from '../../../../components/Input';
import TextArea from '../../../../components/Input/TextArea';
import Select from '../../../../components/Select';
import { AdminLanguageItems } from '../../../../config/app-config';
import { useGetSubject } from '../../../../endpoints/admin/template/useGetSubject';
import { useGetTemplateRaw } from '../../../../endpoints/admin/template/useGetTemplateRaw';
import { useGetTemplates } from '../../../../endpoints/admin/template/useGetTemplates';
import { useUpdateAction } from '../../../../endpoints/admin/template/useUpdateAction';
import { useUpdateDocuments } from '../../../../endpoints/admin/template/useUpdateDocuments';
import { useUpdateTemplate } from '../../../../endpoints/admin/template/useUpdateTemplate';
import { Template } from '../../../../interface/template';
import ButtonDownload from './ButtonDownload';

interface Props {
  className?: string;
}

interface Checkboxes {
  label: string;
  key: string;
  value: boolean;
}

const TemplateList: FC<Props> = () => {
  const [t] = useTranslation();
  const [lang, setLang] = useState('en');
  const [app, setApp] = useState('portal');
  const [isTemplateSaved, setIsTemplateSaved] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>();
  const [checkboxesValue, setCheckboxesValue] = useState<Checkboxes[]>();
  const { data: templates } = useGetTemplates(app, lang);
  const { data: templateRaw, isSuccess: isGetTemplateRawSuccess, refetch: getTemplateRaw } = useGetTemplateRaw(
    selectedTemplate?.template,
  );
  const { refetch: getSubject } = useGetSubject(selectedTemplate?.template);
  const { mutate: updateDocuments, data: documents } = useUpdateDocuments(app);
  const { mutate: updateTemplate, isLoading: updateTemplateLoading } = useUpdateTemplate(selectedTemplate?.template);
  const { mutate: updateAction, data: action } = useUpdateAction(app);

  const { control, errors, handleSubmit, register, getValues, reset } = useForm();

  const isTemplateMail = React.useMemo(() => {
    if (selectedTemplate) {
      return selectedTemplate.preview.type === 'mail';
    }

    return null;
  }, [selectedTemplate]);

  useEffect(() => {
    if (templateRaw) {
      register({ name: 'templateEdited' });
    }
  }, [register, templateRaw]);

  useEffect(() => {
    if (isTemplateMail) {
      register({ name: 'subject' }, { required: true });
    }
  }, [isTemplateMail, register]);

  useEffect(() => {
    if (templates) {
      setSelectedTemplate(undefined);
      setSelectedDocumentId(undefined);
    }
  }, [templates]);

  useEffect(() => {
    if (selectedTemplate) {
      getTemplateRaw().then(({ data }) => {
        const subject = getValues('subject');
        reset({ templateEdited: data, subject });
      });
      getSubject().then(({ data }) => {
        const templateEdited = getValues('templateEdited');
        reset({ templateEdited, subject: data });
      });
    }
  }, [selectedTemplate, getTemplateRaw, reset, getValues, getSubject]);

  useEffect(() => {
    if (selectedTemplate?.app === app) {
      setSelectedDocumentId(undefined);
      if (isGetTemplateRawSuccess) {
        setCheckboxesValue(() =>
          selectedTemplate.preview?.checkboxes?.map((checkbox) => ({
            key: checkbox.key,
            value: false,
            label: checkbox.label,
          })),
        );
        if (selectedTemplate.preview.documentType) {
          updateDocuments({
            template: selectedTemplate,
          });
        }
        setIsTemplateSaved(true);
      }
    }
  }, [selectedTemplate, app, isGetTemplateRawSuccess, updateDocuments]);

  const onSubmit = React.useCallback(
    (data) => {
      updateTemplate(
        { value: data.templateEdited, subject: data.subject },
        {
          onSuccess() {
            setIsTemplateSaved(true);
          },
        },
      );
    },
    [updateTemplate],
  );

  const handleTriggerAction = (actionType: string) => {
    updateAction({
      action: actionType,
      checkboxes: checkboxesValue?.reduce((acc: { [key: string]: boolean }, c) => {
        acc[c.key] = c.value;
        return acc;
      }, {}),
      document: selectedDocumentId,
      template: selectedTemplate,
      language: lang,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Space direction="vertical" size="large">
        <Row gutter={24}>
          <Col span={4}>
            <Select
              items={[
                { label: 'Optimization', value: 'follow', key: '0' },
                { label: 'Portal', value: 'portal', key: '1' },
                { label: 'Marketplace', value: 'tender', key: '2' },
              ]}
              value={app}
              onChange={setApp}
            />
          </Col>
          <Col span={4}>
            <Select items={AdminLanguageItems} value={lang} onChange={setLang} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Select
              items={(templates || []).map((temp) => ({ label: temp.name, value: temp.name, key: temp.name }))}
              label={t('admin-template-label-select')}
              placeholder={t('admin-template-placeholder-select')}
              value={selectedTemplate?.name}
              onChange={(value) => {
                const currentTemplate = templates?.find((temp) => temp.name === value);
                setSelectedTemplate(currentTemplate);
              }}
            />
          </Col>
        </Row>

        {selectedTemplate && (
          <Row gutter={24}>
            <Col span={8}>
              <Select
                items={(documents || []).map((doc) => ({ label: doc.label, value: doc.id, key: doc.label }))}
                label={selectedTemplate.preview.documentLabel}
                value={selectedDocumentId}
                onChange={(id) => setSelectedDocumentId(id)}
              />
            </Col>
          </Row>
        )}

        {isTemplateMail && (
          <Row gutter={24}>
            <Col span={8}>
              <Controller
                as={Input}
                control={control}
                customOnChange={() => {
                  setIsTemplateSaved(false);
                }}
                error={errors?.subject}
                label="Subject"
                name="subject"
              />
            </Col>
          </Row>
        )}

        {selectedDocumentId && (selectedTemplate?.preview.buttons.length || 0) > 0 && (
          <Space size="large">
            {selectedTemplate?.preview.buttons.map((button) => (
              <>
                <Popconfirm
                  disabled={isTemplateSaved}
                  okButtonProps={{ style: { display: 'none' } }}
                  placement="bottomLeft"
                  title={t('admin-template-popover-get-title')}
                >
                  <Button onClick={() => isTemplateSaved && handleTriggerAction(button.action)}>{button.label}</Button>
                </Popconfirm>
                {button.downloadable && action && (
                  <ButtonDownload
                    action={button.action}
                    app={app}
                    filename={action.filename}
                    isTemplateSaved={isTemplateSaved}
                  />
                )}
              </>
            ))}
          </Space>
        )}

        {checkboxesValue && checkboxesValue.length > 0 && selectedDocumentId && (
          <Space size="large">
            {checkboxesValue.map((checkbox) => (
              <Checkbox
                checked={checkbox.value}
                onChange={(e) => {
                  setCheckboxesValue(() =>
                    checkboxesValue.map((item) =>
                      item.key === checkbox.key ? { ...item, value: e.target.checked } : item,
                    ),
                  );
                }}
              >
                {checkbox.label}
              </Checkbox>
            ))}
          </Space>
        )}

        {templateRaw && (
          <Controller
            as={TextArea}
            control={control}
            customOnChange={() => {
              setIsTemplateSaved(false);
            }}
            defaultValue={templateRaw}
            disabled={!selectedTemplate}
            name="templateEdited"
            rows={18}
          />
        )}

        <GradientButton disabled={isTemplateSaved} isLoading={updateTemplateLoading} type="submit">
          {t('global-save')}
        </GradientButton>
      </Space>
    </form>
  );
};

export default TemplateList;
