import { View, StyleSheet } from 'react-native';
import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { Input, Accordion } from '../uiComponentBarrel';
import { inputStyles } from '../../styles/theme';

// CustomInfoAccordion.tsx: Additional form fields in collapsible accordion section for adding a custom seed on CustomSeedSheet.tsx

const TIMING_PLACEHOLDER = 'e.g. Start indoors in early spring over bottom heat';
const STARTING_PLACEHOLDER = 'e.g. Sow seeds 5 mm to 1cm deep';
const GROWING_PLACEHOLDER = 'e.g. Requires full sun and lots of heat';
const HARVEST_PLACEHOLDER = 'e.g. Pick tomatoes in the breaker stage';
const COMPANION_PLANTING_PLACEHOLDER = 'e.g. Basil, chives, nasturtium, and peppers';

export default function CustomInfoAccordion() {
  const customSeed = useCustomSeed();

  return (
    <View style={styles.accordionWrapper}>
      <Accordion title="Details" titleSize="small" description="Extra tidbits about the seed">
        <View style={styles.accordionContent}>
          <View style={inputStyles.inputSection}>
            <Input
              label="Latin Name"
              placeholder="e.g. Solanum lycopersicum"
              value={customSeed.seed.latin || ''}
              onChangeText={(text) => customSeed.setLatin(text)}
            />
          </View>

          <View style={inputStyles.inputSection}>
            <Input
              label="Days to Maturity"
              placeholder="e.g. 70"
              value={customSeed.seed.maturesInDays?.toString() || ''}
              onChangeText={(text) => customSeed.setMaturesInDays(text ? Number.parseInt(text) : null)}
              inputMode="numeric"
              note="Must be a number"
            />
          </View>
        </View>
      </Accordion>

      <Accordion title="Germinating" titleSize="small" description="How and when to start the seed">
        <View style={styles.accordionContent}>
          <View style={inputStyles.inputSection}>
            <Input
              multiline
              label="Timing"
              placeholder={TIMING_PLACEHOLDER}
              value={customSeed.seed.timing || ''}
              onChangeText={(text) => customSeed.setTiming(text)}
            />
          </View>

          <View style={inputStyles.inputSection}>
            <Input
              multiline
              label="Starting"
              placeholder={STARTING_PLACEHOLDER}
              value={customSeed.seed.starting || ''}
              onChangeText={(text) => customSeed.setStarting(text)}
            />
          </View>
        </View>
      </Accordion>

      <Accordion title="Plant Care" titleSize="small" description="Tips for growing the plant">
        <View style={styles.accordionContent}>
          <View style={inputStyles.inputSection}>
            <Input
              multiline
              label="Growing"
              placeholder={GROWING_PLACEHOLDER}
              value={customSeed.seed.growing || ''}
              onChangeText={(text) => customSeed.setGrowing(text)}
            />
          </View>

          <View style={inputStyles.inputSection}>
            <Input
              multiline
              label="Harvest"
              placeholder={HARVEST_PLACEHOLDER}
              value={customSeed.seed.harvest || ''}
              onChangeText={(text) => customSeed.setHarvest(text)}
            />
          </View>

          <View style={inputStyles.inputSection}>
            <Input
              multiline
              label="Companion Planting"
              placeholder={COMPANION_PLANTING_PLACEHOLDER}
              value={customSeed.seed.companionPlanting || ''}
              onChangeText={(text) => customSeed.setCompanionPlanting(text)}
            />
          </View>
        </View>
      </Accordion>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  accordionWrapper: {
    flex: 1,
  },
  accordionContent: {
    gap: 24,
  },
});
