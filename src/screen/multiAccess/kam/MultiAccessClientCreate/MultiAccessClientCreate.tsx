import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import React, { FC } from 'react';
import { Space } from 'antd';
import { useStateMachine } from 'little-state-machine';

import InfoIcon from '../../../../components/icons/InfoIcon';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import UserGraphIcon from '../../../../components/icons/UserGraphIcon';
import Hr from '../../../../components/Hr';
import MainLayout from '../../../../layout/MainLayout';
import Steps from '../../../../components/Steps';
import { HeaderOne, TextRegular } from '../../../../style/utils';
import FormStep1 from '../FormStep1';
import FormStep2 from '../FormStep2';
import GradientButton from '../../../../components/GradientButton';
import { updateMultiAccessForm } from '../../../../StoreForm/updateState';
import { useCreateMultiAccessUser } from '../../../../endpoints/multiAccess/useCreateMultiAccessUser';
import multiAccessClientState from '../../../../StoreForm/multiAccessClientState';
import useDesktop from '../../../../hooks/useDesktop';
import { useGetMarketList } from '../../../../endpoints/multiAccess/useGetMarketList';
import { useCheckUsername } from '../../../../endpoints/registration/useCheckUsername';
import useGetPortalApp from '../../../../hooks/useGetPortalApp';
import { hasSomeClientMarketActivated } from '../../utils';
import history from '../../../../router/history';
import { Navigation } from '../../../../navigation/index';

interface Props {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const MultiAccessClientCreate: FC<Props> = ({ currentStep, setCurrentStep }) => {
  const [t] = useTranslation();
  const portalAppUrl = useGetPortalApp();
  const { actions, state } = useStateMachine({ updateMultiAccessForm });
  const isDesktop = useDesktop();
  const { mutate: createUser, isLoading } = useCreateMultiAccessUser();
  const { mutate: checkEmailExist, isLoading: checkEmailPending } = useCheckUsername();
  const { data: marketList } = useGetMarketList();
  const methods = useForm({ defaultValues: state.multiAccessClient });
  const { reset, watch, setError } = methods;

  React.useEffect(() => {
    reset(state.multiAccessClient);
  }, [reset, state.multiAccessClient]);

  React.useEffect(() => {
    return () => {
      actions.updateMultiAccessForm(multiAccessClientState);
    };
    // eslint-disable-next-line
  }, []);

  const steps = React.useMemo(
    () => [
      {
        icon: <InfoIcon />,
        title: t('multi-access-create-client-tab-1'),
        key: 0,
        component: <FormStep1 isCreateForm />,
      },
      {
        icon: <UserGraphIcon />,
        title: t('multi-access-create-client-tab-2'),
        key: 1,
        component: <FormStep2 marketList={marketList} />,
      },
    ],
    [marketList, t],
  );

  const title = React.useMemo(() => {
    if (currentStep === 0) return t('multi-access-create-information-general');
    if (currentStep === 1) return t('multi-access-create-information-general-access');
  }, [currentStep, t]);

  const description = React.useMemo(() => {
    if (currentStep === 0) return t('multi-access-create-client-description-info');
    if (currentStep === 1) return t('multi-access-create-client-description-access');
  }, [currentStep, t]);

  const onSubmit = React.useCallback(
    (data) => {
      if (currentStep !== steps.length - 1) {
        actions.updateMultiAccessForm(data);
        checkEmailExist(data.username, {
          onSuccess(response) {
            if (response)
              if (response.exists) setError('username', { message: 'register-surname-failed' });
              else setCurrentStep(currentStep + 1);
          },
        });
      } else if (data.multiaccess.clientCanLogin && !hasSomeClientMarketActivated(data.multiaccess.clientMarkets)) {
        setError('multiaccess.clientMarkets', { message: 'register-client-marker-error' });
      } else {
        const result = {
          ...state.multiAccessClient,
          ...data,
          phone: state.multiAccessClient.phone.replace(/\+*/, '+'),
          confirmEmailUrl: `${portalAppUrl}/confirmEmail`,
          multiaccess: {
            ...state.multiAccessClient.multiaccess,
            ...data.multiaccess,
            // Extract `period`, to not sent it in the payload
            clientMarkets: data.multiaccess?.clientMarkets?.map(({ period, ...market }) => {
              return {
                ...market,
                periodStart: market.enabled ? period[0].format('YYYY-MM-DD') : undefined,
                periodEnd: market.enabled ? period[1].format('YYYY-MM-DD') : undefined,
              };
            }),
          },
        };
        createUser(result, {
          onSuccess() {
            history.push(Navigation.MULTI_ACCESS);
          },
        });
      }
    },
    [
      actions,
      checkEmailExist,
      createUser,
      currentStep,
      portalAppUrl,
      setCurrentStep,
      setError,
      state.multiAccessClient,
      steps.length,
    ],
  );

  const onCancel = React.useCallback(() => {
    actions.updateMultiAccessForm(multiAccessClientState);
    history.push(Navigation.MULTI_ACCESS);
  }, [actions]);

  const handleClickBack = React.useCallback(() => {
    actions.updateMultiAccessForm(watch());
    setCurrentStep(0);
  }, [actions, setCurrentStep, watch]);

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox hasCloseIcon onCancel={onCancel}>
        {isDesktop && <Steps steps={steps} currentStep={currentStep} />}
        <Space direction="vertical" size={13}>
          <TextRegular>
            {t('multi-access-create-client-account')}
            {!isDesktop && `: ${currentStep + 1}/${steps.length}`}
          </TextRegular>
          <HeaderOne>{title}</HeaderOne>
          <TextRegular>{description}</TextRegular>
        </Space>

        <Hr noBottom noTop />
        <div style={{ width: '100%' }}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: '100%' }}>
              {steps[currentStep].component}

              <Space size="middle">
                {currentStep > 0 && (
                  <GradientButton onClick={handleClickBack} variant="outlined">
                    {t('global-previous')}
                  </GradientButton>
                )}
                <GradientButton type="submit" isLoading={isLoading || checkEmailPending}>
                  {currentStep === 1 ? t('multi-access-create-button') : t('global-next')}
                </GradientButton>
              </Space>
            </form>
          </FormProvider>
        </div>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessClientCreate;
