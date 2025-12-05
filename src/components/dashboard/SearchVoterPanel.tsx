import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import VoterTable from './VoterTable';
import { Voter } from '@/types/election';

interface SearchVoterPanelProps {
  voters: Voter[];
}

const SearchVoterPanel = ({ voters }: SearchVoterPanelProps) => {
  const [keyword, setKeyword] = useState('');
  const [ward, setWard] = useState('all');
  const [gender, setGender] = useState('all');

  const wardOptions = useMemo(() => {
    const unique = new Map<string, string>();
    voters.forEach((voter) => {
      if (!unique.has(voter.wardNo)) {
        unique.set(voter.wardNo, voter.wardName);
      }
    });
    return Array.from(unique.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [voters]);

  const filteredVoters = useMemo(() => {
    return voters.filter((voter) => {
      if (keyword) {
        const term = keyword.toLowerCase();
        const matchesKeyword =
          voter.name.toLowerCase().includes(term) ||
          voter.voterId.toLowerCase().includes(term) ||
          voter.cardNo.toLowerCase().includes(term) ||
          (voter.phoneNo?.toLowerCase().includes(term) ?? false);
        if (!matchesKeyword) return false;
      }

      if (ward !== 'all' && voter.wardNo !== ward) return false;
      if (gender !== 'all' && voter.gender.toLowerCase() !== gender) return false;

      return true;
    });
  }, [keyword, ward, gender, voters]);

  const handleReset = () => {
    setKeyword('');
    setWard('all');
    setGender('all');
  };

  return (
    <section className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="keyword">Search by name, voter ID or phone</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="keyword"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Start typing to search quickly..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ward</Label>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger>
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All wards</SelectItem>
                {wardOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} (Ward {option.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset filters
            </Button>
            <Button type="button" variant="secondary" disabled>
              Showing {filteredVoters.length} of {voters.length} voters
            </Button>
          </div>
        </div>
      </div>

      <VoterTable voters={filteredVoters} title="Voter Search Results" />
    </section>
  );
};

export default SearchVoterPanel;
