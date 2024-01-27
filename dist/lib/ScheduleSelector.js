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

      for (let h = props.minTime; h < props.maxTime; h += 1) {
        for (let c = 0; c < props.hourlyChunks; c += 1) {
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

    for (let j = 0; j < numTimes; j += 1) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJEYXRlQ2VsbCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4IiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJyZW5kZXJpbmdEYXRlcyIsImZvckVhY2giLCJyZW5kZXJpbmdEYXRlIiwiY3VycmVudERheSIsImN1cnJlbnREYXRlIiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJjb25zb2xlIiwibG9nIiwiY29uc3RydWN0b3IiLCJjZWxsVG9EYXRlIiwiTWFwIiwiZ3JpZFJlZiIsInJlbmRlckRhdGVDZWxsV3JhcHBlciIsInRpbWUiLCJzdGFydEhhbmRsZXIiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwiQm9vbGVhbiIsImZpbmQiLCJhIiwidG9JU09TdHJpbmciLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwic2V0IiwicmVuZGVyVGltZUxhYmVsIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0Iiwic2VsZWN0aW9uVHlwZSIsImlzVG91Y2hEcmFnZ2luZyIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImVuZFNlbGVjdGlvbiIsImJpbmQiLCJjb21wb25lbnREaWRNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInZhbHVlIiwicGFzc2l2ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFRpbWVGcm9tVG91Y2hFdmVudCIsImV2ZW50IiwidG91Y2hlcyIsImxlbmd0aCIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjZWxsVGltZSIsImdldCIsIm9uQ2hhbmdlIiwic2V0U3RhdGUiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsImNhbGxiYWNrIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYiIsInN0YXJ0VGltZSIsInRpbWVTZWxlY3RlZCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtRGF5cyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50Iiwia2V5IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFD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LENBQWlCNkQsTUFENUI7QUFFRSxNQUFBLElBQUksRUFBRSxLQUFLakUsS0FBTCxDQUFXSSxLQUFYLENBQWlCLENBQWpCLEVBQW9CNkQsTUFGNUI7QUFHRSxNQUFBLFNBQVMsRUFBRSxLQUFLdkYsS0FBTCxDQUFXRyxTQUh4QjtBQUlFLE1BQUEsTUFBTSxFQUFFLEtBQUtILEtBQUwsQ0FBV0ksTUFKckI7QUFLRSxNQUFBLEdBQUcsRUFBRXdILEVBQUUsSUFBSTtBQUNULGFBQUs3RSxPQUFMLEdBQWU2RSxFQUFmO0FBQ0Q7QUFQSCxPQVNHLEtBQUtmLGtCQUFMLEVBVEgsQ0FERixDQURGO0FBZUQ7O0FBcFZpRjs7O0FBQS9EM0YsZ0IsQ0FZWjJHLFksR0FBbUM7QUFDeENwRyxFQUFBQSxTQUFTLEVBQUUsRUFENkI7QUFFeEMyRSxFQUFBQSxlQUFlLEVBQUUsUUFGdUI7QUFHeENXLEVBQUFBLE9BQU8sRUFBRSxDQUgrQjtBQUl4Q3pFLEVBQUFBLE9BQU8sRUFBRSxDQUorQjtBQUt4Q0MsRUFBQUEsT0FBTyxFQUFFLEVBTCtCO0FBTXhDUixFQUFBQSxZQUFZLEVBQUUsQ0FOMEI7QUFPeEM7QUFDQTtBQUNBQyxFQUFBQSxjQUFjLEVBQUUsRUFUd0I7QUFVeENpQyxFQUFBQSxVQUFVLEVBQUUsSUFWNEI7QUFXeENHLEVBQUFBLFVBQVUsRUFBRSxLQVg0QjtBQVl4Q2pFLEVBQUFBLFNBQVMsRUFBRSxLQVo2QjtBQWF4Q0MsRUFBQUEsTUFBTSxFQUFFLEtBYmdDO0FBY3hDSSxFQUFBQSxhQUFhLEVBQUVzSCxnQkFBT0MsSUFka0I7QUFleEN0SCxFQUFBQSxlQUFlLEVBQUVxSCxnQkFBT0UsUUFmZ0I7QUFnQnhDdEgsRUFBQUEsWUFBWSxFQUFFb0gsZ0JBQU9HLFNBaEJtQjtBQWlCeENuQyxFQUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFO0FBakJzQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJ1xuXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXG5pbXBvcnQgYWRkTWludXRlcyBmcm9tICdkYXRlLWZucy9hZGRfbWludXRlcydcbmltcG9ydCBhZGRIb3VycyBmcm9tICdkYXRlLWZucy9hZGRfaG91cnMnXG5pbXBvcnQgYWRkRGF5cyBmcm9tICdkYXRlLWZucy9hZGRfZGF5cydcbmltcG9ydCBzdGFydE9mRGF5IGZyb20gJ2RhdGUtZm5zL3N0YXJ0X29mX2RheSdcbmltcG9ydCBpc1NhbWVNaW51dGUgZnJvbSAnZGF0ZS1mbnMvaXNfc2FtZV9taW51dGUnXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5cbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuYFxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjx7IGNvbHVtbnM6IG51bWJlcjsgcm93czogbnVtYmVyOyBjb2x1bW5HYXA6IHN0cmluZzsgcm93R2FwOiBzdHJpbmcgfT5gXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5zfSwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLnJvd3N9LCAxZnIpO1xuICBjb2x1bW4tZ2FwOiAke3Byb3BzID0+IHByb3BzLmNvbHVtbkdhcH07XG4gIHJvdy1nYXA6ICR7cHJvcHMgPT4gcHJvcHMucm93R2FwfTtcbiAgd2lkdGg6IDEwMCU7XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gIHRvdWNoLWFjdGlvbjogbm9uZTtcbmBcblxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PHtcbiAgc2VsZWN0ZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG59PmBcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMjVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiAocHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yKX07XG5cbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICB9XG5gXG5cbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgfVxuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbmBcblxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgfVxuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tcmlnaHQ6IDRweDtcbmBcblxudHlwZSBQcm9wc1R5cGUgPSB7XG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cbiAgc2VsZWN0aW9uU2NoZW1lOiBTZWxlY3Rpb25TY2hlbWVUeXBlXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxuICAvL3N0YXJ0RGF0ZTogRGF0ZVxuICByZW5kZXJpbmdEYXRlczogRGF0ZVtdIC8vIOydtOyEoO2YuCDstpTqsIBcbiAgbnVtRGF5czogbnVtYmVyXG4gIG1pblRpbWU6IG51bWJlclxuICBtYXhUaW1lOiBudW1iZXJcbiAgaG91cmx5Q2h1bmtzOiBudW1iZXJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXG4gIHRpbWVGb3JtYXQ6IHN0cmluZ1xuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbnR5cGUgU3RhdGVUeXBlID0ge1xuICAvLyBJbiB0aGUgY2FzZSB0aGF0IGEgdXNlciBpcyBkcmFnLXNlbGVjdGluZywgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMucHJvcHMub25DaGFuZ2UoKSB1bnRpbCB0aGV5IGhhdmUgY29tcGxldGVkXG4gIC8vIHRoZSBkcmFnLXNlbGVjdC4gc2VsZWN0aW9uRHJhZnQgc2VydmVzIGFzIGEgdGVtcG9yYXJ5IGNvcHkgZHVyaW5nIGRyYWctc2VsZWN0cy5cbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGUgfCBudWxsXG4gIHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbFxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cbiAgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PlxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZVNlbGVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzVHlwZSwgU3RhdGVUeXBlPiB7XG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxuICBjZWxsVG9EYXRlOiBNYXA8RWxlbWVudCwgRGF0ZT4gPSBuZXcgTWFwKClcbiAgLy8gZG9jdW1lbnRNb3VzZVVwSGFuZGxlcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50OiAoZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY1RvdWNoRXZlbnQ8Kj4pID0+IHZvaWRcbiAgLy8gaGFuZGxlVG91Y2hFbmRFdmVudDogKCkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZU1vdXNlRW50ZXJFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgLy8gaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IFBhcnRpYWw8UHJvcHNUeXBlPiA9IHtcbiAgICBzZWxlY3Rpb246IFtdLFxuICAgIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gICAgbnVtRGF5czogNyxcbiAgICBtaW5UaW1lOiA5LFxuICAgIG1heFRpbWU6IDIzLFxuICAgIGhvdXJseUNodW5rczogMSxcbiAgICAvLyBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gICAgLy8g7J207ISg7Zi4IOy2lOqwgFxuICAgIHJlbmRlcmluZ0RhdGVzOiBbXSxcbiAgICB0aW1lRm9ybWF0OiAnaGEnLFxuICAgIGRhdGVGb3JtYXQ6ICdNL0QnLFxuICAgIGNvbHVtbkdhcDogJzRweCcsXG4gICAgcm93R2FwOiAnNHB4JyxcbiAgICBzZWxlY3RlZENvbG9yOiBjb2xvcnMuYmx1ZSxcbiAgICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcbiAgICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzOiBQcm9wc1R5cGUsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcbiAgICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIGlzbid0IGluIHRoZSBwcm9jZXNzIG9mIHNlbGVjdGluZywgYWxsb3cgcHJvcCBjaGFuZ2VzIHRvIHJlLXBvcHVsYXRlIHNlbGVjdGlvbiBzdGF0ZVxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnByb3BzLnNlbGVjdGlvbl0sXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qIFxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZXNcbiAgfVxuICAqL1xuXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gICAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuXG4gICAgcHJvcHMucmVuZGVyaW5nRGF0ZXMuZm9yRWFjaChyZW5kZXJpbmdEYXRlID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBzdGFydE9mRGF5KHJlbmRlcmluZ0RhdGUpXG5cbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhjdXJyZW50RGF0ZSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKGRhdGVzKVxuICAgIHJldHVybiBkYXRlc1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzVHlwZSkge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dLCAvLyBjb3B5IGl0IG92ZXJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbCxcbiAgICAgIGlzVG91Y2hEcmFnZ2luZzogZmFsc2UsXG4gICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICAgIGxpbmVhcjogc2VsZWN0aW9uU2NoZW1lcy5saW5lYXIsXG4gICAgICBzcXVhcmU6IHNlbGVjdGlvblNjaGVtZXMuc3F1YXJlXG4gICAgfVxuXG4gICAgdGhpcy5lbmRTZWxlY3Rpb24gPSB0aGlzLmVuZFNlbGVjdGlvbi5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50ID0gdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50LmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xuICAgIC8vIHRoZSBkYXRlIGNlbGxzIChpbiB3aGljaCBjYXNlIG5vbmUgb2YgdGhlIERhdGVDZWxsJ3Mgb25Nb3VzZVVwIGhhbmRsZXJzIHdvdWxkIGZpcmUpXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXG4gICAgLy8gdGhlIGVsZW1lbnQgd2hlcmUgdGhlIHRvdWNoL2RyYWcgc3RhcnRlZCBzbyBpdCdzIGFsd2F5cyBjYXVnaHQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZW5kU2VsZWN0aW9uKVxuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXG4gIC8vIGlmIHRoZSBldmVudCBpcyBhIGB0b3VjaG1vdmVgIGV2ZW50IHNpbmNlIGl0J3MgdGhlIG9ubHkgb25lIHRoYXQgaGFzIGEgYHRvdWNoZXNgIGxpc3QuXG4gIGdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwge1xuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcbiAgICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmNlbGxUb0RhdGUuZ2V0KHRhcmdldEVsZW1lbnQpXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgZW5kU2VsZWN0aW9uKCkge1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbFxuICAgIH0pXG4gIH1cblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0LFxuICAgICAgICBzZWxlY3Rpb25FbmQsXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXNcbiAgICAgIClcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXVxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3Rpb25EcmFmdDogbmV4dERyYWZ0IH0sIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25UeXBlOiB0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZTogRGF0ZSkge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gIH1cblxuICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZTogRGF0ZSkge1xuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxuICB9XG5cbiAgaGFuZGxlVG91Y2hNb3ZlRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiB0cnVlIH0pXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcbiAgICBpZiAoY2VsbFRpbWUpIHtcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICAvLyBHb2luZyBkb3duIHRoaXMgYnJhbmNoIG1lYW5zIHRoZSB1c2VyIHRhcHBlZCBidXQgZGlkbid0IGRyYWcgLS0gd2hpY2hcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXG4gICAgICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudCB3YXMgbmV2ZXIgY2FsbGVkKSBzbyB3ZSBuZWVkIHRvIGRvIGl0IG5vd1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChudWxsLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogZmFsc2UgfSlcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbih0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkQ2VsbFxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XG4gICAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VVcD17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnR9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICB0aGlzLmNlbGxUb0RhdGUuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIHJlZlNldHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERhdGVDZWxsXG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMudW5zZWxlY3RlZENvbG9yfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17dGhpcy5wcm9wcy5ob3ZlcmVkQ29sb3J9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCB0aGlzLnByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwoZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZSwgdGhpcy5wcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJGdWxsRGF0ZUdyaWQoKTogQXJyYXk8SlNYLkVsZW1lbnQ+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IHRoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RoXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lczsgaiArPSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKHRoaXMuc3RhdGUuZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAodGhpcy5yZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZS5kYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxuICAgICAgICBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5yZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSlcbiAgICAgICksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgICB0aGlzLmdyaWRSZWYgPSBlbFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgICAgPC9HcmlkPlxuICAgICAgPC9XcmFwcGVyPlxuICAgIClcbiAgfVxufVxuIl19