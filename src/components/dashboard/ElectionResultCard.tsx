import { ElectionResult } from '@/types/election';
import { Trophy } from 'lucide-react';

interface ElectionResultCardProps {
  result: ElectionResult;
}

const ElectionResultCard = ({ result }: ElectionResultCardProps) => {
  return (
    <div className="stat-card-teal rounded-lg p-4 text-primary-foreground shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5" />
        <h3 className="font-heading font-semibold">Election Result-{result.year}</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="opacity-80">WINNER :</span>
          <span className="font-medium">{result.winner}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">PARTY :</span>
          <span className="font-medium">{result.party}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">TOTAL VOTES :</span>
          <span className="font-medium">{result.totalVotes.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">WIN MARGIN :</span>
          <span className="font-medium">{result.marginPercentage}%</span>
        </div>
        
        <div className="border-t border-primary-foreground/20 my-2 pt-2">
          <div className="flex justify-between">
            <span className="opacity-80">MALE VOTER :</span>
            <span className="font-medium">{result.maleVoter.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">FEMALE VOTER :</span>
            <span className="font-medium">{result.femaleVoter.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">OTHER VOTER :</span>
            <span className="font-medium">{result.otherVoter}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">POLLING PERCENTAGE :</span>
            <span className="font-medium">{result.pollingPercentage}%</span>
          </div>
        </div>
        
        <button className="w-full mt-2 py-1.5 bg-primary-foreground/20 rounded text-xs hover:bg-primary-foreground/30 transition-colors">
          View More...
        </button>
      </div>
    </div>
  );
};

export default ElectionResultCard;
