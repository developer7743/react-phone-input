import React, {
  createRef,
  Fragment,
  useEffect, useMemo, useRef, useState,
} from 'react';
import * as PropTypes from 'prop-types';
import SelectMui from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const Select = ({
  options, label, helperText, name, error, ...props
}) => {
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const transformedError = useMemo(() => {
    if (!helperText || typeof helperText === 'string') {
      return helperText;
    }

    if (Array.isArray(helperText)) {
      return helperText.map(text => (
        <Fragment key={text}>
          {text}
          <br />
        </Fragment>
      ));
    }

    return false;
  }, [helperText]);


  return (
    <FormControl variant="outlined" fullWidth margin="dense" error={Boolean(error)}>
      <InputLabel ref={inputLabel} htmlFor={name} component="label">
        {label}
      </InputLabel>
      <SelectMui
        native
        name={name}
        {...props}
        input={
          <OutlinedInput labelWidth={labelWidth} id={name} />
        }
        multiple={false}
      >
        <option value="" hidden />
        {
          options && options.map(
            (
              {
                label: optionLabel, value,
              },
            ) => (
              <option key={value} value={value}>
                {optionLabel}
              </option>
            ),
          )
        }
      </SelectMui>
      {(error && helperText) && (
        <FormHelperText>
          {transformedError}
        </FormHelperText>
      )}
    </FormControl>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  error: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      label: PropTypes.string,
    }),
  ),
};

Select.defaultProps = {
  label: null,
  error: null,
  helperText: null,
  options: [],
};


export default Select;
