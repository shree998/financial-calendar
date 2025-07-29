import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, format,
  addDays, subDays, addWeeks, subWeeks, isSameMonth, isSameDay
} from 'date-fns';
import { Box } from '@mui/material';

import CalendarHeader from './CalendarHeader';
import CalendarCell from './CalendarCell';
import PeriodCell from './PeriodCell';
import { aggregateIntoWeeks, aggregateIntoMonthWithDaily } from '../../utils/dataProcessor';
import MonthlyView from './MonthlyView';


const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ dataMap, onItemClick, selectedRange }) => {
  const dailyGridRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('daily');
  const [focusedDate, setFocusedDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleCellClick = (data) => {
    if (!data) return;


    setFocusedDate(new Date(data.openTime));

    onItemClick(data);
  };


  const handleKeyDown = (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
      return;
    }

    e.preventDefault();
    setFocusedDate(currentFocusedDate => {
      let newFocusedDate = currentFocusedDate; // Start with the guaranteed latest date

      switch (e.key) {
        case 'ArrowRight': newFocusedDate = addDays(currentFocusedDate, 1); break;
        case 'ArrowLeft': newFocusedDate = subDays(currentFocusedDate, 1); break;
        case 'ArrowUp': newFocusedDate = subWeeks(currentFocusedDate, 1); break;
        case 'ArrowDown': newFocusedDate = addWeeks(currentFocusedDate, 1); break;
        case 'Enter':
          const dateKey = format(currentFocusedDate, 'yyyy-MM-dd');
          if (dataMap.has(dateKey)) {
            const dayData = dataMap.get(dateKey);

            const augmentedData = { ...dayData, periodType: 'Daily' };

            onItemClick(augmentedData);
          }
          return currentFocusedDate;
        default:
          return currentFocusedDate;
      }


      if (!isSameMonth(newFocusedDate, currentMonth)) {
        setCurrentMonth(newFocusedDate);
      }


      return newFocusedDate;
    });
  };

  useEffect(() => {

    if (view === 'daily' && dailyGridRef.current) {
      dailyGridRef.current.focus();
    }
  }, [view]);


  const dailyGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const weeklyData = useMemo(() => aggregateIntoWeeks(dataMap, currentMonth), [dataMap, currentMonth]);
  const monthlyData = useMemo(() => aggregateIntoMonthWithDaily(dataMap, currentMonth), [dataMap, currentMonth]);

  const renderView = () => {
    switch (view) {
      case 'weekly':
        return (
          <Box

            sx={{ display: 'flex', flexDirection: 'column', p: 1, outline: 'none' }}
          >
            {weeklyData.map((week, index) => (
              <PeriodCell key={index} periodData={week} onClick={onItemClick} />
            ))}
          </Box>
        );
      case 'monthly':
        return (
          <MonthlyView
            monthlyData={monthlyData}
            onMonthClick={onItemClick}
          />
        );
      case 'daily':
      default:
        return (
          <Box
            ref={dailyGridRef}
            tabIndex="0"

            onKeyDown={handleKeyDown}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              backgroundColor: 'divider',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}



          >
            {weekDays.map(day => (
              <Box
                key={day}

                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: 1,
                  backgroundColor: 'action.hover',
                }}
              >
                {day}
              </Box>
            ))}
            {dailyGrid.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayData = dataMap.get(dateKey);
              const augmentedData = dayData ? { ...dayData, periodType: 'Daily' } : null;
              return (
                <CalendarCell
                  key={day.toString()}
                  day={day}
                  data={augmentedData}
                  currentMonth={currentMonth}
                  onClick={handleCellClick}
                  selectedRange={selectedRange}
                  isFocused={isSameDay(day, focusedDate)}
                />
              );
            })}
          </Box>
        );
    }
  };

  return (
    <Box>
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        view={view}
        onViewChange={(newView) => setView(newView)}
      />
      <Box sx={{ minHeight: 500}} >
        {renderView()}
      </Box>
    </Box>
  );
};

export default Calendar;