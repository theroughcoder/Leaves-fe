import React, { Fragment, useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import type { View } from 'react-big-calendar'
import './index.scss';
// @ts-ignore
import events from '../../data/events'

// Note that the dayjsLocalizer extends Day.js with the following plugins:
// - IsBetween
// - IsSameOrAfter
// - IsSameOrBefore
// - LocaleData
// - LocalizedFormat
// - MinMax
// - UTC

// add optional time zone support
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(timezone)

const djLocalizer = dayjsLocalizer(dayjs)

const ColoredDateCellWrapper = ({ children }: { children: React.ReactElement }) => {
  const child = React.Children.only(children) as React.ReactElement<any>
  return React.cloneElement(child, {
    style: {
      ...child.props.style,
      backgroundColor: 'lightblue',
    },
  })
}

// Custom toolbar component that returns null to hide the default toolbar
const CustomToolbar = () => null

interface DayjsProps {
  view?: View;
  onViewChange?: (view: View) => void;
  date?: Date;
  onNavigate?: (date: Date) => void;
  [key: string]: any;
}

export default function Dayjs({ view: externalView, onViewChange, date: externalDate, onNavigate: externalOnNavigate, ...props }: DayjsProps) {
  const [internalDate, setInternalDate] = useState<Date>(new Date())
  const [internalView, setInternalView] = useState<View>(Views.MONTH)

  // Use external props if provided, otherwise use internal state
  const currentView = externalView !== undefined ? externalView : internalView
  const currentDate = externalDate !== undefined ? externalDate : internalDate

  const onNavigate = useCallback((newDate: Date) => {
    if (externalOnNavigate) {
      externalOnNavigate(newDate)
    } else {
      setInternalDate(newDate)
    }
  }, [externalOnNavigate])

  const onView = useCallback((newView: View) => {
    if (onViewChange) {
      onViewChange(newView)
    } else {
      setInternalView(newView)
    }
  }, [onViewChange])

  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper as React.ComponentType<any>,
        toolbar: CustomToolbar,
      },
      defaultDate: new Date(),
      max: dayjs().endOf('day').subtract(1, 'hours').toDate(),
      views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
    }),
    []
  )

  return (
    <Fragment>      
      <div className="calender" {...props}>
        <Calendar
          components={components}
          date={currentDate}
          defaultDate={defaultDate}
          events={events}
          localizer={djLocalizer}
          max={max}
          onNavigate={onNavigate}
          onView={onView}
          showMultiDayTimes
          step={60}
          view={currentView}
          views={views}
          popup
          popupOffset={30}
        />
      </div>
    </Fragment>
  )
}   
