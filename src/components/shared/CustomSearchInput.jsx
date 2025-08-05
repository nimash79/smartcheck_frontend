import SearchIcon from "../icons/SearchIcon";


const CustomSearchInput = ({placeholder, ...props}) => {
  return (
    <div className="custom-search-input">
      <input placeholder={placeholder} {...props} />
      <SearchIcon />
    </div>
  );
};

export default CustomSearchInput;
