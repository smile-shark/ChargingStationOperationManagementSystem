import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useCountUp';
import { useEffect, useState } from 'react';

interface CardProps {
  title: string;
  value: number;
  growth: number;
  icon?: string;
  onClick?: () => void;
}

export function Card({ title, value, growth, icon, onClick }: CardProps) {
  const isPositive = growth >= 0;
  const [isMounted, setIsMounted] = useState(false);
  const animatedValue = useCountUp(isMounted ? value : 0, 1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div 
      className={cn(
        "bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all",
        onClick && "cursor-pointer hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && (
          <i className={`fas fa-${icon} text-blue-500 text-xl mr-3`}></i>
        )}
        <h3 className="text-gray-500 text-sm">{title}</h3>
      </div>
      <div className="flex items-end mt-2">
        <span className="text-2xl font-bold">{animatedValue}</span>
        <span className={cn(
          'ml-2 text-sm',
          isPositive ? 'text-green-500' : 'text-red-500'
        )}>
          {isPositive ? '+' : ''}{growth}%
        </span>
      </div>
    </div>
  );
}