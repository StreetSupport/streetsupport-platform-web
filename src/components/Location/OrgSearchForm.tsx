interface OrgSearchFormProps {
  orgSearchInput: string;
  onInputChange: (value: string) => void;
  isOrgSearching: boolean;
  orgSearchError: string | null;
  onClearError: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function OrgSearchForm({
  orgSearchInput,
  onInputChange,
  isOrgSearching,
  orgSearchError,
  onClearError,
  onSubmit,
  onCancel,
}: OrgSearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      <div className="text-left">
        <label htmlFor="org-search" className="block text-small font-medium text-brand-l mb-2">
          Search for an organisation by name
        </label>
        <input
          id="org-search"
          type="text"
          className="w-full px-3 py-2 border border-brand-q rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent"
          placeholder="e.g., Manchester City Mission"
          value={orgSearchInput}
          onChange={(e) => {
            onInputChange(e.target.value);
            onClearError();
          }}
          disabled={isOrgSearching}
          required
        />
        {orgSearchError && (
          <p className="mt-2 text-sm text-red-600">{orgSearchError}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-base btn-primary btn-md flex-1"
          disabled={isOrgSearching || !orgSearchInput.trim()}
        >
          {isOrgSearching ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-q mr-2"></div>
              Searching...
            </span>
          ) : (
            'Search Organisations'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-base btn-tertiary btn-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
