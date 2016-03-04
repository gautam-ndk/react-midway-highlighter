### What?
Given a list of vertically stacked non-overlapping elements, this component can be used to find out which element falls in the middle line (midway) of the window.

Once you figure out which element falls on the midway, we can highlight it with different styling. 

### Why?
Influenced by typeform, I wanted to have a similar functionality in my [pluckdp](http://pluckdp.theox.in) app. So, built it. OSSing it :-)

### Example
Clone the repo and open example/index.html in your browser. 

It fetches react,react-dom and jquery from script urls and uses jsx in-browser transformer . So, no need to worry about browserifying / reactifying / npming bullshit just to test.

Below is the snap of the example
![Sample](/example/sample.png?raw=true "Sample Snap")



### More details
#### How does it work?
* The component encapsulates the children passed with containers.
* Once, the component is mounted, it will take a note of all containers top & bottom positions. It registers scroll event callback as well. 
* When the window is scrolled, it checks which container the midway falls in and tada!
* Works with resizing of window as well.

#### Props?
```
 eventCallback: React.PropTypes.func
```
This is an optional function, the caller can pass, through which midway-highlighter can interact with the caller by sending events.

Function prototype has to be
```
  function (event_type, data)
```
event_type can be one of ['active', 'dims']

##### active
* 'active' event is triggered when a new element falls in the midway.
* data, in this case, is the active index id. Index starts from 0.

##### dims
* 'dims' event is triggered whenever the positions are calculated (onload / resize ..)
* data, in this case, is an array of dimensions  {top: , bottom: }


#### How to style midway element?

##### Way 1
* Register eventCallback
* Handle the 'active' event and style the midway element accordingly.
 
##### Way 2
* The encapsulating containers have mh_container class. 
* For midway elements, the container's class will have an addition class 'active'.
* Using this info, you should be able to style. 

#### Dependencies
Depends on react, react-dom and jquery. This component assumes all the global variables already exist.

##### Why are't they included in package.json
Personally, I think this whole npm js eco-system is screwed up. Or may be am too new to it.

Few points being: 
* [My twitter rant](https://twitter.com/dhunnapotha/status/705225192239304704)
* Am assuming whoever uses it already have all the dependencies installed / can install dependencies on their own. 
* I spent around 3 hrs making this and being a newbie to this eco system, I spent around 2.5 days trying to fix the interoperability issues of browserify-rails, react-rails + duplicate inclusion of reactjs from some of the dependencies etc.. Thought I will understand and fix it later. Any help here is appreciated.


### Open Issues
* Internally, we register the positions using jQuery .offset(). It has its limitations with margins, which anyways has a work around. I will work on it when I get time.
* Currently, the component doesn't work well when the children height's change (for eg: with a click). The positions are not updated accordingly.

### Contributing
Feel free to send PR.

### Any other doubts? 
Please create an issue.

