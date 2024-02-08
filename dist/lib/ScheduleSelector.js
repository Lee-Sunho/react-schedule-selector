"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.preventScroll = exports.GridCell = void 0;

var React = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _add_minutes = _interopRequireDefault(require("date-fns/add_minutes"));

var _add_hours = _interopRequireDefault(require("date-fns/add_hours"));

var _start_of_day = _interopRequireDefault(require("date-fns/start_of_day"));

var _is_same_minute = _interopRequireDefault(require("date-fns/is_same_minute"));

var _format = _interopRequireDefault(require("date-fns/format"));

var _typography = require("./typography");

var _colors = _interopRequireDefault(require("./colors"));

var _selectionSchemes = _interopRequireDefault(require("./selection-schemes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Wrapper = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Wrapper",
  componentId: "sc-1ke4ka2-0"
})(["display:flex;align-items:center;width:100%;user-select:none;"]);

const Grid = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Grid",
  componentId: "sc-1ke4ka2-1"
})(["display:grid;grid-template-columns:auto repeat(", ",1fr);grid-template-rows:auto repeat(", ",1fr);column-gap:", ";row-gap:", ";width:100%;"], props => props.columns, props => props.rows, props => props.columnGap, props => props.rowGap);

const GridCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__GridCell",
  componentId: "sc-1ke4ka2-2"
})(["place-self:stretch;touch-action:none;"]);

exports.GridCell = GridCell;

const getDateCellColor = props => {
  if (props.blocked) {
    return props.blockedColor;
  } else if (props.selected) {
    return props.selectedColor;
  } else {
    return props.unselectedColor;
  }
};

const DateCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__DateCell",
  componentId: "sc-1ke4ka2-3"
})(["width:100%;height:25px;background-color:", ";", ""], getDateCellColor, props => !props.blocked ? "\n    &:hover {\n      background-color: ".concat(props.hoveredColor, ";\n    }\n  ") : '');

const DateLabel = (0, _styledComponents.default)(_typography.Subtitle).withConfig({
  displayName: "ScheduleSelector__DateLabel",
  componentId: "sc-1ke4ka2-4"
})(["@media (max-width:699px){font-size:12px;}margin:0;margin-bottom:4px;"]);
const TimeText = (0, _styledComponents.default)(_typography.Text).withConfig({
  displayName: "ScheduleSelector__TimeText",
  componentId: "sc-1ke4ka2-5"
})(["@media (max-width:699px){font-size:10px;}text-align:right;margin:0;margin-right:4px;"]);

const preventScroll = e => {
  e.preventDefault();
};

exports.preventScroll = preventScroll;

class ScheduleSelector extends React.Component {
  // documentMouseUpHandler: () => void = () => {}
  // endSelection: () => void = () => {}
  // handleTouchMoveEvent: (event: React.SyntheticTouchEvent<*>) => void
  // handleTouchEndEvent: () => void
  // handleMouseUpEvent: (date: Date) => void
  // handleMouseEnterEvent: (date: Date) => void
  // handleSelectionStartEvent: (date: Date) => void
  static getDerivedStateFromProps(props, state) {
    // As long as the user isn't in the process of selecting, allow prop changes to re-populate selection state
    if (state.selectionStart == null) {
      return {
        selectionDraft: [...props.selection],
        dates: ScheduleSelector.computeDatesMatrix(props)
      };
    }

    return null;
  }
  /* 
  static computeDatesMatrix(props: PropsType): Array<Array<Date>> {
    const startTime = startOfDay(props.startDate)
    const dates: Array<Array<Date>> = []
    const minutesInChunk = Math.floor(60 / props.hourlyChunks)
    for (let d = 0; d < props.numDays; d += 1) {
      const currentDay = []
      for (let h = props.minTime; h < props.maxTime; h += 1) {
        for (let c = 0; c < props.hourlyChunks; c += 1) {
          currentDay.push(addMinutes(addHours(addDays(startTime, d), h), c * minutesInChunk))
        }
      }
      dates.push(currentDay)
    }
    return dates
  }
  */


  static computeDatesMatrix(props) {
    // const startTime = startOfDay(props.startDate)
    const dates = [];
    const minutesInChunk = Math.floor(60 / props.hourlyChunks);
    props.renderingDates.forEach(renderingDate => {
      const currentDay = [];
      const currentDate = (0, _start_of_day.default)(renderingDate);

      for (let h = props.minTime; h <= props.maxTime; h += 1) {
        // 시간이 maxTime이고 청크가 hourlyChunks보다 작을 때만 반복하여 maxTime이 포함되게 (이선호 추가)
        for (let c = 0; c < props.hourlyChunks && !(h === props.maxTime && c === props.hourlyChunks - 1); c += 1) {
          currentDay.push((0, _add_minutes.default)((0, _add_hours.default)(currentDate, h), c * minutesInChunk));
        }
      }

      dates.push(currentDay);
    });
    return dates;
  }

  constructor(props) {
    super(props);
    this.cellToDate = new Map();
    this.gridRef = null;

    this.renderDateCellWrapper = time => {
      const startHandler = () => {
        this.handleSelectionStartEvent(time);
      };

      const selected = Boolean(this.state.selectionDraft.find(a => (0, _is_same_minute.default)(a, time)));
      const blocked = this.isTimeBlocked(time);
      const unblockedCellProps = {
        // Mouse handlers
        onMouseDown: startHandler,
        onMouseEnter: () => {
          this.handleMouseEnterEvent(time);
        },
        onMouseUp: () => {
          this.handleMouseUpEvent(time);
        },
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        onTouchStart: startHandler,
        onTouchMove: this.handleTouchMoveEvent,
        onTouchEnd: this.handleTouchEndEvent
      };
      return /*#__PURE__*/React.createElement(GridCell, _extends({
        className: "rgdp__grid-cell",
        role: "presentation",
        key: time.toISOString()
      }, !blocked ? unblockedCellProps : {}), this.renderDateCell(time, selected, blocked));
    };

    this.renderDateCell = (time, selected, blocked) => {
      const refSetter = dateCell => {
        if (dateCell) {
          this.cellToDate.set(dateCell, time);
        }
      };

      if (this.props.renderDateCell) {
        return this.props.renderDateCell(time, selected, blocked, refSetter);
      } else {
        return /*#__PURE__*/React.createElement(DateCell, {
          blocked: blocked,
          selected: selected,
          ref: refSetter,
          selectedColor: this.props.selectedColor,
          unselectedColor: this.props.unselectedColor,
          hoveredColor: this.props.hoveredColor,
          blockedColor: this.props.blockedColor
        });
      }
    };

    this.renderTimeLabel = time => {
      if (this.props.renderTimeLabel) {
        return this.props.renderTimeLabel(time);
      } else {
        return /*#__PURE__*/React.createElement(TimeText, null, (0, _format.default)(time, this.props.timeFormat));
      }
    };

    this.renderDateLabel = date => {
      if (this.props.renderDateLabel) {
        return this.props.renderDateLabel(date);
      } else {
        return /*#__PURE__*/React.createElement(DateLabel, null, (0, _format.default)(date, this.props.dateFormat));
      }
    };

    this.state = {
      selectionDraft: [...this.props.selection],
      // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false,
      dates: ScheduleSelector.computeDatesMatrix(props)
    };
    this.selectionSchemeHandlers = {
      linear: _selectionSchemes.default.linear,
      square: _selectionSchemes.default.square
    };
    this.endSelection = this.endSelection.bind(this);
    this.handleMouseUpEvent = this.handleMouseUpEvent.bind(this);
    this.handleMouseEnterEvent = this.handleMouseEnterEvent.bind(this);
    this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this);
    this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this);
    this.handleSelectionStartEvent = this.handleSelectionStartEvent.bind(this);
  }

  componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection); // Prevent page scrolling when user is dragging on the date cells

    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, {
          passive: false
        });
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection);
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.removeEventListener) {
        // @ts-ignore
        dateCell.removeEventListener('touchmove', preventScroll);
      }
    });
  } // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.


  getTimeFromTouchEvent(event) {
    const {
      touches
    } = event;
    if (!touches || touches.length === 0) return null;
    const {
      clientX,
      clientY
    } = touches[0];
    const targetElement = document.elementFromPoint(clientX, clientY);

    if (targetElement) {
      const cellTime = this.cellToDate.get(targetElement);
      return cellTime !== null && cellTime !== void 0 ? cellTime : null;
    }

    return null;
  }

  endSelection() {
    this.props.onChange(this.state.selectionDraft);
    this.setState({
      selectionType: null,
      selectionStart: null
    });
  } // Given an ending Date, determines all the dates that should be selected in this draft


  updateAvailabilityDraft(selectionEnd, callback) {
    const {
      selectionType,
      selectionStart
    } = this.state;
    if (selectionType === null || selectionStart === null) return;
    let newSelection = [];

    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.state.dates).filter(selectedTime => !this.isTimeBlocked(selectedTime));
    }

    let nextDraft = [...this.props.selection];

    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]));
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => (0, _is_same_minute.default)(a, b)));
    }

    this.setState({
      selectionDraft: nextDraft
    }, callback);
  }

  isTimeBlocked(time) {
    if (this.props.availableTimes) {
      return this.props.availableTimes.find(availableTime => availableTime.toISOString() === time.toISOString()) === undefined;
    }

    return false;
  } // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input


  handleSelectionStartEvent(startTime) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = this.props.selection.find(a => (0, _is_same_minute.default)(a, startTime));
    this.setState({
      selectionType: timeSelected ? 'remove' : 'add',
      selectionStart: startTime
    });
  }

  handleMouseEnterEvent(time) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time);
  }

  handleMouseUpEvent(time) {
    this.updateAvailabilityDraft(time); // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  handleTouchMoveEvent(event) {
    this.setState({
      isTouchDragging: true
    });
    const cellTime = this.getTimeFromTouchEvent(event);

    if (cellTime) {
      this.updateAvailabilityDraft(cellTime);
    }
  }

  handleTouchEndEvent() {
    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, () => {
        this.endSelection();
      });
    } else {
      this.endSelection();
    }

    this.setState({
      isTouchDragging: false
    });
  }

  renderFullDateGrid() {
    const flattenedDates = [];
    const numDays = this.state.dates.length;
    const numTimes = this.state.dates[0].length;

    for (let j = 0; j < numTimes - 1; j += 1) {
      // numTimes - 1을 통해 마지막 시간은 셀 생성하지 않게 (이선호 추가)
      for (let i = 0; i < numDays; i += 1) {
        flattenedDates.push(this.state.dates[i][j]);
      }
    }

    const dateGridElements = flattenedDates.map(this.renderDateCellWrapper);

    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays;
      const time = this.state.dates[0][i]; // Inject the time label at the start of every row

      dateGridElements.splice(index + i, 0, this.renderTimeLabel(time));
    }

    return [
    /*#__PURE__*/
    // Empty top left corner
    React.createElement("div", {
      key: "topleft"
    }), // Top row of dates
    ...this.state.dates.map((dayOfTimes, index) => /*#__PURE__*/React.cloneElement(this.renderDateLabel(dayOfTimes[0]), {
      key: "date-".concat(index)
    })), // Every row after that
    ...dateGridElements.map((element, index) => /*#__PURE__*/React.cloneElement(element, {
      key: "time-".concat(index)
    }))];
  }

  render() {
    return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Grid, {
      columns: this.state.dates.length,
      rows: this.state.dates[0].length,
      columnGap: this.props.columnGap,
      rowGap: this.props.rowGap,
      ref: el => {
        this.gridRef = el;
      }
    }, this.renderFullDateGrid()));
  }

}

exports.default = ScheduleSelector;
ScheduleSelector.defaultProps = {
  selection: [],
  selectionScheme: 'square',
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  hourlyChunks: 1,
  // startDate: new Date(),
  // 이선호 추가
  renderingDates: [],
  timeFormat: 'ha',
  dateFormat: 'M/D',
  columnGap: '4px',
  rowGap: '4px',
  selectedColor: _colors.default.blue,
  unselectedColor: _colors.default.paleBlue,
  hoveredColor: _colors.default.lightBlue,
  // availableTimes: [], // 이선호 추가
  blockedColor: '#f1f1f2',
  // 이선호 추가
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsIkRhdGVDZWxsIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwiZGF0ZXMiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsInJlbmRlcmluZ0RhdGVzIiwiZm9yRWFjaCIsInJlbmRlcmluZ0RhdGUiLCJjdXJyZW50RGF5IiwiY3VycmVudERhdGUiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImNvbnN0cnVjdG9yIiwiY2VsbFRvRGF0ZSIsIk1hcCIsImdyaWRSZWYiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJ0aW1lIiwic3RhcnRIYW5kbGVyIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsIkJvb2xlYW4iLCJmaW5kIiwiYSIsImlzVGltZUJsb2NrZWQiLCJ1bmJsb2NrZWRDZWxsUHJvcHMiLCJvbk1vdXNlRG93biIsIm9uTW91c2VFbnRlciIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsIm9uTW91c2VVcCIsImhhbmRsZU1vdXNlVXBFdmVudCIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwiaGFuZGxlVG91Y2hNb3ZlRXZlbnQiLCJvblRvdWNoRW5kIiwiaGFuZGxlVG91Y2hFbmRFdmVudCIsInRvSVNPU3RyaW5nIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJkYXRlQ2VsbCIsInNldCIsInJlbmRlclRpbWVMYWJlbCIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInNlbGVjdGlvblR5cGUiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJlbmRTZWxlY3Rpb24iLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2YWx1ZSIsInBhc3NpdmUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJnZXQiLCJvbkNoYW5nZSIsInNldFN0YXRlIiwidXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQiLCJzZWxlY3Rpb25FbmQiLCJjYWxsYmFjayIsIm5ld1NlbGVjdGlvbiIsInNlbGVjdGlvblNjaGVtZSIsImZpbHRlciIsInNlbGVjdGVkVGltZSIsIm5leHREcmFmdCIsIkFycmF5IiwiZnJvbSIsIlNldCIsImIiLCJhdmFpbGFibGVUaW1lcyIsImF2YWlsYWJsZVRpbWUiLCJ1bmRlZmluZWQiLCJzdGFydFRpbWUiLCJ0aW1lU2VsZWN0ZWQiLCJyZW5kZXJGdWxsRGF0ZUdyaWQiLCJmbGF0dGVuZWREYXRlcyIsIm51bURheXMiLCJudW1UaW1lcyIsImoiLCJpIiwiZGF0ZUdyaWRFbGVtZW50cyIsIm1hcCIsImluZGV4Iiwic3BsaWNlIiwiZGF5T2ZUaW1lcyIsImNsb25lRWxlbWVudCIsImtleSIsImVsZW1lbnQiLCJyZW5kZXIiLCJlbCIsImRlZmF1bHRQcm9wcyIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLE9BQU8sR0FBR0MsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsb0VBQWI7O0FBT0EsTUFBTUMsSUFBSSxHQUFHRiwwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSxtSkFFNkJFLEtBQUssSUFBSUEsS0FBSyxDQUFDQyxPQUY1QyxFQUcwQkQsS0FBSyxJQUFJQSxLQUFLLENBQUNFLElBSHpDLEVBSU1GLEtBQUssSUFBSUEsS0FBSyxDQUFDRyxTQUpyQixFQUtHSCxLQUFLLElBQUlBLEtBQUssQ0FBQ0ksTUFMbEIsQ0FBVjs7QUFTTyxNQUFNQyxRQUFRLEdBQUdSLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLDZDQUFkOzs7O0FBY1AsTUFBTVEsZ0JBQWdCLEdBQUlOLEtBQUQsSUFBMEI7QUFDakQsTUFBSUEsS0FBSyxDQUFDTyxPQUFWLEVBQW1CO0FBQ2pCLFdBQU9QLEtBQUssQ0FBQ1EsWUFBYjtBQUNELEdBRkQsTUFFTyxJQUFJUixLQUFLLENBQUNTLFFBQVYsRUFBb0I7QUFDekIsV0FBT1QsS0FBSyxDQUFDVSxhQUFiO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsV0FBT1YsS0FBSyxDQUFDVyxlQUFiO0FBQ0Q7QUFDRixDQVJEOztBQVVBLE1BQU1DLFFBQVEsR0FBR2YsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsMERBR1FRLGdCQUhSLEVBS1ZOLEtBQUssSUFDTCxDQUFDQSxLQUFLLENBQUNPLE9BQVAsc0RBR3NCUCxLQUFLLENBQUNhLFlBSDVCLG9C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QUFZLEVBQUUsU0FsQjBCO0FBa0JmO0FBQ3pCK0YsRUFBQUEsUUFBUSxFQUFFLE1BQU0sQ0FBRTtBQW5Cc0IsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cydcblxuLy8gSW1wb3J0IG9ubHkgdGhlIG1ldGhvZHMgd2UgbmVlZCBmcm9tIGRhdGUtZm5zIGluIG9yZGVyIHRvIGtlZXAgYnVpbGQgc2l6ZSBzbWFsbFxuaW1wb3J0IGFkZE1pbnV0ZXMgZnJvbSAnZGF0ZS1mbnMvYWRkX21pbnV0ZXMnXG5pbXBvcnQgYWRkSG91cnMgZnJvbSAnZGF0ZS1mbnMvYWRkX2hvdXJzJ1xuaW1wb3J0IGFkZERheXMgZnJvbSAnZGF0ZS1mbnMvYWRkX2RheXMnXG5pbXBvcnQgc3RhcnRPZkRheSBmcm9tICdkYXRlLWZucy9zdGFydF9vZl9kYXknXG5pbXBvcnQgaXNTYW1lTWludXRlIGZyb20gJ2RhdGUtZm5zL2lzX3NhbWVfbWludXRlJ1xuaW1wb3J0IGZvcm1hdERhdGUgZnJvbSAnZGF0ZS1mbnMvZm9ybWF0J1xuXG5pbXBvcnQgeyBUZXh0LCBTdWJ0aXRsZSB9IGZyb20gJy4vdHlwb2dyYXBoeSdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnXG5pbXBvcnQgc2VsZWN0aW9uU2NoZW1lcywgeyBTZWxlY3Rpb25TY2hlbWVUeXBlLCBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9zZWxlY3Rpb24tc2NoZW1lcydcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbmBcblxuY29uc3QgR3JpZCA9IHN0eWxlZC5kaXY8eyBjb2x1bW5zOiBudW1iZXI7IHJvd3M6IG51bWJlcjsgY29sdW1uR2FwOiBzdHJpbmc7IHJvd0dhcDogc3RyaW5nIH0+YFxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMuY29sdW1uc30sIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5yb3dzfSwgMWZyKTtcbiAgY29sdW1uLWdhcDogJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5HYXB9O1xuICByb3ctZ2FwOiAke3Byb3BzID0+IHByb3BzLnJvd0dhcH07XG4gIHdpZHRoOiAxMDAlO1xuYFxuXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxuICBwbGFjZS1zZWxmOiBzdHJldGNoO1xuICB0b3VjaC1hY3Rpb246IG5vbmU7XG5gXG5cbnR5cGUgRGF0ZUNlbGxQcm9wcyA9IHtcbiAgYmxvY2tlZDogYm9vbGVhblxuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgZ2V0RGF0ZUNlbGxDb2xvciA9IChwcm9wczogRGF0ZUNlbGxQcm9wcykgPT4ge1xuICBpZiAocHJvcHMuYmxvY2tlZCkge1xuICAgIHJldHVybiBwcm9wcy5ibG9ja2VkQ29sb3JcbiAgfSBlbHNlIGlmIChwcm9wcy5zZWxlY3RlZCkge1xuICAgIHJldHVybiBwcm9wcy5zZWxlY3RlZENvbG9yXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb3BzLnVuc2VsZWN0ZWRDb2xvclxuICB9XG59XG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjxEYXRlQ2VsbFByb3BzPmBcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMjVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtnZXREYXRlQ2VsbENvbG9yfTtcblxuICAke3Byb3BzID0+XG4gICAgIXByb3BzLmJsb2NrZWRcbiAgICAgID8gYFxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYFxuICAgICAgOiAnJ31cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIG1hcmdpbjogMDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xuYFxuXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xuYFxuXG50eXBlIFByb3BzVHlwZSA9IHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIC8vc3RhcnREYXRlOiBEYXRlXG4gIHJlbmRlcmluZ0RhdGVzOiBEYXRlW10gLy8g7J207ISg7Zi4IOy2lOqwgFxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcDogc3RyaW5nXG4gIHJvd0dhcDogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xuICBhdmFpbGFibGVUaW1lczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoXG4gICAgZGF0ZXRpbWU6IERhdGUsXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW4sXG4gICAgYmxvY2tlZDogYm9vbGVhbixcbiAgICByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkXG4gICkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG50eXBlIFN0YXRlVHlwZSA9IHtcbiAgLy8gSW4gdGhlIGNhc2UgdGhhdCBhIHVzZXIgaXMgZHJhZy1zZWxlY3RpbmcsIHdlIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzLnByb3BzLm9uQ2hhbmdlKCkgdW50aWwgdGhleSBoYXZlIGNvbXBsZXRlZFxuICAvLyB0aGUgZHJhZy1zZWxlY3QuIHNlbGVjdGlvbkRyYWZ0IHNlcnZlcyBhcyBhIHRlbXBvcmFyeSBjb3B5IGR1cmluZyBkcmFnLXNlbGVjdHMuXG4gIHNlbGVjdGlvbkRyYWZ0OiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlIHwgbnVsbFxuICBzZWxlY3Rpb25TdGFydDogRGF0ZSB8IG51bGxcbiAgaXNUb3VjaERyYWdnaW5nOiBib29sZWFuXG4gIGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj5cbn1cblxuZXhwb3J0IGNvbnN0IHByZXZlbnRTY3JvbGwgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wc1R5cGUsIFN0YXRlVHlwZT4ge1xuICBzZWxlY3Rpb25TY2hlbWVIYW5kbGVyczogeyBba2V5OiBzdHJpbmddOiAoc3RhcnREYXRlOiBEYXRlLCBlbmREYXRlOiBEYXRlLCBmb286IEFycmF5PEFycmF5PERhdGU+PikgPT4gRGF0ZVtdIH1cbiAgY2VsbFRvRGF0ZTogTWFwPEVsZW1lbnQsIERhdGU+ID0gbmV3IE1hcCgpXG4gIC8vIGRvY3VtZW50TW91c2VVcEhhbmRsZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxuICAvLyBlbmRTZWxlY3Rpb246ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxuICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudDogKGV2ZW50OiBSZWFjdC5TeW50aGV0aWNUb3VjaEV2ZW50PCo+KSA9PiB2b2lkXG4gIC8vIGhhbmRsZVRvdWNoRW5kRXZlbnQ6ICgpID0+IHZvaWRcbiAgLy8gaGFuZGxlTW91c2VVcEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZUVudGVyRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIGdyaWRSZWY6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7XG4gICAgc2VsZWN0aW9uOiBbXSxcbiAgICBzZWxlY3Rpb25TY2hlbWU6ICdzcXVhcmUnLFxuICAgIG51bURheXM6IDcsXG4gICAgbWluVGltZTogOSxcbiAgICBtYXhUaW1lOiAyMyxcbiAgICBob3VybHlDaHVua3M6IDEsXG4gICAgLy8gc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICAgIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgICByZW5kZXJpbmdEYXRlczogW10sXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcbiAgICBkYXRlRm9ybWF0OiAnTS9EJyxcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxuICAgIHJvd0dhcDogJzRweCcsXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAgIC8vIGF2YWlsYWJsZVRpbWVzOiBbXSwgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIGJsb2NrZWRDb2xvcjogJyNmMWYxZjInLCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wc1R5cGUsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcbiAgICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIGlzbid0IGluIHRoZSBwcm9jZXNzIG9mIHNlbGVjdGluZywgYWxsb3cgcHJvcCBjaGFuZ2VzIHRvIHJlLXBvcHVsYXRlIHNlbGVjdGlvbiBzdGF0ZVxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnByb3BzLnNlbGVjdGlvbl0sXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qIFxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZXNcbiAgfVxuICAqL1xuXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gICAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuXG4gICAgcHJvcHMucmVuZGVyaW5nRGF0ZXMuZm9yRWFjaChyZW5kZXJpbmdEYXRlID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBzdGFydE9mRGF5KHJlbmRlcmluZ0RhdGUpXG5cbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDw9IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICAvLyDsi5zqsITsnbQgbWF4VGltZeydtOqzoCDssq3tgazqsIAgaG91cmx5Q2h1bmtz67O064ukIOyekeydhCDrlYzrp4wg67CY67O17ZWY7JesIG1heFRpbWXsnbQg7Y+s7ZWo65CY6rKMICjsnbTshKDtmLgg7LaU6rCAKVxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rcyAmJiAhKGggPT09IHByb3BzLm1heFRpbWUgJiYgYyA9PT0gcHJvcHMuaG91cmx5Q2h1bmtzIC0gMSk7IGMgKz0gMSkge1xuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGN1cnJlbnREYXRlLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH0pXG4gICAgcmV0dXJuIGRhdGVzXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNUeXBlKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl0sIC8vIGNvcHkgaXQgb3ZlclxuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxuICAgICAgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzID0ge1xuICAgICAgbGluZWFyOiBzZWxlY3Rpb25TY2hlbWVzLmxpbmVhcixcbiAgICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgICB9XG5cbiAgICB0aGlzLmVuZFNlbGVjdGlvbiA9IHRoaXMuZW5kU2VsZWN0aW9uLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG5cbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuY2VsbFRvRGF0ZS5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBlbmRTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsXG4gICAgfSlcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsLCBjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcbiAgICBjb25zdCB7IHNlbGVjdGlvblR5cGUsIHNlbGVjdGlvblN0YXJ0IH0gPSB0aGlzLnN0YXRlXG5cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gbnVsbCB8fCBzZWxlY3Rpb25TdGFydCA9PT0gbnVsbCkgcmV0dXJuXG5cbiAgICBsZXQgbmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPiA9IFtdXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0ICYmIHNlbGVjdGlvbkVuZCAmJiBzZWxlY3Rpb25UeXBlKSB7XG4gICAgICBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzW3RoaXMucHJvcHMuc2VsZWN0aW9uU2NoZW1lXShcbiAgICAgICAgc2VsZWN0aW9uU3RhcnQsXG4gICAgICAgIHNlbGVjdGlvbkVuZCxcbiAgICAgICAgdGhpcy5zdGF0ZS5kYXRlc1xuICAgICAgKS5maWx0ZXIoc2VsZWN0ZWRUaW1lID0+ICF0aGlzLmlzVGltZUJsb2NrZWQoc2VsZWN0ZWRUaW1lKSlcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXVxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3Rpb25EcmFmdDogbmV4dERyYWZ0IH0sIGNhbGxiYWNrKVxuICB9XG5cbiAgaXNUaW1lQmxvY2tlZCh0aW1lOiBEYXRlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYXZhaWxhYmxlVGltZXMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucHJvcHMuYXZhaWxhYmxlVGltZXMuZmluZChhdmFpbGFibGVUaW1lID0+IGF2YWlsYWJsZVRpbWUudG9JU09TdHJpbmcoKSA9PT0gdGltZS50b0lTT1N0cmluZygpKSA9PT1cbiAgICAgICAgdW5kZWZpbmVkXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25UeXBlOiB0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZTogRGF0ZSkge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gIH1cblxuICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZTogRGF0ZSkge1xuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxuICB9XG5cbiAgaGFuZGxlVG91Y2hNb3ZlRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiB0cnVlIH0pXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcbiAgICBpZiAoY2VsbFRpbWUpIHtcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICAvLyBHb2luZyBkb3duIHRoaXMgYnJhbmNoIG1lYW5zIHRoZSB1c2VyIHRhcHBlZCBidXQgZGlkbid0IGRyYWcgLS0gd2hpY2hcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXG4gICAgICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudCB3YXMgbmV2ZXIgY2FsbGVkKSBzbyB3ZSBuZWVkIHRvIGRvIGl0IG5vd1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChudWxsLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogZmFsc2UgfSlcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbih0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuICAgIGNvbnN0IGJsb2NrZWQgPSB0aGlzLmlzVGltZUJsb2NrZWQodGltZSlcblxuICAgIGNvbnN0IHVuYmxvY2tlZENlbGxQcm9wcyA9IHtcbiAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXG4gICAgICBvbk1vdXNlRG93bjogc3RhcnRIYW5kbGVyLFxuICAgICAgb25Nb3VzZUVudGVyOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWUpXG4gICAgICB9LFxuICAgICAgb25Nb3VzZVVwOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICB9LFxuICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcbiAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgIC8vIGluIHRoZSB0aW1lIHBhcmFtZXRlciwgaW5zdGVhZCB0aGVzZSBoYW5kbGVycyB3aWxsIGRvIHRoZWlyIGpvYiB1c2luZyB0aGUgZGVmYXVsdCBFdmVudFxuICAgICAgLy8gcGFyYW1ldGVyc1xuICAgICAgb25Ub3VjaFN0YXJ0OiBzdGFydEhhbmRsZXIsXG4gICAgICBvblRvdWNoTW92ZTogdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudCxcbiAgICAgIG9uVG91Y2hFbmQ6IHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudFxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICB7Li4uKCFibG9ja2VkID8gdW5ibG9ja2VkQ2VsbFByb3BzIDoge30pfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgYmxvY2tlZCl9XG4gICAgICA8L0dyaWRDZWxsPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCBibG9ja2VkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHJlZlNldHRlciA9IChkYXRlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcbiAgICAgICAgdGhpcy5jZWxsVG9EYXRlLnNldChkYXRlQ2VsbCwgdGltZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCBibG9ja2VkLCByZWZTZXR0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlQ2VsbFxuICAgICAgICAgIGJsb2NrZWQ9e2Jsb2NrZWR9XG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMudW5zZWxlY3RlZENvbG9yfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17dGhpcy5wcm9wcy5ob3ZlcmVkQ29sb3J9XG4gICAgICAgICAgYmxvY2tlZENvbG9yPXt0aGlzLnByb3BzLmJsb2NrZWRDb2xvcn1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHRoaXMucHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCB0aGlzLnByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZ1bGxEYXRlR3JpZCgpOiBBcnJheTxKU1guRWxlbWVudD4ge1xuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxuICAgIGNvbnN0IG51bURheXMgPSB0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aFxuICAgIGNvbnN0IG51bVRpbWVzID0gdGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzIC0gMTsgaiArPSAxKSB7XG4gICAgICAvLyBudW1UaW1lcyAtIDHsnYQg7Ya17ZW0IOuniOyngOuniSDsi5zqsITsnYAg7IWAIOyDneyEse2VmOyngCDslYrqsowgKOydtOyEoO2YuCDstpTqsIApXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKHRoaXMuc3RhdGUuZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAodGhpcy5yZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZS5kYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxuICAgICAgICBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5yZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSlcbiAgICAgICksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgICB0aGlzLmdyaWRSZWYgPSBlbFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgICAgPC9HcmlkPlxuICAgICAgPC9XcmFwcGVyPlxuICAgIClcbiAgfVxufVxuIl19