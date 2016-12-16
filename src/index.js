import React, { Component } from 'react';
import './style.scss';

class TestPull extends Component {
  constructor () {
    super()
    this.pullStartY = null
    this.pullMoveY = null
    this.dist = 0
    this.distResisted = 0
    this.distTreshold= 50
    this.distMax= 80
    this.distReload= 50
  this.state = {
    pullState: 'pending',
    height: 0
    // pullState: 'refreshing',
    // height: 100
  }
  }


  componentDidMount () {
    window.addEventListener('touchstart', e => { 
      this.pullStartY = e.touches[0].screenY
    })

    window.addEventListener('touchmove', e => {
      event.preventDefault()
      this.pullMoveY = e.touches[0].screenY;
      this.dist = this.pullMoveY - this.pullStartY;
      if(this.dist > 0){
        this.distResisted = this.resistanceFunction(this.dist / this.distTreshold) * Math.min(this.distMax, this.dist);
        this.setState({height: this.distResisted})
        // pull outside distTreshold
        if(this.distResisted > this.distTreshold){
          console.log('in releasing state')
          this.setState({pullState: 'releasing'})
        }else{
        // pull inside distTreshold
          console.log('in pulling state')
          this.setState({pullState: 'pulling'})
        }
      }
    })
    window.addEventListener('touchend', e => {
      console.log('this.distResisted:', this.distResisted)
      // leave finger outside distTreshold
      if(this.distResisted > this.distTreshold){
        console.log('in refreshing state')
        this.setState({pullState: 'refreshing'})

        // reset
        // this.props.onRefresh().then( res => {
        //   // alert(res)
        //   this.setState({pullState: 'pending'})
        // })
        setTimeout(_=>{this.setState({pullState: 'pending'})},1000)
        this.distResisted = 0
      }else{
        // leave finger inside distTreshold
        console.log('in pending state')
        this.setState({pullState: 'pending'})
      }
    })
  }

  resistanceFunction (t){
    return Math.min(1, t / 2.5)
  }
  getTextElement() {
    const {instructionsReleaseToRefresh, instructionsPullToRefresh, instructionsRefreshing} = this.props
    if (this.state.pullState === 'releasing') {
      return instructionsReleaseToRefresh;
    }

    if (this.state.pullState === 'pulling' ) {
      return instructionsPullToRefresh;
    }

    if (this.state.pullState === 'refreshing') {
      return instructionsRefreshing;
    }      
  }

  getIconElement() {
    const {iconRefreshing, iconArrow} = this.props
    if (this.state.pullState === 'refreshing'){
      return iconRefreshing;
    } 

    if (this.state.pullState === 'pulling' ){
      return iconArrow;
    }

    if (this.state.pullState === 'releasing' ){
      return iconArrow;
    }
  }

  render() {
    // 拉的时候没有transition
    let stateClass = ''
    if(this.state.pullState === 'pulling' ||
       this.state.pullState === 'releasing'){
      stateClass = 'testPull--pulling'
    }

    let style = {'height': this.state.height}
    if(this.state.pullState === 'refreshing'){
      style = {'height': '50px'}
    }
    if(this.state.pullState === 'pending'){
      style = {'height': '0px'}
    }

    let iconStyle = {}
    if(this.state.pullState === 'releasing'){
      iconStyle = { 'transform': 'rotate(180deg)', 'transition': 'transform 0.2s'}
    }else{
      iconStyle = { 'transition': 'transform 0.2s'}
    }

    const iconEl = this.getIconElement()
    const textEl = this.getTextElement()

    return (
      <div className={`testPull ${stateClass}`} style={style}>
        <div className="testPull--content">
          <div className="testPull--icon" dangerouslySetInnerHTML={{__html: iconEl}} style={iconStyle}></div>
          <div className="testPull--text">{ textEl }</div>
        </div>
      </div>
    );
  }
}

TestPull.propTypes = {
  iconArrow: React.PropTypes.string,
  iconRefreshing: React.PropTypes.string,
  instructionsReleaseToRefresh: React.PropTypes.string,
  instructionsPullToRefresh: React.PropTypes.string,
  instructionsRefreshing: React.PropTypes.string,
  onRefresh: React.PropTypes.func,
  refreshTimeout: React.PropTypes.number
};

TestPull.defaultProps = {
  iconArrow: '&#8675;',
  iconRefreshing: '&hellip;',
  instructionsPullToRefresh: 'Pull down to refresh',
  instructionsReleaseToRefresh: 'Release to refresh',
  instructionsRefreshing: 'Refreshing',
  onRefresh: ()=>{},
  refreshTimeout: 500
};

export default TestPull;
