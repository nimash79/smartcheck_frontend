import { useEffect, useRef, useState } from 'react';
import ArrowDown from '../svgs/ArrowDown';

const CustomDropdown = ({
  label,
  labelBackground,
  icon,
  containerStyle = {},
  list,
  ref,
  initialValue = 0,
  disabled = false,
  ...props
}) => {
  const [value, setValue] = useState(0);
  const [openList, setOpenList] = useState(false);
  const [items, setItems] = useState([]);
  const [customStyles, setCustomStyles] = useState({});

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      inputRef.current.value = list.find(l => l.value === initialValue)?.label || "";
    }
  }, [initialValue, list])

  useEffect(() => {
    setItems(list);
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={disabled ? "custom-dropdown-container custom-disabled" : "custom-dropdown-container"} style={containerStyle} onClick={() => setOpenList(true)}>
      <input type="hidden" value={value} ref={ref} />
      {label ? (
        <div className="label" style={{ backgroundColor: labelBackground }}>
          {label}
        </div>
      ) : null}
      {icon ? <div className="icon">{icon}</div> : null}
      <input
        className={icon ? "custom-dropdown" : "custom-dropdown without-margin"}
        onKeyUp={(e) => {
          setItems(list.filter(item => item.label.includes(e.target.value)))
        }}
        ref={inputRef}
        {...props}
      />
      <div className="icon"><ArrowDown /></div>
      <div className='custom-dropdown-list' style={{display: openList ? "block" : "none"}}>
        {items.map(item => (
          <div key={item.value} className='custom-dropdown-item' onClick={(e) => {
            e.stopPropagation(); 
            setOpenList(false);
            setValue(item.value);
            inputRef.current.value = item.label;
          }}>{item.label}</div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
