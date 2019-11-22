import React, {
  Fragment, useCallback, useMemo, useState,
} from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import ModalSelectListItem from 'components/forms/ModalSelect/ModalSelectListItem';
import ModalInput from 'components/forms/ModalSelect/ModalInput';
import { DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';

const controlSelectOptions = [];

/**
 * @param inputLabel
 * @param name
 * @param renderValue
 * @param renderListItem
 * @param currentValue
 * @param onChange
 * @param options
 * @param filter
 * @param minSearchLength
 * @param error
 * @param helperText
 * @param modalTitle
 * @param valueKey
 * @param multiple
 * @param customInput
 * @param noTranslate
 * @returns {*}
 * @constructor
 */

const ModalSelect = (
  {
    label: inputLabel,
    name,
    renderValue,
    renderListItem,
    value: currentValue,
    onChange,
    options,
    filter,
    minSearchLength,
    error,
    helperText,
    modalTitle,
    valueKey,
    multiple,
    customInput,
    noTranslate,
  },
) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearchValue] = useState('');


  const onSearchChange = useCallback(({ target: { value } }) => {
    setSearchValue(value);
  }, [setSearchValue]);

  /**
   * Filter options by provided search query
   * @type {any}
   */

  const filteredOptions = useMemo(
    () => {
      /**
       * If filter function is not provided then return full list
       */
      if (!filter || typeof filter !== 'function') {
        return options;
      }
      /**
       * Return empty result is search query is required and less than minimal length
       */
      if (minSearchLength && (!search || search.length < minSearchLength)) {
        return [];
      }

      if (!search) {
        return options;
      }

      return options
        .filter(entry => Boolean(filter(search.toLowerCase(), entry)));
    },
    [search, options, minSearchLength, filter],
  );
  /**
   * Focus handler for always visible control trigger
   * Notice: by default it is input,
   * but for button or any block component should be attached as onClick handler
   * @type {Function}
   */
  const onControlFocus = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const onClose = useCallback(() => {
    setModalOpen(false);
    setSearchValue('');
  }, [setModalOpen, setSearchValue]);

  const onSelect = useCallback(({ target }) => {
    /**
     * Function works with html attribute for prevent redundant on click handlers creations
     * onClose event triggers on any value change, it is business requirements
     * @type {string}
     */
    let newValue = target.getAttribute('data-value');

    if (!newValue) {
      return;
    }
    /**
     * Non strict compare due to numbers types becomes strings in inputs values
     */
    // eslint-disable-next-line eqeqeq
    if (newValue == currentValue && !multiple) {
      onClose();
      return;
    }

    /**
     * If modal accepts multiple select
     */
    if (multiple) {
      newValue = currentValue.includes(newValue)
        ? currentValue.filter(id => id !== newValue)
        : [...currentValue, newValue].sort();
    }

    onChange(newValue);
    onClose();
  }, [onChange, multiple, onClose, currentValue]);

  const isResultEmpty = Boolean(
    (
      (minSearchLength && search.length >= minSearchLength)
      || (!minSearchLength && search.length)
    ) && !filteredOptions.length,
  );

  /**
   * Check is modal has initial state
   * Can be true only for modals where search query is required
   * @type {boolean}
   */

  const isInitialState = Boolean(
    (
      (minSearchLength && search.length < minSearchLength)
      || (!minSearchLength && !search.length)
    ) && !filteredOptions.length,
  );

  return (
    <Fragment>
      <ModalInput
        label={inputLabel}
        name={name}
        value={currentValue}
        options={controlSelectOptions}
        renderValue={renderValue}
        error={error}
        helperText={helperText}
        onFocus={onControlFocus}
        auto
        component={customInput}
      />

      <Dialog
        open={modalOpen}
        title={modalTitle}
        onClose={onClose}
        disableRestoreFocus
      >
        <DialogTitle>
          <div>
            {modalTitle}
          </div>
          <div className="p-2">
            <TextField
              fullWidth
              variant="outlined"
              autoFocus={Boolean(minSearchLength)}
              value={search}
              onChange={onSearchChange}
              placeholder="Search"
            />
          </div>
        </DialogTitle>
        <DialogContent>
          {Boolean(filteredOptions.length) && (
            <div
              className={clsx('py-2', { notranslate: noTranslate })}
              onClick={onSelect}
              role="presentation"
            >
              {filteredOptions.map((
                entry,
              ) => {
                const value = entry[valueKey];
                const checked = multiple
                  ? currentValue && currentValue.includes(String(value))
                  : String(value) === String(currentValue);

                return (
                  <ModalSelectListItem
                    item={entry}
                    key={value}
                    value={value}
                    checked={checked}
                    renderFunction={renderListItem}
                    multiple={multiple}
                  />
                );
              })}
            </div>
          )}

          {isResultEmpty && (
            <FormHelperText>
              Any result for your request
            </FormHelperText>
          )}
          {isInitialState && (
            <FormHelperText component="div">
              <div className="text-center">
                Please start typing for search relevant results
                <br />
                {
                  Boolean(minSearchLength) && `(min ${minSearchLength} symbols)`
                }
              </div>
            </FormHelperText>
          )}
        </DialogContent>
      </Dialog>

    </Fragment>
  );
};

ModalSelect.propTypes = {
  label: PropTypes.string,
  modalTitle: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  renderValue: PropTypes.func.isRequired,
  renderListItem: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  valueKey: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  filter: PropTypes.func,
  error: PropTypes.bool,
  multiple: PropTypes.bool,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  customInput: PropTypes.func,
  noTranslate: PropTypes.bool,
  minSearchLength: PropTypes.number,
};


ModalSelect.defaultProps = {
  label: undefined,
  value: undefined,
  filter: undefined,
  error: null,
  helperText: null,
  valueKey: 'value',
  multiple: false,
  customInput: null,
  noTranslate: false,
  minSearchLength: undefined,
};

export default ModalSelect;
