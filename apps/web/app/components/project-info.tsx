import { regions } from "@instant-postgres/neon/regions";

export const ProjectInfo = ({ timeToProvision, project }) => {
	return (
		<p className="animate-in fade-in slide-in-from-bottom md:text-right font-mono text-xs leading-none tracking-extra-tight text-white tracking-extra-tight opacity-90">
			Provisioned in {timeToProvision} ms, {regions[project.region_id]}
		</p>
	);
};
