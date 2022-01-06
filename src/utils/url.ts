import qs from 'qs';

export const getQueryParameters = () => qs.parse(window.location.search, { ignoreQueryPrefix: true });
