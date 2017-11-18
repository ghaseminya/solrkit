import { PaginationData, SearchParams, SolrCore, SolrMoreLikeThis, SolrGet, SolrTransitions } from './DataStore';
import * as React from 'react';
import { PropTypes } from 'react';
import * as _ from 'lodash';

type RenderLambda<T> = 
  (v: T | T[], p?: PaginationData) => JSX.Element;

function databind<T>(
    event: Function,
    ds: SolrCore<object>,
    render: RenderLambda<T>
) {
  return () => {
    return (
      <Bound
        event={event}
        dataStore={ds}
        render={render}
      />
    );
  };
}

interface DataBoundProps<T> {
  event: Function;
  dataStore: SolrGet<T> & SolrMoreLikeThis<T> & SolrTransitions;
  render: RenderLambda<T>;
}

interface DataBoundState<T> {
  data?: T | T[];
  paging?: PaginationData;
}

class Bound extends React.Component<DataBoundProps<object>, DataBoundState<object>> {
  static childContextTypes = {
    transition: PropTypes.func,
    searchState: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props: DataBoundProps<object>) {
    super(props);

    this.state = {
      data: undefined,
      paging: undefined
    };

    // This needs to happen early
    props.event.call(
      props.dataStore,
      (data: object | object[], paging: PaginationData) => {
        this.setState( {
          data: data,
          paging: paging
        });
      }
    );
  }

  transition(args: SearchParams) {
    const currentParams = this.props.dataStore.getCurrentParameters();
    const newParams: SearchParams = Object.assign(
      {},
      currentParams,
      args      
    );

    if (args.facets) {
      newParams.facets = Object.assign({}, currentParams.facets, args.facets);      
    }

    // TODO - should handle different classes of route
    const page: number = (newParams.start || 0) / this.props.dataStore.getCoreConfig().pageSize + 1;

    let facets = '';
    if (newParams.facets) {
      facets = '?' + _.map(
        newParams.facets,
        (k, v) => v + '=' + (
          _.isArray(k) ? k.join(',') : k
        )
      ).join('&');
    }
    
    this.context.router.history.push(
      '/' + this.props.dataStore.getCoreConfig().prefix + '/' + newParams.query + '/' + 
      page + facets
    );

    this.props.dataStore.stateTransition(newParams);
  }

  getChildContext() {
    return {
      searchState: this.props.dataStore.getCurrentParameters(),
      transition: this.transition.bind(this)
    };
  }

  render() {
    // TODO these need to be named or something
    if (!this.state.data) {
      return null;
    }

    return (
      this.props.render(this.state.data || [], this.state.paging)
    );
  }
}

class DataBind extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export { DataBind, Bound, databind };