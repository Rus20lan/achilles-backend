import { useEffect, useRef, useState } from 'react';
import Portal, { createContainer } from '../portal';
import styled from 'styled-components';

const ModalContainer = styled.div`
  background: rgba(255, 255, 255, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 105;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = (props) => {
  const { children, onClose } = props;
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    createContainer({ id: 'modal-container-id' });
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMounted]);

  useEffect(() => {
    const handleWrapperClick = (event) => {
      const { target } = event;
      if (target instanceof Node && modalRef.current === target) {
        onClose?.();
      }
    };
    const handleEscapePress = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('click', handleWrapperClick);
    window.addEventListener('keydown', handleEscapePress);

    return () => {
      window.removeEventListener('click', handleWrapperClick);
      window.removeEventListener('keydown', handleEscapePress);
    };
  }, [onClose]);

  return isMounted ? (
    <Portal id={'modal-container-id'}>
      <ModalContainer ref={modalRef}>{children}</ModalContainer>
    </Portal>
  ) : null;
};

export default Modal;
