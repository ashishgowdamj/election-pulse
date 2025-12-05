import { ReactNode, useMemo, useState } from 'react';
import { Voter } from '@/types/election';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Columns3, User } from 'lucide-react';

type ColumnConfig = {
  id: string;
  label: string;
  defaultVisible?: boolean;
  alwaysVisible?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  render: (voter: Voter) => ReactNode;
};

const columnConfigs: ColumnConfig[] = [
  {
    id: 'slNo',
    label: 'Sl.No',
    alwaysVisible: true,
    headerClassName: 'w-12',
    cellClassName: 'font-medium',
    render: (voter) => voter.slNo,
  },
  {
    id: 'cardNo',
    label: 'Card No.',
    defaultVisible: true,
    render: (voter) => voter.cardNo,
  },
  {
    id: 'name',
    label: 'Name',
    defaultVisible: true,
    cellClassName: 'font-medium',
    render: (voter) => voter.name,
  },
  {
    id: 'age',
    label: 'Age',
    defaultVisible: true,
    headerClassName: 'w-16',
    render: (voter) => voter.age,
  },
  {
    id: 'ward',
    label: 'Ward',
    defaultVisible: true,
    render: (voter) => (
      <span>
        {voter.wardName} ({voter.wardNo})
      </span>
    ),
  },
  {
    id: 'voterId',
    label: 'Voter ID',
    defaultVisible: true,
    cellClassName: 'font-mono text-xs',
    render: (voter) => voter.voterId,
  },
  {
    id: 'phone',
    label: 'Phone No.',
    defaultVisible: true,
    render: (voter) => voter.phoneNo || '-',
  },
  {
    id: 'gender',
    label: 'Gender',
    render: (voter) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          voter.gender === 'Male'
            ? 'bg-stat-blue/20 text-stat-blue'
            : voter.gender === 'Female'
            ? 'bg-stat-green/20 text-stat-green'
            : 'bg-stat-orange/20 text-stat-orange'
        }`}
      >
        {voter.gender}
      </span>
    ),
  },
  {
    id: 'address',
    label: 'New Address',
    render: (voter) => <span className="max-w-[240px] truncate inline-block">{voter.newAddress}</span>,
  },
  {
    id: 'photo',
    label: 'Photo',
    headerClassName: 'w-20',
    render: () => (
      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
        <User className="w-5 h-5 text-muted-foreground" />
      </div>
    ),
  },
];

interface VoterTableProps {
  voters: Voter[];
  title?: string;
}

const defaultVisibleColumnIds = columnConfigs
  .filter((column) => column.defaultVisible || column.alwaysVisible)
  .map((column) => column.id);

const VoterTable = ({ voters, title = 'Voters Data' }: VoterTableProps) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumnIds);

  const activeColumns = useMemo(
    () => columnConfigs.filter((column) => visibleColumns.includes(column.id) || column.alwaysVisible),
    [visibleColumns]
  );

  const handleColumnToggle = (columnId: string, nextChecked: boolean) => {
    const column = columnConfigs.find((col) => col.id === columnId);
    if (!column || column.alwaysVisible) {
      return;
    }
    setVisibleColumns((previous) => {
      const withoutDuplicates = new Set(previous);
      if (nextChecked) {
        withoutDuplicates.add(columnId);
      } else {
        withoutDuplicates.delete(columnId);
      }
      return Array.from(withoutDuplicates);
    });
  };

  const checkedState = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-card-foreground">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 border-border"
            >
              <Columns3 className="h-4 w-4" />
              <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {columnConfigs.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.alwaysVisible || checkedState.has(column.id)}
                onCheckedChange={(checked) => handleColumnToggle(column.id, Boolean(checked))}
                disabled={column.alwaysVisible}
              >
                <span className="flex-1">{column.label}</span>
                {column.alwaysVisible && <span className="text-[11px] text-muted-foreground">Required</span>}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {activeColumns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {voters.map((voter) => (
              <TableRow key={`${voter.voterId}-${voter.slNo}`} className="hover:bg-muted/30">
                {activeColumns.map((column) => (
                  <TableCell key={column.id} className={column.cellClassName}>
                    {column.render(voter)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VoterTable;
