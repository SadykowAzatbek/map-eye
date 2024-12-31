import React from 'react';

interface SearchProps {
  onClick: () => void;
  displayName: string;
}

const Search: React.FC<SearchProps> = ({ displayName, onClick }) => {
  return (
    <>
      <div className="search-list" onClick={onClick}>
        {displayName}
      </div>
    </>
  );
};

export default Search;