"use strict";

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

// Import only the methods we need from date-fns in order to keep build size small
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

const DateCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__DateCell",
  componentId: "sc-1ke4ka2-3"
})(["width:100%;height:25px;background-color:", ";&:hover{background-color:", ";}"], props => props.selected ? props.selectedColor : props.unselectedColor, props => props.hoveredColor);

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
      return /*#__PURE__*/React.createElement(GridCell, {
        className: "rgdp__grid-cell",
        role: "presentation",
        key: time.toISOString() // Mouse handlers
        ,
        onMouseDown: startHandler,
        onMouseEnter: () => {
          this.handleMouseEnterEvent(time);
        },
        onMouseUp: () => {
          this.handleMouseUpEvent(time);
        } // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        ,
        onTouchStart: startHandler,
        onTouchMove: this.handleTouchMoveEvent,
        onTouchEnd: this.handleTouchEndEvent
      }, this.renderDateCell(time, selected));
    };

    this.renderDateCell = (time, selected) => {
      const refSetter = dateCell => {
        if (dateCell) {
          this.cellToDate.set(dateCell, time);
        }
      };

      if (this.props.renderDateCell) {
        return this.props.renderDateCell(time, selected, refSetter);
      } else {
        return /*#__PURE__*/React.createElement(DateCell, {
          selected: selected,
          ref: refSetter,
          selectedColor: this.props.selectedColor,
          unselectedColor: this.props.unselectedColor,
          hoveredColor: this.props.hoveredColor
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
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.state.dates);
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
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJEYXRlQ2VsbCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4IiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJyZW5kZXJpbmdEYXRlcyIsImZvckVhY2giLCJyZW5kZXJpbmdEYXRlIiwiY3VycmVudERheSIsImN1cnJlbnREYXRlIiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJjb25zdHJ1Y3RvciIsImNlbGxUb0RhdGUiLCJNYXAiLCJncmlkUmVmIiwicmVuZGVyRGF0ZUNlbGxXcmFwcGVyIiwidGltZSIsInN0YXJ0SGFuZGxlciIsImhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQiLCJCb29sZWFuIiwiZmluZCIsImEiLCJ0b0lTT1N0cmluZyIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsImhhbmRsZU1vdXNlVXBFdmVudCIsImhhbmRsZVRvdWNoTW92ZUV2ZW50IiwiaGFuZGxlVG91Y2hFbmRFdmVudCIsInJlbmRlckRhdGVDZWxsIiwicmVmU2V0dGVyIiwiZGF0ZUNlbGwiLCJzZXQiLCJyZW5kZXJUaW1lTGFiZWwiLCJ0aW1lRm9ybWF0IiwicmVuZGVyRGF0ZUxhYmVsIiwiZGF0ZSIsImRhdGVGb3JtYXQiLCJzZWxlY3Rpb25UeXBlIiwiaXNUb3VjaERyYWdnaW5nIiwic2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMiLCJsaW5lYXIiLCJzZWxlY3Rpb25TY2hlbWVzIiwic3F1YXJlIiwiZW5kU2VsZWN0aW9uIiwiYmluZCIsImNvbXBvbmVudERpZE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwidmFsdWUiLCJwYXNzaXZlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwiZ2V0Iiwib25DaGFuZ2UiLCJzZXRTdGF0ZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwiY2FsbGJhY2siLCJuZXdTZWxlY3Rpb24iLCJzZWxlY3Rpb25TY2hlbWUiLCJuZXh0RHJhZnQiLCJBcnJheSIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJiIiwic3RhcnRUaW1lIiwidGltZVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1EYXlzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJjbG9uZUVsZW1lbnQiLCJrZXkiLCJlbGVtZW50IiwicmVuZGVyIiwiZWwiLCJkZWZhdWx0UHJvcHMiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztB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IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJ1xyXG5cclxuLy8gSW1wb3J0IG9ubHkgdGhlIG1ldGhvZHMgd2UgbmVlZCBmcm9tIGRhdGUtZm5zIGluIG9yZGVyIHRvIGtlZXAgYnVpbGQgc2l6ZSBzbWFsbFxyXG5pbXBvcnQgYWRkTWludXRlcyBmcm9tICdkYXRlLWZucy9hZGRfbWludXRlcydcclxuaW1wb3J0IGFkZEhvdXJzIGZyb20gJ2RhdGUtZm5zL2FkZF9ob3VycydcclxuaW1wb3J0IGFkZERheXMgZnJvbSAnZGF0ZS1mbnMvYWRkX2RheXMnXHJcbmltcG9ydCBzdGFydE9mRGF5IGZyb20gJ2RhdGUtZm5zL3N0YXJ0X29mX2RheSdcclxuaW1wb3J0IGlzU2FtZU1pbnV0ZSBmcm9tICdkYXRlLWZucy9pc19zYW1lX21pbnV0ZSdcclxuaW1wb3J0IGZvcm1hdERhdGUgZnJvbSAnZGF0ZS1mbnMvZm9ybWF0J1xyXG5cclxuaW1wb3J0IHsgVGV4dCwgU3VidGl0bGUgfSBmcm9tICcuL3R5cG9ncmFwaHknXHJcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnXHJcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xyXG5cclxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIHVzZXItc2VsZWN0OiBub25lO1xyXG5gXHJcblxyXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjx7IGNvbHVtbnM6IG51bWJlcjsgcm93czogbnVtYmVyOyBjb2x1bW5HYXA6IHN0cmluZzsgcm93R2FwOiBzdHJpbmcgfT5gXHJcbiAgZGlzcGxheTogZ3JpZDtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMuY29sdW1uc30sIDFmcik7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLnJvd3N9LCAxZnIpO1xyXG4gIGNvbHVtbi1nYXA6ICR7cHJvcHMgPT4gcHJvcHMuY29sdW1uR2FwfTtcclxuICByb3ctZ2FwOiAke3Byb3BzID0+IHByb3BzLnJvd0dhcH07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbmBcclxuXHJcbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXHJcbiAgcGxhY2Utc2VsZjogc3RyZXRjaDtcclxuICB0b3VjaC1hY3Rpb246IG5vbmU7XHJcbmBcclxuXHJcbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjx7XHJcbiAgc2VsZWN0ZWQ6IGJvb2xlYW5cclxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcclxuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xyXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXHJcbn0+YFxyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMjVweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5zZWxlY3RlZCA/IHByb3BzLnNlbGVjdGVkQ29sb3IgOiBwcm9wcy51bnNlbGVjdGVkQ29sb3IpfTtcclxuXHJcbiAgJjpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLmhvdmVyZWRDb2xvcn07XHJcbiAgfVxyXG5gXHJcblxyXG5jb25zdCBEYXRlTGFiZWwgPSBzdHlsZWQoU3VidGl0bGUpYFxyXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gIH1cclxuICBtYXJnaW46IDA7XHJcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xyXG5gXHJcblxyXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcclxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcclxuICAgIGZvbnQtc2l6ZTogMTBweDtcclxuICB9XHJcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIG1hcmdpbi1yaWdodDogNHB4O1xyXG5gXHJcblxyXG50eXBlIFByb3BzVHlwZSA9IHtcclxuICBzZWxlY3Rpb246IEFycmF5PERhdGU+XHJcbiAgc2VsZWN0aW9uU2NoZW1lOiBTZWxlY3Rpb25TY2hlbWVUeXBlXHJcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXHJcbiAgLy9zdGFydERhdGU6IERhdGVcclxuICByZW5kZXJpbmdEYXRlczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcclxuICBudW1EYXlzOiBudW1iZXJcclxuICBtaW5UaW1lOiBudW1iZXJcclxuICBtYXhUaW1lOiBudW1iZXJcclxuICBob3VybHlDaHVua3M6IG51bWJlclxyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xyXG4gIHRpbWVGb3JtYXQ6IHN0cmluZ1xyXG4gIGNvbHVtbkdhcDogc3RyaW5nXHJcbiAgcm93R2FwOiBzdHJpbmdcclxuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xyXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xyXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXHJcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxyXG4gIHJlbmRlclRpbWVMYWJlbD86ICh0aW1lOiBEYXRlKSA9PiBKU1guRWxlbWVudFxyXG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxyXG59XHJcblxyXG50eXBlIFN0YXRlVHlwZSA9IHtcclxuICAvLyBJbiB0aGUgY2FzZSB0aGF0IGEgdXNlciBpcyBkcmFnLXNlbGVjdGluZywgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMucHJvcHMub25DaGFuZ2UoKSB1bnRpbCB0aGV5IGhhdmUgY29tcGxldGVkXHJcbiAgLy8gdGhlIGRyYWctc2VsZWN0LiBzZWxlY3Rpb25EcmFmdCBzZXJ2ZXMgYXMgYSB0ZW1wb3JhcnkgY29weSBkdXJpbmcgZHJhZy1zZWxlY3RzLlxyXG4gIHNlbGVjdGlvbkRyYWZ0OiBBcnJheTxEYXRlPlxyXG4gIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGUgfCBudWxsXHJcbiAgc2VsZWN0aW9uU3RhcnQ6IERhdGUgfCBudWxsXHJcbiAgaXNUb3VjaERyYWdnaW5nOiBib29sZWFuXHJcbiAgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PlxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVkdWxlU2VsZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHNUeXBlLCBTdGF0ZVR5cGU+IHtcclxuICBzZWxlY3Rpb25TY2hlbWVIYW5kbGVyczogeyBba2V5OiBzdHJpbmddOiAoc3RhcnREYXRlOiBEYXRlLCBlbmREYXRlOiBEYXRlLCBmb286IEFycmF5PEFycmF5PERhdGU+PikgPT4gRGF0ZVtdIH1cclxuICBjZWxsVG9EYXRlOiBNYXA8RWxlbWVudCwgRGF0ZT4gPSBuZXcgTWFwKClcclxuICAvLyBkb2N1bWVudE1vdXNlVXBIYW5kbGVyOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cclxuICAvLyBlbmRTZWxlY3Rpb246ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxyXG4gIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50OiAoZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY1RvdWNoRXZlbnQ8Kj4pID0+IHZvaWRcclxuICAvLyBoYW5kbGVUb3VjaEVuZEV2ZW50OiAoKSA9PiB2b2lkXHJcbiAgLy8gaGFuZGxlTW91c2VVcEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZU1vdXNlRW50ZXJFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcclxuICAvLyBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxyXG4gIGdyaWRSZWY6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGxcclxuXHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wczogUGFydGlhbDxQcm9wc1R5cGU+ID0ge1xyXG4gICAgc2VsZWN0aW9uOiBbXSxcclxuICAgIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXHJcbiAgICBudW1EYXlzOiA3LFxyXG4gICAgbWluVGltZTogOSxcclxuICAgIG1heFRpbWU6IDIzLFxyXG4gICAgaG91cmx5Q2h1bmtzOiAxLFxyXG4gICAgLy8gc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgLy8g7J207ISg7Zi4IOy2lOqwgFxyXG4gICAgcmVuZGVyaW5nRGF0ZXM6IFtdLFxyXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcclxuICAgIGRhdGVGb3JtYXQ6ICdNL0QnLFxyXG4gICAgY29sdW1uR2FwOiAnNHB4JyxcclxuICAgIHJvd0dhcDogJzRweCcsXHJcbiAgICBzZWxlY3RlZENvbG9yOiBjb2xvcnMuYmx1ZSxcclxuICAgIHVuc2VsZWN0ZWRDb2xvcjogY29sb3JzLnBhbGVCbHVlLFxyXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxyXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wc1R5cGUsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcclxuICAgIC8vIEFzIGxvbmcgYXMgdGhlIHVzZXIgaXNuJ3QgaW4gdGhlIHByb2Nlc3Mgb2Ygc2VsZWN0aW5nLCBhbGxvdyBwcm9wIGNoYW5nZXMgdG8gcmUtcG9wdWxhdGUgc2VsZWN0aW9uIHN0YXRlXHJcbiAgICBpZiAoc3RhdGUuc2VsZWN0aW9uU3RhcnQgPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4ucHJvcHMuc2VsZWN0aW9uXSxcclxuICAgICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG5cclxuICAvKiBcclxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXHJcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cclxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcclxuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxyXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcclxuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRlc1xyXG4gIH1cclxuICAqL1xyXG5cclxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xyXG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXHJcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cclxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcclxuXHJcbiAgICBwcm9wcy5yZW5kZXJpbmdEYXRlcy5mb3JFYWNoKHJlbmRlcmluZ0RhdGUgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cclxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBzdGFydE9mRGF5KHJlbmRlcmluZ0RhdGUpXHJcblxyXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8PSBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcclxuICAgICAgICAvLyDsi5zqsITsnbQgbWF4VGltZeydtOqzoCDssq3tgazqsIAgaG91cmx5Q2h1bmtz67O064ukIOyekeydhCDrlYzrp4wg67CY67O17ZWY7JesIG1heFRpbWXsnbQg7Y+s7ZWo65CY6rKMICjsnbTshKDtmLgg7LaU6rCAKVxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzICYmICEoaCA9PT0gcHJvcHMubWF4VGltZSAmJiBjID09PSBwcm9wcy5ob3VybHlDaHVua3MgLSAxKTsgYyArPSAxKSB7XHJcbiAgICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhjdXJyZW50RGF0ZSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZGF0ZXNcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wc1R5cGUpIHtcclxuICAgIHN1cGVyKHByb3BzKVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dLCAvLyBjb3B5IGl0IG92ZXJcclxuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcclxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGwsXHJcbiAgICAgIGlzVG91Y2hEcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzID0ge1xyXG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxyXG4gICAgICBzcXVhcmU6IHNlbGVjdGlvblNjaGVtZXMuc3F1YXJlXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmRTZWxlY3Rpb24gPSB0aGlzLmVuZFNlbGVjdGlvbi5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudC5iaW5kKHRoaXMpXHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXHJcbiAgICAvLyB0aGUgZGF0ZSBjZWxscyAoaW4gd2hpY2ggY2FzZSBub25lIG9mIHRoZSBEYXRlQ2VsbCdzIG9uTW91c2VVcCBoYW5kbGVycyB3b3VsZCBmaXJlKVxyXG4gICAgLy9cclxuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cclxuICAgIC8vIHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaC9kcmFnIHN0YXJ0ZWQgc28gaXQncyBhbHdheXMgY2F1Z2h0LlxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxyXG5cclxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXHJcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XHJcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxyXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xyXG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xyXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcclxuICAvLyBpZiB0aGUgZXZlbnQgaXMgYSBgdG91Y2htb3ZlYCBldmVudCBzaW5jZSBpdCdzIHRoZSBvbmx5IG9uZSB0aGF0IGhhcyBhIGB0b3VjaGVzYCBsaXN0LlxyXG4gIGdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwge1xyXG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxyXG4gICAgaWYgKCF0b3VjaGVzIHx8IHRvdWNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbFxyXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXHJcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxyXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmNlbGxUb0RhdGUuZ2V0KHRhcmdldEVsZW1lbnQpXHJcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxuXHJcbiAgZW5kU2VsZWN0aW9uKCkge1xyXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0KVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXHJcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgLy8gR2l2ZW4gYW4gZW5kaW5nIERhdGUsIGRldGVybWluZXMgYWxsIHRoZSBkYXRlcyB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBpbiB0aGlzIGRyYWZ0XHJcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XHJcbiAgICBjb25zdCB7IHNlbGVjdGlvblR5cGUsIHNlbGVjdGlvblN0YXJ0IH0gPSB0aGlzLnN0YXRlXHJcblxyXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxyXG5cclxuICAgIGxldCBuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+ID0gW11cclxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xyXG4gICAgICBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNjaGVtZUhhbmRsZXJzW3RoaXMucHJvcHMuc2VsZWN0aW9uU2NoZW1lXShcclxuICAgICAgICBzZWxlY3Rpb25TdGFydCxcclxuICAgICAgICBzZWxlY3Rpb25FbmQsXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5kYXRlc1xyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5leHREcmFmdCA9IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl1cclxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xyXG4gICAgICBuZXh0RHJhZnQgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLm5leHREcmFmdCwgLi4ubmV3U2VsZWN0aW9uXSkpXHJcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3Rpb25EcmFmdDogbmV4dERyYWZ0IH0sIGNhbGxiYWNrKVxyXG4gIH1cclxuXHJcbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcclxuICBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHN0YXJ0VGltZTogRGF0ZSkge1xyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXJ0VGltZSBjZWxsIGlzIHNlbGVjdGVkL3Vuc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZHJhZy1zZWxlY3Qgc2hvdWxkXHJcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcclxuICAgIGNvbnN0IHRpbWVTZWxlY3RlZCA9IHRoaXMucHJvcHMuc2VsZWN0aW9uLmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgc3RhcnRUaW1lKSlcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWxlY3Rpb25UeXBlOiB0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnLFxyXG4gICAgICBzZWxlY3Rpb25TdGFydDogc3RhcnRUaW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWU6IERhdGUpIHtcclxuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXHJcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcclxuICAgIC8vIGluIHRoaXMgc2NlbmFyaW8pXHJcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXHJcbiAgfVxyXG5cclxuICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZTogRGF0ZSkge1xyXG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxyXG4gICAgLy8gRG9uJ3QgY2FsbCB0aGlzLmVuZFNlbGVjdGlvbigpIGhlcmUgYmVjYXVzZSB0aGUgZG9jdW1lbnQgbW91c2V1cCBoYW5kbGVyIHdpbGwgZG8gaXRcclxuICB9XHJcblxyXG4gIGhhbmRsZVRvdWNoTW92ZUV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiB0cnVlIH0pXHJcbiAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxyXG4gICAgaWYgKGNlbGxUaW1lKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVUb3VjaEVuZEV2ZW50KCkge1xyXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVG91Y2hEcmFnZ2luZykge1xyXG4gICAgICAvLyBHb2luZyBkb3duIHRoaXMgYnJhbmNoIG1lYW5zIHRoZSB1c2VyIHRhcHBlZCBidXQgZGlkbid0IGRyYWcgLS0gd2hpY2hcclxuICAgICAgLy8gbWVhbnMgdGhlIGF2YWlsYWJpbGl0eSBkcmFmdCBoYXNuJ3QgeWV0IGJlZW4gdXBkYXRlZCAoc2luY2VcclxuICAgICAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQgd2FzIG5ldmVyIGNhbGxlZCkgc28gd2UgbmVlZCB0byBkbyBpdCBub3dcclxuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChudWxsLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogZmFsc2UgfSlcclxuICB9XHJcblxyXG4gIHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4odGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8R3JpZENlbGxcclxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxyXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxyXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxyXG4gICAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXHJcbiAgICAgICAgb25Nb3VzZURvd249e3N0YXJ0SGFuZGxlcn1cclxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcclxuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWUpXHJcbiAgICAgICAgfX1cclxuICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcclxuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXHJcbiAgICAgICAgfX1cclxuICAgICAgICAvLyBUb3VjaCBoYW5kbGVyc1xyXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcclxuICAgICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcclxuICAgICAgICAvLyBwYXJhbWV0ZXJzXHJcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XHJcbiAgICAgICAgb25Ub3VjaE1vdmU9e3RoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnR9XHJcbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50fVxyXG4gICAgICA+XHJcbiAgICAgICAge3RoaXMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQpfVxyXG4gICAgICA8L0dyaWRDZWxsPlxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xyXG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcclxuICAgICAgICB0aGlzLmNlbGxUb0RhdGUuc2V0KGRhdGVDZWxsLCB0aW1lKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgcmVmU2V0dGVyKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8RGF0ZUNlbGxcclxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cclxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxyXG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17dGhpcy5wcm9wcy5zZWxlY3RlZENvbG9yfVxyXG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnVuc2VsZWN0ZWRDb2xvcn1cclxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17dGhpcy5wcm9wcy5ob3ZlcmVkQ29sb3J9XHJcbiAgICAgICAgLz5cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHRoaXMucHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlckRhdGVMYWJlbCA9IChkYXRlOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZSwgdGhpcy5wcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlckZ1bGxEYXRlR3JpZCgpOiBBcnJheTxKU1guRWxlbWVudD4ge1xyXG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXHJcbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcclxuICAgIGNvbnN0IG51bVRpbWVzID0gdGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGhcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXMgLSAxOyBqICs9IDEpIHsgLy8gbnVtVGltZXMgLSAx7J2EIO2Gte2VtCDrp4jsp4Drp4kg7Iuc6rCE7J2AIOyFgCDsg53shLHtlZjsp4Ag7JWK6rKMICjsnbTshKDtmLgg7LaU6rCAKVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xyXG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2godGhpcy5zdGF0ZS5kYXRlc1tpXVtqXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0ZUdyaWRFbGVtZW50cyA9IGZsYXR0ZW5lZERhdGVzLm1hcCh0aGlzLnJlbmRlckRhdGVDZWxsV3JhcHBlcilcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXHJcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlLmRhdGVzWzBdW2ldXHJcbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XHJcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcclxuICAgICAgPGRpdiBrZXk9XCJ0b3BsZWZ0XCIgLz4sXHJcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcclxuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxyXG4gICAgICAgIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KVxyXG4gICAgICApLFxyXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxyXG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKVxyXG4gICAgXVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxXcmFwcGVyPlxyXG4gICAgICAgIDxHcmlkXHJcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cclxuICAgICAgICAgIHJvd3M9e3RoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RofVxyXG4gICAgICAgICAgY29sdW1uR2FwPXt0aGlzLnByb3BzLmNvbHVtbkdhcH1cclxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XHJcbiAgICAgICAgICByZWY9e2VsID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmlkUmVmID0gZWxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge3RoaXMucmVuZGVyRnVsbERhdGVHcmlkKCl9XHJcbiAgICAgICAgPC9HcmlkPlxyXG4gICAgICA8L1dyYXBwZXI+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdfQ==