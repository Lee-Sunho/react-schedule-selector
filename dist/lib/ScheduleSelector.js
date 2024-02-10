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
      const {
        clickedTime
      } = this.state;

      const startHandler = () => {
        this.handleSelectionStartEvent(time);
      };

      const selected = Boolean(this.state.selectionDraft.find(a => (0, _is_same_minute.default)(a, time)));
      const blocked = this.isTimeBlocked(time);
      const clicked = clickedTime !== null && this.props.isConfirmed && (0, _is_same_minute.default)(time, clickedTime);
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
      }, !blocked ? unblockedCellProps : {}), this.renderDateCell(time, selected, blocked, clicked));
    };

    this.handleCellClick = (time, blocked) => {
      if (!blocked) {
        this.setState({
          clickedTime: time
        });
      }
    };

    this.renderDateCell = (time, selected, blocked, clicked) => {
      const refSetter = dateCell => {
        if (dateCell) {
          this.cellToDate.set(dateCell, time);
        }
      };

      if (this.props.renderDateCell) {
        return this.props.renderDateCell(time, selected, blocked, clicked, this.handleCellClick, refSetter);
      } else {
        return /*#__PURE__*/React.createElement(DateCell, {
          clicked: clicked,
          blocked: blocked,
          selected: selected,
          ref: refSetter,
          selectedColor: this.props.selectedColor,
          unselectedColor: this.props.unselectedColor,
          hoveredColor: this.props.hoveredColor,
          blockedColor: this.props.blockedColor,
          onClick: () => this.handleCellClick(time, blocked)
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
      dates: ScheduleSelector.computeDatesMatrix(props),
      clickedTime: null // 이선호 추가

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
    // 면접 확정뷰의 경우 이미 선택된 날짜 선택 불가하도록 - 이선호 추가
    const isAlreadySelected = this.state.selectionDraft.find(a => (0, _is_same_minute.default)(a, startTime));
    const selectionType = isAlreadySelected ? 'remove' : 'add';

    if (this.props.isConfirmed && isAlreadySelected) {
      return;
    }

    this.setState({
      selectionType: selectionType ? 'remove' : 'add',
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
  isConfirmed: false,
  // 이선호 추가
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsIkRhdGVDZWxsIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwiZGF0ZXMiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsInJlbmRlcmluZ0RhdGVzIiwiZm9yRWFjaCIsInJlbmRlcmluZ0RhdGUiLCJjdXJyZW50RGF5IiwiY3VycmVudERhdGUiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImNvbnN0cnVjdG9yIiwiY2VsbFRvRGF0ZSIsIk1hcCIsImdyaWRSZWYiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJ0aW1lIiwiY2xpY2tlZFRpbWUiLCJzdGFydEhhbmRsZXIiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwiQm9vbGVhbiIsImZpbmQiLCJhIiwiaXNUaW1lQmxvY2tlZCIsImNsaWNrZWQiLCJpc0NvbmZpcm1lZCIsInVuYmxvY2tlZENlbGxQcm9wcyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50Iiwib25Nb3VzZVVwIiwiaGFuZGxlTW91c2VVcEV2ZW50Iiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsIm9uVG91Y2hFbmQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwidG9JU09TdHJpbmciLCJyZW5kZXJEYXRlQ2VsbCIsImhhbmRsZUNlbGxDbGljayIsInNldFN0YXRlIiwicmVmU2V0dGVyIiwiZGF0ZUNlbGwiLCJzZXQiLCJyZW5kZXJUaW1lTGFiZWwiLCJ0aW1lRm9ybWF0IiwicmVuZGVyRGF0ZUxhYmVsIiwiZGF0ZSIsImRhdGVGb3JtYXQiLCJzZWxlY3Rpb25UeXBlIiwiaXNUb3VjaERyYWdnaW5nIiwic2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMiLCJsaW5lYXIiLCJzZWxlY3Rpb25TY2hlbWVzIiwic3F1YXJlIiwiZW5kU2VsZWN0aW9uIiwiYmluZCIsImNvbXBvbmVudERpZE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwidmFsdWUiLCJwYXNzaXZlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwiZ2V0Iiwib25DaGFuZ2UiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsImNhbGxiYWNrIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwiZmlsdGVyIiwic2VsZWN0ZWRUaW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiYiIsImF2YWlsYWJsZVRpbWVzIiwiYXZhaWxhYmxlVGltZSIsInVuZGVmaW5lZCIsInN0YXJ0VGltZSIsImlzQWxyZWFkeVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1EYXlzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJjbG9uZUVsZW1lbnQiLCJrZXkiLCJlbGVtZW50IiwicmVuZGVyIiwiZWwiLCJkZWZhdWx0UHJvcHMiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxPQUFPLEdBQUdDLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLG9FQUFiOztBQU9BLE1BQU1DLElBQUksR0FBR0YsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsbUpBRTZCRSxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsT0FGNUMsRUFHMEJELEtBQUssSUFBSUEsS0FBSyxDQUFDRSxJQUh6QyxFQUlNRixLQUFLLElBQUlBLEtBQUssQ0FBQ0csU0FKckIsRUFLR0gsS0FBSyxJQUFJQSxLQUFLLENBQUNJLE1BTGxCLENBQVY7O0FBU08sTUFBTUMsUUFBUSxHQUFHUiwwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSw2Q0FBZDs7OztBQWVQLE1BQU1RLGdCQUFnQixHQUFJTixLQUFELElBQTBCO0FBQ2pELE1BQUlBLEtBQUssQ0FBQ08sT0FBVixFQUFtQjtBQUNqQixXQUFPUCxLQUFLLENBQUNRLFlBQWI7QUFDRCxHQUZELE1BRU8sSUFBSVIsS0FBSyxDQUFDUyxRQUFWLEVBQW9CO0FBQ3pCLFdBQU9ULEtBQUssQ0FBQ1UsYUFBYjtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQU9WLEtBQUssQ0FBQ1csZUFBYjtBQUNEO0FBQ0YsQ0FSRDs7QUFVQSxNQUFNQyxRQUFRLEdBQUdmLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLDBEQUdRUSxnQkFIUixFQUtW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QVMsRUFBRSxLQUFLckcsS0FBTCxDQUFXRyxTQUh4QjtBQUlFLE1BQUEsTUFBTSxFQUFFLEtBQUtILEtBQUwsQ0FBV0ksTUFKckI7QUFLRSxNQUFBLEdBQUcsRUFBRXlJLEVBQUUsSUFBSTtBQUNULGFBQUs3RixPQUFMLEdBQWU2RixFQUFmO0FBQ0Q7QUFQSCxPQVNHLEtBQUtmLGtCQUFMLEVBVEgsQ0FERixDQURGO0FBZUQ7O0FBMVhpRjs7O0FBQS9EekcsZ0IsQ0FZWnlILFksR0FBbUM7QUFDeENsSCxFQUFBQSxTQUFTLEVBQUUsRUFENkI7QUFFeENxRixFQUFBQSxlQUFlLEVBQUUsUUFGdUI7QUFHeENlLEVBQUFBLE9BQU8sRUFBRSxDQUgrQjtBQUl4Q3ZGLEVBQUFBLE9BQU8sRUFBRSxDQUorQjtBQUt4Q0MsRUFBQUEsT0FBTyxFQUFFLEVBTCtCO0FBTXhDUixFQUFBQSxZQUFZLEVBQUUsQ0FOMEI7QUFPeEM7QUFDQTtBQUNBQyxFQUFBQSxjQUFjLEVBQUUsRUFUd0I7QUFVeEM0QyxFQUFBQSxVQUFVLEVBQUUsSUFWNEI7QUFXeENHLEVBQUFBLFVBQVUsRUFBRSxLQVg0QjtBQVl4Qy9FLEVBQUFBLFNBQVMsRUFBRSxLQVo2QjtBQWF4Q0MsRUFBQUEsTUFBTSxFQUFFLEtBYmdDO0FBY3hDTSxFQUFBQSxhQUFhLEVBQUVxSSxnQkFBT0MsSUFka0I7QUFleENySSxFQUFBQSxlQUFlLEVBQUVvSSxnQkFBT0UsUUFmZ0I7QUFnQnhDcEksRUFBQUEsWUFBWSxFQUFFa0ksZ0JBQU9HLFNBaEJtQjtBQWlCeEM7QUFDQTFJLEVBQUFBLFlBQVksRUFBRSxTQWxCMEI7QUFrQmY7QUFDekJtRCxFQUFBQSxXQUFXLEVBQUUsS0FuQjJCO0FBbUJwQjtBQUNwQmlELEVBQUFBLFFBQVEsRUFBRSxNQUFNLENBQUU7QUFwQnNCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXG5cbi8vIEltcG9ydCBvbmx5IHRoZSBtZXRob2RzIHdlIG5lZWQgZnJvbSBkYXRlLWZucyBpbiBvcmRlciB0byBrZWVwIGJ1aWxkIHNpemUgc21hbGxcbmltcG9ydCBhZGRNaW51dGVzIGZyb20gJ2RhdGUtZm5zL2FkZF9taW51dGVzJ1xuaW1wb3J0IGFkZEhvdXJzIGZyb20gJ2RhdGUtZm5zL2FkZF9ob3VycydcbmltcG9ydCBhZGREYXlzIGZyb20gJ2RhdGUtZm5zL2FkZF9kYXlzJ1xuaW1wb3J0IHN0YXJ0T2ZEYXkgZnJvbSAnZGF0ZS1mbnMvc3RhcnRfb2ZfZGF5J1xuaW1wb3J0IGlzU2FtZU1pbnV0ZSBmcm9tICdkYXRlLWZucy9pc19zYW1lX21pbnV0ZSdcbmltcG9ydCBmb3JtYXREYXRlIGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCdcblxuaW1wb3J0IHsgVGV4dCwgU3VidGl0bGUgfSBmcm9tICcuL3R5cG9ncmFwaHknXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJ1xuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMnXG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG5gXG5cbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PHsgY29sdW1uczogbnVtYmVyOyByb3dzOiBudW1iZXI7IGNvbHVtbkdhcDogc3RyaW5nOyByb3dHYXA6IHN0cmluZyB9PmBcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLmNvbHVtbnN9LCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMucm93c30sIDFmcik7XG4gIGNvbHVtbi1nYXA6ICR7cHJvcHMgPT4gcHJvcHMuY29sdW1uR2FwfTtcbiAgcm93LWdhcDogJHtwcm9wcyA9PiBwcm9wcy5yb3dHYXB9O1xuICB3aWR0aDogMTAwJTtcbmBcblxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcbiAgcGxhY2Utc2VsZjogc3RyZXRjaDtcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xuYFxuXG50eXBlIERhdGVDZWxsUHJvcHMgPSB7XG4gIGNsaWNrZWQ6IGJvb2xlYW5cbiAgYmxvY2tlZDogYm9vbGVhblxuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgZ2V0RGF0ZUNlbGxDb2xvciA9IChwcm9wczogRGF0ZUNlbGxQcm9wcykgPT4ge1xuICBpZiAocHJvcHMuYmxvY2tlZCkge1xuICAgIHJldHVybiBwcm9wcy5ibG9ja2VkQ29sb3JcbiAgfSBlbHNlIGlmIChwcm9wcy5zZWxlY3RlZCkge1xuICAgIHJldHVybiBwcm9wcy5zZWxlY3RlZENvbG9yXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb3BzLnVuc2VsZWN0ZWRDb2xvclxuICB9XG59XG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjxEYXRlQ2VsbFByb3BzPmBcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMjVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtnZXREYXRlQ2VsbENvbG9yfTtcblxuICAke3Byb3BzID0+XG4gICAgIXByb3BzLmJsb2NrZWRcbiAgICAgID8gYFxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYFxuICAgICAgOiAnJ31cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIG1hcmdpbjogMDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xuYFxuXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xuYFxuXG50eXBlIFByb3BzVHlwZSA9IHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIC8vc3RhcnREYXRlOiBEYXRlXG4gIHJlbmRlcmluZ0RhdGVzOiBEYXRlW10gLy8g7J207ISg7Zi4IOy2lOqwgFxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcDogc3RyaW5nXG4gIHJvd0dhcDogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xuICBhdmFpbGFibGVUaW1lczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmcgLy8g7J207ISg7Zi4IOy2lOqwgFxuICBpc0NvbmZpcm1lZDogYm9vbGVhbiAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIHJlbmRlckRhdGVDZWxsPzogKFxuICAgIGRhdGV0aW1lOiBEYXRlLFxuICAgIHNlbGVjdGVkOiBib29sZWFuLFxuICAgIGJsb2NrZWQ6IGJvb2xlYW4sXG4gICAgY2xpY2tlZDogYm9vbGVhbixcbiAgICBvbkNsaWNrOiAodGltZTogRGF0ZSwgYmxvY2tlZDogYm9vbGVhbikgPT4gdm9pZCxcbiAgICByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkXG4gICkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG50eXBlIFN0YXRlVHlwZSA9IHtcbiAgLy8gSW4gdGhlIGNhc2UgdGhhdCBhIHVzZXIgaXMgZHJhZy1zZWxlY3RpbmcsIHdlIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzLnByb3BzLm9uQ2hhbmdlKCkgdW50aWwgdGhleSBoYXZlIGNvbXBsZXRlZFxuICAvLyB0aGUgZHJhZy1zZWxlY3QuIHNlbGVjdGlvbkRyYWZ0IHNlcnZlcyBhcyBhIHRlbXBvcmFyeSBjb3B5IGR1cmluZyBkcmFnLXNlbGVjdHMuXG4gIHNlbGVjdGlvbkRyYWZ0OiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlIHwgbnVsbFxuICBzZWxlY3Rpb25TdGFydDogRGF0ZSB8IG51bGxcbiAgaXNUb3VjaERyYWdnaW5nOiBib29sZWFuXG4gIGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj5cbiAgY2xpY2tlZFRpbWU6IERhdGUgfCBudWxsIC8vIOydtOyEoO2YuCDstpTqsIBcbn1cblxuZXhwb3J0IGNvbnN0IHByZXZlbnRTY3JvbGwgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wc1R5cGUsIFN0YXRlVHlwZT4ge1xuICBzZWxlY3Rpb25TY2hlbWVIYW5kbGVyczogeyBba2V5OiBzdHJpbmddOiAoc3RhcnREYXRlOiBEYXRlLCBlbmREYXRlOiBEYXRlLCBmb286IEFycmF5PEFycmF5PERhdGU+PikgPT4gRGF0ZVtdIH1cbiAgY2VsbFRvRGF0ZTogTWFwPEVsZW1lbnQsIERhdGU+ID0gbmV3IE1hcCgpXG4gIC8vIGRvY3VtZW50TW91c2VVcEhhbmRsZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxuICAvLyBlbmRTZWxlY3Rpb246ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxuICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudDogKGV2ZW50OiBSZWFjdC5TeW50aGV0aWNUb3VjaEV2ZW50PCo+KSA9PiB2b2lkXG4gIC8vIGhhbmRsZVRvdWNoRW5kRXZlbnQ6ICgpID0+IHZvaWRcbiAgLy8gaGFuZGxlTW91c2VVcEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZUVudGVyRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIGdyaWRSZWY6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7XG4gICAgc2VsZWN0aW9uOiBbXSxcbiAgICBzZWxlY3Rpb25TY2hlbWU6ICdzcXVhcmUnLFxuICAgIG51bURheXM6IDcsXG4gICAgbWluVGltZTogOSxcbiAgICBtYXhUaW1lOiAyMyxcbiAgICBob3VybHlDaHVua3M6IDEsXG4gICAgLy8gc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICAgIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgICByZW5kZXJpbmdEYXRlczogW10sXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcbiAgICBkYXRlRm9ybWF0OiAnTS9EJyxcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxuICAgIHJvd0dhcDogJzRweCcsXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAgIC8vIGF2YWlsYWJsZVRpbWVzOiBbXSwgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIGJsb2NrZWRDb2xvcjogJyNmMWYxZjInLCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgaXNDb25maXJtZWQ6IGZhbHNlLCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wc1R5cGUsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcbiAgICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIGlzbid0IGluIHRoZSBwcm9jZXNzIG9mIHNlbGVjdGluZywgYWxsb3cgcHJvcCBjaGFuZ2VzIHRvIHJlLXBvcHVsYXRlIHNlbGVjdGlvbiBzdGF0ZVxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnByb3BzLnNlbGVjdGlvbl0sXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qIFxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZXNcbiAgfVxuICAqL1xuXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gICAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuXG4gICAgcHJvcHMucmVuZGVyaW5nRGF0ZXMuZm9yRWFjaChyZW5kZXJpbmdEYXRlID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBzdGFydE9mRGF5KHJlbmRlcmluZ0RhdGUpXG5cbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDw9IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICAvLyDsi5zqsITsnbQgbWF4VGltZeydtOqzoCDssq3tgazqsIAgaG91cmx5Q2h1bmtz67O064ukIOyekeydhCDrlYzrp4wg67CY67O17ZWY7JesIG1heFRpbWXsnbQg7Y+s7ZWo65CY6rKMICjsnbTshKDtmLgg7LaU6rCAKVxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rcyAmJiAhKGggPT09IHByb3BzLm1heFRpbWUgJiYgYyA9PT0gcHJvcHMuaG91cmx5Q2h1bmtzIC0gMSk7IGMgKz0gMSkge1xuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGN1cnJlbnREYXRlLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH0pXG4gICAgcmV0dXJuIGRhdGVzXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNUeXBlKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl0sIC8vIGNvcHkgaXQgb3ZlclxuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxuICAgICAgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcyksXG4gICAgICBjbGlja2VkVGltZTogbnVsbCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICAgIGxpbmVhcjogc2VsZWN0aW9uU2NoZW1lcy5saW5lYXIsXG4gICAgICBzcXVhcmU6IHNlbGVjdGlvblNjaGVtZXMuc3F1YXJlXG4gICAgfVxuXG4gICAgdGhpcy5lbmRTZWxlY3Rpb24gPSB0aGlzLmVuZFNlbGVjdGlvbi5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50ID0gdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50LmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xuICAgIC8vIHRoZSBkYXRlIGNlbGxzIChpbiB3aGljaCBjYXNlIG5vbmUgb2YgdGhlIERhdGVDZWxsJ3Mgb25Nb3VzZVVwIGhhbmRsZXJzIHdvdWxkIGZpcmUpXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXG4gICAgLy8gdGhlIGVsZW1lbnQgd2hlcmUgdGhlIHRvdWNoL2RyYWcgc3RhcnRlZCBzbyBpdCdzIGFsd2F5cyBjYXVnaHQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXG4gIC8vIGlmIHRoZSBldmVudCBpcyBhIGB0b3VjaG1vdmVgIGV2ZW50IHNpbmNlIGl0J3MgdGhlIG9ubHkgb25lIHRoYXQgaGFzIGEgYHRvdWNoZXNgIGxpc3QuXG4gIGdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwge1xuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcbiAgICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmNlbGxUb0RhdGUuZ2V0KHRhcmdldEVsZW1lbnQpXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgZW5kU2VsZWN0aW9uKCkge1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbFxuICAgIH0pXG4gIH1cblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0LFxuICAgICAgICBzZWxlY3Rpb25FbmQsXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXNcbiAgICAgICkuZmlsdGVyKHNlbGVjdGVkVGltZSA9PiAhdGhpcy5pc1RpbWVCbG9ja2VkKHNlbGVjdGVkVGltZSkpXG4gICAgfVxuXG4gICAgbGV0IG5leHREcmFmdCA9IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0aW9uRHJhZnQ6IG5leHREcmFmdCB9LCBjYWxsYmFjaylcbiAgfVxuXG4gIGlzVGltZUJsb2NrZWQodGltZTogRGF0ZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmF2YWlsYWJsZVRpbWVzKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLnByb3BzLmF2YWlsYWJsZVRpbWVzLmZpbmQoYXZhaWxhYmxlVGltZSA9PiBhdmFpbGFibGVUaW1lLnRvSVNPU3RyaW5nKCkgPT09IHRpbWUudG9JU09TdHJpbmcoKSkgPT09XG4gICAgICAgIHVuZGVmaW5lZFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XG4gIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQoc3RhcnRUaW1lOiBEYXRlKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXJ0VGltZSBjZWxsIGlzIHNlbGVjdGVkL3Vuc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZHJhZy1zZWxlY3Qgc2hvdWxkXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXG4gICAgLy8g66m07KCRIO2Zleygleu3sOydmCDqsr3smrAg7J2066+4IOyEoO2DneuQnCDrgqDsp5wg7ISg7YOdIOu2iOqwgO2VmOuPhOuhnSAtIOydtOyEoO2YuCDstpTqsIBcbiAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIGNvbnN0IHNlbGVjdGlvblR5cGUgPSBpc0FscmVhZHlTZWxlY3RlZCA/ICdyZW1vdmUnIDogJ2FkZCdcbiAgICBpZiAodGhpcy5wcm9wcy5pc0NvbmZpcm1lZCAmJiBpc0FscmVhZHlTZWxlY3RlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogc2VsZWN0aW9uVHlwZSA/ICdyZW1vdmUnIDogJ2FkZCcsXG4gICAgICBzZWxlY3Rpb25TdGFydDogc3RhcnRUaW1lXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lOiBEYXRlKSB7XG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXBFdmVudCh0aW1lOiBEYXRlKSB7XG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBoYW5kbGVUb3VjaE1vdmVFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IHRydWUgfSlcbiAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChjZWxsVGltZSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVUb3VjaEVuZEV2ZW50KCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoRHJhZ2dpbmcpIHtcbiAgICAgIC8vIEdvaW5nIGRvd24gdGhpcyBicmFuY2ggbWVhbnMgdGhlIHVzZXIgdGFwcGVkIGJ1dCBkaWRuJ3QgZHJhZyAtLSB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhlIGF2YWlsYWJpbGl0eSBkcmFmdCBoYXNuJ3QgeWV0IGJlZW4gdXBkYXRlZCAoc2luY2VcbiAgICAgIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50IHdhcyBuZXZlciBjYWxsZWQpIHNvIHdlIG5lZWQgdG8gZG8gaXQgbm93XG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KG51bGwsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSB9KVxuICB9XG5cbiAgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgeyBjbGlja2VkVGltZSB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbih0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuICAgIGNvbnN0IGJsb2NrZWQgPSB0aGlzLmlzVGltZUJsb2NrZWQodGltZSlcbiAgICBjb25zdCBjbGlja2VkID0gY2xpY2tlZFRpbWUgIT09IG51bGwgJiYgdGhpcy5wcm9wcy5pc0NvbmZpcm1lZCAmJiBpc1NhbWVNaW51dGUodGltZSwgY2xpY2tlZFRpbWUpXG5cbiAgICBjb25zdCB1bmJsb2NrZWRDZWxsUHJvcHMgPSB7XG4gICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgb25Nb3VzZURvd246IHN0YXJ0SGFuZGxlcixcbiAgICAgIG9uTW91c2VFbnRlcjogKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgfSxcbiAgICAgIG9uTW91c2VVcDogKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgfSxcbiAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcbiAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgIG9uVG91Y2hTdGFydDogc3RhcnRIYW5kbGVyLFxuICAgICAgb25Ub3VjaE1vdmU6IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQsXG4gICAgICBvblRvdWNoRW5kOiB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnRcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdyaWRDZWxsXG4gICAgICAgIGNsYXNzTmFtZT1cInJnZHBfX2dyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cbiAgICAgICAgey4uLighYmxvY2tlZCA/IHVuYmxvY2tlZENlbGxQcm9wcyA6IHt9KX1cbiAgICAgID5cbiAgICAgICAge3RoaXMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIGJsb2NrZWQsIGNsaWNrZWQpfVxuICAgICAgPC9HcmlkQ2VsbD5cbiAgICApXG4gIH1cblxuICAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIGhhbmRsZUNlbGxDbGljayA9ICh0aW1lOiBEYXRlLCBibG9ja2VkOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKCFibG9ja2VkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY2xpY2tlZFRpbWU6IHRpbWUgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJEYXRlQ2VsbCA9ICh0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgYmxvY2tlZDogYm9vbGVhbiwgY2xpY2tlZDogYm9vbGVhbik6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsKSB7XG4gICAgICAgIHRoaXMuY2VsbFRvRGF0ZS5zZXQoZGF0ZUNlbGwsIHRpbWUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlckRhdGVDZWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgYmxvY2tlZCwgY2xpY2tlZCwgdGhpcy5oYW5kbGVDZWxsQ2xpY2ssIHJlZlNldHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERhdGVDZWxsXG4gICAgICAgICAgY2xpY2tlZD17Y2xpY2tlZH1cbiAgICAgICAgICBibG9ja2VkPXtibG9ja2VkfVxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnVuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxuICAgICAgICAgIGJsb2NrZWRDb2xvcj17dGhpcy5wcm9wcy5ibG9ja2VkQ29sb3J9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVDZWxsQ2xpY2sodGltZSwgYmxvY2tlZCl9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCB0aGlzLnByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwoZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZSwgdGhpcy5wcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJGdWxsRGF0ZUdyaWQoKTogQXJyYXk8SlNYLkVsZW1lbnQ+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IHRoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RoXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lcyAtIDE7IGogKz0gMSkge1xuICAgICAgLy8gbnVtVGltZXMgLSAx7J2EIO2Gte2VtCDrp4jsp4Drp4kg7Iuc6rCE7J2AIOyFgCDsg53shLHtlZjsp4Ag7JWK6rKMICjsnbTshKDtmLgg7LaU6rCAKVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaCh0aGlzLnN0YXRlLmRhdGVzW2ldW2pdKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHRoaXMucmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGUuZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHRoaXMucmVuZGVyVGltZUxhYmVsKHRpbWUpKVxuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcbiAgICAgIC4uLnRoaXMuc3RhdGUuZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT5cbiAgICAgICAgUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pXG4gICAgICApLFxuICAgICAgLy8gRXZlcnkgcm93IGFmdGVyIHRoYXRcbiAgICAgIC4uLmRhdGVHcmlkRWxlbWVudHMubWFwKChlbGVtZW50LCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KGVsZW1lbnQsIHsga2V5OiBgdGltZS0ke2luZGV4fWAgfSkpXG4gICAgXVxuICB9XG5cbiAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgPFdyYXBwZXI+XG4gICAgICAgIDxHcmlkXG4gICAgICAgICAgY29sdW1ucz17dGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGh9XG4gICAgICAgICAgcm93cz17dGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGh9XG4gICAgICAgICAgY29sdW1uR2FwPXt0aGlzLnByb3BzLmNvbHVtbkdhcH1cbiAgICAgICAgICByb3dHYXA9e3RoaXMucHJvcHMucm93R2FwfVxuICAgICAgICAgIHJlZj17ZWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5ncmlkUmVmID0gZWxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnVsbERhdGVHcmlkKCl9XG4gICAgICAgIDwvR3JpZD5cbiAgICAgIDwvV3JhcHBlcj5cbiAgICApXG4gIH1cbn1cbiJdfQ==