import lunr, { Index } from 'lunr';
import searchIndexData from '../data/search_index.json';

export default class SearchIndex {
    index: Index;
  
    constructor() {
      this.createIndex();
    }
  
    /**
     * Process the data and create a search index.
     * NOTE: Stemming is disabled :)
     */
    createIndex(): SearchIndex {
      this.index = lunr(function options() {
        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);
  
        this.ref('id');
        this.field('name');
        this.field('spec');
        this.field('rare');
        this.field('posed');
        this.field('tag1');
        this.field('tag2');
        this.field('depth');
        this.field('subtype');
        this.field('genre');
        this.field('isSuit');
  
        searchIndexData.forEach((doc) => {
          this.add(doc);
        }, this);
      });
      return this;
    }
  
    /**
     * Looks up the item within the search index.
     * @param searchTerm The search input.
     * @param maxResults The max number of results to return.
     */
    searchWithTerm(searchTerm: string, maxResults?: number): string[] {
      const output: string[] = [];
      this.index.search(searchTerm).some((result) => {
        output.push(result.ref);
        return maxResults ? output.length === maxResults : false;
      });
      return output;
    }
}