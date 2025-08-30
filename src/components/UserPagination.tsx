
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onGoToPage: (page: number) => void;
}

export default function UserPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  onGoToPage
}: UserPaginationProps) {
  const [pageInput, setPageInput] = React.useState('');

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onGoToPage(page);
      setPageInput('');
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="border-t bg-background/50 px-4 py-3 sm:px-6">
      {/* Mobile View */}
      <div className="flex flex-col gap-4 sm:hidden">
        {/* Page info */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalItems} users
        </div>
        
        {/* Items per page selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Go to page */}
        <form onSubmit={handleGoToPage} className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Go to page:</span>
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-16 h-8 text-center"
            placeholder={currentPage.toString()}
          />
          <Button type="submit" size="sm" variant="outline">
            Go
          </Button>
        </form>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Left side - Items per page and page info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startItem}-{endItem}</span> of{' '}
            <span className="font-medium text-foreground">{totalItems}</span> users
          </div>
        </div>

        {/* Right side - Navigation and Go to page */}
        <div className="flex items-center gap-4">
          {/* Go to page */}
          <form onSubmit={handleGoToPage} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Go to page:</span>
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-16 h-8 text-center"
              placeholder={currentPage.toString()}
            />
            <Button type="submit" size="sm" variant="outline">
              Go
            </Button>
          </form>

          {/* Pagination */}
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                      className="min-w-[32px]"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
