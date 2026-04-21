import {  Clock, CheckCircle,  TrendingUp, BookOpen, Target } from "lucide-react"

type DashboardCard = {
    id: number
    label: string
    value: number
    icon: React.ReactNode
    color: string
    trend?: string
  }

  type StatsProps = {
    stats: {
      total: number
      pending: number
      inProgress: number
      submitted: number
    }
  }
  
 
export default function Stats ({stats}: StatsProps) {

    const cards: DashboardCard[] = [
        { 
          id: 1, 
          label: "Total Assignments", 
          value: stats.total,
          icon: <BookOpen className="w-5 h-5" />,
          color: "bg-blue-500",
          trend: "+12% from last month"
        },
        { 
          id: 2, 
          label: "Pending", 
          value: stats.pending,
          icon: <Clock className="w-5 h-5" />,
          color: "bg-yellow-500",
          trend: "3 due this week"
        },
        { 
          id: 3, 
          label: "In Progress", 
          value: stats.inProgress,
          icon: <Target className="w-5 h-5" />,
          color: "bg-purple-500",
          trend: "2 active now"
        },
        { 
          id: 4, 
          label: "Submitted", 
          value: stats.submitted,
          icon: <CheckCircle className="w-5 h-5" />,
          color: "bg-green-500",
          trend: "+8 this month"
        },
      ]
    
     
    return (
        <div>
             {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-hover bg-card rounded-xl p-6 border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${card.color} bg-opacity-10`}>
                <div className={`${card.color.replace('bg-', 'text-')}`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </div>
            {card.trend && (
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                {card.trend}
              </div>
            )}
          </div>
        ))}
      </div>
        </div>
    )
}