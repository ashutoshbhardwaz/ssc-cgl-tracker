'use client';

import { useStudyStore } from '@/lib/store';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { Flame } from 'lucide-react';

interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-4 for color intensity
}

export default function Heatmap() {
  const { subjects } = useStudyStore();

  // Generate activity data from completedAt timestamps
  const generateActivityData = (): ActivityData[] => {
    const activityMap = new Map<string, number>();
    const days = 365; // Show last year

    // Initialize all days with 0 count
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      activityMap.set(date, 0);
    }

    // Count completions per day
    Object.values(subjects).forEach((subjectProgress) => {
      Object.values(subjectProgress).forEach((lecture) => {
        if (lecture.completedAt) {
          const date = format(parseISO(lecture.completedAt), 'yyyy-MM-dd');
          activityMap.set(date, (activityMap.get(date) || 0) + 1);
        }
      });
    });

    // Convert to array and calculate levels
    const data: ActivityData[] = Array.from(activityMap.entries())
      .map(([date, count]) => {
        let level = 0;
        if (count > 0) level = 1;
        if (count >= 2) level = 2;
        if (count >= 4) level = 3;
        if (count >= 6) level = 4;

        return { date, count, level };
      })
      .reverse(); // Show oldest to newest

    return data;
  };

  const activityData = generateActivityData();
  
  // Calculate current streak
  const calculateCurrentStreak = (): number => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const dayActivity = activityData.find(d => d.date === dateStr);
      
      if (dayActivity && dayActivity.count > 0) {
        streak++;
      } else if (i > 0) { // Allow today to have no activity
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateCurrentStreak();
  const totalCompletions = activityData.reduce((sum, day) => sum + day.count, 0);

  // Group by weeks for display
  const weeks: ActivityData[][] = [];
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7));
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-slate-800';
      case 1:
        return 'bg-emerald-900';
      case 2:
        return 'bg-emerald-700';
      case 3:
        return 'bg-emerald-500';
      case 4:
        return 'bg-emerald-400';
      default:
        return 'bg-slate-800';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Study Consistency</h3>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{currentStreak}</div>
            <div className="text-slate-400">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalCompletions}</div>
            <div className="text-slate-400">Total Completed</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Month labels */}
          <div className="flex flex-col gap-1 mr-2">
            <div className="h-3"></div>
            {weeks.map((_, weekIndex) => {
              const dayData = weeks[weekIndex][0];
              const monthIndex = parseInt(dayData.date.split('-')[1]) - 1;
              const showMonth = weekIndex === 0 || (weekIndex > 0 && parseInt(weeks[weekIndex - 1][0].date.split('-')[1]) !== monthIndex + 1);
              
              return showMonth ? (
                <div key={weekIndex} className="h-3 text-xs text-slate-400" style={{ marginTop: weekIndex % 4 === 0 ? '12px' : '0' }}>
                  {months[monthIndex]}
                </div>
              ) : (
                <div key={weekIndex} className="h-3"></div>
              );
            })}
          </div>

          {/* Activity grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} transition-all hover:scale-125 cursor-pointer`}
                    title={`${day.date}: ${day.count} completions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
