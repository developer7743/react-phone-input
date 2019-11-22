import React, { useMemo } from 'react';
import { TextField } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { getPlaceholderNumber } from 'helpers/phoneHelpers';


const PhoneNumberInput = (
  {
    onChange,
    value,
    phoneCode,
    ...rest
  },
) => {
  const phonePlaceholder = useMemo(() => {
    const defaultValue = 'Number';

    if (!phoneCode) {
      return defaultValue;
    }

    return getPlaceholderNumber(phoneCode) || defaultValue;
  }, [phoneCode]);

  return (
    <TextField
      onChange={onChange}
      value={value}
      placeholder={phonePlaceholder}
      type="number"
      variant="outlined"
      margin="dense"
      fullWidth
      {...rest}
    />
  );
};

PhoneNumberInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  phoneCode: PropTypes.string,
};

PhoneNumberInput.defaultProps = {
  value: '',
  phoneCode: '',
};

export default PhoneNumberInput;
