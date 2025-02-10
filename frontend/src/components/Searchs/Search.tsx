import React from 'react';

interface SearchProps {
  onClick: () => void;
  displayName: string;
  image?: string;
}

const Search: React.FC<SearchProps> = ({ displayName, onClick, image }) => {
  return (
    <>
      <div className="search-list" onClick={onClick} onMouseDown={(e) => e.preventDefault()}>
        <div>
          {displayName}
        </div>
        {image ? (<div>
          <img src={image} alt={`Флаг ${displayName}`} style={{ height: 20 }} />
        </div>) : ''}
      </div>
    </>
  );
};

export default Search;