import TextInput from "../../inputs/TextInput";
export default function LocationFields({ country, region, city, onChange }) {
  return (
    <div>
      <TextInput
        label="Country"
        value={country}
        onChange={(v) => onChange({ country: v })}
      />
      <TextInput
        label="Region"
        value={region}
        onChange={(v) => onChange({ region: v })}
      />
      <TextInput
        label="City"
        value={city}
        onChange={(v) => onChange({ city: v })}
      />
    </div>
  );
}
