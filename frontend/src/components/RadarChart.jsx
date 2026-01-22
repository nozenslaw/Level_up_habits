import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { calculateLevelFromTotalXP } from '../hooks/useRPG';

export const RadarChart = ({ stats, className }) => {
  const { isDark } = useTheme();

  const data = stats.map(stat => ({
    name: stat.name,
    value: calculateLevelFromTotalXP(stat.xp).level,
    fullMark: 100,
    color: stat.color
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg px-3 py-2 shadow-lg">
          <p className="font-semibold" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Niveau {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className} data-testid="radar-chart">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid 
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="name"
            tick={{ 
              fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', 
              fontSize: 12,
              fontWeight: 500
            }}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="#00F0FF"
            fill="#00F0FF"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: '#00F0FF',
              strokeWidth: 2,
              stroke: isDark ? '#050505' : '#FAFAFA'
            }}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.5))'
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
