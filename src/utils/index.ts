export const getCorrectBackend = (backend: string) => {
  switch (backend) {
    case 'follow': {
      return process.env.REACT_APP_BACKEND_FOLLOW_URL;
    }
    case 'tender': {
      return process.env.REACT_APP_BACKEND_TENDER_URL;
    }
    default: {
      return process.env.REACT_APP_BACKEND_PORTAL_URL;
    }
  }
};

export const callAll = (...fns: (((...args: any[]) => void) | undefined)[]) => (...args: any[]) =>
  fns.forEach((fn) => fn && fn(...args));
