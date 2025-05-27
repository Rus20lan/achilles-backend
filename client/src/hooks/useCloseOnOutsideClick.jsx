import { useEffect } from 'react';

const useCloseOnOutsideClick = (ref, isChecked, setIsChecked) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInside = ref.current?.contains(e.target);
      const isLabelClick = e.target.closest(`label[for=${ref.current?.id}]`);

      if (!isClickInside && !isLabelClick && isChecked) {
        setIsChecked(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isChecked]);
};

export default useCloseOnOutsideClick;
