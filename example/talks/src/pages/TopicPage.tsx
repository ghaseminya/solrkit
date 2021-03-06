import * as React from 'react';
import * as _ from 'lodash';
import { suggestions } from './data/suggestions';
import { AppDataStore } from './data/AppDataStore';
import { Talk } from './data/Document';
import { Dropdown } from 'semantic-ui-react';

import {
  ResultsLayout,  
  SearchBox,
  PaginationData,
  Bound,
  GenericSolrQuery,
  SearchParams
} from 'solrkit';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const searches: SavedSearch[] = [
  {
    title: 'Historic Speeches',
    search: {
      query: 'Economic'
    }
  },
  {
    title: 'Economic Justice',
    search: {
      query: 'Rights'
    }
  },
  {
    title: 'Civil Rights Movement',
    search: {
      query: 'Civil'
    }
  }
];

interface SearchPageProps {
  query: string;
  page: number;
  facets: { [ key: string ]: string[] };
}

const dataStore = new AppDataStore('topic');

interface SavedSearch {
  title: string;
  search: GenericSolrQuery;
}

const PlayIcon = ({selected}: {selected: boolean}) => (
  <g 
    transform="translate(-30,-30)"
    fill="none" 
    fill-rule="evenodd" 
    id="gloss" 
    stroke="none" 
    stroke-width="1"
  >
    <g>
      <circle 
        r="35"
        cx="30"
        cy="30"
        fill="#EEE"
        id="around"
      />
      <path 
        d="M30,60 C46.5685433,60 60,46.5685433 60,30 C60,13.4314567 46.5685433,0 30,0 C13.4314567,0 0,13.4314567 0,30 C0,46.5685433 13.4314567,60 30,60 Z" 
        fill={selected ? '#FF2626' : '#262626'}
        fill-opacity="0.1"
      />
      <path 
        d="M51.2132037,8.78679626 C56.6421358,14.2157283 60,21.7157283 60,30 C60,46.5685433 46.5685433,60 30,60 C21.7157283,60 14.2157283,56.6421358 8.78679626,51.2132037 L51.2132037,8.78679626 Z" 
        fill={selected ? '#C00' : '#000'}
        fill-opacity="0.1"
      />
      <g 
        transform="translate(17.46, 13)"
      >
        <path 
          d="M18.3076923,10.6203459 L2.52728106,2 C1.70485715,2 1.03846154,2.66475248 1.03846154,3.48514851 L1.03846154,30.5148515 C1.03846154,31.3352475 1.70485715,32 2.52728106,32 C2.52728106,32 11.1806001,27.244086 18.3076923,23.3439795 L18.3076923,10.6203459 Z" 
          fill="#EEE"
          id="Mask"
        />
        <path 
          d="M21.5106871,12.370042 L27.5394489,15.6633663 C30.2199196,17.1072277 27.5394489,18.3366337 27.5394489,18.3366337 C27.5394489,18.2531683 2.52728106,32 2.52728106,32 C2.4790684,32 2.43139195,31.9977155 2.38435454,31.9932491 L21.5106871,12.370042 Z" 
          fill="#CCC" 
          id="Mask"
        />
        <path 
          d="M2.52823098,2.00051891 L27.5394489,15.6633663 C30.2199196,17.1072277 27.5394489,18.3366337 27.5394489,18.3366337 C27.5394489,18.3101555 25.0222692,19.6755337 21.5849861,21.552341 L2.52823098,2.00051891 Z"
          fill="#CCC" 
          id="Mask"
        />
        <path 
          d="M21.5430894,12.3877424 L27.5394489,15.6633663 C30.2199196,17.1072277 27.5394489,18.3366337 27.5394489,18.3366337 C27.5394489,18.3101555 25.0222692,19.6755337 21.5849861,21.552341 L17.0977657,16.9485492 L21.5430894,12.3877424 Z"
          fill="#EEE" 
          id="Mask"
        />
      </g>
    </g>
  </g>
);

class CheckmarkIcon extends React.Component<
  {value: string, id: string}, 
  {}
> {
  constructor() {
    super();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    if (!this.props.value) {
      // video has not been opened
      return null;
    }

    const mainElementId = this.props.id + '_watchedOverlay';
    const animationTrigger = mainElementId + '.mouseover';
    const duration = '0.4s';

    const hover = (
      <g>
        <rect 
          x="289" 
          y="140" 
          width="0" 
          height="30" 
          fill="#000000"        
          fillOpacity="0.6"
          id={this.props.id + '_1'}
        >
          <animate 
            xlinkHref={'#' + this.props.id + '_1'}
            attributeType="XML" 
            attributeName="width" 
            from="0" 
            to="180"
            dur={duration}  
            repeatCount="0"
            fill="freeze"      
            restart="never"
            begin={animationTrigger}
          />
          <animate 
            xlinkHref={'#' + this.props.id + '_1'}
            attributeType="XML" 
            attributeName="x" 
            from="289" 
            to="109"
            dur={duration}
            repeatCount="0"
            fill="freeze"
            restart="never"
            begin={animationTrigger}
          />
        </rect>
        
        <text 
          x="289"
          y="160"  
          width="0"
          fontFamily="Lato" 
          fontSize="16" 
          fill="#BBB"
          id={this.props.id + '_2'}
        >
          <animate 
            xlinkHref={'#' + this.props.id + '_2'}
            attributeType="XML" 
            attributeName="width" 
            from="0" 
            to="180"
            dur={duration}  
            repeatCount="0"
            fill="freeze"
            restart="never"
            begin={animationTrigger}
          />
          <animate 
            xlinkHref={'#' + this.props.id + '_2'}
            attributeType="XML" 
            attributeName="x" 
            from="289" 
            to="113"
            dur={duration}
            repeatCount="0"
            fill="freeze"
            restart="never"
            begin={animationTrigger}
          />
          {this.props.value}
        </text>

        <rect 
          id={this.props.id + '_3'}
          x="289" 
          y="140" 
          width="0"
          height="30" 
          fillOpacity="0"
          strokeOpacity="1"
          stroke="#9F9"
          strokeWidth="2px"
        >          
          <animate 
            xlinkHref={'#' + this.props.id + '_3'}           
            attributeType="XML" 
            attributeName="width" 
            from="0" 
            to="180"
            dur={duration}
            repeatCount="0"
            begin={animationTrigger}
            fill="freeze"
            restart="never"
          />
          <animate 
            xlinkHref={'#' + this.props.id + '_3'}
            attributeType="XML" 
            attributeName="x" 
            from="289" 
            to="109"
            dur={duration}
            repeatCount="0"
            begin={animationTrigger}
            fill="freeze"
            restart="never"
          />
        </rect>
      </g>
    );
      
    return (
      <g id={mainElementId}>        
        <rect
          fill="#0006" 
          width="320" 
          height="180" 
        />
        {hover}
        <g
          transform="translate(275,135) scale(0.3)"
        >
          <g>
            <g>
              <circle 
                cx="64" 
                cy="64" 
                r="66"
                fill="#9F9"
              />
              <circle 
                cx="64" 
                cy="64" 
                r="60"
              />
            </g>
            <g>
              <path 
                fill="#EEE"
                d="M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z"
              />
            </g>
          </g>
        </g>
      </g>
    );
  }
}

const Watched = (
  {id, selected}: {
    id: string, 
    selected: boolean
  }
) => (
  <CheckmarkIcon key={id} id={id} value={_.get(localStorage, 'watched' + id, '')} />
);

function thumbnailUrl(url: string) {
  return (
    'http://img.youtube.com/vi/' + 
    url.replace(/.*v=/, '') +
    '/mqdefault.jpg'
  );
}

class VideoThumbnail extends React.Component<{talk: Talk}, {hover: boolean}> {
  constructor() {
    super();

    this.state = {
      hover: false
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({hover: true});
  }

  onMouseLeave() {
    this.setState({hover: false});
  }

  
  render() {
    const talk = this.props.talk;
    return (
      <svg
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        viewBox="0 0 320 180"
        style={{
          width: '100%',
          borderRadius: '5px'
        }}
      >
        <image
          xlinkHref={thumbnailUrl(talk.url_s)} 
          width="320"
          height="180"
        />        
        <Watched id={talk.id} selected={this.state.hover}  />
        <g
          transform="translate(160,90) scale(0.75)"
        >
          <PlayIcon selected={this.state.hover} />
        </g>
      </svg>
    );
  }
}

class Hover extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  render() {
    return (
      <div 
        className="item"
        style={{
          // paddingLeft: '16px',
          // paddingRight: '6px',
          // marginLeft: '10px',
          // marginRight: '10px',
          marginTop: '0px',
          paddingTop: '0px',
          marginBottom: '0px',
          borderRadius: '10px',
          width: '100%'
        }}
      >
        {
          (_.flatten([this.props.children]) as object[]).map(
            (child) => (
              child
            )
          )
        }  
      </div>
    );
  }
}

interface ArrowProps {
  left: boolean;
  className?: string;
  style?: object;
  onClick?: () => void;
}

class Arrow extends React.Component<ArrowProps, {hover: boolean}> {
  constructor() {
    super();

    this.state = {
      hover: false
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({hover: true});
  }

  onMouseLeave() {
    this.setState({hover: false});
  }

  render() {
    const { onClick, style } = this.props;

    return (
      <div
        onMouseOver={this.onMouseEnter}
        onMouseOut={this.onMouseLeave}
        style={this.props.left ? {
          height: '100%',
          width: '25px',
          display: 'block',
          position: 'absolute',
          top: '0px',
          cursor: 'pointer',
          right: '-25px',
          paddingLeft: '5px'
        } : {
          ...style,
          height: '100%',
          width: '25px',
          display: 'block',
          position: 'absolute',
          paddingLeft: '5px',
          left: '-25px',
          top: '0px',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        <div
          style={{
            paddingTop: '60px'
          }}
        >
          <svg
            enableBackground="new 0 0 25 180" 
            height="180px" 
            viewBox="0 0 25 180" 
            width="25" 
            xmlSpace="preserve" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g
              transform={this.props.left ? 'translate(20, 0) scale(-1, 1)' : 'translate(0, 0)'} 
              stroke={this.state.hover ? '#999' : '#222'}
            >
              <polygon 
                fill={this.state.hover ? '#AAA' : '#222'}
                points="12.885,0.58 14.969,2.664 4.133,13.5 14.969,24.336 12.885,26.42 2.049,15.584 -0.035,13.5 "
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

class VideoScroller extends React.Component<{
  talks: Talk[],
  title: string
}, {}> {
  private slider;
  private prevArrow;
  private nextArrow;
  private dragging: boolean;

  constructor() {
    super();

    this.prevArrow = (
      <Arrow left={false} />
    );

    this.nextArrow = (
      <Arrow left={true} />
    );

    this.onClickVideo = this.onClickVideo.bind(this);
    this.dragging = false;
  }

  onClickVideo(e: React.MouseEvent<HTMLAnchorElement>) {   
    if (this.dragging) {
      e.preventDefault();
      
      return true;
    } else {
      return false;
    }
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 2,
      swipeToSlide: true,
      variableWidth: false,
      prevArrow: this.prevArrow,      
      nextArrow: this.nextArrow,
      beforeChange: () => this.dragging = true,
      afterChange: () => this.dragging = false,
    };

    return (
      <div>
        <h4
          style={{
            marginLeft: '5px'                          
          }}
        >
          {this.props.title}
        </h4>
        <Slider 
          {...settings}
          ref={(slider) => this.slider = slider}
        >
          {
            this.props.talks.map(
              (talk: Talk) => (
                <div>
                  <div
                    style={{              
                      marginLeft: '5px',
                      marginRight: '5px'
                    }}
                  >
                    <Hover>
                      <a
                        href={'/view/' + talk.id}
                        target="_new"
                        onClick={this.onClickVideo}
                        style={{
                          width: '100%',
                        }}
                      >
                        <VideoThumbnail talk={talk} />
                        {talk.title_s}
                      </a>
                    </Hover>
                  </div>
                </div>
              )
            )
          }
        </Slider>
        <div 
          className="ui divider" 
        />
      </div>
    );
  }
}

class TopicPage extends React.Component<SearchPageProps, {}> {
  static dataStore = dataStore;

  private left: () => JSX.Element;
  private right: () => JSX.Element;
  private header: () => JSX.Element;
  private footer: () => JSX.Element;
  private rightRail: () => JSX.Element;

  constructor() {
    super();

    this.right = 
      () => (
        <div        
          style={{
            paddingLeft: '25px',
            paddingRight: '25px',
            paddingBottom: '35px',
          }}
        >          
          <div
            style={{
              marginLeft: '5px'                          
            }}
          >
            <Dropdown 
              text="Topic > Social Justice" 
              pointing={true} 
              className="link item"
            >
              <Dropdown.Menu>
                <Dropdown.Header>Computer Science</Dropdown.Header>
                <Dropdown.Item>
                  <Dropdown text="Trending Topics">
                    <Dropdown.Menu>
                      <Dropdown.Item>Artificial Intelligence</Dropdown.Item>
                      <Dropdown.Item>Cryptocurrency</Dropdown.Item>
                      <Dropdown.Item>Javascript</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>                  
                  <Dropdown text="Software Engineering">
                    <Dropdown.Menu>
                      <Dropdown.Item>Build Engineering</Dropdown.Item>
                      <Dropdown.Item>Project Management</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>                  
                  <Dropdown text="Data">
                    <Dropdown.Menu>
                      <Dropdown.Item>Data Science</Dropdown.Item>
                      <Dropdown.Item>Big Data</Dropdown.Item>
                      <Dropdown.Item>Databases</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>                
                <Dropdown.Header>Other Topics</Dropdown.Header>
                <Dropdown.Item>
                  <Dropdown text="Social Issues">
                    <Dropdown.Menu>
                      <Dropdown.Item>Social Justice</Dropdown.Item>
                      <Dropdown.Item>Feminism</Dropdown.Item>
                      <Dropdown.Item>Liberation Theology</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown text="Economics">
                    <Dropdown.Menu>
                      <Dropdown.Item>Socialism</Dropdown.Item>
                      <Dropdown.Item>Libertarianism</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown text="History">
                    <Dropdown.Menu>
                      <Dropdown.Item>Black History</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Order</Dropdown.Header>
                <Dropdown.Item>Status</Dropdown.Item>
                <Dropdown.Item>Cancellations</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <h4>
              Related Topics:&nbsp;
                <a>Socialism,&nbsp;</a> 
                <a>Feminism,&nbsp;</a> 
                <a>Black History,&nbsp;</a>
                <a>Liberation Theology,&nbsp;</a>
                <a>Non-profit management</a>
            </h4>
            <p>
              Social justice is a concept of fair and just relations 
              between the individual and society.

              The lectures below include major themes, influential speakers, 
              and primary source materials.
            </p>
          </div>
          <div
            style={{
              marginLeft: '5px',
              marginRight: '5px'
            }}
            className="ui divider" 
          />
          {
            searches.map(
              (savedSearch: SavedSearch, i: number) => (
                <Bound
                  key={i + ''}
                  dataStore={dataStore.talks.refine(
                    savedSearch.search
                  )}
                  render={
                    (talks: Talk[], pagination: PaginationData) => 
                      <VideoScroller 
                        key={i + ''}
                        talks={talks} 
                        title={savedSearch.title}
                      />
                  }
                />
              )
            )
          }
        </div>
      );

    this.header = () => (
      <div className="ui grid">
        <div         
          style={{
            marginLeft: '30px',
            marginRight: '30px'
          }}
          className="sixteen wide column"
        >
          <SearchBox
            placeholder="Search..."
            loading={false}
            sampleSearches={suggestions}
            transition={
              (params: SearchParams) => 
                (window as any).location = 
                  'https://www.findlectures.com/?q=' + params.query.replace(/ /g, '%20')
            }
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    // this isn't taking url props
    dataStore.talks.stateTransition(
      {
        type: 'QUERY', 
        query: this.props.query,
        page: this.props.page,
        facets: this.props.facets
      }
    );
  }

  componentWillReceiveProps(newProps: SearchPageProps) {
    dataStore.talks.stateTransition(
      {
        type: 'QUERY', 
        query: newProps.query,
        page: newProps.page,
        facets: this.props.facets
      }
    );
  }

  render() { 
    return (
      <ResultsLayout 
        leftComponent={this.left}
        rightComponent={this.right}
        headerComponent={this.header}
        footerComponent={this.footer}
        rightRailComponent={this.rightRail}
      />
    );
  }
}

export { TopicPage };