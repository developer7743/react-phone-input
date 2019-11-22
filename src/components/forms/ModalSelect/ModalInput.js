import React from 'react';
import * as PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from 'components/forms/Select';

const useStyles = makeStyles({
  selectField: {
    lineHeight: 1.35,
  },
});

const ModalInput = (
  {
    label,
    name,
    value,
    options,
    renderValue,
    error,
    helperText,
    onFocus,
    component,
  },
) => {
  const { selectField } = useStyles();

  if (component) {
    return component({
      label,
      name,
      value,
      options,
      renderValue,
      error,
      helperText,
      onFocus,
    });
  }

  return (
    <Select
      classes={{ select: selectField }}
      label={label}
      name={name}
      value={value}
      options={options}
      renderValue={renderValue}
      native={false}
      error={error}
      helperText={helperText}
      onFocus={onFocus}
    />
  );
};

ModalInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  renderValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onFocus: PropTypes.func.isRequired,
  component: PropTypes.func,
};

ModalInput.defaultProps = {
  label: undefined,
  value: undefined,
  error: null,
  helperText: null,
  component: null,
};

export default ModalInput;
