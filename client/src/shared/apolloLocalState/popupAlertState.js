import { makeVar } from '@apollo/client';

export const dialogVar = makeVar({
  show: false,
  message: '',
  acceptButtonName: '',
  adminMode: false,
  func: () => { }
});