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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Columns3, Download, User } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ColumnConfig = {
  id: string;
  label: string;
  defaultVisible?: boolean;
  alwaysVisible?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  render: (voter: Voter) => ReactNode;
  exportValue?: (voter: Voter) => string | number;
};

const columnConfigs: ColumnConfig[] = [
  {
    id: 'slNo',
    label: 'Sl.No',
    alwaysVisible: true,
    headerClassName: 'w-12',
    cellClassName: 'font-medium',
    render: (voter) => voter.slNo,
    exportValue: (voter) => voter.slNo,
  },
  {
    id: 'cardNo',
    label: 'Card No.',
    defaultVisible: true,
    render: (voter) => voter.cardNo,
    exportValue: (voter) => voter.cardNo,
  },
  {
    id: 'name',
    label: 'Name',
    defaultVisible: true,
    cellClassName: 'font-medium',
    render: (voter) => voter.name,
    exportValue: (voter) => voter.name,
  },
  {
    id: 'age',
    label: 'Age',
    defaultVisible: true,
    headerClassName: 'w-16',
    render: (voter) => voter.age,
    exportValue: (voter) => voter.age,
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
    exportValue: (voter) => `${voter.wardName} (${voter.wardNo})`,
  },
  {
    id: 'voterId',
    label: 'Voter ID',
    defaultVisible: true,
    cellClassName: 'font-mono text-xs',
    render: (voter) => voter.voterId,
    exportValue: (voter) => voter.voterId,
  },
  {
    id: 'phone',
    label: 'Phone No.',
    defaultVisible: true,
    render: (voter) => voter.phoneNo || '-',
    exportValue: (voter) => voter.phoneNo || '-',
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
    exportValue: (voter) => voter.gender,
  },
  {
    id: 'address',
    label: 'New Address',
    render: (voter) => <span className="max-w-[240px] truncate inline-block">{voter.newAddress}</span>,
    exportValue: (voter) => voter.newAddress,
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
    exportValue: () => '',
  },
];

interface VoterTableProps {
  voters: Voter[];
  title?: string;
  filteredCount?: number;
  totalCount?: number;
}

const defaultVisibleColumnIds = columnConfigs
  .filter((column) => column.defaultVisible || column.alwaysVisible)
  .map((column) => column.id);

const VoterTable = ({ voters, title = 'Voters Data', filteredCount, totalCount }: VoterTableProps) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumnIds);
  const filtered = filteredCount ?? voters.length;
  const total = totalCount ?? voters.length;

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

  const escapeCsv = (value: string | number) => {
    const stringValue = value ?? '';
    return `"${String(stringValue).replace(/"/g, '""')}"`;
  };

  const buildRows = () =>
    voters.map((voter) =>
      activeColumns.map((column) => (column.exportValue ? column.exportValue(voter) : ''))
    );

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!voters.length || !activeColumns.length) {
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    const headerLabels = activeColumns.map((column) => column.label);
    const rows = buildRows();

    if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      autoTable(doc, {
        head: [headerLabels],
        body: rows,
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [245, 247, 255] },
      });
      doc.save(`voters-data-${timestamp}.pdf`);
      return;
    }

    const csvHeader = headerLabels.map((label) => escapeCsv(label)).join(',');
    const csvRows = rows.map((row) => row.map((value) => escapeCsv(value)).join(','));
    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voters-data-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-card-foreground">{title}</h3>
        <p className="w-full text-center text-sm text-muted-foreground order-3 lg:order-none lg:flex-1">
          Showing {filtered.toLocaleString()} of {total.toLocaleString()} voters based on applied filters
        </p>
        <div className="flex items-center gap-2 w-full justify-end order-2 lg:order-none lg:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2 border-border"
                disabled={!voters.length}
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
      <div className="overflow-auto" style={{ height: '400px' }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/50">
            <TableRow>
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
