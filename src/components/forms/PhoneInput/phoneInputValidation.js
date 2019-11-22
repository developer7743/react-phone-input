import { phoneCodeKey, phoneNumberKey } from 'components/forms/PhoneInput/constants';
import { isValidPhoneNumber } from 'helpers/phoneHelpers';

/**
 * The same validator for any place where input used
 * @param phoneCode
 * @param phoneNumber
 * @param numberRequired
 * @param codeRequired
 * @param invalid
 * @returns {*}
 */

const phoneInputValidation = (
  {
    [phoneCodeKey]: phoneCode,
    [phoneNumberKey]: phoneNumber,
  },
  {
    numberRequired,
    codeRequired,
    invalid,
  },
) => {
  let error;

  if (!phoneNumber) {
    error = numberRequired;
  }

  if (phoneNumber && !phoneCodeKey) {
    error = codeRequired;
  }

  if (
    !error
    && phoneNumber && phoneCode
    && !isValidPhoneNumber(phoneCode, phoneNumber)) {
    error = invalid;
  }

  return error ? [error] : undefined;
};

export default phoneInputValidation;
