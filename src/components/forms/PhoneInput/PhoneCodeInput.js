import React, { useCallback, useEffect, useMemo } from 'react';
import * as PropTypes from 'prop-types';
import countriesList from 'constants/countriesList';
import { defaultPhoneCode, phoneCodeKey } from 'components/forms/PhoneInput/constants';
import ModalSelect from 'components/forms/ModalSelect/ModalSelect';

const PhoneCodeInput = (
  { value, onChange, error },
) => {
  useEffect(() => {
    if (!value) {
      setTimeout(() => onChange(defaultPhoneCode), 0);
    }
  }, []);

  const countriesListFormatted = useMemo(() => {
    const options = [];
    const countiesCodesArr = Object.keys(countriesList);

    for (let i = 0; i < countiesCodesArr.length; i += 1) {
      const code = countiesCodesArr[i];
      const { phone: phoneCode, emoji, name } = countriesList[code];
      options.push({
        className: 'notranslate',
        value: `${phoneCode}#${code}`,
        label: `${emoji} +${phoneCode}`,
        phoneCode,
        emoji,
        countryName: name,
      });
    }

    return options;
  }, [countriesList]);

  const renderValue = useCallback((currentValue) => {
    const currentItem = countriesListFormatted
      .find(({ value: countryValue }) => String(countryValue) === String(currentValue));
    return currentItem ? currentItem.label : undefined;
  }, []);

  const renderListItem = useCallback((
    {
      countryName, phoneCode,
      emoji,
    },
  ) => (
    `${emoji} ${countryName} (+${phoneCode})`
  ), []);

  const filter = useCallback((
    search,
    {
      phoneCode,
      countryName,
    },
  ) => (
    phoneCode.toLowerCase().startsWith(search)
    || countryName.toLowerCase().startsWith(search)
  ), []);

  return (
    <ModalSelect
      error={error}
      modalTitle="Search for Country name or phone code"
      options={countriesListFormatted}
      renderValue={renderValue}
      renderListItem={renderListItem}
      filter={filter}
      onChange={onChange}
      value={value}
      name={phoneCodeKey}
    />
  );
};

PhoneCodeInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  value: PropTypes.string,
};

PhoneCodeInput.defaultProps = {
  value: '',
  error: false,
};

export default PhoneCodeInput;
