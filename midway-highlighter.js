var MidwayHighlighter = React.createClass({
  displayName: 'MidwayHighlighter',

  propTypes: {
    midway_element_styling: React.PropTypes.object,
    other_elements_styling: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      midway_element_styling: {},
      other_elements_styling: {
        opacity: 0.5,
        backgroundColor: 'black'
      }
    };
  },

  /* State
    dims            = array of top and bottom indices of the containers
    active          = default value -1.
    children_count  = no of children passed
  */

  getInitialState: function () {
    var children_count = React.Children.count(this.props.children);
    return { dims: [], active: -1, children_count: children_count };
  },

  /* Given an index, returns the ref name. Check out the render method 
    on how to set refs
  */

  _getRefName: function (index) {
    return "container_" + index;
  },

  /* Given a react container, find out the top offset of the element
  top = offset().top; 
  bottom = top + outerHeight(true)
   Now, top doesn't reflect the margin-top of the children. 
  So, we need to subtract that information to get the actual top
   */

  _fetchContainerPosition: function (react_element) {

    var jquery_handle = jQuery(ReactDOM.findDOMNode(react_element));
    var top = jquery_handle.offset().top;
    var bottom = top + jquery_handle.outerHeight(true);
    var margin_top = parseInt(jquery_handle.children().first().css('margin-top').replace('px', ''));
    var actual_top = top - margin_top;

    return { top: actual_top, bottom: bottom };
  },


  // Find the vertical midline of the window.
  _findMidwayPoint: function () {
    return (window.innerHeight / 2 + jQuery(window).scrollTop());
  },

  // Find if the given dimensions contain the midway point passed!
  _ifCordinatesFallBetween: function (dim, midway) {
    return (dim.top <= midway && dim.bottom >= midway);
  },

  /* Once the component is mounted, we should register the positions.
     These registered values are used to find out which element to be highlighted.
     On the component mount, we should find out what is the active index.
  */
  _registerPositions: function () {
    var active = this.state.active;
    var children_count = this.state.children_count;
    var dims = [];
    var midway = this._findMidwayPoint();
    for (i = 0; i < children_count; i += 1) {
      var ref = this.refs[this._getRefName(i)];
      dims[i] = this._fetchContainerPosition(ref);


      // on load, find the active index.
      if(this._ifCordinatesFallBetween(dims[i], midway))
        active = i;
    }

    this.setState({ dims: dims, active: active });
  },

  // Finds the index, which is containing the midline
  _findMidwayIndex: function () {
    var midway = this._findMidwayPoint();
    var active = -1;
    var dims = this.state.dims;

    // todo: move to binary search in the future
    for (i in dims) {
      var d = dims[i];
      if(this._ifCordinatesFallBetween(d, midway)) {
        active = i;
        break;
      }
    }

    return active;
  },

  // If the active element is updated, update this state
  handleScrollEvent: function () {
    var active_index = this._findMidwayIndex();
    if (this.state.active != active_index) {
      this.setState({ active: active_index });
    }
  },

  // Listen for scroll events and update the active element accordingly.
  _registerScrollEventListener: function () {
    window.addEventListener('scroll', this.handleScrollEvent);
  },

  // Register positions & register scrollevent listeneer
  componentDidMount: function () {
    this._registerPositions();
    this._registerScrollEventListener();
  },

  /* Wrap the passed children by divs. Change the state of the divs.
    Do not change the state of the children direclty.  */
  _wrapInsideDivs: function () {

    var active_index = this.state.active;
    var children = React.Children.toArray(this.props.children);

    var wrap = children.map(function (element, index) {
      var ref_name = this._getRefName(index);
      var styling = active_index == index ? this.props.midway_element_styling : this.props.other_elements_styling;
      return React.createElement(
        'div',
        { className: 'mh_container', key: index, ref: ref_name, style: styling },
        element
      );
    }, this);

    return wrap;
  },

  render: function () {

    return React.createElement(
      'div',
      { className: 'midway_highlighter' },
      this._wrapInsideDivs()
    );
  }

});

// integrate browserify later
if (typeof module != 'undefined') module.exports = MidwayHighlighter;

