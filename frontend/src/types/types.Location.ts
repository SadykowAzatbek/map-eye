export interface LocationTypes {
  _id?: string;
  location: string;
  city: string;
  altSpellings: string[];
}

export interface CountryTypes {
  altSpellings: string[];
  name: {
    common: string;
  };
  translations: {
    rus: {
      common: string;
    }
  }
  flags: {
    svg: string;
  }
}
