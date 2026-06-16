import { getAllProblems } from '@/lib/content';
import { ProblemClient } from './ProblemClient';

export const metadata = {
  title: 'Problems | BdOI Guide',
  description: 'Search and filter practice problems from the BdOI Guide curriculum.',
};

export default function ProblemsPage() {
  const problems = getAllProblems();

  return (
    <div className="w-full">
      <ProblemClient initialProblems={problems} />
    </div>
  );
}
