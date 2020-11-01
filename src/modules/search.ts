import data from '../search_index.json';
import lunr from 'lunr';
import { Index } from 'lunr';

export default class Search extends Error {
  index: Index;

  constructor() {
    super();
    this.index = this.createIndex();
  }

  /**
   * Process the data and create a search index.
   * NOTE: Stemming is disabled :)
   */
  createIndex() {
    return lunr(function() {
      this.pipeline.remove(lunr.stemmer)
      this.searchPipeline.remove(lunr.stemmer)

      this.ref('id')
      this.field('name')
      this.field('type')
  
      data.forEach((doc) => {
        this.add(doc)
      }, this);
    });
  }

  /**
   * Looks up the item within the search index.
   * Prefers SUITS over ITEMs.
   * @param searchTerm The search input.
   */
  searchName(searchTerm: string, maxResults: number = 10): string[] {
    const output: string[] = []
    let results = this.index.search(`+name:${searchTerm} type:suit`).slice(0, maxResults);

    console.log(results.length)

    results.forEach((result) => {
      output.push(result.ref);
    })

    return output;
  }
}
