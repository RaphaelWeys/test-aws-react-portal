import { AxiosError } from 'axios';
import { useStateMachine } from 'little-state-machine';
import pick from 'lodash/pick';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';

import { useApi } from '../../context/ApiContext';
import { useUserInfo } from '../../context/UserInfoContext';
import useGetPortalApp from '../../hooks/useGetPortalApp';
import useSaveToken from '../../hooks/useSaveToken';
import { UserInfo } from '../../interface/user';
import { FormRegisterStep3 } from '../../screen/Register/components/RegisterForm/RegisterForm.interface';
import createUserState from '../../StoreForm/createUserState';
import { updateRegisterForm } from '../../StoreForm/updateState';

export const useCreateUser = () => {
  const client = useApi();
  const history = useHistory();
  const portalAppUrl = useGetPortalApp();
  const { userInfo } = useUserInfo();
  const { setUserInfo } = useUserInfo();
  const { actions } = useStateMachine({ updateRegisterForm });
  const { saveToken } = useSaveToken();

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
        saveToken(data.token);
        setUserInfo(data);
        history.push(`/confirmEmail?userid=${data._id}`);
      },
    },
  );
};
