const PlusIcon = (props) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 9.875h10c.03 0 .061.012.087.038a.123.123 0 01.038.087c0 .03-.012.061-.038.087a.123.123 0 01-.087.038H5a.123.123 0 01-.087-.038.123.123 0 01-.038-.087c0-.03.012-.061.038-.087A.123.123 0 015 9.875z"
        stroke="#F9F9F9"
      />
      <path
        d="M10 15.625A.63.63 0 019.375 15V5A.63.63 0 0110 4.375a.63.63 0 01.625.625v10a.63.63 0 01-.625.625z"
        fill="#F9F9F9"
      />
    </svg>
  )
}

export default PlusIcon;
