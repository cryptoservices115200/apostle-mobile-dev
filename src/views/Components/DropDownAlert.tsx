import React, {useEffect, useRef} from 'react';
import DropdownAlert from 'react-native-dropdownalert';

import {useOvermind} from '@/store';

const baseStyle = {
  textAlign: 'left',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: 'transparent',
};

const Alert: React.FC = () => {
  const {state, actions} = useOvermind();
  const ref = useRef<DropdownAlert | null>();

  const titleStyle = {
    ...baseStyle,
    fontSize: 16,
  };

  const messageStyle = {
    ...baseStyle,
    fontSize: 14,
  };

  // Subscribe to alert changes
  useEffect(() => {
    if (state.alert.visible) {
      const {type, title, message} = state.alert;
      ref.current?.alertWithType(type, title, message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.alert.visible]);

  // @ts-ignore
  return (
    <DropdownAlert
      ref={(node) => (ref.current = node)}
      panResponderEnabled={false}
      titleNumOfLines={0}
      messageNumOfLines={0}
      titleStyle={titleStyle}
      messageStyle={messageStyle}
      successColor="#000"
      onClose={actions.alert.hide}
    />
  );
};

export default Alert;
