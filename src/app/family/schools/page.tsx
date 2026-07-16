import ParentSchoolSearch from "@/src/components/parent/dashboard/search/ParentSchoolSearch";

// The school directory (FE-001 three shells): finding a school is a PLATFORM surface, not a page
// buried in a parent portal. Reached from the Platform Home's "Find a school" card.
export default function SchoolsDirectoryPage() {
  return <ParentSchoolSearch />;
}
