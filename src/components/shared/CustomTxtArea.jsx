
const CusotmTextArea = ({
  label,
  labelBackground,
  icon,
  containerStyle,
  ...props
}) => {
  return (
    <div className="custom-textarea-container" style={containerStyle}>
      {label ? (
        <div className="label" style={{ backgroundColor: labelBackground }}>
          {label}
        </div>
      ) : null}
      {icon ? <div className="icon">{icon}</div> : null}
      <textarea
        className={icon ? "custom-textarea" : "custom-textarea without-margin"}
        {...props}
      ></textarea>
    </div>
  );
};

export default CusotmTextArea;
