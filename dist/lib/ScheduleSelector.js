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
        return this.props.renderDateCell(time, selected, refSetter);
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
    return this.props.blockedTimes.find(blockedTime => blockedTime.toISOString() === time.toISOString()) !== undefined;
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
  blockedTimes: [],
  // 이선호 추가
  blockedColor: '#f1f1f2',
  // 이선호 추가
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsIkRhdGVDZWxsIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwiZGF0ZXMiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsInJlbmRlcmluZ0RhdGVzIiwiZm9yRWFjaCIsInJlbmRlcmluZ0RhdGUiLCJjdXJyZW50RGF5IiwiY3VycmVudERhdGUiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImNvbnN0cnVjdG9yIiwiY2VsbFRvRGF0ZSIsIk1hcCIsImdyaWRSZWYiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJ0aW1lIiwic3RhcnRIYW5kbGVyIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsIkJvb2xlYW4iLCJmaW5kIiwiYSIsImlzVGltZUJsb2NrZWQiLCJ1bmJsb2NrZWRDZWxsUHJvcHMiLCJvbk1vdXNlRG93biIsIm9uTW91c2VFbnRlciIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsIm9uTW91c2VVcCIsImhhbmRsZU1vdXNlVXBFdmVudCIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwiaGFuZGxlVG91Y2hNb3ZlRXZlbnQiLCJvblRvdWNoRW5kIiwiaGFuZGxlVG91Y2hFbmRFdmVudCIsInRvSVNPU3RyaW5nIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJkYXRlQ2VsbCIsInNldCIsInJlbmRlclRpbWVMYWJlbCIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInNlbGVjdGlvblR5cGUiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJlbmRTZWxlY3Rpb24iLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2YWx1ZSIsInBhc3NpdmUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJnZXQiLCJvbkNoYW5nZSIsInNldFN0YXRlIiwidXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQiLCJzZWxlY3Rpb25FbmQiLCJjYWxsYmFjayIsIm5ld1NlbGVjdGlvbiIsInNlbGVjdGlvblNjaGVtZSIsImZpbHRlciIsInNlbGVjdGVkVGltZSIsIm5leHREcmFmdCIsIkFycmF5IiwiZnJvbSIsIlNldCIsImIiLCJibG9ja2VkVGltZXMiLCJibG9ja2VkVGltZSIsInVuZGVmaW5lZCIsInN0YXJ0VGltZSIsInRpbWVTZWxlY3RlZCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtRGF5cyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50Iiwia2V5IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsT0FBTyxHQUFHQywwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSxvRUFBYjs7QUFPQSxNQUFNQyxJQUFJLEdBQUdGLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLG1KQUU2QkUsS0FBSyxJQUFJQSxLQUFLLENBQUNDLE9BRjVDLEVBRzBCRCxLQUFLLElBQUlBLEtBQUssQ0FBQ0UsSUFIekMsRUFJTUYsS0FBSyxJQUFJQSxLQUFLLENBQUNHLFNBSnJCLEVBS0dILEtBQUssSUFBSUEsS0FBSyxDQUFDSSxNQUxsQixDQUFWOztBQVNPLE1BQU1DLFFBQVEsR0FBR1IsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsNkNBQWQ7Ozs7QUFjUCxNQUFNUSxnQkFBZ0IsR0FBSU4sS0FBRCxJQUEwQjtBQUNqRCxNQUFJQSxLQUFLLENBQUNPLE9BQVYsRUFBbUI7QUFDakIsV0FBT1AsS0FBSyxDQUFDUSxZQUFiO0FBQ0QsR0FGRCxNQUVPLElBQUlSLEtBQUssQ0FBQ1MsUUFBVixFQUFvQjtBQUN6QixXQUFPVCxLQUFLLENBQUNVLGFBQWI7QUFDRCxHQUZNLE1BRUE7QUFDTCxXQUFPVixLQUFLLENBQUNXLGVBQWI7QUFDRDtBQUNGLENBUkQ7O0FBVUEsTUFBTUMsUUFBUSxHQUFHZiwwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSwwREFHUVEsZ0JBSFIsRUFLVk4sS0FBSyxJQUNMLENBQUNBLEtBQUssQ0FBQ08sT0FBUCxzREFHc0JQLEtBQUssQ0FBQ2EsWUFINUIsb0JBTUksRUFaTSxDQUFkOztBQWVBLE1BQU1DLFNBQVMsR0FBRywrQkFBT0Msb0JBQVAsQ0FBSDtBQUFBO0FBQUE7QUFBQSw0RUFBZjtBQVFBLE1BQU1DLFFBQVEsR0FBRywrQkFBT0MsZ0JBQVAsQ0FBSDtBQUFBO0FBQUE7QUFBQSw0RkFBZDs7QUEyQ08sTUFBTUMsYUFBYSxHQUFJQyxDQUFELElBQW1CO0FBQzlDQSxFQUFBQSxDQUFDLENBQUNDLGNBQUY7QUFDRCxDQUZNOzs7O0FBSVEsTUFBTUMsZ0JBQU4sU0FBK0JDLEtBQUssQ0FBQ0MsU0FBckMsQ0FBcUU7QUFHbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF5QkEsU0FBT0Msd0JBQVAsQ0FBZ0N4QixLQUFoQyxFQUFrRHlCLEtBQWxELEVBQStGO0FBQzdGO0FBQ0EsUUFBSUEsS0FBSyxDQUFDQyxjQUFOLElBQXdCLElBQTVCLEVBQWtDO0FBQ2hDLGFBQU87QUFDTEMsUUFBQUEsY0FBYyxFQUFFLENBQUMsR0FBRzNCLEtBQUssQ0FBQzRCLFNBQVYsQ0FEWDtBQUVMQyxRQUFBQSxLQUFLLEVBQUVSLGdCQUFnQixDQUFDUyxrQkFBakIsQ0FBb0M5QixLQUFwQztBQUZGLE9BQVA7QUFJRDs7QUFDRCxXQUFPLElBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVFLFNBQU84QixrQkFBUCxDQUEwQjlCLEtBQTFCLEVBQWdFO0FBQzlEO0FBQ0EsVUFBTTZCLEtBQXlCLEdBQUcsRUFBbEM7QUFDQSxVQUFNRSxjQUFjLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtqQyxLQUFLLENBQUNrQyxZQUF0QixDQUF2QjtBQUVBbEMsSUFBQUEsS0FBSyxDQUFDbUMsY0FBTixDQUFxQkMsT0FBckIsQ0FBNkJDLGFBQWEsSUFBSTtBQUM1QyxZQUFNQyxVQUFVLEdBQUcsRUFBbkI7QUFDQSxZQUFNQyxXQUFXLEdBQUcsMkJBQVdGLGFBQVgsQ0FBcEI7O0FBRUEsV0FBSyxJQUFJRyxDQUFDLEdBQUd4QyxLQUFLLENBQUN5QyxPQUFuQixFQUE0QkQsQ0FBQyxJQUFJeEMsS0FBSyxDQUFDMEMsT0FBdkMsRUFBZ0RGLENBQUMsSUFBSSxDQUFyRCxFQUF3RDtBQUN0RDtBQUNBLGFBQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzNDLEtBQUssQ0FBQ2tDLFlBQVYsSUFBMEIsRUFBRU0sQ0FBQyxLQUFLeEMsS0FBSyxDQUFDMEMsT0FBWixJQUF1QkMsQ0FBQyxLQUFLM0MsS0FBSyxDQUFDa0MsWUFBTixHQUFxQixDQUFwRCxDQUExQyxFQUFrR1MsQ0FBQyxJQUFJLENBQXZHLEVBQTBHO0FBQ3hHTCxVQUFBQSxVQUFVLENBQUNNLElBQVgsQ0FBZ0IsMEJBQVcsd0JBQVNMLFdBQVQsRUFBc0JDLENBQXRCLENBQVgsRUFBcUNHLENBQUMsR0FBR1osY0FBekMsQ0FBaEI7QUFDRDtBQUNGOztBQUNERixNQUFBQSxLQUFLLENBQUNlLElBQU4sQ0FBV04sVUFBWDtBQUNELEtBWEQ7QUFZQSxXQUFPVCxLQUFQO0FBQ0Q7O0FBRURnQixFQUFBQSxXQUFXLENBQUM3QyxLQUFELEVBQW1CO0FBQzVCLFVBQU1BLEtBQU47QUFENEIsU0FqRjlCOEMsVUFpRjhCLEdBakZHLElBQUlDLEdBQUosRUFpRkg7QUFBQSxTQXpFOUJDLE9BeUU4QixHQXpFQSxJQXlFQTs7QUFBQSxTQXFKOUJDLHFCQXJKOEIsR0FxSkxDLElBQUQsSUFBNkI7QUFDbkQsWUFBTUMsWUFBWSxHQUFHLE1BQU07QUFDekIsYUFBS0MseUJBQUwsQ0FBK0JGLElBQS9CO0FBQ0QsT0FGRDs7QUFJQSxZQUFNekMsUUFBUSxHQUFHNEMsT0FBTyxDQUFDLEtBQUs1QixLQUFMLENBQVdFLGNBQVgsQ0FBMEIyQixJQUExQixDQUErQkMsQ0FBQyxJQUFJLDZCQUFhQSxDQUFiLEVBQWdCTCxJQUFoQixDQUFwQyxDQUFELENBQXhCO0FBQ0EsWUFBTTNDLE9BQU8sR0FBRyxLQUFLaUQsYUFBTCxDQUFtQk4sSUFBbkIsQ0FBaEI7QUFFQSxZQUFNTyxrQkFBa0IsR0FBRztBQUN6QjtBQUNBQyxRQUFBQSxXQUFXLEVBQUVQLFlBRlk7QUFHekJRLFFBQUFBLFlBQVksRUFBRSxNQUFNO0FBQ2xCLGVBQUtDLHFCQUFMLENBQTJCVixJQUEzQjtBQUNELFNBTHdCO0FBTXpCVyxRQUFBQSxTQUFTLEVBQUUsTUFBTTtBQUNmLGVBQUtDLGtCQUFMLENBQXdCWixJQUF4QjtBQUNELFNBUndCO0FBU3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0FhLFFBQUFBLFlBQVksRUFBRVosWUFiVztBQWN6QmEsUUFBQUEsV0FBVyxFQUFFLEtBQUtDLG9CQWRPO0FBZXpCQyxRQUFBQSxVQUFVLEVBQUUsS0FBS0M7QUFmUSxPQUEzQjtBQWtCQSwwQkFDRSxvQkFBQyxRQUFEO0FBQ0UsUUFBQSxTQUFTLEVBQUMsaUJBRFo7QUFFRSxRQUFBLElBQUksRUFBQyxjQUZQO0FBR0UsUUFBQSxHQUFHLEVBQUVqQixJQUFJLENBQUNrQixXQUFMO0FBSFAsU0FJTyxDQUFDN0QsT0FBRCxHQUFXa0Qsa0JBQVgsR0FBZ0MsRUFKdkMsR0FNRyxLQUFLWSxjQUFMLENBQW9CbkIsSUFBcEIsRUFBMEJ6QyxRQUExQixFQUFvQ0YsT0FBcEMsQ0FOSCxDQURGO0FBVUQsS0F6TDZCOztBQUFBLFNBMkw5QjhELGNBM0w4QixHQTJMYixDQUFDbkIsSUFBRCxFQUFhekMsUUFBYixFQUFnQ0YsT0FBaEMsS0FBa0U7QUFDakYsWUFBTStELFNBQVMsR0FBSUMsUUFBRCxJQUFrQztBQUNsRCxZQUFJQSxRQUFKLEVBQWM7QUFDWixlQUFLekIsVUFBTCxDQUFnQjBCLEdBQWhCLENBQW9CRCxRQUFwQixFQUE4QnJCLElBQTlCO0FBQ0Q7QUFDRixPQUpEOztBQUtBLFVBQUksS0FBS2xELEtBQUwsQ0FBV3FFLGNBQWYsRUFBK0I7QUFDN0IsZUFBTyxLQUFLckUsS0FBTCxDQUFXcUUsY0FBWCxDQUEwQm5CLElBQTFCLEVBQWdDekMsUUFBaEMsRUFBMEM2RCxTQUExQyxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsNEJBQ0Usb0JBQUMsUUFBRDtBQUNFLFVBQUEsT0FBTyxFQUFFL0QsT0FEWDtBQUVFLFVBQUEsUUFBUSxFQUFFRSxRQUZaO0FBR0UsVUFBQSxHQUFHLEVBQUU2RCxTQUhQO0FBSUUsVUFBQSxhQUFhLEVBQUUsS0FBS3RFLEtBQUwsQ0FBV1UsYUFKNUI7QUFLRSxVQUFBLGVBQWUsRUFBRSxLQUFLVixLQUFMLENBQVdXLGVBTDlCO0FBTUUsVUFBQSxZQUFZLEVBQUUsS0FBS1gsS0FBTCxDQUFXYSxZQU4zQjtBQU9FLFVBQUEsWUFBWSxFQUFFLEtBQUtiLEtBQUwsQ0FBV1E7QUFQM0IsVUFERjtBQVdEO0FBQ0YsS0FoTjZCOztBQUFBLFNBa045QmlFLGVBbE44QixHQWtOWHZCLElBQUQsSUFBNkI7QUFDN0MsVUFBSSxLQUFLbEQsS0FBTCxDQUFXeUUsZUFBZixFQUFnQztBQUM5QixlQUFPLEtBQUt6RSxLQUFMLENBQVd5RSxlQUFYLENBQTJCdkIsSUFBM0IsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLDRCQUFPLG9CQUFDLFFBQUQsUUFBVyxxQkFBV0EsSUFBWCxFQUFpQixLQUFLbEQsS0FBTCxDQUFXMEUsVUFBNUIsQ0FBWCxDQUFQO0FBQ0Q7QUFDRixLQXhONkI7O0FBQUEsU0EwTjlCQyxlQTFOOEIsR0EwTlhDLElBQUQsSUFBNkI7QUFDN0MsVUFBSSxLQUFLNUUsS0FBTCxDQUFXMkUsZUFBZixFQUFnQztBQUM5QixlQUFPLEtBQUszRSxLQUFMLENBQVcyRSxlQUFYLENBQTJCQyxJQUEzQixDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsNEJBQU8sb0JBQUMsU0FBRCxRQUFZLHFCQUFXQSxJQUFYLEVBQWlCLEtBQUs1RSxLQUFMLENBQVc2RSxVQUE1QixDQUFaLENBQVA7QUFDRDtBQUNGLEtBaE82Qjs7QUFHNUIsU0FBS3BELEtBQUwsR0FBYTtBQUNYRSxNQUFBQSxjQUFjLEVBQUUsQ0FBQyxHQUFHLEtBQUszQixLQUFMLENBQVc0QixTQUFmLENBREw7QUFDZ0M7QUFDM0NrRCxNQUFBQSxhQUFhLEVBQUUsSUFGSjtBQUdYcEQsTUFBQUEsY0FBYyxFQUFFLElBSEw7QUFJWHFELE1BQUFBLGVBQWUsRUFBRSxLQUpOO0FBS1hsRCxNQUFBQSxLQUFLLEVBQUVSLGdCQUFnQixDQUFDUyxrQkFBakIsQ0FBb0M5QixLQUFwQztBQUxJLEtBQWI7QUFRQSxTQUFLZ0YsdUJBQUwsR0FBK0I7QUFDN0JDLE1BQUFBLE1BQU0sRUFBRUMsMEJBQWlCRCxNQURJO0FBRTdCRSxNQUFBQSxNQUFNLEVBQUVELDBCQUFpQkM7QUFGSSxLQUEvQjtBQUtBLFNBQUtDLFlBQUwsR0FBb0IsS0FBS0EsWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDQSxTQUFLdkIsa0JBQUwsR0FBMEIsS0FBS0Esa0JBQUwsQ0FBd0J1QixJQUF4QixDQUE2QixJQUE3QixDQUExQjtBQUNBLFNBQUt6QixxQkFBTCxHQUE2QixLQUFLQSxxQkFBTCxDQUEyQnlCLElBQTNCLENBQWdDLElBQWhDLENBQTdCO0FBQ0EsU0FBS3BCLG9CQUFMLEdBQTRCLEtBQUtBLG9CQUFMLENBQTBCb0IsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBNUI7QUFDQSxTQUFLbEIsbUJBQUwsR0FBMkIsS0FBS0EsbUJBQUwsQ0FBeUJrQixJQUF6QixDQUE4QixJQUE5QixDQUEzQjtBQUNBLFNBQUtqQyx5QkFBTCxHQUFpQyxLQUFLQSx5QkFBTCxDQUErQmlDLElBQS9CLENBQW9DLElBQXBDLENBQWpDO0FBQ0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUtKLFlBQTFDLEVBUGtCLENBU2xCOztBQUNBLFNBQUt0QyxVQUFMLENBQWdCVixPQUFoQixDQUF3QixDQUFDcUQsS0FBRCxFQUFRbEIsUUFBUixLQUFxQjtBQUMzQyxVQUFJQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ2lCLGdCQUF6QixFQUEyQztBQUN6QztBQUNBakIsUUFBQUEsUUFBUSxDQUFDaUIsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUN0RSxhQUF2QyxFQUFzRDtBQUFFd0UsVUFBQUEsT0FBTyxFQUFFO0FBQVgsU0FBdEQ7QUFDRDtBQUNGLEtBTEQ7QUFNRDs7QUFFREMsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckJKLElBQUFBLFFBQVEsQ0FBQ0ssbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBS1IsWUFBN0M7QUFDQSxTQUFLdEMsVUFBTCxDQUFnQlYsT0FBaEIsQ0FBd0IsQ0FBQ3FELEtBQUQsRUFBUWxCLFFBQVIsS0FBcUI7QUFDM0MsVUFBSUEsUUFBUSxJQUFJQSxRQUFRLENBQUNxQixtQkFBekIsRUFBOEM7QUFDNUM7QUFDQXJCLFFBQUFBLFFBQVEsQ0FBQ3FCLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDMUUsYUFBMUM7QUFDRDtBQUNGLEtBTEQ7QUFNRCxHQXJJaUYsQ0F1SWxGO0FBQ0E7QUFDQTs7O0FBQ0EyRSxFQUFBQSxxQkFBcUIsQ0FBQ0MsS0FBRCxFQUE0QztBQUMvRCxVQUFNO0FBQUVDLE1BQUFBO0FBQUYsUUFBY0QsS0FBcEI7QUFDQSxRQUFJLENBQUNDLE9BQUQsSUFBWUEsT0FBTyxDQUFDQyxNQUFSLEtBQW1CLENBQW5DLEVBQXNDLE9BQU8sSUFBUDtBQUN0QyxVQUFNO0FBQUVDLE1BQUFBLE9BQUY7QUFBV0MsTUFBQUE7QUFBWCxRQUF1QkgsT0FBTyxDQUFDLENBQUQsQ0FBcEM7QUFDQSxVQUFNSSxhQUFhLEdBQUdaLFFBQVEsQ0FBQ2EsZ0JBQVQsQ0FBMEJILE9BQTFCLEVBQW1DQyxPQUFuQyxDQUF0Qjs7QUFDQSxRQUFJQyxhQUFKLEVBQW1CO0FBQ2pCLFlBQU1FLFFBQVEsR0FBRyxLQUFLdkQsVUFBTCxDQUFnQndELEdBQWhCLENBQW9CSCxhQUFwQixDQUFqQjtBQUNBLGFBQU9FLFFBQVAsYUFBT0EsUUFBUCxjQUFPQSxRQUFQLEdBQW1CLElBQW5CO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBRURqQixFQUFBQSxZQUFZLEdBQUc7QUFDYixTQUFLcEYsS0FBTCxDQUFXdUcsUUFBWCxDQUFvQixLQUFLOUUsS0FBTCxDQUFXRSxjQUEvQjtBQUNBLFNBQUs2RSxRQUFMLENBQWM7QUFDWjFCLE1BQUFBLGFBQWEsRUFBRSxJQURIO0FBRVpwRCxNQUFBQSxjQUFjLEVBQUU7QUFGSixLQUFkO0FBSUQsR0E1SmlGLENBOEpsRjs7O0FBQ0ErRSxFQUFBQSx1QkFBdUIsQ0FBQ0MsWUFBRCxFQUE0QkMsUUFBNUIsRUFBbUQ7QUFDeEUsVUFBTTtBQUFFN0IsTUFBQUEsYUFBRjtBQUFpQnBELE1BQUFBO0FBQWpCLFFBQW9DLEtBQUtELEtBQS9DO0FBRUEsUUFBSXFELGFBQWEsS0FBSyxJQUFsQixJQUEwQnBELGNBQWMsS0FBSyxJQUFqRCxFQUF1RDtBQUV2RCxRQUFJa0YsWUFBeUIsR0FBRyxFQUFoQzs7QUFDQSxRQUFJbEYsY0FBYyxJQUFJZ0YsWUFBbEIsSUFBa0M1QixhQUF0QyxFQUFxRDtBQUNuRDhCLE1BQUFBLFlBQVksR0FBRyxLQUFLNUIsdUJBQUwsQ0FBNkIsS0FBS2hGLEtBQUwsQ0FBVzZHLGVBQXhDLEVBQ2JuRixjQURhLEVBRWJnRixZQUZhLEVBR2IsS0FBS2pGLEtBQUwsQ0FBV0ksS0FIRSxFQUliaUYsTUFKYSxDQUlOQyxZQUFZLElBQUksQ0FBQyxLQUFLdkQsYUFBTCxDQUFtQnVELFlBQW5CLENBSlgsQ0FBZjtBQUtEOztBQUVELFFBQUlDLFNBQVMsR0FBRyxDQUFDLEdBQUcsS0FBS2hILEtBQUwsQ0FBVzRCLFNBQWYsQ0FBaEI7O0FBQ0EsUUFBSWtELGFBQWEsS0FBSyxLQUF0QixFQUE2QjtBQUMzQmtDLE1BQUFBLFNBQVMsR0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBQVcsSUFBSUMsR0FBSixDQUFRLENBQUMsR0FBR0gsU0FBSixFQUFlLEdBQUdKLFlBQWxCLENBQVIsQ0FBWCxDQUFaO0FBQ0QsS0FGRCxNQUVPLElBQUk5QixhQUFhLEtBQUssUUFBdEIsRUFBZ0M7QUFDckNrQyxNQUFBQSxTQUFTLEdBQUdBLFNBQVMsQ0FBQ0YsTUFBVixDQUFpQnZELENBQUMsSUFBSSxDQUFDcUQsWUFBWSxDQUFDdEQsSUFBYixDQUFrQjhELENBQUMsSUFBSSw2QkFBYTdELENBQWIsRUFBZ0I2RCxDQUFoQixDQUF2QixDQUF2QixDQUFaO0FBQ0Q7O0FBRUQsU0FBS1osUUFBTCxDQUFjO0FBQUU3RSxNQUFBQSxjQUFjLEVBQUVxRjtBQUFsQixLQUFkLEVBQTZDTCxRQUE3QztBQUNEOztBQUVEbkQsRUFBQUEsYUFBYSxDQUFDTixJQUFELEVBQWE7QUFDeEIsV0FBTyxLQUFLbEQsS0FBTCxDQUFXcUgsWUFBWCxDQUF3Qi9ELElBQXhCLENBQTZCZ0UsV0FBVyxJQUFJQSxXQUFXLENBQUNsRCxXQUFaLE9BQThCbEIsSUFBSSxDQUFDa0IsV0FBTCxFQUExRSxNQUFrR21ELFNBQXpHO0FBQ0QsR0F6TGlGLENBMkxsRjs7O0FBQ0FuRSxFQUFBQSx5QkFBeUIsQ0FBQ29FLFNBQUQsRUFBa0I7QUFDekM7QUFDQTtBQUNBLFVBQU1DLFlBQVksR0FBRyxLQUFLekgsS0FBTCxDQUFXNEIsU0FBWCxDQUFxQjBCLElBQXJCLENBQTBCQyxDQUFDLElBQUksNkJBQWFBLENBQWIsRUFBZ0JpRSxTQUFoQixDQUEvQixDQUFyQjtBQUNBLFNBQUtoQixRQUFMLENBQWM7QUFDWjFCLE1BQUFBLGFBQWEsRUFBRTJDLFlBQVksR0FBRyxRQUFILEdBQWMsS0FEN0I7QUFFWi9GLE1BQUFBLGNBQWMsRUFBRThGO0FBRkosS0FBZDtBQUlEOztBQUVENUQsRUFBQUEscUJBQXFCLENBQUNWLElBQUQsRUFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxTQUFLdUQsdUJBQUwsQ0FBNkJ2RCxJQUE3QjtBQUNEOztBQUVEWSxFQUFBQSxrQkFBa0IsQ0FBQ1osSUFBRCxFQUFhO0FBQzdCLFNBQUt1RCx1QkFBTCxDQUE2QnZELElBQTdCLEVBRDZCLENBRTdCO0FBQ0Q7O0FBRURlLEVBQUFBLG9CQUFvQixDQUFDNkIsS0FBRCxFQUEwQjtBQUM1QyxTQUFLVSxRQUFMLENBQWM7QUFBRXpCLE1BQUFBLGVBQWUsRUFBRTtBQUFuQixLQUFkO0FBQ0EsVUFBTXNCLFFBQVEsR0FBRyxLQUFLUixxQkFBTCxDQUEyQkMsS0FBM0IsQ0FBakI7O0FBQ0EsUUFBSU8sUUFBSixFQUFjO0FBQ1osV0FBS0ksdUJBQUwsQ0FBNkJKLFFBQTdCO0FBQ0Q7QUFDRjs7QUFFRGxDLEVBQUFBLG1CQUFtQixHQUFHO0FBQ3BCLFFBQUksQ0FBQyxLQUFLMUMsS0FBTCxDQUFXc0QsZUFBaEIsRUFBaUM7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsV0FBSzBCLHVCQUFMLENBQTZCLElBQTdCLEVBQW1DLE1BQU07QUFDdkMsYUFBS3JCLFlBQUw7QUFDRCxPQUZEO0FBR0QsS0FQRCxNQU9PO0FBQ0wsV0FBS0EsWUFBTDtBQUNEOztBQUNELFNBQUtvQixRQUFMLENBQWM7QUFBRXpCLE1BQUFBLGVBQWUsRUFBRTtBQUFuQixLQUFkO0FBQ0Q7O0FBK0VEMkMsRUFBQUEsa0JBQWtCLEdBQXVCO0FBQ3ZDLFVBQU1DLGNBQXNCLEdBQUcsRUFBL0I7QUFDQSxVQUFNQyxPQUFPLEdBQUcsS0FBS25HLEtBQUwsQ0FBV0ksS0FBWCxDQUFpQm1FLE1BQWpDO0FBQ0EsVUFBTTZCLFFBQVEsR0FBRyxLQUFLcEcsS0FBTCxDQUFXSSxLQUFYLENBQWlCLENBQWpCLEVBQW9CbUUsTUFBckM7O0FBQ0EsU0FBSyxJQUFJOEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsUUFBUSxHQUFHLENBQS9CLEVBQWtDQyxDQUFDLElBQUksQ0FBdkMsRUFBMEM7QUFBRTtBQUMxQyxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdILE9BQXBCLEVBQTZCRyxDQUFDLElBQUksQ0FBbEMsRUFBcUM7QUFDbkNKLFFBQUFBLGNBQWMsQ0FBQy9FLElBQWYsQ0FBb0IsS0FBS25CLEtBQUwsQ0FBV0ksS0FBWCxDQUFpQmtHLENBQWpCLEVBQW9CRCxDQUFwQixDQUFwQjtBQUNEO0FBQ0Y7O0FBQ0QsVUFBTUUsZ0JBQWdCLEdBQUdMLGNBQWMsQ0FBQ00sR0FBZixDQUFtQixLQUFLaEYscUJBQXhCLENBQXpCOztBQUNBLFNBQUssSUFBSThFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLFFBQXBCLEVBQThCRSxDQUFDLElBQUksQ0FBbkMsRUFBc0M7QUFDcEMsWUFBTUcsS0FBSyxHQUFHSCxDQUFDLEdBQUdILE9BQWxCO0FBQ0EsWUFBTTFFLElBQUksR0FBRyxLQUFLekIsS0FBTCxDQUFXSSxLQUFYLENBQWlCLENBQWpCLEVBQW9Ca0csQ0FBcEIsQ0FBYixDQUZvQyxDQUdwQzs7QUFDQUMsTUFBQUEsZ0JBQWdCLENBQUNHLE1BQWpCLENBQXdCRCxLQUFLLEdBQUdILENBQWhDLEVBQW1DLENBQW5DLEVBQXNDLEtBQUt0RCxlQUFMLENBQXFCdkIsSUFBckIsQ0FBdEM7QUFDRDs7QUFDRCxXQUFPO0FBQUE7QUFDTDtBQUNBO0FBQUssTUFBQSxHQUFHLEVBQUM7QUFBVCxNQUZLLEVBR0w7QUFDQSxPQUFHLEtBQUt6QixLQUFMLENBQVdJLEtBQVgsQ0FBaUJvRyxHQUFqQixDQUFxQixDQUFDRyxVQUFELEVBQWFGLEtBQWIsa0JBQ3RCNUcsS0FBSyxDQUFDK0csWUFBTixDQUFtQixLQUFLMUQsZUFBTCxDQUFxQnlELFVBQVUsQ0FBQyxDQUFELENBQS9CLENBQW5CLEVBQXdEO0FBQUVFLE1BQUFBLEdBQUcsaUJBQVVKLEtBQVY7QUFBTCxLQUF4RCxDQURDLENBSkUsRUFPTDtBQUNBLE9BQUdGLGdCQUFnQixDQUFDQyxHQUFqQixDQUFxQixDQUFDTSxPQUFELEVBQVVMLEtBQVYsa0JBQW9CNUcsS0FBSyxDQUFDK0csWUFBTixDQUFtQkUsT0FBbkIsRUFBNEI7QUFBRUQsTUFBQUEsR0FBRyxpQkFBVUosS0FBVjtBQUFMLEtBQTVCLENBQXpDLENBUkUsQ0FBUDtBQVVEOztBQUVETSxFQUFBQSxNQUFNLEdBQWdCO0FBQ3BCLHdCQUNFLG9CQUFDLE9BQUQscUJBQ0Usb0JBQUMsSUFBRDtBQUNFLE1BQUEsT0FBTyxFQUFFLEtBQUsvRyxLQUFMLENBQVdJLEtBQVgsQ0FBaUJtRSxNQUQ1QjtBQUVFLE1BQUEsSUFBSSxFQUFFLEtBQUt2RSxLQUFMLENBQVdJLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0JtRSxNQUY1QjtBQUdFLE1BQUEsU0FBUyxFQUFFLEtBQUtoRyxLQUFMLENBQVdHLFNBSHhCO0FBSUUsTUFBQSxNQUFNLEVBQUUsS0FBS0gsS0FBTCxDQUFXSSxNQUpyQjtBQUtFLE1BQUEsR0FBRyxFQUFFcUksRUFBRSxJQUFJO0FBQ1QsYUFBS3pGLE9BQUwsR0FBZXlGLEVBQWY7QUFDRDtBQVBILE9BU0csS0FBS2Ysa0JBQUwsRUFUSCxDQURGLENBREY7QUFlRDs7QUFqV2lGOzs7QUFBL0RyRyxnQixDQVlacUgsWSxHQUFtQztBQUN4QzlHLEVBQUFBLFNBQVMsRUFBRSxFQUQ2QjtBQUV4Q2lGLEVBQUFBLGVBQWUsRUFBRSxRQUZ1QjtBQUd4Q2UsRUFBQUEsT0FBTyxFQUFFLENBSCtCO0FBSXhDbkYsRUFBQUEsT0FBTyxFQUFFLENBSitCO0FBS3hDQyxFQUFBQSxPQUFPLEVBQUUsRUFMK0I7QUFNeENSLEVBQUFBLFlBQVksRUFBRSxDQU4wQjtBQU94QztBQUNBO0FBQ0FDLEVBQUFBLGNBQWMsRUFBRSxFQVR3QjtBQVV4Q3VDLEVBQUFBLFVBQVUsRUFBRSxJQVY0QjtBQVd4Q0csRUFBQUEsVUFBVSxFQUFFLEtBWDRCO0FBWXhDMUUsRUFBQUEsU0FBUyxFQUFFLEtBWjZCO0FBYXhDQyxFQUFBQSxNQUFNLEVBQUUsS0FiZ0M7QUFjeENNLEVBQUFBLGFBQWEsRUFBRWlJLGdCQUFPQyxJQWRrQjtBQWV4Q2pJLEVBQUFBLGVBQWUsRUFBRWdJLGdCQUFPRSxRQWZnQjtBQWdCeENoSSxFQUFBQSxZQUFZLEVBQUU4SCxnQkFBT0csU0FoQm1CO0FBaUJ4Q3pCLEVBQUFBLFlBQVksRUFBRSxFQWpCMEI7QUFpQnRCO0FBQ2xCN0csRUFBQUEsWUFBWSxFQUFFLFNBbEIwQjtBQWtCZjtBQUN6QitGLEVBQUFBLFFBQVEsRUFBRSxNQUFNLENBQUU7QUFuQnNCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cydcclxuXHJcbi8vIEltcG9ydCBvbmx5IHRoZSBtZXRob2RzIHdlIG5lZWQgZnJvbSBkYXRlLWZucyBpbiBvcmRlciB0byBrZWVwIGJ1aWxkIHNpemUgc21hbGxcclxuaW1wb3J0IGFkZE1pbnV0ZXMgZnJvbSAnZGF0ZS1mbnMvYWRkX21pbnV0ZXMnXHJcbmltcG9ydCBhZGRIb3VycyBmcm9tICdkYXRlLWZucy9hZGRfaG91cnMnXHJcbmltcG9ydCBhZGREYXlzIGZyb20gJ2RhdGUtZm5zL2FkZF9kYXlzJ1xyXG5pbXBvcnQgc3RhcnRPZkRheSBmcm9tICdkYXRlLWZucy9zdGFydF9vZl9kYXknXHJcbmltcG9ydCBpc1NhbWVNaW51dGUgZnJvbSAnZGF0ZS1mbnMvaXNfc2FtZV9taW51dGUnXHJcbmltcG9ydCBmb3JtYXREYXRlIGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCdcclxuXHJcbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xyXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJ1xyXG5pbXBvcnQgc2VsZWN0aW9uU2NoZW1lcywgeyBTZWxlY3Rpb25TY2hlbWVUeXBlLCBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9zZWxlY3Rpb24tc2NoZW1lcydcclxuXHJcbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB3aWR0aDogMTAwJTtcclxuICB1c2VyLXNlbGVjdDogbm9uZTtcclxuYFxyXG5cclxuY29uc3QgR3JpZCA9IHN0eWxlZC5kaXY8eyBjb2x1bW5zOiBudW1iZXI7IHJvd3M6IG51bWJlcjsgY29sdW1uR2FwOiBzdHJpbmc7IHJvd0dhcDogc3RyaW5nIH0+YFxyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLmNvbHVtbnN9LCAxZnIpO1xyXG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5yb3dzfSwgMWZyKTtcclxuICBjb2x1bW4tZ2FwOiAke3Byb3BzID0+IHByb3BzLmNvbHVtbkdhcH07XHJcbiAgcm93LWdhcDogJHtwcm9wcyA9PiBwcm9wcy5yb3dHYXB9O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5gXHJcblxyXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxyXG4gIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XHJcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xyXG5gXHJcblxyXG50eXBlIERhdGVDZWxsUHJvcHMgPSB7XHJcbiAgYmxvY2tlZDogYm9vbGVhblxyXG4gIHNlbGVjdGVkOiBib29sZWFuXHJcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcclxuICBibG9ja2VkQ29sb3I6IHN0cmluZ1xyXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IGdldERhdGVDZWxsQ29sb3IgPSAocHJvcHM6IERhdGVDZWxsUHJvcHMpID0+IHtcclxuICBpZiAocHJvcHMuYmxvY2tlZCkge1xyXG4gICAgcmV0dXJuIHByb3BzLmJsb2NrZWRDb2xvclxyXG4gIH0gZWxzZSBpZiAocHJvcHMuc2VsZWN0ZWQpIHtcclxuICAgIHJldHVybiBwcm9wcy5zZWxlY3RlZENvbG9yXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBwcm9wcy51bnNlbGVjdGVkQ29sb3JcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjxEYXRlQ2VsbFByb3BzPmBcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDI1cHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtnZXREYXRlQ2VsbENvbG9yfTtcclxuXHJcbiAgJHtwcm9wcyA9PlxyXG4gICAgIXByb3BzLmJsb2NrZWRcclxuICAgICAgPyBgXHJcbiAgICAmOmhvdmVyIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xyXG4gICAgfVxyXG4gIGBcclxuICAgICAgOiAnJ31cclxuYFxyXG5cclxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcclxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICB9XHJcbiAgbWFyZ2luOiAwO1xyXG4gIG1hcmdpbi1ib3R0b206IDRweDtcclxuYFxyXG5cclxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XHJcbiAgICBmb250LXNpemU6IDEwcHg7XHJcbiAgfVxyXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gIG1hcmdpbjogMDtcclxuICBtYXJnaW4tcmlnaHQ6IDRweDtcclxuYFxyXG5cclxudHlwZSBQcm9wc1R5cGUgPSB7XHJcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxyXG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxyXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxyXG4gIC8vc3RhcnREYXRlOiBEYXRlXHJcbiAgcmVuZGVyaW5nRGF0ZXM6IERhdGVbXSAvLyDsnbTshKDtmLgg7LaU6rCAXHJcbiAgbnVtRGF5czogbnVtYmVyXHJcbiAgbWluVGltZTogbnVtYmVyXHJcbiAgbWF4VGltZTogbnVtYmVyXHJcbiAgaG91cmx5Q2h1bmtzOiBudW1iZXJcclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcclxuICB0aW1lRm9ybWF0OiBzdHJpbmdcclxuICBjb2x1bW5HYXA6IHN0cmluZ1xyXG4gIHJvd0dhcDogc3RyaW5nXHJcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcclxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcclxuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xyXG4gIGJsb2NrZWRUaW1lczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcclxuICBibG9ja2VkQ29sb3I6IHN0cmluZ1xyXG4gIHJlbmRlckRhdGVDZWxsPzogKGRhdGV0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCkgPT4gSlNYLkVsZW1lbnRcclxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcclxuICByZW5kZXJEYXRlTGFiZWw/OiAoZGF0ZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcclxufVxyXG5cclxudHlwZSBTdGF0ZVR5cGUgPSB7XHJcbiAgLy8gSW4gdGhlIGNhc2UgdGhhdCBhIHVzZXIgaXMgZHJhZy1zZWxlY3RpbmcsIHdlIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzLnByb3BzLm9uQ2hhbmdlKCkgdW50aWwgdGhleSBoYXZlIGNvbXBsZXRlZFxyXG4gIC8vIHRoZSBkcmFnLXNlbGVjdC4gc2VsZWN0aW9uRHJhZnQgc2VydmVzIGFzIGEgdGVtcG9yYXJ5IGNvcHkgZHVyaW5nIGRyYWctc2VsZWN0cy5cclxuICBzZWxlY3Rpb25EcmFmdDogQXJyYXk8RGF0ZT5cclxuICBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlIHwgbnVsbFxyXG4gIHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbFxyXG4gIGlzVG91Y2hEcmFnZ2luZzogYm9vbGVhblxyXG4gIGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHByZXZlbnRTY3JvbGwgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZVNlbGVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzVHlwZSwgU3RhdGVUeXBlPiB7XHJcbiAgc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnM6IHsgW2tleTogc3RyaW5nXTogKHN0YXJ0RGF0ZTogRGF0ZSwgZW5kRGF0ZTogRGF0ZSwgZm9vOiBBcnJheTxBcnJheTxEYXRlPj4pID0+IERhdGVbXSB9XHJcbiAgY2VsbFRvRGF0ZTogTWFwPEVsZW1lbnQsIERhdGU+ID0gbmV3IE1hcCgpXHJcbiAgLy8gZG9jdW1lbnRNb3VzZVVwSGFuZGxlcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XHJcbiAgLy8gZW5kU2VsZWN0aW9uOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cclxuICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudDogKGV2ZW50OiBSZWFjdC5TeW50aGV0aWNUb3VjaEV2ZW50PCo+KSA9PiB2b2lkXHJcbiAgLy8gaGFuZGxlVG91Y2hFbmRFdmVudDogKCkgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZU1vdXNlVXBFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcclxuICAvLyBoYW5kbGVNb3VzZUVudGVyRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgLy8gaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcclxuICBncmlkUmVmOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsXHJcblxyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IFBhcnRpYWw8UHJvcHNUeXBlPiA9IHtcclxuICAgIHNlbGVjdGlvbjogW10sXHJcbiAgICBzZWxlY3Rpb25TY2hlbWU6ICdzcXVhcmUnLFxyXG4gICAgbnVtRGF5czogNyxcclxuICAgIG1pblRpbWU6IDksXHJcbiAgICBtYXhUaW1lOiAyMyxcclxuICAgIGhvdXJseUNodW5rczogMSxcclxuICAgIC8vIHN0YXJ0RGF0ZTogbmV3IERhdGUoKSxcclxuICAgIC8vIOydtOyEoO2YuCDstpTqsIBcclxuICAgIHJlbmRlcmluZ0RhdGVzOiBbXSxcclxuICAgIHRpbWVGb3JtYXQ6ICdoYScsXHJcbiAgICBkYXRlRm9ybWF0OiAnTS9EJyxcclxuICAgIGNvbHVtbkdhcDogJzRweCcsXHJcbiAgICByb3dHYXA6ICc0cHgnLFxyXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXHJcbiAgICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcclxuICAgIGhvdmVyZWRDb2xvcjogY29sb3JzLmxpZ2h0Qmx1ZSxcclxuICAgIGJsb2NrZWRUaW1lczogW10sIC8vIOydtOyEoO2YuCDstpTqsIBcclxuICAgIGJsb2NrZWRDb2xvcjogJyNmMWYxZjInLCAvLyDsnbTshKDtmLgg7LaU6rCAXHJcbiAgICBvbkNoYW5nZTogKCkgPT4ge31cclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHM6IFByb3BzVHlwZSwgc3RhdGU6IFN0YXRlVHlwZSk6IFBhcnRpYWw8U3RhdGVUeXBlPiB8IG51bGwge1xyXG4gICAgLy8gQXMgbG9uZyBhcyB0aGUgdXNlciBpc24ndCBpbiB0aGUgcHJvY2VzcyBvZiBzZWxlY3RpbmcsIGFsbG93IHByb3AgY2hhbmdlcyB0byByZS1wb3B1bGF0ZSBzZWxlY3Rpb24gc3RhdGVcclxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi5wcm9wcy5zZWxlY3Rpb25dLFxyXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIC8qIFxyXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcclxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxyXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxyXG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcclxuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXHJcbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xyXG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGVzXHJcbiAgfVxyXG4gICovXHJcblxyXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XHJcbiAgICAvLyBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcclxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxyXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxyXG5cclxuICAgIHByb3BzLnJlbmRlcmluZ0RhdGVzLmZvckVhY2gocmVuZGVyaW5nRGF0ZSA9PiB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxyXG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHN0YXJ0T2ZEYXkocmVuZGVyaW5nRGF0ZSlcclxuXHJcbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDw9IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xyXG4gICAgICAgIC8vIOyLnOqwhOydtCBtYXhUaW1l7J206rOgIOyyre2BrOqwgCBob3VybHlDaHVua3Prs7Tri6Qg7J6R7J2EIOuVjOunjCDrsJjrs7XtlZjsl6wgbWF4VGltZeydtCDtj6ztlajrkJjqsowgKOydtOyEoO2YuCDstpTqsIApXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3MgJiYgIShoID09PSBwcm9wcy5tYXhUaW1lICYmIGMgPT09IHByb3BzLmhvdXJseUNodW5rcyAtIDEpOyBjICs9IDEpIHtcclxuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGN1cnJlbnREYXRlLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxyXG4gICAgfSlcclxuICAgIHJldHVybiBkYXRlc1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzVHlwZSkge1xyXG4gICAgc3VwZXIocHJvcHMpXHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl0sIC8vIGNvcHkgaXQgb3ZlclxyXG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxyXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbCxcclxuICAgICAgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgZGF0ZXM6IFNjaGVkdWxlU2VsZWN0b3IuY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XHJcbiAgICAgIGxpbmVhcjogc2VsZWN0aW9uU2NoZW1lcy5saW5lYXIsXHJcbiAgICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuZFNlbGVjdGlvbiA9IHRoaXMuZW5kU2VsZWN0aW9uLmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50ID0gdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50LmJpbmQodGhpcylcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXHJcbiAgICAvLyB0byBjYXRjaCB0aGUgY2FzZXMgd2hlcmUgdGhlIHVzZXJzIGVuZHMgdGhlaXIgbW91c2UtY2xpY2sgc29tZXdoZXJlIGJlc2lkZXNcclxuICAgIC8vIHRoZSBkYXRlIGNlbGxzIChpbiB3aGljaCBjYXNlIG5vbmUgb2YgdGhlIERhdGVDZWxsJ3Mgb25Nb3VzZVVwIGhhbmRsZXJzIHdvdWxkIGZpcmUpXHJcbiAgICAvL1xyXG4gICAgLy8gVGhpcyBpc24ndCBuZWNlc3NhcnkgZm9yIHRvdWNoIGV2ZW50cyBzaW5jZSB0aGUgYHRvdWNoZW5kYCBldmVudCBmaXJlcyBvblxyXG4gICAgLy8gdGhlIGVsZW1lbnQgd2hlcmUgdGhlIHRvdWNoL2RyYWcgc3RhcnRlZCBzbyBpdCdzIGFsd2F5cyBjYXVnaHQuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXHJcblxyXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcclxuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcclxuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXHJcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XHJcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXHJcbiAgLy8gdGhlIGNlbGwgd2hlcmUgdGhpcyB0b3VjaCBldmVudCBpcyByaWdodCBub3cuIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIG9ubHkgd29ya1xyXG4gIC8vIGlmIHRoZSBldmVudCBpcyBhIGB0b3VjaG1vdmVgIGV2ZW50IHNpbmNlIGl0J3MgdGhlIG9ubHkgb25lIHRoYXQgaGFzIGEgYHRvdWNoZXNgIGxpc3QuXHJcbiAgZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCB7XHJcbiAgICBjb25zdCB7IHRvdWNoZXMgfSA9IGV2ZW50XHJcbiAgICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsXHJcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cclxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpXHJcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuY2VsbFRvRGF0ZS5nZXQodGFyZ2V0RWxlbWVudClcclxuICAgICAgcmV0dXJuIGNlbGxUaW1lID8/IG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG5cclxuICBlbmRTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQpXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcclxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGxcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcclxuICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsLCBjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcclxuICAgIGNvbnN0IHsgc2VsZWN0aW9uVHlwZSwgc2VsZWN0aW9uU3RhcnQgfSA9IHRoaXMuc3RhdGVcclxuXHJcbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gbnVsbCB8fCBzZWxlY3Rpb25TdGFydCA9PT0gbnVsbCkgcmV0dXJuXHJcblxyXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxyXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0ICYmIHNlbGVjdGlvbkVuZCAmJiBzZWxlY3Rpb25UeXBlKSB7XHJcbiAgICAgIG5ld1NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbdGhpcy5wcm9wcy5zZWxlY3Rpb25TY2hlbWVdKFxyXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0LFxyXG4gICAgICAgIHNlbGVjdGlvbkVuZCxcclxuICAgICAgICB0aGlzLnN0YXRlLmRhdGVzXHJcbiAgICAgICkuZmlsdGVyKHNlbGVjdGVkVGltZSA9PiAhdGhpcy5pc1RpbWVCbG9ja2VkKHNlbGVjdGVkVGltZSkpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5leHREcmFmdCA9IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl1cclxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xyXG4gICAgICBuZXh0RHJhZnQgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLm5leHREcmFmdCwgLi4ubmV3U2VsZWN0aW9uXSkpXHJcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3Rpb25EcmFmdDogbmV4dERyYWZ0IH0sIGNhbGxiYWNrKVxyXG4gIH1cclxuXHJcbiAgaXNUaW1lQmxvY2tlZCh0aW1lOiBEYXRlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5ibG9ja2VkVGltZXMuZmluZChibG9ja2VkVGltZSA9PiBibG9ja2VkVGltZS50b0lTT1N0cmluZygpID09PSB0aW1lLnRvSVNPU3RyaW5nKCkpICE9PSB1bmRlZmluZWRcclxuICB9XHJcblxyXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XHJcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcclxuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxyXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXHJcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VsZWN0aW9uVHlwZTogdGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJyxcclxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lOiBEYXRlKSB7XHJcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xyXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXHJcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxyXG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWU6IERhdGUpIHtcclxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcclxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XHJcbiAgfVxyXG5cclxuICBoYW5kbGVUb3VjaE1vdmVFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogdHJ1ZSB9KVxyXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcclxuICAgIGlmIChjZWxsVGltZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcclxuICAgIGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoRHJhZ2dpbmcpIHtcclxuICAgICAgLy8gR29pbmcgZG93biB0aGlzIGJyYW5jaCBtZWFucyB0aGUgdXNlciB0YXBwZWQgYnV0IGRpZG4ndCBkcmFnIC0tIHdoaWNoXHJcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXHJcbiAgICAgIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50IHdhcyBuZXZlciBjYWxsZWQpIHNvIHdlIG5lZWQgdG8gZG8gaXQgbm93XHJcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbCwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcclxuICAgIH1cclxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlIH0pXHJcbiAgfVxyXG5cclxuICByZW5kZXJEYXRlQ2VsbFdyYXBwZXIgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcclxuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHRpbWUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBCb29sZWFuKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCB0aW1lKSkpXHJcbiAgICBjb25zdCBibG9ja2VkID0gdGhpcy5pc1RpbWVCbG9ja2VkKHRpbWUpXHJcblxyXG4gICAgY29uc3QgdW5ibG9ja2VkQ2VsbFByb3BzID0ge1xyXG4gICAgICAvLyBNb3VzZSBoYW5kbGVyc1xyXG4gICAgICBvbk1vdXNlRG93bjogc3RhcnRIYW5kbGVyLFxyXG4gICAgICBvbk1vdXNlRW50ZXI6ICgpID0+IHtcclxuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxyXG4gICAgICB9LFxyXG4gICAgICBvbk1vdXNlVXA6ICgpID0+IHtcclxuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxyXG4gICAgICB9LFxyXG4gICAgICAvLyBUb3VjaCBoYW5kbGVyc1xyXG4gICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXHJcbiAgICAgIC8vIGluIHRoZSB0aW1lIHBhcmFtZXRlciwgaW5zdGVhZCB0aGVzZSBoYW5kbGVycyB3aWxsIGRvIHRoZWlyIGpvYiB1c2luZyB0aGUgZGVmYXVsdCBFdmVudFxyXG4gICAgICAvLyBwYXJhbWV0ZXJzXHJcbiAgICAgIG9uVG91Y2hTdGFydDogc3RhcnRIYW5kbGVyLFxyXG4gICAgICBvblRvdWNoTW92ZTogdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudCxcclxuICAgICAgb25Ub3VjaEVuZDogdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEdyaWRDZWxsXHJcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcclxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcclxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cclxuICAgICAgICB7Li4uKCFibG9ja2VkID8gdW5ibG9ja2VkQ2VsbFByb3BzIDoge30pfVxyXG4gICAgICA+XHJcbiAgICAgICAge3RoaXMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIGJsb2NrZWQpfVxyXG4gICAgICA8L0dyaWRDZWxsPlxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4sIGJsb2NrZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xyXG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcclxuICAgICAgICB0aGlzLmNlbGxUb0RhdGUuc2V0KGRhdGVDZWxsLCB0aW1lKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgcmVmU2V0dGVyKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8RGF0ZUNlbGxcclxuICAgICAgICAgIGJsb2NrZWQ9e2Jsb2NrZWR9XHJcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XHJcbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cclxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cclxuICAgICAgICAgIHVuc2VsZWN0ZWRDb2xvcj17dGhpcy5wcm9wcy51bnNlbGVjdGVkQ29sb3J9XHJcbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxyXG4gICAgICAgICAgYmxvY2tlZENvbG9yPXt0aGlzLnByb3BzLmJsb2NrZWRDb2xvcn1cclxuICAgICAgICAvPlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcclxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdERhdGUodGltZSwgdGhpcy5wcm9wcy50aW1lRm9ybWF0KX08L1RpbWVUZXh0PlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCB0aGlzLnByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyRnVsbERhdGVHcmlkKCk6IEFycmF5PEpTWC5FbGVtZW50PiB7XHJcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cclxuICAgIGNvbnN0IG51bURheXMgPSB0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aFxyXG4gICAgY29uc3QgbnVtVGltZXMgPSB0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aFxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lcyAtIDE7IGogKz0gMSkgeyAvLyBudW1UaW1lcyAtIDHsnYQg7Ya17ZW0IOuniOyngOuniSDsi5zqsITsnYAg7IWAIOyDneyEse2VmOyngCDslYrqsowgKOydtOyEoO2YuCDstpTqsIApXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGF5czsgaSArPSAxKSB7XHJcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaCh0aGlzLnN0YXRlLmRhdGVzW2ldW2pdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHRoaXMucmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gaSAqIG51bURheXNcclxuICAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGUuZGF0ZXNbMF1baV1cclxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcclxuICAgICAgZGF0ZUdyaWRFbGVtZW50cy5zcGxpY2UoaW5kZXggKyBpLCAwLCB0aGlzLnJlbmRlclRpbWVMYWJlbCh0aW1lKSlcclxuICAgIH1cclxuICAgIHJldHVybiBbXHJcbiAgICAgIC8vIEVtcHR5IHRvcCBsZWZ0IGNvcm5lclxyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcclxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xyXG4gICAgICAuLi50aGlzLnN0YXRlLmRhdGVzLm1hcCgoZGF5T2ZUaW1lcywgaW5kZXgpID0+XHJcbiAgICAgICAgUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pXHJcbiAgICAgICksXHJcbiAgICAgIC8vIEV2ZXJ5IHJvdyBhZnRlciB0aGF0XHJcbiAgICAgIC4uLmRhdGVHcmlkRWxlbWVudHMubWFwKChlbGVtZW50LCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KGVsZW1lbnQsIHsga2V5OiBgdGltZS0ke2luZGV4fWAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPFdyYXBwZXI+XHJcbiAgICAgICAgPEdyaWRcclxuICAgICAgICAgIGNvbHVtbnM9e3RoaXMuc3RhdGUuZGF0ZXMubGVuZ3RofVxyXG4gICAgICAgICAgcm93cz17dGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGh9XHJcbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxyXG4gICAgICAgICAgcm93R2FwPXt0aGlzLnByb3BzLnJvd0dhcH1cclxuICAgICAgICAgIHJlZj17ZWwgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRSZWYgPSBlbFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7dGhpcy5yZW5kZXJGdWxsRGF0ZUdyaWQoKX1cclxuICAgICAgICA8L0dyaWQ+XHJcbiAgICAgIDwvV3JhcHBlcj5cclxuICAgIClcclxuICB9XHJcbn1cclxuIl19