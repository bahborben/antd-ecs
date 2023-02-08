import React from 'react';

import { withSize } from 'react-sizeme';

const SizeAwareContainer: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
  
  return (
    <>
        {props.children}
    </>
  );
}

export default withSize({monitorHeight: true})(SizeAwareContainer);
