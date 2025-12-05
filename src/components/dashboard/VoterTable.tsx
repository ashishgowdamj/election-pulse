import { Voter } from '@/types/election';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from 'lucide-react';

interface VoterTableProps {
  voters: Voter[];
  title?: string;
}

const VoterTable = ({ voters, title = 'Voter Registry' }: VoterTableProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-card-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">Sl.No</TableHead>
              <TableHead>Card No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-16">Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>New Address</TableHead>
              <TableHead>Voter ID</TableHead>
              <TableHead>Phone No.</TableHead>
              <TableHead className="w-20">Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voters.map((voter) => (
              <TableRow key={voter.slNo} className="hover:bg-muted/30">
                <TableCell className="font-medium">{voter.slNo}</TableCell>
                <TableCell>{voter.cardNo}</TableCell>
                <TableCell className="font-medium">{voter.name}</TableCell>
                <TableCell>{voter.age}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    voter.gender === 'Male' 
                      ? 'bg-stat-blue/20 text-stat-blue' 
                      : voter.gender === 'Female'
                      ? 'bg-stat-green/20 text-stat-green'
                      : 'bg-stat-orange/20 text-stat-orange'
                  }`}>
                    {voter.gender}
                  </span>
                </TableCell>
                <TableCell>{voter.wardName} ({voter.wardNo})</TableCell>
                <TableCell className="max-w-[200px] truncate">{voter.newAddress}</TableCell>
                <TableCell className="font-mono text-xs">{voter.voterId}</TableCell>
                <TableCell>{voter.phoneNo || '-'}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VoterTable;
