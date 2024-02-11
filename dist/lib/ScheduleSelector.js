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
    console.log(this.props.availableTimes);

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
      selectionType: selectionType,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJnZXREYXRlQ2VsbENvbG9yIiwiYmxvY2tlZCIsImJsb2NrZWRDb2xvciIsImNsaWNrZWQiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ29sb3IiLCJ1bnNlbGVjdGVkQ29sb3IiLCJEYXRlQ2VsbCIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4IiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJyZW5kZXJpbmdEYXRlcyIsImZvckVhY2giLCJyZW5kZXJpbmdEYXRlIiwiY3VycmVudERheSIsImN1cnJlbnREYXRlIiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJjb25zdHJ1Y3RvciIsImNlbGxUb0RhdGUiLCJNYXAiLCJncmlkUmVmIiwicmVuZGVyRGF0ZUNlbGxXcmFwcGVyIiwidGltZSIsInN0YXJ0SGFuZGxlciIsImhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQiLCJCb29sZWFuIiwiZmluZCIsImEiLCJpc1RpbWVCbG9ja2VkIiwiY2xpY2tlZFRpbWUiLCJpc0NvbmZpcm1lZCIsInVuYmxvY2tlZENlbGxQcm9wcyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50Iiwib25Nb3VzZVVwIiwiaGFuZGxlTW91c2VVcEV2ZW50Iiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsIm9uVG91Y2hFbmQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwidG9JU09TdHJpbmciLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwic2V0IiwicmVuZGVyVGltZUxhYmVsIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0Iiwic2VsZWN0aW9uVHlwZSIsImlzVG91Y2hEcmFnZ2luZyIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImVuZFNlbGVjdGlvbiIsImJpbmQiLCJjb21wb25lbnREaWRNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInZhbHVlIiwicGFzc2l2ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFRpbWVGcm9tVG91Y2hFdmVudCIsImV2ZW50IiwidG91Y2hlcyIsImxlbmd0aCIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjZWxsVGltZSIsImdldCIsIm9uQ2hhbmdlIiwic2V0U3RhdGUiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsImNhbGxiYWNrIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwiZmlsdGVyIiwic2VsZWN0ZWRUaW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiYiIsImNvbnNvbGUiLCJsb2ciLCJhdmFpbGFibGVUaW1lcyIsImF2YWlsYWJsZVRpbWUiLCJ1bmRlZmluZWQiLCJzdGFydFRpbWUiLCJpc0FscmVhZHlTZWxlY3RlZCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtRGF5cyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50Iiwia2V5IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsT0FBTyxHQUFHQywwQkFBT0MsR0FBVjtBQUFBO0FBQUE7QUFBQSxvRUFBYjs7QUFPQSxNQUFNQyxJQUFJLEdBQUdGLDBCQUFPQyxHQUFWO0FBQUE7QUFBQTtBQUFBLG1KQUU2QkUsS0FBSyxJQUFJQSxLQUFLLENBQUNDLE9BRjVDLEVBRzBCRCxLQUFLLElBQUlBLEtBQUssQ0FBQ0UsSUFIekMsRUFJTUYsS0FBSyxJQUFJQSxLQUFLLENBQUNHLFNBSnJCLEVBS0dILEtBQUssSUFBSUEsS0FBSyxDQUFDSSxNQUxsQixDQUFWOztBQVNPLE1BQU1DLFFBQVEsR0FBR1IsMEJBQU9DLEdBQVY7QUFBQTtBQUFBO0FBQUEsNkNBQWQ7Ozs7QUFlUCxNQUFNUSxnQkFBZ0IsR0FBSU4sS0FBRCxJQUEwQjtBQUNqRCxNQUFJQSxLQUFLLENBQUNPLE9BQVYsRUFBbUI7QUFDakIsV0FBT1AsS0FBSyxDQUFDUSxZQUFiO0FBQ0QsR0FGRCxNQUVPLElBQUlSLEtBQUssQ0FBQ1MsT0FBVixFQUFtQjtBQUN4QixXQUFPLFNBQVA7QUFDRCxHQUZNLE1BRUEsSUFBSVQsS0FBSyxDQUFDVSxRQUFWLEVBQW9CO0FBQ3pCLFdBQU9WLEtBQUssQ0FBQ1csYUFBYjtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQU9YLEtBQUssQ0FBQ1ksZUFBYjtBQUNEO0FBQ0YsQ0FWRDs7QUFZQSxNQUFN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LGdCLENBWVp5SCxZLEdBQW1DO0FBQ3hDbEgsRUFBQUEsU0FBUyxFQUFFLEVBRDZCO0FBRXhDbUYsRUFBQUEsZUFBZSxFQUFFLFFBRnVCO0FBR3hDaUIsRUFBQUEsT0FBTyxFQUFFLENBSCtCO0FBSXhDdkYsRUFBQUEsT0FBTyxFQUFFLENBSitCO0FBS3hDQyxFQUFBQSxPQUFPLEVBQUUsRUFMK0I7QUFNeENSLEVBQUFBLFlBQVksRUFBRSxDQU4wQjtBQU94QztBQUNBO0FBQ0FDLEVBQUFBLGNBQWMsRUFBRSxFQVR3QjtBQVV4Q3lDLEVBQUFBLFVBQVUsRUFBRSxJQVY0QjtBQVd4Q0csRUFBQUEsVUFBVSxFQUFFLEtBWDRCO0FBWXhDN0UsRUFBQUEsU0FBUyxFQUFFLEtBWjZCO0FBYXhDQyxFQUFBQSxNQUFNLEVBQUUsS0FiZ0M7QUFjeENPLEVBQUFBLGFBQWEsRUFBRXFJLGdCQUFPQyxJQWRrQjtBQWV4Q3JJLEVBQUFBLGVBQWUsRUFBRW9JLGdCQUFPRSxRQWZnQjtBQWdCeENwSSxFQUFBQSxZQUFZLEVBQUVrSSxnQkFBT0csU0FoQm1CO0FBaUJ4QztBQUNBM0ksRUFBQUEsWUFBWSxFQUFFLFNBbEIwQjtBQWtCZjtBQUN6Qm1ELEVBQUFBLFdBQVcsRUFBRSxLQW5CMkI7QUFtQnBCO0FBQ3BCRCxFQUFBQSxXQUFXLEVBQUUsSUFwQjJCO0FBcUJ4Q2dELEVBQUFBLFFBQVEsRUFBRSxNQUFNLENBQUU7QUFyQnNCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXG5cbi8vIEltcG9ydCBvbmx5IHRoZSBtZXRob2RzIHdlIG5lZWQgZnJvbSBkYXRlLWZucyBpbiBvcmRlciB0byBrZWVwIGJ1aWxkIHNpemUgc21hbGxcbmltcG9ydCBhZGRNaW51dGVzIGZyb20gJ2RhdGUtZm5zL2FkZF9taW51dGVzJ1xuaW1wb3J0IGFkZEhvdXJzIGZyb20gJ2RhdGUtZm5zL2FkZF9ob3VycydcbmltcG9ydCBhZGREYXlzIGZyb20gJ2RhdGUtZm5zL2FkZF9kYXlzJ1xuaW1wb3J0IHN0YXJ0T2ZEYXkgZnJvbSAnZGF0ZS1mbnMvc3RhcnRfb2ZfZGF5J1xuaW1wb3J0IGlzU2FtZU1pbnV0ZSBmcm9tICdkYXRlLWZucy9pc19zYW1lX21pbnV0ZSdcbmltcG9ydCBmb3JtYXREYXRlIGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCdcblxuaW1wb3J0IHsgVGV4dCwgU3VidGl0bGUgfSBmcm9tICcuL3R5cG9ncmFwaHknXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJ1xuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMnXG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG5gXG5cbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PHsgY29sdW1uczogbnVtYmVyOyByb3dzOiBudW1iZXI7IGNvbHVtbkdhcDogc3RyaW5nOyByb3dHYXA6IHN0cmluZyB9PmBcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLmNvbHVtbnN9LCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMucm93c30sIDFmcik7XG4gIGNvbHVtbi1nYXA6ICR7cHJvcHMgPT4gcHJvcHMuY29sdW1uR2FwfTtcbiAgcm93LWdhcDogJHtwcm9wcyA9PiBwcm9wcy5yb3dHYXB9O1xuICB3aWR0aDogMTAwJTtcbmBcblxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcbiAgcGxhY2Utc2VsZjogc3RyZXRjaDtcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xuYFxuXG50eXBlIERhdGVDZWxsUHJvcHMgPSB7XG4gIGNsaWNrZWQ6IGJvb2xlYW5cbiAgYmxvY2tlZDogYm9vbGVhblxuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgYmxvY2tlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgZ2V0RGF0ZUNlbGxDb2xvciA9IChwcm9wczogRGF0ZUNlbGxQcm9wcykgPT4ge1xuICBpZiAocHJvcHMuYmxvY2tlZCkge1xuICAgIHJldHVybiBwcm9wcy5ibG9ja2VkQ29sb3JcbiAgfSBlbHNlIGlmIChwcm9wcy5jbGlja2VkKSB7XG4gICAgcmV0dXJuICcjMDAwMDAwJ1xuICB9IGVsc2UgaWYgKHByb3BzLnNlbGVjdGVkKSB7XG4gICAgcmV0dXJuIHByb3BzLnNlbGVjdGVkQ29sb3JcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJvcHMudW5zZWxlY3RlZENvbG9yXG4gIH1cbn1cblxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PERhdGVDZWxsUHJvcHM+YFxuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAyNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke2dldERhdGVDZWxsQ29sb3J9O1xuXG4gICR7cHJvcHMgPT5cbiAgICAhcHJvcHMuYmxvY2tlZFxuICAgICAgPyBgXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzLmhvdmVyZWRDb2xvcn07XG4gICAgfVxuICBgXG4gICAgICA6ICcnfVxuYFxuXG5jb25zdCBEYXRlTGFiZWwgPSBzdHlsZWQoU3VidGl0bGUpYFxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gIH1cbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG5gXG5cbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIG1hcmdpbjogMDtcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XG5gXG5cbnR5cGUgUHJvcHNUeXBlID0ge1xuICBzZWxlY3Rpb246IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcbiAgLy9zdGFydERhdGU6IERhdGVcbiAgcmVuZGVyaW5nRGF0ZXM6IERhdGVbXSAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIG51bURheXM6IG51bWJlclxuICBtaW5UaW1lOiBudW1iZXJcbiAgbWF4VGltZTogbnVtYmVyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xuICB0aW1lRm9ybWF0OiBzdHJpbmdcbiAgY29sdW1uR2FwOiBzdHJpbmdcbiAgcm93R2FwOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG4gIGF2YWlsYWJsZVRpbWVzOiBEYXRlW10gLy8g7J207ISg7Zi4IOy2lOqwgFxuICBibG9ja2VkQ29sb3I6IHN0cmluZyAvLyDsnbTshKDtmLgg7LaU6rCAXG4gIGlzQ29uZmlybWVkOiBib29sZWFuIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgY2xpY2tlZFRpbWU6IERhdGUgfCBudWxsIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoXG4gICAgZGF0ZXRpbWU6IERhdGUsXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW4sXG4gICAgYmxvY2tlZDogYm9vbGVhbixcbiAgICBjbGlja2VkOiBib29sZWFuLFxuICAgIC8vIG9uQ2xpY2s6ICh0aW1lOiBEYXRlLCBibG9ja2VkOiBib29sZWFuKSA9PiB2b2lkLFxuICAgIHJlZlNldHRlcjogKGRhdGVDZWxsRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWRcbiAgKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbnR5cGUgU3RhdGVUeXBlID0ge1xuICAvLyBJbiB0aGUgY2FzZSB0aGF0IGEgdXNlciBpcyBkcmFnLXNlbGVjdGluZywgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMucHJvcHMub25DaGFuZ2UoKSB1bnRpbCB0aGV5IGhhdmUgY29tcGxldGVkXG4gIC8vIHRoZSBkcmFnLXNlbGVjdC4gc2VsZWN0aW9uRHJhZnQgc2VydmVzIGFzIGEgdGVtcG9yYXJ5IGNvcHkgZHVyaW5nIGRyYWctc2VsZWN0cy5cbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGUgfCBudWxsXG4gIHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbFxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cbiAgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PlxuICAvLyBjbGlja2VkVGltZTogRGF0ZSB8IG51bGwgLy8g7J207ISg7Zi4IOy2lOqwgFxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZVNlbGVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzVHlwZSwgU3RhdGVUeXBlPiB7XG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxuICBjZWxsVG9EYXRlOiBNYXA8RWxlbWVudCwgRGF0ZT4gPSBuZXcgTWFwKClcbiAgLy8gZG9jdW1lbnRNb3VzZVVwSGFuZGxlcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50OiAoZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY1RvdWNoRXZlbnQ8Kj4pID0+IHZvaWRcbiAgLy8gaGFuZGxlVG91Y2hFbmRFdmVudDogKCkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZU1vdXNlRW50ZXJFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgLy8gaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IFBhcnRpYWw8UHJvcHNUeXBlPiA9IHtcbiAgICBzZWxlY3Rpb246IFtdLFxuICAgIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gICAgbnVtRGF5czogNyxcbiAgICBtaW5UaW1lOiA5LFxuICAgIG1heFRpbWU6IDIzLFxuICAgIGhvdXJseUNodW5rczogMSxcbiAgICAvLyBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gICAgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIHJlbmRlcmluZ0RhdGVzOiBbXSxcbiAgICB0aW1lRm9ybWF0OiAnaGEnLFxuICAgIGRhdGVGb3JtYXQ6ICdNL0QnLFxuICAgIGNvbHVtbkdhcDogJzRweCcsXG4gICAgcm93R2FwOiAnNHB4JyxcbiAgICBzZWxlY3RlZENvbG9yOiBjb2xvcnMuYmx1ZSxcbiAgICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcbiAgICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXG4gICAgLy8gYXZhaWxhYmxlVGltZXM6IFtdLCAvLyDsnbTshKDtmLgg7LaU6rCAXG4gICAgYmxvY2tlZENvbG9yOiAnI2YxZjFmMicsIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgICBpc0NvbmZpcm1lZDogZmFsc2UsIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgICBjbGlja2VkVGltZTogbnVsbCxcbiAgICBvbkNoYW5nZTogKCkgPT4ge31cbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHM6IFByb3BzVHlwZSwgc3RhdGU6IFN0YXRlVHlwZSk6IFBhcnRpYWw8U3RhdGVUeXBlPiB8IG51bGwge1xuICAgIC8vIEFzIGxvbmcgYXMgdGhlIHVzZXIgaXNuJ3QgaW4gdGhlIHByb2Nlc3Mgb2Ygc2VsZWN0aW5nLCBhbGxvdyBwcm9wIGNoYW5nZXMgdG8gcmUtcG9wdWxhdGUgc2VsZWN0aW9uIHN0YXRlXG4gICAgaWYgKHN0YXRlLnNlbGVjdGlvblN0YXJ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4ucHJvcHMuc2VsZWN0aW9uXSxcbiAgICAgICAgZGF0ZXM6IFNjaGVkdWxlU2VsZWN0b3IuY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLyogXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gICAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhhZGREYXlzKHN0YXJ0VGltZSwgZCksIGgpLCBjICogbWludXRlc0luQ2h1bmspKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkYXRlcy5wdXNoKGN1cnJlbnREYXkpXG4gICAgfVxuICAgIHJldHVybiBkYXRlc1xuICB9XG4gICovXG5cbiAgc3RhdGljIGNvbXB1dGVEYXRlc01hdHJpeChwcm9wczogUHJvcHNUeXBlKTogQXJyYXk8QXJyYXk8RGF0ZT4+IHtcbiAgICAvLyBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cbiAgICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG5cbiAgICBwcm9wcy5yZW5kZXJpbmdEYXRlcy5mb3JFYWNoKHJlbmRlcmluZ0RhdGUgPT4ge1xuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHN0YXJ0T2ZEYXkocmVuZGVyaW5nRGF0ZSlcblxuICAgICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPD0gcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICAgIC8vIOyLnOqwhOydtCBtYXhUaW1l7J206rOgIOyyre2BrOqwgCBob3VybHlDaHVua3Prs7Tri6Qg7J6R7J2EIOuVjOunjCDrsJjrs7XtlZjsl6wgbWF4VGltZeydtCDtj6ztlajrkJjqsowgKOydtOyEoO2YuCDstpTqsIApXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzICYmICEoaCA9PT0gcHJvcHMubWF4VGltZSAmJiBjID09PSBwcm9wcy5ob3VybHlDaHVua3MgLSAxKTsgYyArPSAxKSB7XG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoY3VycmVudERhdGUsIGgpLCBjICogbWludXRlc0luQ2h1bmspKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkYXRlcy5wdXNoKGN1cnJlbnREYXkpXG4gICAgfSlcbiAgICByZXR1cm4gZGF0ZXNcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wc1R5cGUpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXSwgLy8gY29weSBpdCBvdmVyXG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGwsXG4gICAgICBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGF0ZXM6IFNjaGVkdWxlU2VsZWN0b3IuY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKVxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZVxuICAgIH1cblxuICAgIHRoaXMuZW5kU2VsZWN0aW9uID0gdGhpcy5lbmRTZWxlY3Rpb24uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudC5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgZW5kU2VsZWN0aW9uIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCBpdHNlbGYgaW4gb3JkZXJcbiAgICAvLyB0byBjYXRjaCB0aGUgY2FzZXMgd2hlcmUgdGhlIHVzZXJzIGVuZHMgdGhlaXIgbW91c2UtY2xpY2sgc29tZXdoZXJlIGJlc2lkZXNcbiAgICAvLyB0aGUgZGF0ZSBjZWxscyAoaW4gd2hpY2ggY2FzZSBub25lIG9mIHRoZSBEYXRlQ2VsbCdzIG9uTW91c2VVcCBoYW5kbGVycyB3b3VsZCBmaXJlKVxuICAgIC8vXG4gICAgLy8gVGhpcyBpc24ndCBuZWNlc3NhcnkgZm9yIHRvdWNoIGV2ZW50cyBzaW5jZSB0aGUgYHRvdWNoZW5kYCBldmVudCBmaXJlcyBvblxuICAgIC8vIHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaC9kcmFnIHN0YXJ0ZWQgc28gaXQncyBhbHdheXMgY2F1Z2h0LlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcblxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIFBlcmZvcm1zIGEgbG9va3VwIGludG8gdGhpcy5jZWxsVG9EYXRlIHRvIHJldHJpZXZlIHRoZSBEYXRlIHRoYXQgY29ycmVzcG9uZHMgdG9cbiAgLy8gdGhlIGNlbGwgd2hlcmUgdGhpcyB0b3VjaCBldmVudCBpcyByaWdodCBub3cuIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIG9ubHkgd29ya1xuICAvLyBpZiB0aGUgZXZlbnQgaXMgYSBgdG91Y2htb3ZlYCBldmVudCBzaW5jZSBpdCdzIHRoZSBvbmx5IG9uZSB0aGF0IGhhcyBhIGB0b3VjaGVzYCBsaXN0LlxuICBnZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQ8YW55Pik6IERhdGUgfCBudWxsIHtcbiAgICBjb25zdCB7IHRvdWNoZXMgfSA9IGV2ZW50XG4gICAgaWYgKCF0b3VjaGVzIHx8IHRvdWNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IHsgY2xpZW50WCwgY2xpZW50WSB9ID0gdG91Y2hlc1swXVxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5jZWxsVG9EYXRlLmdldCh0YXJnZXRFbGVtZW50KVxuICAgICAgcmV0dXJuIGNlbGxUaW1lID8/IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGVuZFNlbGVjdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGxcbiAgICB9KVxuICB9XG5cbiAgLy8gR2l2ZW4gYW4gZW5kaW5nIERhdGUsIGRldGVybWluZXMgYWxsIHRoZSBkYXRlcyB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBpbiB0aGlzIGRyYWZ0XG4gIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHNlbGVjdGlvbkVuZDogRGF0ZSB8IG51bGwsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xuICAgIGNvbnN0IHsgc2VsZWN0aW9uVHlwZSwgc2VsZWN0aW9uU3RhcnQgfSA9IHRoaXMuc3RhdGVcblxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSBudWxsIHx8IHNlbGVjdGlvblN0YXJ0ID09PSBudWxsKSByZXR1cm5cblxuICAgIGxldCBuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+ID0gW11cbiAgICBpZiAoc2VsZWN0aW9uU3RhcnQgJiYgc2VsZWN0aW9uRW5kICYmIHNlbGVjdGlvblR5cGUpIHtcbiAgICAgIG5ld1NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbdGhpcy5wcm9wcy5zZWxlY3Rpb25TY2hlbWVdKFxuICAgICAgICBzZWxlY3Rpb25TdGFydCxcbiAgICAgICAgc2VsZWN0aW9uRW5kLFxuICAgICAgICB0aGlzLnN0YXRlLmRhdGVzXG4gICAgICApLmZpbHRlcihzZWxlY3RlZFRpbWUgPT4gIXRoaXMuaXNUaW1lQmxvY2tlZChzZWxlY3RlZFRpbWUpKVxuICAgIH1cblxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdhZGQnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLm5leHREcmFmdCwgLi4ubmV3U2VsZWN0aW9uXSkpXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xuICAgICAgbmV4dERyYWZ0ID0gbmV4dERyYWZ0LmZpbHRlcihhID0+ICFuZXdTZWxlY3Rpb24uZmluZChiID0+IGlzU2FtZU1pbnV0ZShhLCBiKSkpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGlvbkRyYWZ0OiBuZXh0RHJhZnQgfSwgY2FsbGJhY2spXG4gIH1cblxuICBpc1RpbWVCbG9ja2VkKHRpbWU6IERhdGUpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLmF2YWlsYWJsZVRpbWVzKVxuICAgIGlmICh0aGlzLnByb3BzLmF2YWlsYWJsZVRpbWVzKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLnByb3BzLmF2YWlsYWJsZVRpbWVzLmZpbmQoYXZhaWxhYmxlVGltZSA9PiBhdmFpbGFibGVUaW1lLnRvSVNPU3RyaW5nKCkgPT09IHRpbWUudG9JU09TdHJpbmcoKSkgPT09XG4gICAgICAgIHVuZGVmaW5lZFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XG4gIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQoc3RhcnRUaW1lOiBEYXRlKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXJ0VGltZSBjZWxsIGlzIHNlbGVjdGVkL3Vuc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZHJhZy1zZWxlY3Qgc2hvdWxkXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXG4gICAgLy8g66m07KCRIO2Zleygleu3sOydmCDqsr3smrAg7J2066+4IOyEoO2DneuQnCDrgqDsp5wg7ISg7YOdIOu2iOqwgO2VmOuPhOuhnSAtIOydtOyEoO2YuCDstpTqsIBcbiAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIGNvbnN0IHNlbGVjdGlvblR5cGUgPSBpc0FscmVhZHlTZWxlY3RlZCA/ICdyZW1vdmUnIDogJ2FkZCdcbiAgICBpZiAodGhpcy5wcm9wcy5pc0NvbmZpcm1lZCAmJiBpc0FscmVhZHlTZWxlY3RlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogc2VsZWN0aW9uVHlwZSxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBzdGFydFRpbWVcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWU6IERhdGUpIHtcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSB1c2VyIGp1c3QgY2xpY2tzIG9uIGEgc2luZ2xlIGNlbGwgKGJlY2F1c2Ugbm8gbW91c2VlbnRlciBldmVudHMgZmlyZVxuICAgIC8vIGluIHRoaXMgc2NlbmFyaW8pXG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWU6IERhdGUpIHtcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gICAgLy8gRG9uJ3QgY2FsbCB0aGlzLmVuZFNlbGVjdGlvbigpIGhlcmUgYmVjYXVzZSB0aGUgZG9jdW1lbnQgbW91c2V1cCBoYW5kbGVyIHdpbGwgZG8gaXRcbiAgfVxuXG4gIGhhbmRsZVRvdWNoTW92ZUV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogdHJ1ZSB9KVxuICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5nZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQpXG4gICAgaWYgKGNlbGxUaW1lKSB7XG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVRvdWNoRW5kRXZlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVG91Y2hEcmFnZ2luZykge1xuICAgICAgLy8gR29pbmcgZG93biB0aGlzIGJyYW5jaCBtZWFucyB0aGUgdXNlciB0YXBwZWQgYnV0IGRpZG4ndCBkcmFnIC0tIHdoaWNoXG4gICAgICAvLyBtZWFucyB0aGUgYXZhaWxhYmlsaXR5IGRyYWZ0IGhhc24ndCB5ZXQgYmVlbiB1cGRhdGVkIChzaW5jZVxuICAgICAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQgd2FzIG5ldmVyIGNhbGxlZCkgc28gd2UgbmVlZCB0byBkbyBpdCBub3dcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbCwgKCkgPT4ge1xuICAgICAgICB0aGlzLmVuZFNlbGVjdGlvbigpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZFNlbGVjdGlvbigpXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlIH0pXG4gIH1cblxuICByZW5kZXJEYXRlQ2VsbFdyYXBwZXIgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCBzdGFydEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4odGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcbiAgICBjb25zdCBibG9ja2VkID0gdGhpcy5pc1RpbWVCbG9ja2VkKHRpbWUpXG4gICAgY29uc3QgY2xpY2tlZCA9XG4gICAgICB0aGlzLnByb3BzLmNsaWNrZWRUaW1lICE9PSBudWxsICYmIHRoaXMucHJvcHMuaXNDb25maXJtZWQgJiYgaXNTYW1lTWludXRlKHRpbWUsIHRoaXMucHJvcHMuY2xpY2tlZFRpbWUpXG5cbiAgICBjb25zdCB1bmJsb2NrZWRDZWxsUHJvcHMgPSB7XG4gICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgb25Nb3VzZURvd246IHN0YXJ0SGFuZGxlcixcbiAgICAgIG9uTW91c2VFbnRlcjogKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgfSxcbiAgICAgIG9uTW91c2VVcDogKCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgfSxcbiAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcbiAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgIG9uVG91Y2hTdGFydDogc3RhcnRIYW5kbGVyLFxuICAgICAgb25Ub3VjaE1vdmU6IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQsXG4gICAgICBvblRvdWNoRW5kOiB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnRcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdyaWRDZWxsXG4gICAgICAgIGNsYXNzTmFtZT1cInJnZHBfX2dyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cbiAgICAgICAgey4uLighYmxvY2tlZCA/IHVuYmxvY2tlZENlbGxQcm9wcyA6IHt9KX1cbiAgICAgID5cbiAgICAgICAge3RoaXMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIGJsb2NrZWQsIGNsaWNrZWQpfVxuICAgICAgPC9HcmlkQ2VsbD5cbiAgICApXG4gIH1cblxuICByZW5kZXJEYXRlQ2VsbCA9ICh0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgYmxvY2tlZDogYm9vbGVhbiwgY2xpY2tlZDogYm9vbGVhbik6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsKSB7XG4gICAgICAgIHRoaXMuY2VsbFRvRGF0ZS5zZXQoZGF0ZUNlbGwsIHRpbWUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlckRhdGVDZWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgYmxvY2tlZCwgY2xpY2tlZCwgcmVmU2V0dGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUNlbGxcbiAgICAgICAgICBjbGlja2VkPXtjbGlja2VkfVxuICAgICAgICAgIGJsb2NrZWQ9e2Jsb2NrZWR9XG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMudW5zZWxlY3RlZENvbG9yfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17dGhpcy5wcm9wcy5ob3ZlcmVkQ29sb3J9XG4gICAgICAgICAgYmxvY2tlZENvbG9yPXt0aGlzLnByb3BzLmJsb2NrZWRDb2xvcn1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHRoaXMucHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCB0aGlzLnByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZ1bGxEYXRlR3JpZCgpOiBBcnJheTxKU1guRWxlbWVudD4ge1xuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxuICAgIGNvbnN0IG51bURheXMgPSB0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aFxuICAgIGNvbnN0IG51bVRpbWVzID0gdGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzIC0gMTsgaiArPSAxKSB7XG4gICAgICAvLyBudW1UaW1lcyAtIDHsnYQg7Ya17ZW0IOuniOyngOuniSDsi5zqsITsnYAg7IWAIOyDneyEse2VmOyngCDslYrqsowgKOydtOyEoO2YuCDstpTqsIApXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKHRoaXMuc3RhdGUuZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAodGhpcy5yZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZS5kYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxuICAgICAgICBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5yZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSlcbiAgICAgICksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgICB0aGlzLmdyaWRSZWYgPSBlbFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgICAgPC9HcmlkPlxuICAgICAgPC9XcmFwcGVyPlxuICAgIClcbiAgfVxufVxuIl19