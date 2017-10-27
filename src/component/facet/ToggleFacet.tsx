import * as React from 'react';
import * as _ from 'lodash';

import {
  FacetRenderer,
  defaultRenderer,
  FacetProps,
  FacetValue
} from './FacetTypes';

class ToggleFacet extends React.Component<FacetProps, {}> {
  static contextTypes = {
    searchState: React.PropTypes.object,
    transition: React.PropTypes.func
  };
  
  onClick(value: FacetValue) {
    return () => {
      let selections: string[] = [];
      if (value.checked) {
        selections = [];
      } else {
        selections.push(value.value);
      }

      const thisFacet = {};
      thisFacet[this.props.facet] = selections;

      this.context.transition(
        {
          start: 0,
          facets: thisFacet
        }
      );
    };
  }

  render() {
    const title = this.props.title;
    const render: FacetRenderer = this.props.render || defaultRenderer;

    return (
      <div className="ui" style={{marginBottom: '1em'}}>
        {title ? (<h4>{title}</h4>) : null}
        {
          _.sortBy(this.props.values, (v) => v[0]).map(
            (value, i) => (
              <p>
                <div className="ui toggle checkbox">
                  <input checked={value[2]} type="checkbox" name={i + ''} onClick={this.onClick(value)} />
                  <label onClick={this.onClick(value)}>{render(value[0], value[1])}</label>
                </div>
              </p>
            )
          )
        }
      </div>
    );
  }
}

export {
  ToggleFacet
};