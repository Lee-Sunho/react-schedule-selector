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
        return this.props.renderDateCell(time, selected, blocked, clicked, refSetter);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsIkRhdGVDZWxsIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwiZGF0ZXMiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsInJlbmRlcmluZ0RhdGVzIiwiZm9yRWFjaCIsInJlbmRlcmluZ0RhdGUiLCJjdXJyZW50RGF5IiwiY3VycmVudERhdGUiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImNvbnN0cnVjdG9yIiwiY2VsbFRvRGF0ZSIsIk1hcCIsImdyaWRSZWYiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJ0aW1lIiwiY2xpY2tlZFRpbWUiLCJzdGFydEhhbmRsZXIiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwiQm9vbGVhbiIsImZpbmQiLCJhIiwiaXNUaW1lQmxvY2tlZCIsImNsaWNrZWQiLCJpc0NvbmZpcm1lZCIsInVuYmxvY2tlZENlbGxQcm9wcyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50Iiwib25Nb3VzZVVwIiwiaGFuZGxlTW91c2VVcEV2ZW50Iiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsIm9uVG91Y2hFbmQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwidG9JU09TdHJpbmciLCJyZW5kZXJEYXRlQ2VsbCIsImhhbmRsZUNlbGxDbGljayIsInNldFN0YXRlIiwicmVmU2V0dGVyIiwiZGF0ZUNlbGwiLCJzZXQiLCJyZW5kZXJUaW1lTGFiZWwiLCJ0aW1lRm9ybWF0IiwicmVuZGVyRGF0ZUxhYmVsIiwiZGF0ZSIsImRhdGVGb3JtYXQiLCJzZWxlY3Rpb25UeXBlIiwiaXNUb3VjaERyYWdnaW5nIiwic2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMiLCJsaW5lYXIiLCJzZWxlY3Rpb25TY2hlbWVzIiwic3F1YXJlIiwiZW5kU2VsZWN0aW9uIiwiYmluZCIsImNvbXBvbmVudERpZE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwidmFsdWUiLCJwYXNzaXZlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwiZ2V0Iiwib25DaGFuZ2UiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsImNhbGxiYWNrIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwiZmlsdGVyIiwic2VsZWN0ZWRUaW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiYiIsImF2YWlsYWJsZVRpbWVzIiwiYXZhaWxhYmxlVGltZSIsInVuZGVmaW5lZCIsInN0YXJ0VGltZSIsImlzQWxyZWFkeVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1EYXlzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJjbG9uZUVsZW1lbnQiLCJrZXkiLCJlbGVtZW50IiwicmVuZGVyIiwiZWwiLCJkZWZhdWx0UHJvcHMiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxPQUFPLEdBQUdDLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLG9FQUFiOztBQU9BLE1BQU1DLElBQUksR0FBR0YsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsbUpBRTZCRSxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsT0FGNUMsRUFHMEJELEtBQUssSUFBSUEsS0FBSyxDQUFDRSxJQUh6QyxFQUlNRixLQUFLLElBQUlBLEtBQUssQ0FBQ0csU0FKckIsRUFLR0gsS0FBSyxJQUFJQSxLQUFLLENBQUNJLE1BTGxCLENBQVY7O0FBU08sTUFBTUMsUUFBUSxHQUFHUiwwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSw2Q0FBZDs7OztBQWVQLE1BQU1RLGdCQUFnQixHQUFJTixLQUFELElBQTBCO0FBQ2pELE1BQUlBLEtBQUssQ0FBQ08sT0FBVixFQUFtQjtBQUNqQixXQUFPUCxLQUFLLENBQUNRLFlBQWI7QUFDRCxHQUZELE1BRU8sSUFBSVIsS0FBSyxDQUFDUyxRQUFWLEVBQW9CO0FBQ3pCLFdBQU9ULEtBQUssQ0FBQ1UsYUFBYjtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQU9WLEtBQUssQ0FBQ1csZUFBYjtBQUNEO0FBQ0YsQ0FSRDs7QUFVQSxNQUFNQyxRQUFRLEdBQUdmLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLDBEQUdRUSxnQkFIUixFQUtW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QUwsQ0FBV0csU0FIeEI7QUFJRSxNQUFBLE1BQU0sRUFBRSxLQUFLSCxLQUFMLENBQVdJLE1BSnJCO0FBS0UsTUFBQSxHQUFHLEVBQUV5SSxFQUFFLElBQUk7QUFDVCxhQUFLN0YsT0FBTCxHQUFlNkYsRUFBZjtBQUNEO0FBUEgsT0FTRyxLQUFLZixrQkFBTCxFQVRILENBREYsQ0FERjtBQWVEOztBQTFYaUY7OztBQUEvRHpHLGdCLENBWVp5SCxZLEdBQW1DO0FBQ3hDbEgsRUFBQUEsU0FBUyxFQUFFLEVBRDZCO0FBRXhDcUYsRUFBQUEsZUFBZSxFQUFFLFFBRnVCO0FBR3hDZSxFQUFBQSxPQUFPLEVBQUUsQ0FIK0I7QUFJeEN2RixFQUFBQSxPQUFPLEVBQUUsQ0FKK0I7QUFLeENDLEVBQUFBLE9BQU8sRUFBRSxFQUwrQjtBQU14Q1IsRUFBQUEsWUFBWSxFQUFFLENBTjBCO0FBT3hDO0FBQ0E7QUFDQUMsRUFBQUEsY0FBYyxFQUFFLEVBVHdCO0FBVXhDNEMsRUFBQUEsVUFBVSxFQUFFLElBVjRCO0FBV3hDRyxFQUFBQSxVQUFVLEVBQUUsS0FYNEI7QUFZeEMvRSxFQUFBQSxTQUFTLEVBQUUsS0FaNkI7QUFheENDLEVBQUFBLE1BQU0sRUFBRSxLQWJnQztBQWN4Q00sRUFBQUEsYUFBYSxFQUFFcUksZ0JBQU9DLElBZGtCO0FBZXhDckksRUFBQUEsZUFBZSxFQUFFb0ksZ0JBQU9FLFFBZmdCO0FBZ0J4Q3BJLEVBQUFBLFlBQVksRUFBRWtJLGdCQUFPRyxTQWhCbUI7QUFpQnhDO0FBQ0ExSSxFQUFBQSxZQUFZLEVBQUUsU0FsQjBCO0FBa0JmO0FBQ3pCbUQsRUFBQUEsV0FBVyxFQUFFLEtBbkIyQjtBQW1CcEI7QUFDcEJpRCxFQUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFO0FBcEJzQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJ1xuXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXG5pbXBvcnQgYWRkTWludXRlcyBmcm9tICdkYXRlLWZucy9hZGRfbWludXRlcydcbmltcG9ydCBhZGRIb3VycyBmcm9tICdkYXRlLWZucy9hZGRfaG91cnMnXG5pbXBvcnQgYWRkRGF5cyBmcm9tICdkYXRlLWZucy9hZGRfZGF5cydcbmltcG9ydCBzdGFydE9mRGF5IGZyb20gJ2RhdGUtZm5zL3N0YXJ0X29mX2RheSdcbmltcG9ydCBpc1NhbWVNaW51dGUgZnJvbSAnZGF0ZS1mbnMvaXNfc2FtZV9taW51dGUnXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5cbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuYFxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjx7IGNvbHVtbnM6IG51bWJlcjsgcm93czogbnVtYmVyOyBjb2x1bW5HYXA6IHN0cmluZzsgcm93R2FwOiBzdHJpbmcgfT5gXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5zfSwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLnJvd3N9LCAxZnIpO1xuICBjb2x1bW4tZ2FwOiAke3Byb3BzID0+IHByb3BzLmNvbHVtbkdhcH07XG4gIHJvdy1nYXA6ICR7cHJvcHMgPT4gcHJvcHMucm93R2FwfTtcbiAgd2lkdGg6IDEwMCU7XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gIHRvdWNoLWFjdGlvbjogbm9uZTtcbmBcblxudHlwZSBEYXRlQ2VsbFByb3BzID0ge1xuICBjbGlja2VkOiBib29sZWFuXG4gIGJsb2NrZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGJsb2NrZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG59XG5cbmNvbnN0IGdldERhdGVDZWxsQ29sb3IgPSAocHJvcHM6IERhdGVDZWxsUHJvcHMpID0+IHtcbiAgaWYgKHByb3BzLmJsb2NrZWQpIHtcbiAgICByZXR1cm4gcHJvcHMuYmxvY2tlZENvbG9yXG4gIH0gZWxzZSBpZiAocHJvcHMuc2VsZWN0ZWQpIHtcbiAgICByZXR1cm4gcHJvcHMuc2VsZWN0ZWRDb2xvclxuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9wcy51bnNlbGVjdGVkQ29sb3JcbiAgfVxufVxuXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8RGF0ZUNlbGxQcm9wcz5gXG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDI1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7Z2V0RGF0ZUNlbGxDb2xvcn07XG5cbiAgJHtwcm9wcyA9PlxuICAgICFwcm9wcy5ibG9ja2VkXG4gICAgICA/IGBcbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuaG92ZXJlZENvbG9yfTtcbiAgICB9XG4gIGBcbiAgICAgIDogJyd9XG5gXG5cbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgfVxuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbmBcblxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgfVxuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tcmlnaHQ6IDRweDtcbmBcblxudHlwZSBQcm9wc1R5cGUgPSB7XG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cbiAgc2VsZWN0aW9uU2NoZW1lOiBTZWxlY3Rpb25TY2hlbWVUeXBlXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxuICAvL3N0YXJ0RGF0ZTogRGF0ZVxuICByZW5kZXJpbmdEYXRlczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgbnVtRGF5czogbnVtYmVyXG4gIG1pblRpbWU6IG51bWJlclxuICBtYXhUaW1lOiBudW1iZXJcbiAgaG91cmx5Q2h1bmtzOiBudW1iZXJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXG4gIHRpbWVGb3JtYXQ6IHN0cmluZ1xuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbiAgYXZhaWxhYmxlVGltZXM6IERhdGVbXSAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIGJsb2NrZWRDb2xvcjogc3RyaW5nIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgaXNDb25maXJtZWQ6IGJvb2xlYW4gLy8g7J207ISg7Zi4IOy2lOqwgFxuICByZW5kZXJEYXRlQ2VsbD86IChcbiAgICBkYXRldGltZTogRGF0ZSxcbiAgICBzZWxlY3RlZDogYm9vbGVhbixcbiAgICBibG9ja2VkOiBib29sZWFuLFxuICAgIGNsaWNrZWQ6IGJvb2xlYW4sXG4gICAgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZFxuICApID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlclRpbWVMYWJlbD86ICh0aW1lOiBEYXRlKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJEYXRlTGFiZWw/OiAoZGF0ZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbn1cblxudHlwZSBTdGF0ZVR5cGUgPSB7XG4gIC8vIEluIHRoZSBjYXNlIHRoYXQgYSB1c2VyIGlzIGRyYWctc2VsZWN0aW5nLCB3ZSBkb24ndCB3YW50IHRvIGNhbGwgdGhpcy5wcm9wcy5vbkNoYW5nZSgpIHVudGlsIHRoZXkgaGF2ZSBjb21wbGV0ZWRcbiAgLy8gdGhlIGRyYWctc2VsZWN0LiBzZWxlY3Rpb25EcmFmdCBzZXJ2ZXMgYXMgYSB0ZW1wb3JhcnkgY29weSBkdXJpbmcgZHJhZy1zZWxlY3RzLlxuICBzZWxlY3Rpb25EcmFmdDogQXJyYXk8RGF0ZT5cbiAgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSB8IG51bGxcbiAgc2VsZWN0aW9uU3RhcnQ6IERhdGUgfCBudWxsXG4gIGlzVG91Y2hEcmFnZ2luZzogYm9vbGVhblxuICBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+XG4gIGNsaWNrZWRUaW1lOiBEYXRlIHwgbnVsbCAvLyDsnbTshKDtmLgg7LaU6rCAXG59XG5cbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVkdWxlU2VsZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHNUeXBlLCBTdGF0ZVR5cGU+IHtcbiAgc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnM6IHsgW2tleTogc3RyaW5nXTogKHN0YXJ0RGF0ZTogRGF0ZSwgZW5kRGF0ZTogRGF0ZSwgZm9vOiBBcnJheTxBcnJheTxEYXRlPj4pID0+IERhdGVbXSB9XG4gIGNlbGxUb0RhdGU6IE1hcDxFbGVtZW50LCBEYXRlPiA9IG5ldyBNYXAoKVxuICAvLyBkb2N1bWVudE1vdXNlVXBIYW5kbGVyOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cbiAgLy8gZW5kU2VsZWN0aW9uOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cbiAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQ6IChldmVudDogUmVhY3QuU3ludGhldGljVG91Y2hFdmVudDwqPikgPT4gdm9pZFxuICAvLyBoYW5kbGVUb3VjaEVuZEV2ZW50OiAoKSA9PiB2b2lkXG4gIC8vIGhhbmRsZU1vdXNlVXBFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgLy8gaGFuZGxlTW91c2VFbnRlckV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICAvLyBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICBncmlkUmVmOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsXG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wczogUGFydGlhbDxQcm9wc1R5cGU+ID0ge1xuICAgIHNlbGVjdGlvbjogW10sXG4gICAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcbiAgICBudW1EYXlzOiA3LFxuICAgIG1pblRpbWU6IDksXG4gICAgbWF4VGltZTogMjMsXG4gICAgaG91cmx5Q2h1bmtzOiAxLFxuICAgIC8vIHN0YXJ0RGF0ZTogbmV3IERhdGUoKSxcbiAgICAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgcmVuZGVyaW5nRGF0ZXM6IFtdLFxuICAgIHRpbWVGb3JtYXQ6ICdoYScsXG4gICAgZGF0ZUZvcm1hdDogJ00vRCcsXG4gICAgY29sdW1uR2FwOiAnNHB4JyxcbiAgICByb3dHYXA6ICc0cHgnLFxuICAgIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxuICAgIHVuc2VsZWN0ZWRDb2xvcjogY29sb3JzLnBhbGVCbHVlLFxuICAgIGhvdmVyZWRDb2xvcjogY29sb3JzLmxpZ2h0Qmx1ZSxcbiAgICAvLyBhdmFpbGFibGVUaW1lczogW10sIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgICBibG9ja2VkQ29sb3I6ICcjZjFmMWYyJywgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIGlzQ29uZmlybWVkOiBmYWxzZSwgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIG9uQ2hhbmdlOiAoKSA9PiB7fVxuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wczogUHJvcHNUeXBlLCBzdGF0ZTogU3RhdGVUeXBlKTogUGFydGlhbDxTdGF0ZVR5cGU+IHwgbnVsbCB7XG4gICAgLy8gQXMgbG9uZyBhcyB0aGUgdXNlciBpc24ndCBpbiB0aGUgcHJvY2VzcyBvZiBzZWxlY3RpbmcsIGFsbG93IHByb3AgY2hhbmdlcyB0byByZS1wb3B1bGF0ZSBzZWxlY3Rpb24gc3RhdGVcbiAgICBpZiAoc3RhdGUuc2VsZWN0aW9uU3RhcnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi5wcm9wcy5zZWxlY3Rpb25dLFxuICAgICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKiBcbiAgc3RhdGljIGNvbXB1dGVEYXRlc01hdHJpeChwcm9wczogUHJvcHNUeXBlKTogQXJyYXk8QXJyYXk8RGF0ZT4+IHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cbiAgICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPCBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGVzXG4gIH1cbiAgKi9cblxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xuICAgIC8vIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcblxuICAgIHByb3BzLnJlbmRlcmluZ0RhdGVzLmZvckVhY2gocmVuZGVyaW5nRGF0ZSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cbiAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc3RhcnRPZkRheShyZW5kZXJpbmdEYXRlKVxuXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8PSBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgICAgLy8g7Iuc6rCE7J20IG1heFRpbWXsnbTqs6Ag7LKt7YGs6rCAIGhvdXJseUNodW5rc+uztOuLpCDsnpHsnYQg65WM66eMIOuwmOuzte2VmOyXrCBtYXhUaW1l7J20IO2PrO2VqOuQmOqyjCAo7J207ISg7Zi4IOy2lOqwgClcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3MgJiYgIShoID09PSBwcm9wcy5tYXhUaW1lICYmIGMgPT09IHByb3BzLmhvdXJseUNodW5rcyAtIDEpOyBjICs9IDEpIHtcbiAgICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhjdXJyZW50RGF0ZSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgICB9KVxuICAgIHJldHVybiBkYXRlc1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzVHlwZSkge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dLCAvLyBjb3B5IGl0IG92ZXJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbCxcbiAgICAgIGlzVG91Y2hEcmFnZ2luZzogZmFsc2UsXG4gICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpLFxuICAgICAgY2xpY2tlZFRpbWU6IG51bGwgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZVxuICAgIH1cblxuICAgIHRoaXMuZW5kU2VsZWN0aW9uID0gdGhpcy5lbmRTZWxlY3Rpb24uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudC5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgZW5kU2VsZWN0aW9uIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCBpdHNlbGYgaW4gb3JkZXJcbiAgICAvLyB0byBjYXRjaCB0aGUgY2FzZXMgd2hlcmUgdGhlIHVzZXJzIGVuZHMgdGhlaXIgbW91c2UtY2xpY2sgc29tZXdoZXJlIGJlc2lkZXNcbiAgICAvLyB0aGUgZGF0ZSBjZWxscyAoaW4gd2hpY2ggY2FzZSBub25lIG9mIHRoZSBEYXRlQ2VsbCdzIG9uTW91c2VVcCBoYW5kbGVycyB3b3VsZCBmaXJlKVxuICAgIC8vXG4gICAgLy8gVGhpcyBpc24ndCBuZWNlc3NhcnkgZm9yIHRvdWNoIGV2ZW50cyBzaW5jZSB0aGUgYHRvdWNoZW5kYCBldmVudCBmaXJlcyBvblxuICAgIC8vIHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaC9kcmFnIHN0YXJ0ZWQgc28gaXQncyBhbHdheXMgY2F1Z2h0LlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcblxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIFBlcmZvcm1zIGEgbG9va3VwIGludG8gdGhpcy5jZWxsVG9EYXRlIHRvIHJldHJpZXZlIHRoZSBEYXRlIHRoYXQgY29ycmVzcG9uZHMgdG9cbiAgLy8gdGhlIGNlbGwgd2hlcmUgdGhpcyB0b3VjaCBldmVudCBpcyByaWdodCBub3cuIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIG9ubHkgd29ya1xuICAvLyBpZiB0aGUgZXZlbnQgaXMgYSBgdG91Y2htb3ZlYCBldmVudCBzaW5jZSBpdCdzIHRoZSBvbmx5IG9uZSB0aGF0IGhhcyBhIGB0b3VjaGVzYCBsaXN0LlxuICBnZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQ8YW55Pik6IERhdGUgfCBudWxsIHtcbiAgICBjb25zdCB7IHRvdWNoZXMgfSA9IGV2ZW50XG4gICAgaWYgKCF0b3VjaGVzIHx8IHRvdWNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IHsgY2xpZW50WCwgY2xpZW50WSB9ID0gdG91Y2hlc1swXVxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5jZWxsVG9EYXRlLmdldCh0YXJnZXRFbGVtZW50KVxuICAgICAgcmV0dXJuIGNlbGxUaW1lID8/IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGVuZFNlbGVjdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGxcbiAgICB9KVxuICB9XG5cbiAgLy8gR2l2ZW4gYW4gZW5kaW5nIERhdGUsIGRldGVybWluZXMgYWxsIHRoZSBkYXRlcyB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBpbiB0aGlzIGRyYWZ0XG4gIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHNlbGVjdGlvbkVuZDogRGF0ZSB8IG51bGwsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xuICAgIGNvbnN0IHsgc2VsZWN0aW9uVHlwZSwgc2VsZWN0aW9uU3RhcnQgfSA9IHRoaXMuc3RhdGVcblxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSBudWxsIHx8IHNlbGVjdGlvblN0YXJ0ID09PSBudWxsKSByZXR1cm5cblxuICAgIGxldCBuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+ID0gW11cbiAgICBpZiAoc2VsZWN0aW9uU3RhcnQgJiYgc2VsZWN0aW9uRW5kICYmIHNlbGVjdGlvblR5cGUpIHtcbiAgICAgIG5ld1NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbdGhpcy5wcm9wcy5zZWxlY3Rpb25TY2hlbWVdKFxuICAgICAgICBzZWxlY3Rpb25TdGFydCxcbiAgICAgICAgc2VsZWN0aW9uRW5kLFxuICAgICAgICB0aGlzLnN0YXRlLmRhdGVzXG4gICAgICApLmZpbHRlcihzZWxlY3RlZFRpbWUgPT4gIXRoaXMuaXNUaW1lQmxvY2tlZChzZWxlY3RlZFRpbWUpKVxuICAgIH1cblxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdhZGQnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLm5leHREcmFmdCwgLi4ubmV3U2VsZWN0aW9uXSkpXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xuICAgICAgbmV4dERyYWZ0ID0gbmV4dERyYWZ0LmZpbHRlcihhID0+ICFuZXdTZWxlY3Rpb24uZmluZChiID0+IGlzU2FtZU1pbnV0ZShhLCBiKSkpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGlvbkRyYWZ0OiBuZXh0RHJhZnQgfSwgY2FsbGJhY2spXG4gIH1cblxuICBpc1RpbWVCbG9ja2VkKHRpbWU6IERhdGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hdmFpbGFibGVUaW1lcykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5wcm9wcy5hdmFpbGFibGVUaW1lcy5maW5kKGF2YWlsYWJsZVRpbWUgPT4gYXZhaWxhYmxlVGltZS50b0lTT1N0cmluZygpID09PSB0aW1lLnRvSVNPU3RyaW5nKCkpID09PVxuICAgICAgICB1bmRlZmluZWRcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxuICBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHN0YXJ0VGltZTogRGF0ZSkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xuICAgIC8vIOuptOygkSDtmZXsoJXrt7DsnZgg6rK97JqwIOydtOuvuCDshKDtg53rkJwg64Kg7KecIOyEoO2DnSDrtojqsIDtlZjrj4TroZ0gLSDsnbTshKDtmLgg7LaU6rCAXG4gICAgY29uc3QgaXNBbHJlYWR5U2VsZWN0ZWQgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgc3RhcnRUaW1lKSlcbiAgICBjb25zdCBzZWxlY3Rpb25UeXBlID0gaXNBbHJlYWR5U2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnXG4gICAgaWYgKHRoaXMucHJvcHMuaXNDb25maXJtZWQgJiYgaXNBbHJlYWR5U2VsZWN0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGlvblR5cGU6IHNlbGVjdGlvblR5cGUgPyAncmVtb3ZlJyA6ICdhZGQnLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZTogRGF0ZSkge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gIH1cblxuICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZTogRGF0ZSkge1xuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxuICB9XG5cbiAgaGFuZGxlVG91Y2hNb3ZlRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiB0cnVlIH0pXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcbiAgICBpZiAoY2VsbFRpbWUpIHtcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICAvLyBHb2luZyBkb3duIHRoaXMgYnJhbmNoIG1lYW5zIHRoZSB1c2VyIHRhcHBlZCBidXQgZGlkbid0IGRyYWcgLS0gd2hpY2hcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXG4gICAgICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudCB3YXMgbmV2ZXIgY2FsbGVkKSBzbyB3ZSBuZWVkIHRvIGRvIGl0IG5vd1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChudWxsLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogZmFsc2UgfSlcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHsgY2xpY2tlZFRpbWUgfSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCBzdGFydEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4odGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcbiAgICBjb25zdCBibG9ja2VkID0gdGhpcy5pc1RpbWVCbG9ja2VkKHRpbWUpXG4gICAgY29uc3QgY2xpY2tlZCA9IGNsaWNrZWRUaW1lICE9PSBudWxsICYmIHRoaXMucHJvcHMuaXNDb25maXJtZWQgJiYgaXNTYW1lTWludXRlKHRpbWUsIGNsaWNrZWRUaW1lKVxuXG4gICAgY29uc3QgdW5ibG9ja2VkQ2VsbFByb3BzID0ge1xuICAgICAgLy8gTW91c2UgaGFuZGxlcnNcbiAgICAgIG9uTW91c2VEb3duOiBzdGFydEhhbmRsZXIsXG4gICAgICBvbk1vdXNlRW50ZXI6ICgpID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZSlcbiAgICAgIH0sXG4gICAgICBvbk1vdXNlVXA6ICgpID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQodGltZSlcbiAgICAgIH0sXG4gICAgICAvLyBUb3VjaCBoYW5kbGVyc1xuICAgICAgLy8gU2luY2UgdG91Y2ggZXZlbnRzIGZpcmUgb24gdGhlIGV2ZW50IHdoZXJlIHRoZSB0b3VjaC1kcmFnIHN0YXJ0ZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gcGFzc2luZ1xuICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAvLyBwYXJhbWV0ZXJzXG4gICAgICBvblRvdWNoU3RhcnQ6IHN0YXJ0SGFuZGxlcixcbiAgICAgIG9uVG91Y2hNb3ZlOiB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50LFxuICAgICAgb25Ub3VjaEVuZDogdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkQ2VsbFxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XG4gICAgICAgIHsuLi4oIWJsb2NrZWQgPyB1bmJsb2NrZWRDZWxsUHJvcHMgOiB7fSl9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCBibG9ja2VkLCBjbGlja2VkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgLy8g7J207ISg7Zi4IOy2lOqwgFxuICBoYW5kbGVDZWxsQ2xpY2sgPSAodGltZTogRGF0ZSwgYmxvY2tlZDogYm9vbGVhbikgPT4ge1xuICAgIGlmICghYmxvY2tlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNsaWNrZWRUaW1lOiB0aW1lIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4sIGJsb2NrZWQ6IGJvb2xlYW4sIGNsaWNrZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICB0aGlzLmNlbGxUb0RhdGUuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIGJsb2NrZWQsIGNsaWNrZWQsIHJlZlNldHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERhdGVDZWxsXG4gICAgICAgICAgY2xpY2tlZD17Y2xpY2tlZH1cbiAgICAgICAgICBibG9ja2VkPXtibG9ja2VkfVxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnVuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxuICAgICAgICAgIGJsb2NrZWRDb2xvcj17dGhpcy5wcm9wcy5ibG9ja2VkQ29sb3J9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVDZWxsQ2xpY2sodGltZSwgYmxvY2tlZCl9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCB0aGlzLnByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwoZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZSwgdGhpcy5wcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJGdWxsRGF0ZUdyaWQoKTogQXJyYXk8SlNYLkVsZW1lbnQ+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IHRoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RoXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lcyAtIDE7IGogKz0gMSkge1xuICAgICAgLy8gbnVtVGltZXMgLSAx7J2EIO2Gte2VtCDrp4jsp4Drp4kg7Iuc6rCE7J2AIOyFgCDsg53shLHtlZjsp4Ag7JWK6rKMICjsnbTshKDtmLgg7LaU6rCAKVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaCh0aGlzLnN0YXRlLmRhdGVzW2ldW2pdKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHRoaXMucmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGUuZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHRoaXMucmVuZGVyVGltZUxhYmVsKHRpbWUpKVxuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcbiAgICAgIC4uLnRoaXMuc3RhdGUuZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT5cbiAgICAgICAgUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pXG4gICAgICApLFxuICAgICAgLy8gRXZlcnkgcm93IGFmdGVyIHRoYXRcbiAgICAgIC4uLmRhdGVHcmlkRWxlbWVudHMubWFwKChlbGVtZW50LCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KGVsZW1lbnQsIHsga2V5OiBgdGltZS0ke2luZGV4fWAgfSkpXG4gICAgXVxuICB9XG5cbiAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgPFdyYXBwZXI+XG4gICAgICAgIDxHcmlkXG4gICAgICAgICAgY29sdW1ucz17dGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGh9XG4gICAgICAgICAgcm93cz17dGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGh9XG4gICAgICAgICAgY29sdW1uR2FwPXt0aGlzLnByb3BzLmNvbHVtbkdhcH1cbiAgICAgICAgICByb3dHYXA9e3RoaXMucHJvcHMucm93R2FwfVxuICAgICAgICAgIHJlZj17ZWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5ncmlkUmVmID0gZWxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnVsbERhdGVHcmlkKCl9XG4gICAgICAgIDwvR3JpZD5cbiAgICAgIDwvV3JhcHBlcj5cbiAgICApXG4gIH1cbn1cbiJdfQ==