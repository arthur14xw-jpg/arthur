import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Cpu, 
  LineChart, 
  Home, 
  Utensils, 
  Car, 
  HeartPulse, 
  Sparkles, 
  BookOpen, 
  FileText, 
  HelpCircle,
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search, 
  Filter, 
  SlidersHorizontal, 
  Calendar, 
  X, 
  Menu, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PieChart, 
  Landmark,
  FileSpreadsheet,
  Check,
  Building,
  RefreshCcw,
  ChevronDown
} from 'lucide-react';

const iconsMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  TrendingUp,
  Cpu,
  LineChart,
  Home,
  Utensils,
  Car,
  HeartPulse,
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Calendar,
  X,
  Menu,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChart,
  Landmark,
  FileSpreadsheet,
  Check,
  Building,
  RefreshCcw,
  ChevronDown
};

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function LucideIcon({ name, className = '', size = 18, strokeWidth = 2 }: LucideIconProps) {
  const IconComponent = iconsMap[name] || HelpCircle;
  return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />;
}
