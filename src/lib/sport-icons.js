import { Activity, ActivitySquare, Award, Goal } from "lucide-react";

const sportIcons = {
  football: Goal,
  basketball: Activity,
  baseball: Award,
  tennis: ActivitySquare,
};

export function getSportIcon(id) {
  return sportIcons[id] || Award;
}
