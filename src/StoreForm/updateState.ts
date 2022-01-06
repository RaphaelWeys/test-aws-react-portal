export function updateRegisterForm(state: Record<string, Record<string, any>>, payload: Record<string, unknown>) {
  return {
    ...state,
    createUserForm: {
      ...state.createUserForm,
      ...payload,
    },
  };
}

export function updateBasketForm(state: Record<string, Record<string, any>>, payload: Record<string, unknown>) {
  return {
    ...state,
    basket: {
      ...state.basket,
      ...payload,
    },
  };
}

export function updateMultiAccessForm(state: Record<string, Record<string, any>>, payload: Record<string, any>) {
  return {
    ...state,
    multiAccessClient: {
      ...state.multiAccessClient,
      ...payload,
      multiaccess: {
        ...state.multiAccessClient.multiaccess,
        ...payload.multiaccess,
      },
    },
  };
}
