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
    console.log(dates);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJEYXRlQ2VsbCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4IiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJyZW5kZXJpbmdEYXRlcyIsImZvckVhY2giLCJyZW5kZXJpbmdEYXRlIiwiY3VycmVudERheSIsImN1cnJlbnREYXRlIiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJjb25zb2xlIiwibG9nIiwiY29uc3RydWN0b3IiLCJjZWxsVG9EYXRlIiwiTWFwIiwiZ3JpZFJlZiIsInJlbmRlckRhdGVDZWxsV3JhcHBlciIsInRpbWUiLCJzdGFydEhhbmRsZXIiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwiQm9vbGVhbiIsImZpbmQiLCJhIiwidG9JU09TdHJpbmciLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwic2V0IiwicmVuZGVyVGltZUxhYmVsIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0Iiwic2VsZWN0aW9uVHlwZSIsImlzVG91Y2hEcmFnZ2luZyIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImVuZFNlbGVjdGlvbiIsImJpbmQiLCJjb21wb25lbnREaWRNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInZhbHVlIiwicGFzc2l2ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFRpbWVGcm9tVG91Y2hFdmVudCIsImV2ZW50IiwidG91Y2hlcyIsImxlbmd0aCIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjZWxsVGltZSIsImdldCIsIm9uQ2hhbmdlIiwic2V0U3RhdGUiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsImNhbGxiYWNrIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYiIsInN0YXJ0VGltZSIsInRpbWVTZWxlY3RlZCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtRGF5cyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50Iiwia2V5IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFD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LEVBQUUsTUFBTSxDQUFFO0FBakJzQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXHJcblxyXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXHJcbmltcG9ydCBhZGRNaW51dGVzIGZyb20gJ2RhdGUtZm5zL2FkZF9taW51dGVzJ1xyXG5pbXBvcnQgYWRkSG91cnMgZnJvbSAnZGF0ZS1mbnMvYWRkX2hvdXJzJ1xyXG5pbXBvcnQgYWRkRGF5cyBmcm9tICdkYXRlLWZucy9hZGRfZGF5cydcclxuaW1wb3J0IHN0YXJ0T2ZEYXkgZnJvbSAnZGF0ZS1mbnMvc3RhcnRfb2ZfZGF5J1xyXG5pbXBvcnQgaXNTYW1lTWludXRlIGZyb20gJ2RhdGUtZm5zL2lzX3NhbWVfbWludXRlJ1xyXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXHJcblxyXG5pbXBvcnQgeyBUZXh0LCBTdWJ0aXRsZSB9IGZyb20gJy4vdHlwb2dyYXBoeSdcclxuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcclxuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMnXHJcblxyXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbmBcclxuXHJcbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PHsgY29sdW1uczogbnVtYmVyOyByb3dzOiBudW1iZXI7IGNvbHVtbkdhcDogc3RyaW5nOyByb3dHYXA6IHN0cmluZyB9PmBcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5zfSwgMWZyKTtcclxuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMucm93c30sIDFmcik7XHJcbiAgY29sdW1uLWdhcDogJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5HYXB9O1xyXG4gIHJvdy1nYXA6ICR7cHJvcHMgPT4gcHJvcHMucm93R2FwfTtcclxuICB3aWR0aDogMTAwJTtcclxuYFxyXG5cclxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcclxuICBwbGFjZS1zZWxmOiBzdHJldGNoO1xyXG4gIHRvdWNoLWFjdGlvbjogbm9uZTtcclxuYFxyXG5cclxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PHtcclxuICBzZWxlY3RlZDogYm9vbGVhblxyXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xyXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcclxufT5gXHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiAyNXB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMuc2VsZWN0ZWRDb2xvciA6IHByb3BzLnVuc2VsZWN0ZWRDb2xvcil9O1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMuaG92ZXJlZENvbG9yfTtcclxuICB9XHJcbmBcclxuXHJcbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XHJcbiAgICBmb250LXNpemU6IDEycHg7XHJcbiAgfVxyXG4gIG1hcmdpbjogMDtcclxuICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcbmBcclxuXHJcbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxyXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xyXG4gICAgZm9udC1zaXplOiAxMHB4O1xyXG4gIH1cclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxuICBtYXJnaW46IDA7XHJcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XHJcbmBcclxuXHJcbnR5cGUgUHJvcHNUeXBlID0ge1xyXG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cclxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcclxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcclxuICAvL3N0YXJ0RGF0ZTogRGF0ZVxyXG4gIHJlbmRlcmluZ0RhdGVzOiBEYXRlW10gLy8g7J207ISg7Zi4IOy2lOqwgFxyXG4gIG51bURheXM6IG51bWJlclxyXG4gIG1pblRpbWU6IG51bWJlclxyXG4gIG1heFRpbWU6IG51bWJlclxyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXHJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXHJcbiAgdGltZUZvcm1hdDogc3RyaW5nXHJcbiAgY29sdW1uR2FwOiBzdHJpbmdcclxuICByb3dHYXA6IHN0cmluZ1xyXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcclxuICByZW5kZXJEYXRlQ2VsbD86IChkYXRldGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4sIHJlZlNldHRlcjogKGRhdGVDZWxsRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWQpID0+IEpTWC5FbGVtZW50XHJcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XHJcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XHJcbn1cclxuXHJcbnR5cGUgU3RhdGVUeXBlID0ge1xyXG4gIC8vIEluIHRoZSBjYXNlIHRoYXQgYSB1c2VyIGlzIGRyYWctc2VsZWN0aW5nLCB3ZSBkb24ndCB3YW50IHRvIGNhbGwgdGhpcy5wcm9wcy5vbkNoYW5nZSgpIHVudGlsIHRoZXkgaGF2ZSBjb21wbGV0ZWRcclxuICAvLyB0aGUgZHJhZy1zZWxlY3QuIHNlbGVjdGlvbkRyYWZ0IHNlcnZlcyBhcyBhIHRlbXBvcmFyeSBjb3B5IGR1cmluZyBkcmFnLXNlbGVjdHMuXHJcbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XHJcbiAgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSB8IG51bGxcclxuICBzZWxlY3Rpb25TdGFydDogRGF0ZSB8IG51bGxcclxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cclxuICBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wc1R5cGUsIFN0YXRlVHlwZT4ge1xyXG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxyXG4gIGNlbGxUb0RhdGU6IE1hcDxFbGVtZW50LCBEYXRlPiA9IG5ldyBNYXAoKVxyXG4gIC8vIGRvY3VtZW50TW91c2VVcEhhbmRsZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxyXG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XHJcbiAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQ6IChldmVudDogUmVhY3QuU3ludGhldGljVG91Y2hFdmVudDwqPikgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZVRvdWNoRW5kRXZlbnQ6ICgpID0+IHZvaWRcclxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgLy8gaGFuZGxlTW91c2VFbnRlckV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxyXG5cclxuICBzdGF0aWMgZGVmYXVsdFByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7XHJcbiAgICBzZWxlY3Rpb246IFtdLFxyXG4gICAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcclxuICAgIG51bURheXM6IDcsXHJcbiAgICBtaW5UaW1lOiA5LFxyXG4gICAgbWF4VGltZTogMjMsXHJcbiAgICBob3VybHlDaHVua3M6IDEsXHJcbiAgICAvLyBzdGFydERhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAvLyDsnbTshKDtmLgg7LaU6rCAXHJcbiAgICByZW5kZXJpbmdEYXRlczogW10sXHJcbiAgICB0aW1lRm9ybWF0OiAnaGEnLFxyXG4gICAgZGF0ZUZvcm1hdDogJ00vRCcsXHJcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxyXG4gICAgcm93R2FwOiAnNHB4JyxcclxuICAgIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxyXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXHJcbiAgICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXHJcbiAgICBvbkNoYW5nZTogKCkgPT4ge31cclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHM6IFByb3BzVHlwZSwgc3RhdGU6IFN0YXRlVHlwZSk6IFBhcnRpYWw8U3RhdGVUeXBlPiB8IG51bGwge1xyXG4gICAgLy8gQXMgbG9uZyBhcyB0aGUgdXNlciBpc24ndCBpbiB0aGUgcHJvY2VzcyBvZiBzZWxlY3RpbmcsIGFsbG93IHByb3AgY2hhbmdlcyB0byByZS1wb3B1bGF0ZSBzZWxlY3Rpb24gc3RhdGVcclxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi5wcm9wcy5zZWxlY3Rpb25dLFxyXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIC8qIFxyXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcclxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxyXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxyXG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcclxuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXHJcbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xyXG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGVzXHJcbiAgfVxyXG4gICovXHJcblxyXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XHJcbiAgICAvLyBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcclxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxyXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxyXG5cclxuICAgIHByb3BzLnJlbmRlcmluZ0RhdGVzLmZvckVhY2gocmVuZGVyaW5nRGF0ZSA9PiB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxyXG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHN0YXJ0T2ZEYXkocmVuZGVyaW5nRGF0ZSlcclxuXHJcbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDw9IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xyXG4gICAgICAgIC8vIOyLnOqwhOydtCBtYXhUaW1l7J206rOgIOyyre2BrOqwgCBob3VybHlDaHVua3Prs7Tri6Qg7J6R7J2EIOuVjOunjCDrsJjrs7XtlZjsl6wgbWF4VGltZeydtCDtj6ztlajrkJjqsowgKOydtOyEoO2YuCDstpTqsIApXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3MgJiYgIShoID09PSBwcm9wcy5tYXhUaW1lICYmIGMgPT09IHByb3BzLmhvdXJseUNodW5rcyAtIDEpOyBjICs9IDEpIHtcclxuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGN1cnJlbnREYXRlLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxyXG4gICAgfSlcclxuICAgIGNvbnNvbGUubG9nKGRhdGVzKVxyXG4gICAgcmV0dXJuIGRhdGVzXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNUeXBlKSB7XHJcbiAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXSwgLy8gY29weSBpdCBvdmVyXHJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXHJcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxyXG4gICAgICBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcclxuICAgICAgbGluZWFyOiBzZWxlY3Rpb25TY2hlbWVzLmxpbmVhcixcclxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5kU2VsZWN0aW9uID0gdGhpcy5lbmRTZWxlY3Rpb24uYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQuYmluZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgZW5kU2VsZWN0aW9uIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCBpdHNlbGYgaW4gb3JkZXJcclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xyXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcclxuICAgIC8vXHJcbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXHJcbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcclxuXHJcbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xyXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xyXG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcclxuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcclxuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIFBlcmZvcm1zIGEgbG9va3VwIGludG8gdGhpcy5jZWxsVG9EYXRlIHRvIHJldHJpZXZlIHRoZSBEYXRlIHRoYXQgY29ycmVzcG9uZHMgdG9cclxuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXHJcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cclxuICBnZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQ8YW55Pik6IERhdGUgfCBudWxsIHtcclxuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcclxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcclxuICAgIGNvbnN0IHsgY2xpZW50WCwgY2xpZW50WSB9ID0gdG91Y2hlc1swXVxyXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcclxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5jZWxsVG9EYXRlLmdldCh0YXJnZXRFbGVtZW50KVxyXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIGVuZFNlbGVjdGlvbigpIHtcclxuICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdClcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxyXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxyXG4gIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHNlbGVjdGlvbkVuZDogRGF0ZSB8IG51bGwsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xyXG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxyXG5cclxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSBudWxsIHx8IHNlbGVjdGlvblN0YXJ0ID09PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICBsZXQgbmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPiA9IFtdXHJcbiAgICBpZiAoc2VsZWN0aW9uU3RhcnQgJiYgc2VsZWN0aW9uRW5kICYmIHNlbGVjdGlvblR5cGUpIHtcclxuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXHJcbiAgICAgICAgc2VsZWN0aW9uU3RhcnQsXHJcbiAgICAgICAgc2VsZWN0aW9uRW5kLFxyXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXNcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dXHJcbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxyXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xyXG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0aW9uRHJhZnQ6IG5leHREcmFmdCB9LCBjYWxsYmFjaylcclxuICB9XHJcblxyXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XHJcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcclxuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxyXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXHJcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VsZWN0aW9uVHlwZTogdGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJyxcclxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lOiBEYXRlKSB7XHJcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xyXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXHJcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxyXG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWU6IERhdGUpIHtcclxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcclxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XHJcbiAgfVxyXG5cclxuICBoYW5kbGVUb3VjaE1vdmVFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogdHJ1ZSB9KVxyXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcclxuICAgIGlmIChjZWxsVGltZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcclxuICAgIGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoRHJhZ2dpbmcpIHtcclxuICAgICAgLy8gR29pbmcgZG93biB0aGlzIGJyYW5jaCBtZWFucyB0aGUgdXNlciB0YXBwZWQgYnV0IGRpZG4ndCBkcmFnIC0tIHdoaWNoXHJcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXHJcbiAgICAgIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50IHdhcyBuZXZlciBjYWxsZWQpIHNvIHdlIG5lZWQgdG8gZG8gaXQgbm93XHJcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbCwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcclxuICAgIH1cclxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlIH0pXHJcbiAgfVxyXG5cclxuICByZW5kZXJEYXRlQ2VsbFdyYXBwZXIgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcclxuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHRpbWUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBCb29sZWFuKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCB0aW1lKSkpXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEdyaWRDZWxsXHJcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcclxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcclxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cclxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xyXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XHJcbiAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxyXG4gICAgICAgIH19XHJcbiAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxyXG4gICAgICAgIH19XHJcbiAgICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcclxuICAgICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXHJcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XHJcbiAgICAgICAgLy8gcGFyYW1ldGVyc1xyXG4gICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIYW5kbGVyfVxyXG4gICAgICAgIG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50fVxyXG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmRFdmVudH1cclxuICAgICAgPlxyXG4gICAgICAgIHt0aGlzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cclxuICAgICAgPC9HcmlkQ2VsbD5cclxuICAgIClcclxuICB9XHJcblxyXG4gIHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcclxuICAgICAgaWYgKGRhdGVDZWxsKSB7XHJcbiAgICAgICAgdGhpcy5jZWxsVG9EYXRlLnNldChkYXRlQ2VsbCwgdGltZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIHJlZlNldHRlcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPERhdGVDZWxsXHJcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XHJcbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cclxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cclxuICAgICAgICAgIHVuc2VsZWN0ZWRDb2xvcj17dGhpcy5wcm9wcy51bnNlbGVjdGVkQ29sb3J9XHJcbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCB0aGlzLnByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcclxuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwoZGF0ZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXREYXRlKGRhdGUsIHRoaXMucHJvcHMuZGF0ZUZvcm1hdCl9PC9EYXRlTGFiZWw+XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXJGdWxsRGF0ZUdyaWQoKTogQXJyYXk8SlNYLkVsZW1lbnQ+IHtcclxuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxyXG4gICAgY29uc3QgbnVtRGF5cyA9IHRoaXMuc3RhdGUuZGF0ZXMubGVuZ3RoXHJcbiAgICBjb25zdCBudW1UaW1lcyA9IHRoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RoXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzIC0gMTsgaiArPSAxKSB7IC8vIG51bVRpbWVzIC0gMeydhCDthrXtlbQg66eI7KeA66eJIOyLnOqwhOydgCDshYAg7IOd7ISx7ZWY7KeAIOyViuqyjCAo7J207ISg7Zi4IOy2lOqwgClcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcclxuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKHRoaXMuc3RhdGUuZGF0ZXNbaV1bal0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAodGhpcy5yZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRpbWVzOyBpICs9IDEpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xyXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZS5kYXRlc1swXVtpXVxyXG4gICAgICAvLyBJbmplY3QgdGhlIHRpbWUgbGFiZWwgYXQgdGhlIHN0YXJ0IG9mIGV2ZXJ5IHJvd1xyXG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHRoaXMucmVuZGVyVGltZUxhYmVsKHRpbWUpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXHJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxyXG4gICAgICAvLyBUb3Agcm93IG9mIGRhdGVzXHJcbiAgICAgIC4uLnRoaXMuc3RhdGUuZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT5cclxuICAgICAgICBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5yZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSlcclxuICAgICAgKSxcclxuICAgICAgLy8gRXZlcnkgcm93IGFmdGVyIHRoYXRcclxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcclxuICAgIF1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8V3JhcHBlcj5cclxuICAgICAgICA8R3JpZFxyXG4gICAgICAgICAgY29sdW1ucz17dGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGh9XHJcbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cclxuICAgICAgICAgIGNvbHVtbkdhcD17dGhpcy5wcm9wcy5jb2x1bW5HYXB9XHJcbiAgICAgICAgICByb3dHYXA9e3RoaXMucHJvcHMucm93R2FwfVxyXG4gICAgICAgICAgcmVmPXtlbCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JpZFJlZiA9IGVsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHt0aGlzLnJlbmRlckZ1bGxEYXRlR3JpZCgpfVxyXG4gICAgICAgIDwvR3JpZD5cclxuICAgICAgPC9XcmFwcGVyPlxyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iXX0=