import React, { Fragment, PureComponent } from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import { getPhoneElements } from 'helpers/phoneHelpers';
import PhoneCodeInput from 'components/forms/PhoneInput/PhoneCodeInput';
import PhoneNumberInput from 'components/forms/PhoneInput/PhoneNumberInput';
import { phoneCodeKey, phoneNumberKey } from 'components/forms/PhoneInput/constants';


class PhoneInput extends PureComponent {
  onCodeChange = (inputValue) => {
    const {
      value, onChange,
    } = this.props;
    onChange(
      {
        ...value,
        [phoneCodeKey]: inputValue,
      },
    );
  };

  onNumberChange = ({ target: { value: inputValue } }) => {
    const {
      value, onChange,
    } = this.props;
    const phoneCode = value[phoneCodeKey];
    /**
     * Parse current phone code and number value, if number include part of phone code
     * Than we update value with new code and number
     */
    const { phoneNumber, extension } = getPhoneElements(phoneCode, inputValue);

    /**
     * Condition when libphonenumber move part of number to code field
     * +1 345-345-345 -> +1345 345-345
     */
    if (
      extension && extension !== phoneCode
      && typeof phoneNumber === 'string' && phoneNumber !== inputValue
    ) {
      onChange(
        {
          [phoneCodeKey]: extension,
          [phoneNumberKey]: phoneNumber,
        },
      );
      return;
    }

    onChange(
      {
        ...value,
        [phoneNumberKey]: inputValue,
      },
    );
  };

  render() {
    const {
      value, helperText, isError, errors, onBlur,
    } = this.props;

    return (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <PhoneCodeInput
              error={isError}
              value={value[phoneCodeKey]}
              onChange={this.onCodeChange}
            />
          </Grid>
          <Grid item xs={7}>
            <PhoneNumberInput
              onChange={this.onNumberChange}
              onBlur={onBlur}
              value={value[phoneNumberKey]}
              error={isError}
              phoneCode={value[phoneCodeKey]}
            />
          </Grid>
        </Grid>
        {(isError && errors) && (
          <FormHelperText error margin="dense" variant="outlined">
            {
              errors.map(text => (
                <Fragment key={text}>
                  {text}
                  <br />
                </Fragment>
              ))
            }
          </FormHelperText>
        )
        }
        {Boolean(helperText) && helperText}
      </div>
    );
  }
}

PhoneInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.node),
  value: PropTypes.shape({
    [phoneCodeKey]: PropTypes.string,
    [phoneNumberKey]: PropTypes.string,
  }),
  helperText: PropTypes.node,
};


PhoneInput.defaultProps = {
  value: {},
  helperText: null,
  isError: false,
  errors: null,
};

export default PhoneInput;
