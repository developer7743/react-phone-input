import {
  parsePhoneNumberFromString,
  getExampleNumber as getExampleNumberLib,
  isPossibleNumber,
  isSupportedCountry,
  getCountryCallingCode,
} from 'libphonenumber-js';
import mobileNumbersExamples from 'libphonenumber-js/examples.mobile.json';
import { defaultPhoneCode, phoneCodeKey, phoneNumberKey } from 'components/forms/PhoneInput/constants';
import countriesList from 'constants/countriesList';


export default function concatPhone(
  {
    [phoneCodeKey]: phoneExtension,
    [phoneNumberKey]: phoneNumber,
  },
) {
  if (!phoneExtension || !phoneNumber) {
    return '';
  }

  return `+${phoneExtension.split('#')[0]}${phoneNumber}`;
}

/**
 @typedef phoneElements
 @type {Object}
 @property {string} extension - country specific prefix.
 @property {string} phoneNumber - phone number without prefix.
 */

/**
 *
 * @param {string} extension
 * @param {string} phoneInput
 * @returns {phoneElements}
 */
export const getPhoneElements = (extension, phoneInput) => {
  /**
   * Default response if any error appear
   * @type {{extension: undefined, phoneNumber: undefined}}
   */
  const defaultResponse = {
    extension: undefined,
    phoneNumber: undefined,
  };

  let phone = phoneInput;

  if (!phone) {
    return defaultResponse;
  }

  let PhoneNumber = parsePhoneNumberFromString(phone);
  if (!PhoneNumber) {
    phone = concatPhone({
      [phoneCodeKey]: extension,
      [phoneNumberKey]: phoneInput,
    });
    PhoneNumber = parsePhoneNumberFromString(phone);
  }

  if (!PhoneNumber) {
    return defaultResponse;
  }
  let { country } = PhoneNumber;
  let countryInfo = countriesList[country];

  /**
   * Trying search country by phone country code instead of country code
   */
  if (!countryInfo) {
    const { countryCallingCode } = PhoneNumber;

    /**
     * Set US as default NANPA country
     */

    if (countryCallingCode === '1') {
      country = 'US';
      countryInfo = countriesList[country];
    } else {
      Object.keys(countriesList).find((countryCode) => {
        const { phone: phoneCode } = countriesList[countryCode];

        if (phoneCode === countryCallingCode) {
          countryInfo = countriesList[countryCode];
          country = countryCode;
          return true;
        }

        return false;
      });
    }
  }

  if (!countryInfo) {
    return defaultResponse;
  }

  return {
    phoneNumber: phone.replace(new RegExp(`\\+?${countryInfo.phone}`), ''),
    extension: `${countryInfo.phone}#${country}`,
  };
};

export function parsePhone(phone) {
  if (!phone) {
    return {
      [phoneCodeKey]: defaultPhoneCode,
    };
  }

  const { phoneNumber, extension } = getPhoneElements(undefined, phone);

  if (!phoneNumber || !extension) {
    return {
      [phoneCodeKey]: defaultPhoneCode,
    };
  }

  return {
    [phoneCodeKey]: extension,
    [phoneNumberKey]: phoneNumber,
  };
}

/**
 * TODO: Improve logic
 * Logic should be adjusted for cut dial code from example
 * https://github.com/jackocnr/intl-tel-input/
 * src/js/intlTelInput.js
 * _updatePlaceholder -> _beforeSetNumber -> _getDialCode
 */


export const getExampleNumber = (extension) => {
  if (!extension) {
    return undefined;
  }

  const country = extension.split('#').pop();

  if (!country) {
    return undefined;
  }

  const examplePhone = getExampleNumberLib(country, mobileNumbersExamples);

  if (!examplePhone) {
    return undefined;
  }

  return examplePhone.formatInternational();
};

export const getPlaceholderNumber = (extension) => {
  const defaultResponse = '';
  const exampleNumber = getExampleNumber(extension);

  if (!exampleNumber) {
    return defaultResponse;
  }

  const [dialCode, country] = extension.split('#');

  if (!dialCode) {
    return defaultResponse;
  }

  const countryCallingCode = getCountryCallingCode(country);
  let fullDialCode = `+${countryCallingCode}`;
  const areaCode = dialCode.substring(countryCallingCode.length);

  if (areaCode) {
    fullDialCode = `${fullDialCode} ${areaCode}`;
  }

  const start = (exampleNumber[fullDialCode.length] === ' ') ? fullDialCode.length + 1 : fullDialCode.length;

  return exampleNumber.substring(start);
};

export const isValidPhoneNumber = (extension, number) => {
  const defaultResponse = false;

  if (!extension || !number) {
    return defaultResponse;
  }

  const country = extension.split('#').pop();

  if (!country) {
    return defaultResponse;
  }

  return isPossibleNumber(number, isSupportedCountry(country) ? country : undefined);
};
