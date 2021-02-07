import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { SUBTYPES_MAP } from '../modules/constants';

export const EmptyResults = (): JSX.Element => {
  const subtype = useSelector((state: RootState) => state.search.subtype);
  const userInput = useSelector((state: RootState) => state.search.userInput);
  const filters = useSelector((state: RootState) => state.search.filters);

  return (
    <div className="empty-results">
      <p>We didn't find anything for your search query:
        {`${SUBTYPES_MAP[subtype]}`} - {`${userInput}`} - {filters.map((f) => `${f.type}: ${f.label} |`)}!
      </p>
    </div>
  );
};

export default EmptyResults;
