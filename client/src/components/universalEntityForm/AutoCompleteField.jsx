import { useRef } from "react";
import { useSelector } from "react-redux";

const AutoCompleteField = ({ name, value, onChange, error }) => {
  const wrapperRef = useRef(null);
  const data = useSelector((state) => state.designs.data);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div ref={wrapperRef}>
      <input />
    </div>
  );
};

export default AutoCompleteField;
