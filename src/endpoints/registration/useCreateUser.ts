import { AxiosError } from 'axios';
import { useStateMachine } from 'little-state-machine';
import pick from 'lodash/pick';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';

import { useApi } from '../../context/ApiContext';
import { UserInfo } from '../../interface/user';
import createUserState from '../../StoreForm/createUserState';
import { updateRegisterForm } from '../../StoreForm/updateState';
import { useUserInfo } from '../../context/UserInfoContext';
import { saveTokenCookies } from '../../utils';
import { FormRegisterStep3 } from '../../screen/Register/components/RegisterForm/ThirdStep/ThirdStep';
import useGetPortalApp from '../../hooks/useGetPortalApp';
import { useTenant } from '../../context/TenantContext';

export const useCreateUser = () => {
  const client = useApi();
  const history = useHistory();
  const portalAppUrl = useGetPortalApp();
  const { userInfo } = useUserInfo();
  const { setUserInfo } = useUserInfo();
  const { actions } = useStateMachine({ updateRegisterForm });
  const { env } = useTenant();

  return useMutation<UserInfo, AxiosError<UserInfo>, FormRegisterStep3>(
    (data) =>
      client
        .post('/users/register', {
          ...pick(data, ['company', 'companyField', 'firstName', 'lastName', 'username', 'affiliation', 'password']),
          language: userInfo.language,
          preferences: {
            ...pick(data, ['personalDataProcessing', 'agreeTermsConditions', 'agreePrivacyPolicy']),
          },
          confirmEmailUrl: `${portalAppUrl}/confirmEmail`,
        })
        .then((res) => res.data),
    {
      onSuccess(data) {
        actions.updateRegisterForm(createUserState);
        saveTokenCookies(data.token, env.REACT_APP_SUB_DOMAIN);
        setUserInfo(data);
        history.push(`/confirmEmail?userid=${data._id}`);
      },
    },
  );
};
