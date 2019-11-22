import React, { useCallback, useState } from 'react';
import PhoneInput from 'components/forms/PhoneInput/PhoneInput';

function App() {
  const [phone, setPhone] = useState({});
  const onBlur = useCallback(() => {}, []);
  return (
    <PhoneInput
      onChange={setPhone}
      onBlur={onBlur}
      value={phone}
    />
  );
}

export default App;
