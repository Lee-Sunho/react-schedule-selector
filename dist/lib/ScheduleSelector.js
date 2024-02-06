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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsIkRhdGVDZWxsIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwiZGF0ZXMiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsInJlbmRlcmluZ0RhdGVzIiwiZm9yRWFjaCIsInJlbmRlcmluZ0RhdGUiLCJjdXJyZW50RGF5IiwiY3VycmVudERhdGUiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImNvbnN0cnVjdG9yIiwiY2VsbFRvRGF0ZSIsIk1hcCIsImdyaWRSZWYiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJ0aW1lIiwic3RhcnRIYW5kbGVyIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsIkJvb2xlYW4iLCJmaW5kIiwiYSIsImlzVGltZUJsb2NrZWQiLCJ1bmJsb2NrZWRDZWxsUHJvcHMiLCJvbk1vdXNlRG93biIsIm9uTW91c2VFbnRlciIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsIm9uTW91c2VVcCIsImhhbmRsZU1vdXNlVXBFdmVudCIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwiaGFuZGxlVG91Y2hNb3ZlRXZlbnQiLCJvblRvdWNoRW5kIiwiaGFuZGxlVG91Y2hFbmRFdmVudCIsInRvSVNPU3RyaW5nIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJkYXRlQ2VsbCIsInNldCIsInJlbmRlclRpbWVMYWJlbCIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInNlbGVjdGlvblR5cGUiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJlbmRTZWxlY3Rpb24iLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2YWx1ZSIsInBhc3NpdmUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJnZXQiLCJvbkNoYW5nZSIsInNldFN0YXRlIiwidXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQiLCJzZWxlY3Rpb25FbmQiLCJjYWxsYmFjayIsIm5ld1NlbGVjdGlvbiIsInNlbGVjdGlvblNjaGVtZSIsImZpbHRlciIsInNlbGVjdGVkVGltZSIsIm5leHREcmFmdCIsIkFycmF5IiwiZnJvbSIsIlNldCIsImIiLCJibG9ja2VkVGltZXMiLCJibG9ja2VkVGltZSIsInVuZGVmaW5lZCIsInN0YXJ0VGltZSIsInRpbWVTZWxlY3RlZCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtRGF5cyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50Iiwia2V5IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsT0FBTyxHQUFHQywwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSxvRUFBYjs7QUFPQSxNQUFNQyxJQUFJLEdBQUdGLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLG1KQUU2QkUsS0FBSyxJQUFJQSxLQUFLLENBQUNDLE9BRjVDLEVBRzBCRCxLQUFLLElBQUlBLEtBQUssQ0FBQ0UsSUFIekMsRUFJTUYsS0FBSyxJQUFJQSxLQUFLLENBQUNHLFNBSnJCLEVBS0dILEtBQUssSUFBSUEsS0FBSyxDQUFDSSxNQUxsQixDQUFWOztBQVNPLE1BQU1DLFFBQVEsR0FBR1IsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsNkNBQWQ7Ozs7QUFjUCxNQUFNUSxnQkFBZ0IsR0FBSU4sS0FBRCxJQUEwQjtBQUNqRCxNQUFJQSxLQUFLLENBQUNPLE9BQVYsRUFBbUI7QUFDakIsV0FBT1AsS0FBSyxDQUFDUSxZQUFiO0FBQ0QsR0FGRCxNQUVPLElBQUlSLEtBQUssQ0FBQ1MsUUFBVixFQUFvQjtBQUN6QixXQUFPVCxLQUFLLENBQUNVLGFBQWI7QUFDRCxHQUZNLE1BRUE7QUFDTCxXQUFPVixLQUFLLENBQUNXLGVBQWI7QUFDRDtBQUNGLENBUkQ7O0FBVUEsTUFBTUMsUUFBUSxHQUFHZiwwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSwwREFHUVEsZ0JBSFIsRUFLVk4sS0FBSyxJQUNMLENBQUNBLEtBQUssQ0FBQ08sT0FBUCxzREFHc0JQLEtBQUssQ0FBQ2EsWUFINUIsb0JBTUks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QUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFO0FBbkJzQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXHJcblxyXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXHJcbmltcG9ydCBhZGRNaW51dGVzIGZyb20gJ2RhdGUtZm5zL2FkZF9taW51dGVzJ1xyXG5pbXBvcnQgYWRkSG91cnMgZnJvbSAnZGF0ZS1mbnMvYWRkX2hvdXJzJ1xyXG5pbXBvcnQgYWRkRGF5cyBmcm9tICdkYXRlLWZucy9hZGRfZGF5cydcclxuaW1wb3J0IHN0YXJ0T2ZEYXkgZnJvbSAnZGF0ZS1mbnMvc3RhcnRfb2ZfZGF5J1xyXG5pbXBvcnQgaXNTYW1lTWludXRlIGZyb20gJ2RhdGUtZm5zL2lzX3NhbWVfbWludXRlJ1xyXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXHJcblxyXG5pbXBvcnQgeyBUZXh0LCBTdWJ0aXRsZSB9IGZyb20gJy4vdHlwb2dyYXBoeSdcclxuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcclxuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMnXHJcblxyXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbmBcclxuXHJcbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PHsgY29sdW1uczogbnVtYmVyOyByb3dzOiBudW1iZXI7IGNvbHVtbkdhcDogc3RyaW5nOyByb3dHYXA6IHN0cmluZyB9PmBcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5zfSwgMWZyKTtcclxuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMucm93c30sIDFmcik7XHJcbiAgY29sdW1uLWdhcDogJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5HYXB9O1xyXG4gIHJvdy1nYXA6ICR7cHJvcHMgPT4gcHJvcHMucm93R2FwfTtcclxuICB3aWR0aDogMTAwJTtcclxuYFxyXG5cclxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcclxuICBwbGFjZS1zZWxmOiBzdHJldGNoO1xyXG4gIHRvdWNoLWFjdGlvbjogbm9uZTtcclxuYFxyXG5cclxudHlwZSBEYXRlQ2VsbFByb3BzID0ge1xyXG4gIGJsb2NrZWQ6IGJvb2xlYW5cclxuICBzZWxlY3RlZDogYm9vbGVhblxyXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xyXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmdcclxuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xyXG59XHJcblxyXG5jb25zdCBnZXREYXRlQ2VsbENvbG9yID0gKHByb3BzOiBEYXRlQ2VsbFByb3BzKSA9PiB7XHJcbiAgaWYgKHByb3BzLmJsb2NrZWQpIHtcclxuICAgIHJldHVybiBwcm9wcy5ibG9ja2VkQ29sb3JcclxuICB9IGVsc2UgaWYgKHByb3BzLnNlbGVjdGVkKSB7XHJcbiAgICByZXR1cm4gcHJvcHMuc2VsZWN0ZWRDb2xvclxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gcHJvcHMudW5zZWxlY3RlZENvbG9yXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8RGF0ZUNlbGxQcm9wcz5gXHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiAyNXB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICR7Z2V0RGF0ZUNlbGxDb2xvcn07XHJcblxyXG4gICR7cHJvcHMgPT5cclxuICAgICFwcm9wcy5ibG9ja2VkXHJcbiAgICAgID8gYFxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuaG92ZXJlZENvbG9yfTtcclxuICAgIH1cclxuICBgXHJcbiAgICAgIDogJyd9XHJcbmBcclxuXHJcbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XHJcbiAgICBmb250LXNpemU6IDEycHg7XHJcbiAgfVxyXG4gIG1hcmdpbjogMDtcclxuICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcbmBcclxuXHJcbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxyXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xyXG4gICAgZm9udC1zaXplOiAxMHB4O1xyXG4gIH1cclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxuICBtYXJnaW46IDA7XHJcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XHJcbmBcclxuXHJcbnR5cGUgUHJvcHNUeXBlID0ge1xyXG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cclxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcclxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcclxuICAvL3N0YXJ0RGF0ZTogRGF0ZVxyXG4gIHJlbmRlcmluZ0RhdGVzOiBEYXRlW10gLy8g7J207ISg7Zi4IOy2lOqwgFxyXG4gIG51bURheXM6IG51bWJlclxyXG4gIG1pblRpbWU6IG51bWJlclxyXG4gIG1heFRpbWU6IG51bWJlclxyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXHJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXHJcbiAgdGltZUZvcm1hdDogc3RyaW5nXHJcbiAgY29sdW1uR2FwOiBzdHJpbmdcclxuICByb3dHYXA6IHN0cmluZ1xyXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcclxuICBibG9ja2VkVGltZXM6IERhdGVbXSAvLyDsnbTshKDtmLgg7LaU6rCAXHJcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmdcclxuICByZW5kZXJEYXRlQ2VsbD86IChkYXRldGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4sIGJsb2NrZWQ6IGJvb2xlYW4sIHJlZlNldHRlcjogKGRhdGVDZWxsRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWQpID0+IEpTWC5FbGVtZW50XHJcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XHJcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XHJcbn1cclxuXHJcbnR5cGUgU3RhdGVUeXBlID0ge1xyXG4gIC8vIEluIHRoZSBjYXNlIHRoYXQgYSB1c2VyIGlzIGRyYWctc2VsZWN0aW5nLCB3ZSBkb24ndCB3YW50IHRvIGNhbGwgdGhpcy5wcm9wcy5vbkNoYW5nZSgpIHVudGlsIHRoZXkgaGF2ZSBjb21wbGV0ZWRcclxuICAvLyB0aGUgZHJhZy1zZWxlY3QuIHNlbGVjdGlvbkRyYWZ0IHNlcnZlcyBhcyBhIHRlbXBvcmFyeSBjb3B5IGR1cmluZyBkcmFnLXNlbGVjdHMuXHJcbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XHJcbiAgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSB8IG51bGxcclxuICBzZWxlY3Rpb25TdGFydDogRGF0ZSB8IG51bGxcclxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cclxuICBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wc1R5cGUsIFN0YXRlVHlwZT4ge1xyXG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxyXG4gIGNlbGxUb0RhdGU6IE1hcDxFbGVtZW50LCBEYXRlPiA9IG5ldyBNYXAoKVxyXG4gIC8vIGRvY3VtZW50TW91c2VVcEhhbmRsZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxyXG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XHJcbiAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQ6IChldmVudDogUmVhY3QuU3ludGhldGljVG91Y2hFdmVudDwqPikgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZVRvdWNoRW5kRXZlbnQ6ICgpID0+IHZvaWRcclxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgLy8gaGFuZGxlTW91c2VFbnRlckV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxyXG5cclxuICBzdGF0aWMgZGVmYXVsdFByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7XHJcbiAgICBzZWxlY3Rpb246IFtdLFxyXG4gICAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcclxuICAgIG51bURheXM6IDcsXHJcbiAgICBtaW5UaW1lOiA5LFxyXG4gICAgbWF4VGltZTogMjMsXHJcbiAgICBob3VybHlDaHVua3M6IDEsXHJcbiAgICAvLyBzdGFydERhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAvLyDsnbTshKDtmLgg7LaU6rCAXHJcbiAgICByZW5kZXJpbmdEYXRlczogW10sXHJcbiAgICB0aW1lRm9ybWF0OiAnaGEnLFxyXG4gICAgZGF0ZUZvcm1hdDogJ00vRCcsXHJcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxyXG4gICAgcm93R2FwOiAnNHB4JyxcclxuICAgIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxyXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXHJcbiAgICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXHJcbiAgICBibG9ja2VkVGltZXM6IFtdLCAvLyDsnbTshKDtmLgg7LaU6rCAXHJcbiAgICBibG9ja2VkQ29sb3I6ICcjZjFmMWYyJywgLy8g7J207ISg7Zi4IOy2lOqwgFxyXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wc1R5cGUsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcclxuICAgIC8vIEFzIGxvbmcgYXMgdGhlIHVzZXIgaXNuJ3QgaW4gdGhlIHByb2Nlc3Mgb2Ygc2VsZWN0aW5nLCBhbGxvdyBwcm9wIGNoYW5nZXMgdG8gcmUtcG9wdWxhdGUgc2VsZWN0aW9uIHN0YXRlXHJcbiAgICBpZiAoc3RhdGUuc2VsZWN0aW9uU3RhcnQgPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4ucHJvcHMuc2VsZWN0aW9uXSxcclxuICAgICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG5cclxuICAvKiBcclxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXHJcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cclxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcclxuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxyXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcclxuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRlc1xyXG4gIH1cclxuICAqL1xyXG5cclxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xyXG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXHJcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cclxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcclxuXHJcbiAgICBwcm9wcy5yZW5kZXJpbmdEYXRlcy5mb3JFYWNoKHJlbmRlcmluZ0RhdGUgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cclxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBzdGFydE9mRGF5KHJlbmRlcmluZ0RhdGUpXHJcblxyXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8PSBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcclxuICAgICAgICAvLyDsi5zqsITsnbQgbWF4VGltZeydtOqzoCDssq3tgazqsIAgaG91cmx5Q2h1bmtz67O064ukIOyekeydhCDrlYzrp4wg67CY67O17ZWY7JesIG1heFRpbWXsnbQg7Y+s7ZWo65CY6rKMICjsnbTshKDtmLgg7LaU6rCAKVxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzICYmICEoaCA9PT0gcHJvcHMubWF4VGltZSAmJiBjID09PSBwcm9wcy5ob3VybHlDaHVua3MgLSAxKTsgYyArPSAxKSB7XHJcbiAgICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhjdXJyZW50RGF0ZSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZGF0ZXNcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wc1R5cGUpIHtcclxuICAgIHN1cGVyKHByb3BzKVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dLCAvLyBjb3B5IGl0IG92ZXJcclxuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcclxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGwsXHJcbiAgICAgIGlzVG91Y2hEcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzID0ge1xyXG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxyXG4gICAgICBzcXVhcmU6IHNlbGVjdGlvblNjaGVtZXMuc3F1YXJlXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmRTZWxlY3Rpb24gPSB0aGlzLmVuZFNlbGVjdGlvbi5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudC5iaW5kKHRoaXMpXHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXHJcbiAgICAvLyB0aGUgZGF0ZSBjZWxscyAoaW4gd2hpY2ggY2FzZSBub25lIG9mIHRoZSBEYXRlQ2VsbCdzIG9uTW91c2VVcCBoYW5kbGVycyB3b3VsZCBmaXJlKVxyXG4gICAgLy9cclxuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cclxuICAgIC8vIHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaC9kcmFnIHN0YXJ0ZWQgc28gaXQncyBhbHdheXMgY2F1Z2h0LlxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxyXG5cclxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXHJcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XHJcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxyXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xyXG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xyXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcclxuICAvLyBpZiB0aGUgZXZlbnQgaXMgYSBgdG91Y2htb3ZlYCBldmVudCBzaW5jZSBpdCdzIHRoZSBvbmx5IG9uZSB0aGF0IGhhcyBhIGB0b3VjaGVzYCBsaXN0LlxyXG4gIGdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwge1xyXG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxyXG4gICAgaWYgKCF0b3VjaGVzIHx8IHRvdWNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbFxyXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXHJcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxyXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmNlbGxUb0RhdGUuZ2V0KHRhcmdldEVsZW1lbnQpXHJcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxuXHJcbiAgZW5kU2VsZWN0aW9uKCkge1xyXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0KVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXHJcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgLy8gR2l2ZW4gYW4gZW5kaW5nIERhdGUsIGRldGVybWluZXMgYWxsIHRoZSBkYXRlcyB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBpbiB0aGlzIGRyYWZ0XHJcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XHJcbiAgICBjb25zdCB7IHNlbGVjdGlvblR5cGUsIHNlbGVjdGlvblN0YXJ0IH0gPSB0aGlzLnN0YXRlXHJcblxyXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxyXG5cclxuICAgIGxldCBuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+ID0gW11cclxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xyXG4gICAgICBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzW3RoaXMucHJvcHMuc2VsZWN0aW9uU2NoZW1lXShcclxuICAgICAgICBzZWxlY3Rpb25TdGFydCxcclxuICAgICAgICBzZWxlY3Rpb25FbmQsXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5kYXRlc1xyXG4gICAgICApLmZpbHRlcihzZWxlY3RlZFRpbWUgPT4gIXRoaXMuaXNUaW1lQmxvY2tlZChzZWxlY3RlZFRpbWUpKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dXHJcbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxyXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xyXG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0aW9uRHJhZnQ6IG5leHREcmFmdCB9LCBjYWxsYmFjaylcclxuICB9XHJcblxyXG4gIGlzVGltZUJsb2NrZWQodGltZTogRGF0ZSkge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYmxvY2tlZFRpbWVzLmZpbmQoYmxvY2tlZFRpbWUgPT4gYmxvY2tlZFRpbWUudG9JU09TdHJpbmcoKSA9PT0gdGltZS50b0lTT1N0cmluZygpKSAhPT0gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxyXG4gIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQoc3RhcnRUaW1lOiBEYXRlKSB7XHJcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcclxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xyXG4gICAgY29uc3QgdGltZVNlbGVjdGVkID0gdGhpcy5wcm9wcy5zZWxlY3Rpb24uZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlbGVjdGlvblR5cGU6IHRpbWVTZWxlY3RlZCA/ICdyZW1vdmUnIDogJ2FkZCcsXHJcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBzdGFydFRpbWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZTogRGF0ZSkge1xyXG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcclxuICAgIC8vIHdoZXJlIHRoZSB1c2VyIGp1c3QgY2xpY2tzIG9uIGEgc2luZ2xlIGNlbGwgKGJlY2F1c2Ugbm8gbW91c2VlbnRlciBldmVudHMgZmlyZVxyXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcclxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcclxuICB9XHJcblxyXG4gIGhhbmRsZU1vdXNlVXBFdmVudCh0aW1lOiBEYXRlKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXHJcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxyXG4gIH1cclxuXHJcbiAgaGFuZGxlVG91Y2hNb3ZlRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IHRydWUgfSlcclxuICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5nZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQpXHJcbiAgICBpZiAoY2VsbFRpbWUpIHtcclxuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChjZWxsVGltZSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZVRvdWNoRW5kRXZlbnQoKSB7XHJcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNUb3VjaERyYWdnaW5nKSB7XHJcbiAgICAgIC8vIEdvaW5nIGRvd24gdGhpcyBicmFuY2ggbWVhbnMgdGhlIHVzZXIgdGFwcGVkIGJ1dCBkaWRuJ3QgZHJhZyAtLSB3aGljaFxyXG4gICAgICAvLyBtZWFucyB0aGUgYXZhaWxhYmlsaXR5IGRyYWZ0IGhhc24ndCB5ZXQgYmVlbiB1cGRhdGVkIChzaW5jZVxyXG4gICAgICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudCB3YXMgbmV2ZXIgY2FsbGVkKSBzbyB3ZSBuZWVkIHRvIGRvIGl0IG5vd1xyXG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KG51bGwsICgpID0+IHtcclxuICAgICAgICB0aGlzLmVuZFNlbGVjdGlvbigpXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVuZFNlbGVjdGlvbigpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSB9KVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBjb25zdCBzdGFydEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbih0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxyXG4gICAgY29uc3QgYmxvY2tlZCA9IHRoaXMuaXNUaW1lQmxvY2tlZCh0aW1lKVxyXG5cclxuICAgIGNvbnN0IHVuYmxvY2tlZENlbGxQcm9wcyA9IHtcclxuICAgICAgLy8gTW91c2UgaGFuZGxlcnNcclxuICAgICAgb25Nb3VzZURvd246IHN0YXJ0SGFuZGxlcixcclxuICAgICAgb25Nb3VzZUVudGVyOiAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZSlcclxuICAgICAgfSxcclxuICAgICAgb25Nb3VzZVVwOiAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQodGltZSlcclxuICAgICAgfSxcclxuICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcclxuICAgICAgLy8gU2luY2UgdG91Y2ggZXZlbnRzIGZpcmUgb24gdGhlIGV2ZW50IHdoZXJlIHRoZSB0b3VjaC1kcmFnIHN0YXJ0ZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gcGFzc2luZ1xyXG4gICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcclxuICAgICAgLy8gcGFyYW1ldGVyc1xyXG4gICAgICBvblRvdWNoU3RhcnQ6IHN0YXJ0SGFuZGxlcixcclxuICAgICAgb25Ub3VjaE1vdmU6IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQsXHJcbiAgICAgIG9uVG91Y2hFbmQ6IHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxHcmlkQ2VsbFxyXG4gICAgICAgIGNsYXNzTmFtZT1cInJnZHBfX2dyaWQtY2VsbFwiXHJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXHJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XHJcbiAgICAgICAgey4uLighYmxvY2tlZCA/IHVuYmxvY2tlZENlbGxQcm9wcyA6IHt9KX1cclxuICAgICAgPlxyXG4gICAgICAgIHt0aGlzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCBibG9ja2VkKX1cclxuICAgICAgPC9HcmlkQ2VsbD5cclxuICAgIClcclxuICB9XHJcblxyXG4gIHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCBibG9ja2VkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcclxuICAgICAgaWYgKGRhdGVDZWxsKSB7XHJcbiAgICAgICAgdGhpcy5jZWxsVG9EYXRlLnNldChkYXRlQ2VsbCwgdGltZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIGJsb2NrZWQsIHJlZlNldHRlcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPERhdGVDZWxsXHJcbiAgICAgICAgICBibG9ja2VkPXtibG9ja2VkfVxyXG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxyXG4gICAgICAgICAgcmVmPXtyZWZTZXR0ZXJ9XHJcbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3J9XHJcbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMudW5zZWxlY3RlZENvbG9yfVxyXG4gICAgICAgICAgaG92ZXJlZENvbG9yPXt0aGlzLnByb3BzLmhvdmVyZWRDb2xvcn1cclxuICAgICAgICAgIGJsb2NrZWRDb2xvcj17dGhpcy5wcm9wcy5ibG9ja2VkQ29sb3J9XHJcbiAgICAgICAgLz5cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHRoaXMucHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlckRhdGVMYWJlbCA9IChkYXRlOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZSwgdGhpcy5wcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlckZ1bGxEYXRlR3JpZCgpOiBBcnJheTxKU1guRWxlbWVudD4ge1xyXG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXHJcbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcclxuICAgIGNvbnN0IG51bVRpbWVzID0gdGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGhcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXMgLSAxOyBqICs9IDEpIHsgLy8gbnVtVGltZXMgLSAx7J2EIO2Gte2VtCDrp4jsp4Drp4kg7Iuc6rCE7J2AIOyFgCDsg53shLHtlZjsp4Ag7JWK6rKMICjsnbTshKDtmLgg7LaU6rCAKVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xyXG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2godGhpcy5zdGF0ZS5kYXRlc1tpXVtqXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0ZUdyaWRFbGVtZW50cyA9IGZsYXR0ZW5lZERhdGVzLm1hcCh0aGlzLnJlbmRlckRhdGVDZWxsV3JhcHBlcilcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXHJcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlLmRhdGVzWzBdW2ldXHJcbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XHJcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcclxuICAgICAgPGRpdiBrZXk9XCJ0b3BsZWZ0XCIgLz4sXHJcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcclxuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxyXG4gICAgICAgIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KVxyXG4gICAgICApLFxyXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxyXG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKVxyXG4gICAgXVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxXcmFwcGVyPlxyXG4gICAgICAgIDxHcmlkXHJcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cclxuICAgICAgICAgIHJvd3M9e3RoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RofVxyXG4gICAgICAgICAgY29sdW1uR2FwPXt0aGlzLnByb3BzLmNvbHVtbkdhcH1cclxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XHJcbiAgICAgICAgICByZWY9e2VsID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmlkUmVmID0gZWxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge3RoaXMucmVuZGVyRnVsbERhdGVHcmlkKCl9XHJcbiAgICAgICAgPC9HcmlkPlxyXG4gICAgICA8L1dyYXBwZXI+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdfQ==