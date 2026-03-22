import { Switch } from 'react-native-paper';
import { Filter } from '../../state/filters/filterTypes';

type ToggleProps = {
  readonly filter: Filter;
  readonly value: boolean;
  readonly onToggle: (filter: Filter) => void;
};

// Toggle component
export default function Toggle({ filter, value, onToggle }: ToggleProps) {
  return <Switch value={value} onValueChange={() => onToggle(filter)} />;
}
