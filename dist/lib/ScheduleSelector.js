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
  } else if (props.clicked) {
    return '#000000';
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
      const clicked = this.props.clickedTime !== null && this.props.isConfirmed && (0, _is_same_minute.default)(time, this.props.clickedTime);
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
  clickedTime: null,
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsImNsaWNrZWQiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ29sb3IiLCJ1bnNlbGVjdGVkQ29sb3IiLCJEYXRlQ2VsbCIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4IiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJyZW5kZXJpbmdEYXRlcyIsImZvckVhY2giLCJyZW5kZXJpbmdEYXRlIiwiY3VycmVudERheSIsImN1cnJlbnREYXRlIiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJjb25zdHJ1Y3RvciIsImNlbGxUb0RhdGUiLCJNYXAiLCJncmlkUmVmIiwicmVuZGVyRGF0ZUNlbGxXcmFwcGVyIiwidGltZSIsInN0YXJ0SGFuZGxlciIsImhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQiLCJCb29sZWFuIiwiZmluZCIsImEiLCJpc1RpbWVCbG9ja2VkIiwiY2xpY2tlZFRpbWUiLCJpc0NvbmZpcm1lZCIsInVuYmxvY2tlZENlbGxQcm9wcyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50Iiwib25Nb3VzZVVwIiwiaGFuZGxlTW91c2VVcEV2ZW50Iiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsIm9uVG91Y2hFbmQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwidG9JU09TdHJpbmciLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwic2V0IiwicmVuZGVyVGltZUxhYmVsIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0Iiwic2VsZWN0aW9uVHlwZSIsImlzVG91Y2hEcmFnZ2luZyIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImVuZFNlbGVjdGlvbiIsImJpbmQiLCJjb21wb25lbnREaWRNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInZhbHVlIiwicGFzc2l2ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFRpbWVGcm9tVG91Y2hFdmVudCIsImV2ZW50IiwidG91Y2hlcyIsImxlbmd0aCIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjZWxsVGltZSIsImdldCIsIm9uQ2hhbmdlIiwic2V0U3RhdGUiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsImNhbGxiYWNrIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwiZmlsdGVyIiwic2VsZWN0ZWRUaW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiYiIsImF2YWlsYWJsZVRpbWVzIiwiYXZhaWxhYmxlVGltZSIsInVuZGVmaW5lZCIsInN0YXJ0VGltZSIsImlzQWxyZWFkeVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1EYXlzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJjbG9uZUVsZW1lbnQiLCJrZXkiLCJlbGVtZW50IiwicmVuZGVyIiwiZWwiLCJkZWZhdWx0UHJvcHMiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxPQUFPLEdBQUdDLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLG9FQUFiOztBQU9BLE1BQU1DLElBQUksR0FBR0YsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsbUpBRTZCRSxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsT0FGNUMsRUFHMEJELEtBQUssSUFBSUEsS0FBSyxDQUFDRSxJQUh6QyxFQUlNRixLQUFLLElBQUlBLEtBQUssQ0FBQ0csU0FKckIsRUFLR0gsS0FBSyxJQUFJQSxLQUFLLENBQUNJLE1BTGxCLENBQVY7O0FBU08sTUFBTUMsUUFBUSxHQUFHUiwwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSw2Q0FBZDs7OztBQWVQLE1BQU1RLGdCQUFnQixHQUFJTixLQUFELElBQTBCO0FBQ2pELE1BQUlBLEtBQUssQ0FBQ08sT0FBVixFQUFtQjtBQUNqQixXQUFPUCxLQUFLLENBQUNRLFlBQWI7QUFDRCxHQUZELE1BRU8sSUFBSVIsS0FBSyxDQUFDUyxPQUFWLEVBQW1CO0FBQ3hCLFdBQU8sU0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJVCxLQUFLLENBQUNVLFFBQVYsRUFBb0I7QUFDekIsV0FBT1YsS0FBSyxDQUFDVyxhQUFiO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsV0FBT1gsS0FBSyxDQUFDWSxlQUFiO0FBQ0Q7QUFDRixDQVZEOztBQVlBLE1BQU1DLFFBQVEsR0FBR2hCLDBC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RixFQUFBQSxlQUFlLEVBQUUsUUFGdUI7QUFHeENlLEVBQUFBLE9BQU8sRUFBRSxDQUgrQjtBQUl4Q3JGLEVBQUFBLE9BQU8sRUFBRSxDQUorQjtBQUt4Q0MsRUFBQUEsT0FBTyxFQUFFLEVBTCtCO0FBTXhDUixFQUFBQSxZQUFZLEVBQUUsQ0FOMEI7QUFPeEM7QUFDQTtBQUNBQyxFQUFBQSxjQUFjLEVBQUUsRUFUd0I7QUFVeEN5QyxFQUFBQSxVQUFVLEVBQUUsSUFWNEI7QUFXeENHLEVBQUFBLFVBQVUsRUFBRSxLQVg0QjtBQVl4QzdFLEVBQUFBLFNBQVMsRUFBRSxLQVo2QjtBQWF4Q0MsRUFBQUEsTUFBTSxFQUFFLEtBYmdDO0FBY3hDTyxFQUFBQSxhQUFhLEVBQUVtSSxnQkFBT0MsSUFka0I7QUFleENuSSxFQUFBQSxlQUFlLEVBQUVrSSxnQkFBT0UsUUFmZ0I7QUFnQnhDbEksRUFBQUEsWUFBWSxFQUFFZ0ksZ0JBQU9HLFNBaEJtQjtBQWlCeEM7QUFDQXpJLEVBQUFBLFlBQVksRUFBRSxTQWxCMEI7QUFrQmY7QUFDekJtRCxFQUFBQSxXQUFXLEVBQUUsS0FuQjJCO0FBbUJwQjtBQUNwQkQsRUFBQUEsV0FBVyxFQUFFLElBcEIyQjtBQXFCeENnRCxFQUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFO0FBckJzQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJ1xuXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXG5pbXBvcnQgYWRkTWludXRlcyBmcm9tICdkYXRlLWZucy9hZGRfbWludXRlcydcbmltcG9ydCBhZGRIb3VycyBmcm9tICdkYXRlLWZucy9hZGRfaG91cnMnXG5pbXBvcnQgYWRkRGF5cyBmcm9tICdkYXRlLWZucy9hZGRfZGF5cydcbmltcG9ydCBzdGFydE9mRGF5IGZyb20gJ2RhdGUtZm5zL3N0YXJ0X29mX2RheSdcbmltcG9ydCBpc1NhbWVNaW51dGUgZnJvbSAnZGF0ZS1mbnMvaXNfc2FtZV9taW51dGUnXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5cbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuYFxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjx7IGNvbHVtbnM6IG51bWJlcjsgcm93czogbnVtYmVyOyBjb2x1bW5HYXA6IHN0cmluZzsgcm93R2FwOiBzdHJpbmcgfT5gXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5zfSwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLnJvd3N9LCAxZnIpO1xuICBjb2x1bW4tZ2FwOiAke3Byb3BzID0+IHByb3BzLmNvbHVtbkdhcH07XG4gIHJvdy1nYXA6ICR7cHJvcHMgPT4gcHJvcHMucm93R2FwfTtcbiAgd2lkdGg6IDEwMCU7XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gIHRvdWNoLWFjdGlvbjogbm9uZTtcbmBcblxudHlwZSBEYXRlQ2VsbFByb3BzID0ge1xuICBjbGlja2VkOiBib29sZWFuXG4gIGJsb2NrZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGJsb2NrZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG59XG5cbmNvbnN0IGdldERhdGVDZWxsQ29sb3IgPSAocHJvcHM6IERhdGVDZWxsUHJvcHMpID0+IHtcbiAgaWYgKHByb3BzLmJsb2NrZWQpIHtcbiAgICByZXR1cm4gcHJvcHMuYmxvY2tlZENvbG9yXG4gIH0gZWxzZSBpZiAocHJvcHMuY2xpY2tlZCkge1xuICAgIHJldHVybiAnIzAwMDAwMCdcbiAgfSBlbHNlIGlmIChwcm9wcy5zZWxlY3RlZCkge1xuICAgIHJldHVybiBwcm9wcy5zZWxlY3RlZENvbG9yXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb3BzLnVuc2VsZWN0ZWRDb2xvclxuICB9XG59XG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjxEYXRlQ2VsbFByb3BzPmBcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMjVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtnZXREYXRlQ2VsbENvbG9yfTtcblxuICAke3Byb3BzID0+XG4gICAgIXByb3BzLmJsb2NrZWRcbiAgICAgID8gYFxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYFxuICAgICAgOiAnJ31cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIG1hcmdpbjogMDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xuYFxuXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xuYFxuXG50eXBlIFByb3BzVHlwZSA9IHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIC8vc3RhcnREYXRlOiBEYXRlXG4gIHJlbmRlcmluZ0RhdGVzOiBEYXRlW10gLy8g7J207ISg7Zi4IOy2lOqwgFxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcDogc3RyaW5nXG4gIHJvd0dhcDogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xuICBhdmFpbGFibGVUaW1lczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmcgLy8g7J207ISg7Zi4IOy2lOqwgFxuICBpc0NvbmZpcm1lZDogYm9vbGVhbiAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIGNsaWNrZWRUaW1lOiBEYXRlIHwgbnVsbCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIHJlbmRlckRhdGVDZWxsPzogKFxuICAgIGRhdGV0aW1lOiBEYXRlLFxuICAgIHNlbGVjdGVkOiBib29sZWFuLFxuICAgIGJsb2NrZWQ6IGJvb2xlYW4sXG4gICAgY2xpY2tlZDogYm9vbGVhbixcbiAgICAvLyBvbkNsaWNrOiAodGltZTogRGF0ZSwgYmxvY2tlZDogYm9vbGVhbikgPT4gdm9pZCxcbiAgICByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkXG4gICkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG50eXBlIFN0YXRlVHlwZSA9IHtcbiAgLy8gSW4gdGhlIGNhc2UgdGhhdCBhIHVzZXIgaXMgZHJhZy1zZWxlY3RpbmcsIHdlIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzLnByb3BzLm9uQ2hhbmdlKCkgdW50aWwgdGhleSBoYXZlIGNvbXBsZXRlZFxuICAvLyB0aGUgZHJhZy1zZWxlY3QuIHNlbGVjdGlvbkRyYWZ0IHNlcnZlcyBhcyBhIHRlbXBvcmFyeSBjb3B5IGR1cmluZyBkcmFnLXNlbGVjdHMuXG4gIHNlbGVjdGlvbkRyYWZ0OiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlIHwgbnVsbFxuICBzZWxlY3Rpb25TdGFydDogRGF0ZSB8IG51bGxcbiAgaXNUb3VjaERyYWdnaW5nOiBib29sZWFuXG4gIGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj5cbiAgLy8gY2xpY2tlZFRpbWU6IERhdGUgfCBudWxsIC8vIOydtOyEoO2YuCDstpTqsIBcbn1cblxuZXhwb3J0IGNvbnN0IHByZXZlbnRTY3JvbGwgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wc1R5cGUsIFN0YXRlVHlwZT4ge1xuICBzZWxlY3Rpb25TY2hlbWVIYW5kbGVyczogeyBba2V5OiBzdHJpbmddOiAoc3RhcnREYXRlOiBEYXRlLCBlbmREYXRlOiBEYXRlLCBmb286IEFycmF5PEFycmF5PERhdGU+PikgPT4gRGF0ZVtdIH1cbiAgY2VsbFRvRGF0ZTogTWFwPEVsZW1lbnQsIERhdGU+ID0gbmV3IE1hcCgpXG4gIC8vIGRvY3VtZW50TW91c2VVcEhhbmRsZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxuICAvLyBlbmRTZWxlY3Rpb246ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxuICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudDogKGV2ZW50OiBSZWFjdC5TeW50aGV0aWNUb3VjaEV2ZW50PCo+KSA9PiB2b2lkXG4gIC8vIGhhbmRsZVRvdWNoRW5kRXZlbnQ6ICgpID0+IHZvaWRcbiAgLy8gaGFuZGxlTW91c2VVcEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZUVudGVyRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIGdyaWRSZWY6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7XG4gICAgc2VsZWN0aW9uOiBbXSxcbiAgICBzZWxlY3Rpb25TY2hlbWU6ICdzcXVhcmUnLFxuICAgIG51bURheXM6IDcsXG4gICAgbWluVGltZTogOSxcbiAgICBtYXhUaW1lOiAyMyxcbiAgICBob3VybHlDaHVua3M6IDEsXG4gICAgLy8gc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICAgIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgICByZW5kZXJpbmdEYXRlczogW10sXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcbiAgICBkYXRlRm9ybWF0OiAnTS9EJyxcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxuICAgIHJvd0dhcDogJzRweCcsXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAgIC8vIGF2YWlsYWJsZVRpbWVzOiBbXSwgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIGJsb2NrZWRDb2xvcjogJyNmMWYxZjInLCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgaXNDb25maXJtZWQ6IGZhbHNlLCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgY2xpY2tlZFRpbWU6IG51bGwsXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wc1R5cGUsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcbiAgICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIGlzbid0IGluIHRoZSBwcm9jZXNzIG9mIHNlbGVjdGluZywgYWxsb3cgcHJvcCBjaGFuZ2VzIHRvIHJlLXBvcHVsYXRlIHNlbGVjdGlvbiBzdGF0ZVxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnByb3BzLnNlbGVjdGlvbl0sXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qIFxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZXNcbiAgfVxuICAqL1xuXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gICAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuXG4gICAgcHJvcHMucmVuZGVyaW5nRGF0ZXMuZm9yRWFjaChyZW5kZXJpbmdEYXRlID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBzdGFydE9mRGF5KHJlbmRlcmluZ0RhdGUpXG5cbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDw9IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICAvLyDsi5zqsITsnbQgbWF4VGltZeydtOqzoCDssq3tgazqsIAgaG91cmx5Q2h1bmtz67O064ukIOyekeydhCDrlYzrp4wg67CY67O17ZWY7JesIG1heFRpbWXsnbQg7Y+s7ZWo65CY6rKMICjsnbTshKDtmLgg7LaU6rCAKVxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rcyAmJiAhKGggPT09IHByb3BzLm1heFRpbWUgJiYgYyA9PT0gcHJvcHMuaG91cmx5Q2h1bmtzIC0gMSk7IGMgKz0gMSkge1xuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGN1cnJlbnREYXRlLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH0pXG4gICAgcmV0dXJuIGRhdGVzXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNUeXBlKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl0sIC8vIGNvcHkgaXQgb3ZlclxuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxuICAgICAgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzID0ge1xuICAgICAgbGluZWFyOiBzZWxlY3Rpb25TY2hlbWVzLmxpbmVhcixcbiAgICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgICB9XG5cbiAgICB0aGlzLmVuZFNlbGVjdGlvbiA9IHRoaXMuZW5kU2VsZWN0aW9uLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG5cbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuY2VsbFRvRGF0ZS5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBlbmRTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsXG4gICAgfSlcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsLCBjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcbiAgICBjb25zdCB7IHNlbGVjdGlvblR5cGUsIHNlbGVjdGlvblN0YXJ0IH0gPSB0aGlzLnN0YXRlXG5cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gbnVsbCB8fCBzZWxlY3Rpb25TdGFydCA9PT0gbnVsbCkgcmV0dXJuXG5cbiAgICBsZXQgbmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPiA9IFtdXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0ICYmIHNlbGVjdGlvbkVuZCAmJiBzZWxlY3Rpb25UeXBlKSB7XG4gICAgICBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzW3RoaXMucHJvcHMuc2VsZWN0aW9uU2NoZW1lXShcbiAgICAgICAgc2VsZWN0aW9uU3RhcnQsXG4gICAgICAgIHNlbGVjdGlvbkVuZCxcbiAgICAgICAgdGhpcy5zdGF0ZS5kYXRlc1xuICAgICAgKS5maWx0ZXIoc2VsZWN0ZWRUaW1lID0+ICF0aGlzLmlzVGltZUJsb2NrZWQoc2VsZWN0ZWRUaW1lKSlcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXVxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3Rpb25EcmFmdDogbmV4dERyYWZ0IH0sIGNhbGxiYWNrKVxuICB9XG5cbiAgaXNUaW1lQmxvY2tlZCh0aW1lOiBEYXRlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYXZhaWxhYmxlVGltZXMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucHJvcHMuYXZhaWxhYmxlVGltZXMuZmluZChhdmFpbGFibGVUaW1lID0+IGF2YWlsYWJsZVRpbWUudG9JU09TdHJpbmcoKSA9PT0gdGltZS50b0lTT1N0cmluZygpKSA9PT1cbiAgICAgICAgdW5kZWZpbmVkXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICAvLyDrqbTsoJEg7ZmV7KCV67ew7J2YIOqyveyasCDsnbTrr7gg7ISg7YOd65CcIOuCoOynnCDshKDtg50g67aI6rCA7ZWY64+E66GdIC0g7J207ISg7Zi4IOy2lOqwgFxuICAgIGNvbnN0IGlzQWxyZWFkeVNlbGVjdGVkID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgY29uc3Qgc2VsZWN0aW9uVHlwZSA9IGlzQWxyZWFkeVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJ1xuICAgIGlmICh0aGlzLnByb3BzLmlzQ29uZmlybWVkICYmIGlzQWxyZWFkeVNlbGVjdGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25UeXBlOiBzZWxlY3Rpb25UeXBlID8gJ3JlbW92ZScgOiAnYWRkJyxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBzdGFydFRpbWVcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWU6IERhdGUpIHtcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSB1c2VyIGp1c3QgY2xpY2tzIG9uIGEgc2luZ2xlIGNlbGwgKGJlY2F1c2Ugbm8gbW91c2VlbnRlciBldmVudHMgZmlyZVxuICAgIC8vIGluIHRoaXMgc2NlbmFyaW8pXG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWU6IERhdGUpIHtcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gICAgLy8gRG9uJ3QgY2FsbCB0aGlzLmVuZFNlbGVjdGlvbigpIGhlcmUgYmVjYXVzZSB0aGUgZG9jdW1lbnQgbW91c2V1cCBoYW5kbGVyIHdpbGwgZG8gaXRcbiAgfVxuXG4gIGhhbmRsZVRvdWNoTW92ZUV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogdHJ1ZSB9KVxuICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5nZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQpXG4gICAgaWYgKGNlbGxUaW1lKSB7XG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVRvdWNoRW5kRXZlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVG91Y2hEcmFnZ2luZykge1xuICAgICAgLy8gR29pbmcgZG93biB0aGlzIGJyYW5jaCBtZWFucyB0aGUgdXNlciB0YXBwZWQgYnV0IGRpZG4ndCBkcmFnIC0tIHdoaWNoXG4gICAgICAvLyBtZWFucyB0aGUgYXZhaWxhYmlsaXR5IGRyYWZ0IGhhc24ndCB5ZXQgYmVlbiB1cGRhdGVkIChzaW5jZVxuICAgICAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQgd2FzIG5ldmVyIGNhbGxlZCkgc28gd2UgbmVlZCB0byBkbyBpdCBub3dcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbCwgKCkgPT4ge1xuICAgICAgICB0aGlzLmVuZFNlbGVjdGlvbigpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZFNlbGVjdGlvbigpXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlIH0pXG4gIH1cblxuICByZW5kZXJEYXRlQ2VsbFdyYXBwZXIgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCBzdGFydEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4odGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcbiAgICBjb25zdCBibG9ja2VkID0gdGhpcy5pc1RpbWVCbG9ja2VkKHRpbWUpXG4gICAgY29uc3QgY2xpY2tlZCA9XG4gICAgICB0aGlzLnByb3BzLmNsaWNrZWRUaW1lICE9PSBudWxsICYmIHRoaXMucHJvcHMuaXNDb25maXJtZWQgJiYgaXNTYW1lTWludXRlKHRpbWUsIHRoaXMucHJvcHMuY2xpY2tlZFRpbWUpXG5cbiAgICBjb25zdCB1bmJsb2NrZWRDZWxsUHJvcHMgPSB7XG4gICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgb25Nb3VzZURvd246IHN0YXJ0SGFuZGxlcixcbiAgICAgIG9uTW91c2VFbnRlcjogKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgfSxcbiAgICAgIG9uTW91c2VVcDogKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgfSxcbiAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcbiAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgIG9uVG91Y2hTdGFydDogc3RhcnRIYW5kbGVyLFxuICAgICAgb25Ub3VjaE1vdmU6IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQsXG4gICAgICBvblRvdWNoRW5kOiB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnRcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdyaWRDZWxsXG4gICAgICAgIGNsYXNzTmFtZT1cInJnZHBfX2dyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cbiAgICAgICAgey4uLighYmxvY2tlZCA/IHVuYmxvY2tlZENlbGxQcm9wcyA6IHt9KX1cbiAgICAgID5cbiAgICAgICAge3RoaXMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIGJsb2NrZWQsIGNsaWNrZWQpfVxuICAgICAgPC9HcmlkQ2VsbD5cbiAgICApXG4gIH1cblxuICByZW5kZXJEYXRlQ2VsbCA9ICh0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgYmxvY2tlZDogYm9vbGVhbiwgY2xpY2tlZDogYm9vbGVhbik6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsKSB7XG4gICAgICAgIHRoaXMuY2VsbFRvRGF0ZS5zZXQoZGF0ZUNlbGwsIHRpbWUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlckRhdGVDZWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgYmxvY2tlZCwgY2xpY2tlZCwgcmVmU2V0dGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUNlbGxcbiAgICAgICAgICBjbGlja2VkPXtjbGlja2VkfVxuICAgICAgICAgIGJsb2NrZWQ9e2Jsb2NrZWR9XG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMudW5zZWxlY3RlZENvbG9yfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17dGhpcy5wcm9wcy5ob3ZlcmVkQ29sb3J9XG4gICAgICAgICAgYmxvY2tlZENvbG9yPXt0aGlzLnByb3BzLmJsb2NrZWRDb2xvcn1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHRoaXMucHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCB0aGlzLnByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZ1bGxEYXRlR3JpZCgpOiBBcnJheTxKU1guRWxlbWVudD4ge1xuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxuICAgIGNvbnN0IG51bURheXMgPSB0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aFxuICAgIGNvbnN0IG51bVRpbWVzID0gdGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzIC0gMTsgaiArPSAxKSB7XG4gICAgICAvLyBudW1UaW1lcyAtIDHsnYQg7Ya17ZW0IOuniOyngOuniSDsi5zqsITsnYAg7IWAIOyDneyEse2VmOyngCDslYrqsowgKOydtOyEoO2YuCDstpTqsIApXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKHRoaXMuc3RhdGUuZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAodGhpcy5yZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZS5kYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxuICAgICAgICBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5yZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSlcbiAgICAgICksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgICB0aGlzLmdyaWRSZWYgPSBlbFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgICAgPC9HcmlkPlxuICAgICAgPC9XcmFwcGVyPlxuICAgIClcbiAgfVxufVxuIl19