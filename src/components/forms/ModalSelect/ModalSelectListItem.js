import React from 'react';
import * as PropTypes from 'prop-types';

const ModalSelectListItem = (
  {
    item, checked, multiple, renderFunction,
    value,
  },
) => (
  <div
    data-value={value}
  >
      {renderFunction(item)}
  </div>
);

ModalSelectListItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  item: PropTypes.shape({}).isRequired,
  checked: PropTypes.bool.isRequired,
  multiple: PropTypes.bool.isRequired,
  renderFunction: PropTypes.func.isRequired,
};

ModalSelectListItem.defaultProps = {};

export default ModalSelectListItem;
