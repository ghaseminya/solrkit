import { DataStore, SolrCore, SolrGet, SolrUpdate, SolrQuery } from 'solrkit';
import { Document } from './Document';

// Ideally you want to write code like this:
// 
//  DataStore.books.get = (talk: Talk) => <Detail {...talk} />
//  bind(onClick, (e) => DataStore.books.get(e.target.value))
//
//  Which would suggest that...
//    We need a different type T for each core
//    get needs to be a property?
type CoreCapabilities = SolrCore<Document> & SolrGet<Document> & SolrUpdate & SolrQuery<Document>;
class AppDataStore extends DataStore {
  private core: CoreCapabilities;

  constructor() {
    super();
  }

  // Every core should have it's own function
  // registered in your datastore
  //
  // If you want to have some UI controls use
  // different subsets of the data in the index
  // you should register one entry per use case.
  get windows(): CoreCapabilities {
    if (!this.core) {
      this.core = super.registerCore({
        url: 'http://40.87.64.225:8983/solr/',
        core: 'glass',
        primaryKey: 'id',
        // Unfortunately these have to be repeated 
        // since there is no apparent way to sync
        // this with Typescript
        fields: [
          'id', 'url', 'place', 'height', 'width', 'aspect', 'faces',
          'face_count', 'resnet50_tags', 'gv_labels',
          'gv_inscription', 'gv_partial_matching_images',
          'gv_pages_matching_images',
          'gv_full_matching_images',
          'train_1', 'train_2', 'train_3', 'train_4', 'train_5',
          'confidence_1', 'confidence_2', 'confidence_3', 'confidence_4', 'confidence_5',
          'prediction_1', 'prediction_2', 'prediction_3', 'prediction_4', 'prediction_5',
        ],
        fq: ['url', '*'],
        defaultSearchFields: [
          'id', 
          'gv_inscription', 
          'resnet50_tags', 
          'gv_labels'
        ],
        pageSize: 50,
        prefix: 'glass'
      });
    }

    return this.core;
  }
}

export { AppDataStore };