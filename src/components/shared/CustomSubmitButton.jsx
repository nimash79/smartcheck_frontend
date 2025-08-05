const CustomSubmitButton = ({text = "ثبت", ...props}) => {
  return (
    <button type='button' className='custom-submit-button' {...props}>
        {text}
    </button>
  )
}

export default CustomSubmitButton;