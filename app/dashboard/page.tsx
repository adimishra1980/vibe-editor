import AddNewButton from "@/modules/dashboard/components/add-new-button";
import AddRepoButton from "@/modules/dashboard/components/add-repo-button";
import EmptyState from "@/components/ui/empty-state";

const DashboardPage = () => {
  const playgrounds: any[] = [];

  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto w-full px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        {/* TODO: */}
        <AddRepoButton />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Create a new project to get started!"
            imageSrc="/empty-state.svg"
          />
        ) : (
          <>
            <p>Playground table</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
