"use strict";

exports.__esModule = true;
exports.default = undefined;

var _class, _temp;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("babel-polyfill");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var previousTouchMove = Symbol();
var scrolling = Symbol();
var wheelScroll = Symbol();
var touchMove = Symbol();
var touchStart = Symbol();
var touchEnd = Symbol();
var keyPress = Symbol();
var onWindowResized = Symbol();
var addNextComponent = Symbol();
var scrollWindowUp = Symbol();
var scrollWindowDown = Symbol();
var setRenderComponents = Symbol();
var _isMounted = Symbol();

var _isBodyScrollEnabled = Symbol();
var disableScroll = Symbol();
var enableScroll = Symbol();

var ANIMATION_TIMER = 200;
var KEY_UP = 38;
var KEY_DOWN = 40;
var DISABLED_CLASS_NAME = "rps-scroll--disabled";

var xDown = null;
var yDown = null;
var xDiff = null;
var yDiff = null;
var timeDown = null;
var startEl = null;

var ReactPageScroller = (_temp = _class = function (_React$Component) {
    _inherits(ReactPageScroller, _React$Component);

    function ReactPageScroller(props) {
        _classCallCheck(this, ReactPageScroller);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.componentDidMount = function () {
            _this[_isMounted] = true;

            window.addEventListener('resize', _this[onWindowResized]);

            _this._pageContainer.addEventListener("touchmove", _this[touchMove], false);
            _this._pageContainer.addEventListener("touchstart", _this[touchStart], false);
            _this._pageContainer.addEventListener("touchend", _this[touchEnd], false);
            _this._pageContainer.addEventListener("keydown", _this[keyPress]);

            var componentsToRenderLength = 0;

            if (!_lodash2.default.isNil(_this.props.children[_this.state.componentIndex])) {
                componentsToRenderLength++;
            } else {
                componentsToRenderLength++;
            }

            _this[addNextComponent](componentsToRenderLength);
        };

        _this.componentWillUnmount = function () {
            _this[_isMounted] = false;

            window.removeEventListener('resize', _this[onWindowResized]);

            _this._pageContainer.removeEventListener("touchmove", _this[touchMove]);
            _this._pageContainer.removeEventListener("touchstart", _this[touchMove]);
            _this._pageContainer.removeEventListener("touchend", _this[touchMove]);
            _this._pageContainer.removeEventListener("keydown", _this[keyPress]);
        };

        _this.goToPage = function (number) {
            var _this$props = _this.props,
                pageOnChange = _this$props.pageOnChange,
                children = _this$props.children;
            var _this$state = _this.state,
                componentIndex = _this$state.componentIndex,
                componentsToRenderLength = _this$state.componentsToRenderLength;


            var newComponentsToRenderLength = componentsToRenderLength;

            if (!_lodash2.default.isEqual(componentIndex, number)) {
                if (!_lodash2.default.isNil(_this["container_" + number]) && !_this[scrolling]) {

                    _this[scrolling] = true;
                    _this._pageContainer.style.transform = "translate3d(0, " + number * -100 + "%, 0)";

                    if (pageOnChange) {
                        pageOnChange(number + 1);
                    }

                    if (_lodash2.default.isNil(_this["container_" + (number + 1)]) && !_lodash2.default.isNil(children[number + 1])) {
                        newComponentsToRenderLength++;
                    }

                    setTimeout(function () {
                        _this.setState({ componentIndex: number, componentsToRenderLength: newComponentsToRenderLength }, function () {
                            _this[scrolling] = false;
                            _this[previousTouchMove] = null;
                        });
                    }, _this.props.animationTimer + ANIMATION_TIMER);
                } else if (!_this[scrolling] && !_lodash2.default.isNil(children[number])) {
                    for (var i = componentsToRenderLength; i <= number; i++) {
                        newComponentsToRenderLength++;
                    }

                    if (!_lodash2.default.isNil(children[number + 1])) {
                        newComponentsToRenderLength++;
                    }

                    _this[scrolling] = true;
                    _this.setState({
                        componentsToRenderLength: newComponentsToRenderLength
                    }, function () {
                        _this._pageContainer.style.transform = "translate3d(0, " + number * -100 + "%, 0)";

                        if (pageOnChange) {
                            pageOnChange(number + 1);
                        }

                        setTimeout(function () {
                            _this.setState({ componentIndex: number }, function () {
                                _this[scrolling] = false;
                                _this[previousTouchMove] = null;
                            });
                        }, _this.props.animationTimer + ANIMATION_TIMER);
                    });
                }
            }
        };

        _this[disableScroll] = function () {
            if (_this[_isBodyScrollEnabled]) {
                _this[_isBodyScrollEnabled] = false;
                window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                });
                document.body.classList.add(DISABLED_CLASS_NAME);
                document.documentElement.classList.add(DISABLED_CLASS_NAME);
            }
        };

        _this[enableScroll] = function () {
            if (!_this[_isBodyScrollEnabled]) {
                _this[_isBodyScrollEnabled] = true;
                document.body.classList.remove(DISABLED_CLASS_NAME);
                document.documentElement.classList.remove(DISABLED_CLASS_NAME);
            }
        };

        _this[wheelScroll] = function (event) {
            if (event.deltaY < 0) {
                _this[scrollWindowUp]();
            } else {
                _this[scrollWindowDown]();
            }
        };

        _this[touchMove] = function (e) {
            if (!xDown || !yDown) return;

            var xUp = e.touches[0].clientX;
            var yUp = e.touches[0].clientY;

            xDiff = xDown - xUp;
            yDiff = yDown - yUp;
        };

        _this[touchStart] = function (e) {
            startEl = e.target;

            timeDown = Date.now();
            xDown = e.touches[0].clientX;
            yDown = e.touches[0].clientY;
            xDiff = 0;
            yDiff = 0;
        };

        _this[touchEnd] = function (e) {
            // if the user released on a different target, cancel!
            if (startEl !== e.target) return;

            var swipeThreshold = 10; // default 10px
            var swipeTimeout = 1000; // default 1000ms
            var timeDiff = Date.now() - timeDown;

            if (Math.abs(xDiff) <= Math.abs(yDiff) && Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (yDiff > 0) {
                    _this[scrollWindowDown]();
                } else {
                    _this[scrollWindowUp]();
                }
            }

            // reset values
            xDown = null;
            yDown = null;
            timeDown = null;
        };

        _this[keyPress] = function (event) {
            if (_lodash2.default.isEqual(event.keyCode, KEY_UP)) {
                _this[scrollWindowUp]();
            }
            if (_lodash2.default.isEqual(event.keyCode, KEY_DOWN)) {
                _this[scrollWindowDown]();
            }
        };

        _this[onWindowResized] = function () {
            _this.forceUpdate();
        };

        _this[addNextComponent] = function (componentsToRenderOnMountLength) {
            var componentsToRenderLength = 0;

            if (!_lodash2.default.isNil(componentsToRenderOnMountLength)) {
                componentsToRenderLength = componentsToRenderOnMountLength;
            }

            componentsToRenderLength = Math.max(componentsToRenderLength, _this.state.componentsToRenderLength);

            if (componentsToRenderLength <= _this.state.componentIndex + 1) {
                if (!_lodash2.default.isNil(_this.props.children[_this.state.componentIndex + 1])) {
                    componentsToRenderLength++;
                }
            }

            _this.setState({
                componentsToRenderLength: componentsToRenderLength
            });
        };

        _this[setRenderComponents] = function () {
            var newComponentsToRender = [];

            var _loop = function _loop(i) {
                if (!_lodash2.default.isNil(_this.props.children[i])) {
                    newComponentsToRender.push(_react2.default.createElement(
                        "div",
                        { key: i, ref: function ref(c) {
                                return _this["container_" + i] = c;
                            },
                            style: { height: "100%", width: "100%" } },
                        _this.props.children[i]
                    ));
                } else {
                    return "break";
                }
            };

            for (var i = 0; i < _this.state.componentsToRenderLength; i++) {
                var _ret = _loop(i);

                if (_ret === "break") break;
            }

            return newComponentsToRender;
        };

        _this[scrollWindowUp] = function () {
            if (!_this[scrolling] && !_this.props.blockScrollUp) {
                if (!_lodash2.default.isNil(_this["container_" + (_this.state.componentIndex - 1)])) {
                    _this[disableScroll]();
                    _this[scrolling] = true;
                    _this._pageContainer.style.transform = "translate3d(0, " + (_this.state.componentIndex - 1) * -100 + "%, 0)";

                    if (_this.props.pageOnChange) {
                        _this.props.pageOnChange(_this.state.componentIndex);
                    }

                    setTimeout(function () {
                        _this[_isMounted] && _this.setState(function (prevState) {
                            return { componentIndex: prevState.componentIndex - 1 };
                        }, function () {
                            _this[scrolling] = false;
                            _this[previousTouchMove] = null;
                        });
                    }, _this.props.animationTimer + ANIMATION_TIMER);
                } else {
                    _this[enableScroll]();
                    if (_this.props.scrollUnavailable) {
                        _this.props.scrollUnavailable();
                    }
                }
            }
        };

        _this[scrollWindowDown] = function () {
            if (!_this[scrolling] && !_this.props.blockScrollDown) {
                if (!_lodash2.default.isNil(_this["container_" + (_this.state.componentIndex + 1)])) {
                    _this[disableScroll]();
                    _this[scrolling] = true;
                    _this._pageContainer.style.transform = "translate3d(0, " + (_this.state.componentIndex + 1) * -100 + "%, 0)";

                    if (_this.props.pageOnChange) {
                        _this.props.pageOnChange(_this.state.componentIndex + 2);
                    }

                    setTimeout(function () {
                        _this[_isMounted] && _this.setState(function (prevState) {
                            return { componentIndex: prevState.componentIndex + 1 };
                        }, function () {
                            _this[scrolling] = false;
                            _this[previousTouchMove] = null;
                            _this[addNextComponent]();
                        });
                    }, _this.props.animationTimer + ANIMATION_TIMER);
                } else {
                    _this[enableScroll]();
                    if (_this.props.scrollUnavailable) {
                        _this.props.scrollUnavailable();
                    }
                }
            }
        };

        _this.state = { componentIndex: 0, componentsToRenderLength: 0 };
        _this[previousTouchMove] = null;
        _this[scrolling] = false;
        _this[_isMounted] = false;
        _this[_isBodyScrollEnabled] = true;
        return _this;
    }

    ReactPageScroller.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            animationTimer = _props.animationTimer,
            transitionTimingFunction = _props.transitionTimingFunction,
            containerHeight = _props.containerHeight,
            containerWidth = _props.containerWidth;


        return _react2.default.createElement(
            "div",
            { style: { height: containerHeight, width: containerWidth, overflow: "hidden" } },
            _react2.default.createElement(
                "div",
                { ref: function ref(c) {
                        return _this2._pageContainer = c;
                    },
                    onWheel: this[wheelScroll],
                    style: {
                        height: "100%",
                        width: "100%",
                        transition: "transform " + animationTimer + "ms " + transitionTimingFunction
                    },
                    tabIndex: 0 },
                this[setRenderComponents]()
            )
        );
    };

    return ReactPageScroller;
}(_react2.default.Component), _class.defaultProps = {
    animationTimer: 1000,
    transitionTimingFunction: "ease-in-out",
    containerHeight: "100vh",
    containerWidth: "100vw",
    blockScrollUp: false,
    blockScrollDown: false
}, _temp);
exports.default = ReactPageScroller;
ReactPageScroller.propTypes = process.env.NODE_ENV !== "production" ? {
    animationTimer: _propTypes2.default.number,
    transitionTimingFunction: _propTypes2.default.string,
    pageOnChange: _propTypes2.default.func,
    scrollUnavailable: _propTypes2.default.func,
    containerHeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    containerWidth: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    blockScrollUp: _propTypes2.default.bool,
    blockScrollDown: _propTypes2.default.bool
} : {};
module.exports = exports["default"];