import React from 'react'
import { Link } from 'react-router'

const CustomButton = ({ text, link = false, route = "", outline = false, ...props }) => {
  if (link) return (
    <Link to={route} className={outline ? "custom-button-outline" : 'custom-button'} {...props}>
      {text}
    </Link>
  )
  else return (
    <button type='button' className={outline ? "custom-button-outline" : 'custom-button'} {...props}>
      {text}
    </button>
  )
}

export default CustomButton